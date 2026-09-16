import { readFileSync } from 'node:fs';
import { Ajv, type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';
import type { StudySession, Segment } from '../temporal/types.js';

export const root = new URL('../../../', import.meta.url);
export const contractNames = ['finding', 'rubric', 'competency-update', 'evaluation-request', 'evaluation-result', 'study-event', 'study-session'] as const;
export type ContractName = typeof contractNames[number];
export const requiredPreflightChecks = [
  'artifact_readable',
  'artifact_not_truncated',
  'required_materials_available',
  'response_matches_task',
  'task_brief_semantically_complete',
  'criteria_and_restrictions_disclosed'
] as const;
export type PreflightCheckName = typeof requiredPreflightChecks[number];
export interface PreflightCheck {
  state: 'PASS' | 'FAIL' | 'NOT_CHECKED';
  asserted_by: 'SYSTEM' | 'HUMAN_REVIEW' | 'AUTHORIZED_COMPONENT';
  assertion_ref: string;
  checked_at: string;
}
const ajv = new Ajv({ allErrors: true, strict: true });
// ESM/NodeNext exposes this CommonJS plugin through its default property.
addFormats.default(ajv);
for (const name of contractNames) {
  const schema = JSON.parse(readFileSync(new URL(`schemas/${name}.schema.json`, root), 'utf8'));
  if (!ajv.validateSchema(schema)) throw new Error(`Schema inválido: ${name}`);
  ajv.addSchema(schema, name);
}
for (const name of contractNames) ajv.getSchema(name); // Compile all references at startup.

export class ContractError extends Error {
  constructor(public readonly contract: ContractName, public readonly details: ErrorObject[]) {
    super(`${contract}: ${ajv.errorsText(details, { separator: '; ' })}`);
  }
}
function issue(instancePath: string, rule: string, message: string): ErrorObject {
  return { instancePath, schemaPath: '#/aion-cross-validation', keyword: 'aionCross', params: { rule }, message };
}
function duplicateCriterionIssues(rubric: Rubric, instancePath = '/dimensions'): ErrorObject[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const dimension of rubric.dimensions) {
    if (seen.has(dimension.criterion_id)) duplicates.add(dimension.criterion_id);
    seen.add(dimension.criterion_id);
  }
  return [...duplicates].map(id => issue(instancePath, 'uniqueCriterionIds', `el criterion_id ${id} está duplicado`));
}
function evaluationResultIssues(value: any): ErrorObject[] {
  const issues: ErrorObject[] = [];
  const preflightStatus = value.preflight.status;
  const result = value.result;
  const confidenceRank: Record<string, number> = { baja: 0, media: 1, alta: 2 };
  const seenCriteria = new Set<string>();

  for (const criterion of value.criteria) {
    if (seenCriteria.has(criterion.criterion_id)) {
      issues.push(issue('/criteria', 'uniqueResultCriterionIds', `el criterion_id ${criterion.criterion_id} está duplicado en el resultado`));
    }
    seenCriteria.add(criterion.criterion_id);
  }
  if (value.findings.some((finding: any) => finding.severity === 'crítica') && result !== 'REHACER') {
    issues.push(issue('/result', 'criticalFindingRequiresRedo', 'todo hallazgo crítico requiere resultado REHACER'));
  }

  if (preflightStatus === 'LISTO' || preflightStatus === 'LISTO_CON_ADVERTENCIAS') {
    for (const name of requiredPreflightChecks) {
      if (value.preflight.checks?.[name]?.state !== 'PASS') {
        issues.push(issue(`/preflight/checks/${name}`, 'readyRequiresPassedChecks', `${preflightStatus} requiere que ${name} esté aprobado`));
      }
    }
  }
  if (result === 'NO_EVALUABLE' && preflightStatus !== 'NO_EVALUABLE') {
    issues.push(issue('/result', 'noEvaluableRequiresBlockedPreflight', 'NO_EVALUABLE requiere preflight NO_EVALUABLE'));
  }
  if (preflightStatus === 'NO_EVALUABLE' && result !== 'NO_EVALUABLE') {
    issues.push(issue('/result', 'blockedPreflightRequiresNoEvaluable', 'un preflight NO_EVALUABLE no admite un resultado sustantivo'));
  }
  if (value.status === 'completed') {
    if (!value.executive_summary.trim()) {
      issues.push(issue('/executive_summary', 'nonBlankCompletedSummary', 'un resultado completed requiere un resumen no vacío'));
    }
    if (confidenceRank[value.result_confidence] > confidenceRank[value.preflight.confidence_limit]) {
      issues.push(issue('/result_confidence', 'confidenceLimit', 'result_confidence supera confidence_limit'));
    }
    if (result === 'COMPETENTE') {
      if (value.criteria.length === 0) issues.push(issue('/criteria', 'competentRequiresCriteria', 'COMPETENTE requiere criterios evaluados'));
      if (value.findings.length === 0 && value.strengths.length === 0) {
        issues.push(issue('/findings', 'competentRequiresEvidence', 'COMPETENTE requiere hallazgos o fortalezas con evidencia localizada'));
      }
      if (value.preflight.blockers.length > 0) issues.push(issue('/preflight/blockers', 'competentForbidsBlockers', 'COMPETENTE no admite bloqueadores'));
    }
  }
  if (value.appeal.available === true) {
    issues.push(issue('/appeal/available', 'appealNotImplemented', 'la apelación no está implementada en esta versión'));
  }
  return issues;
}
function studySessionIssues(value: StudySession): ErrorObject[] {
  const issues: ErrorObject[] = [];
  const sum = (segments: Segment[]) => segments.reduce((total, s) => total + s.minutes, 0);
  const fail = (path: string, message: string) => issues.push(issue(path, 'effectiveTemporalContributions', message));
  if (value.active_minutes !== sum(value.segments)) fail('/active_minutes', 'debe coincidir con la suma de segments[].minutes');
  const all = [...value.corrections.flatMap(c => c.replaced_segments), ...value.segments];
  if (new Set(all.map(s => s.segment_id)).size !== all.length) fail('/segments', 'segment_id duplicado entre estado efectivo e historial');
  if (new Set(value.corrections.map(c => c.event_id)).size !== value.corrections.length) fail('/corrections', 'corrección duplicada');
  const positions = new Map(value.event_ids.map((id, index) => [id, index]));
  const effective: Segment[] = [];
  // Replay only accepted contributions and replacements, using the retained event order.
  for (const eventId of value.event_ids) {
    for (const segment of all.filter(s => s.kind === 'INTERVAL' && s.provenance.at(-1)?.event_id === eventId)) effective.push(segment);
    for (const correction of value.corrections.filter(c => c.event_id === eventId)) {
      if (correction.delta_minutes !== correction.new_minutes - correction.previous_minutes) fail('/corrections', 'delta incoherente');
      if (sum(correction.replaced_segments) !== correction.previous_minutes || sum(effective) !== correction.previous_minutes) fail('/corrections', 'valor previo incoherente con las contribuciones sustituidas');
      if (JSON.stringify(effective.map(s => s.segment_id)) !== JSON.stringify(correction.replaced_segments.map(s => s.segment_id))) fail('/corrections', 'la corrección debe sustituir exactamente el estado efectivo anterior');
      const replacements = all.filter(s => s.kind === 'ADJUSTMENT' && s.correction_event_id === correction.event_id);
      const source = replacements[0]?.provenance[0];
      if (replacements.length !== 1 || replacements[0].minutes !== correction.new_minutes || !source || (['event_id', 'origin', 'source_ref'] as const).some(key => source[key] !== correction.provenance[key])) fail('/corrections', 'ajuste ausente, duplicado o incoherente con su corrección');
      effective.splice(0, effective.length, ...replacements);
    }
  }
  if (JSON.stringify(effective.map(s => s.segment_id)) !== JSON.stringify(value.segments.map(s => s.segment_id))) fail('/segments', 'los segmentos vigentes no corresponden al historial de reemplazos');
  for (const correction of value.corrections) {
    if (!positions.has(correction.event_id) || correction.provenance.event_id !== correction.event_id) fail('/corrections', 'procedencia de corrección no vinculada a un evento');
  }
  const intervals = all.filter(s => s.kind === 'INTERVAL');
  for (let i = 0; i < intervals.length; i++) {
    const a = intervals[i];
    if (Date.parse(a.ended_at) < Date.parse(a.started_at)) fail('/segments', 'intervalo negativo');
    if (intervals.slice(i + 1).some(b => Date.parse(a.started_at) < Date.parse(b.ended_at) && Date.parse(a.ended_at) > Date.parse(b.started_at))) fail('/segments', 'intervalos superpuestos, incluidos los sustituidos');
  }
  return issues;
}
export function validateBlindExport(value: unknown): void {
  const validator = ajv.getSchema('https://aion.school.local/schemas/v1/study-session.schema.json#/definitions/blindExport')!;
  if (!validator(value)) throw new ContractError('study-session', structuredClone(validator.errors ?? []));
}
export function validate(contract: ContractName, value: unknown): void {
  const validator = ajv.getSchema(contract)!;
  if (!validator(value)) throw new ContractError(contract, structuredClone(validator.errors ?? []));
  let issues: ErrorObject[] = [];
  if (contract === 'rubric') issues = duplicateCriterionIssues(value as Rubric);
  if (contract === 'evaluation-request') {
    const rubric = (value as EvaluationRequest).rubric;
    if (rubric) issues = duplicateCriterionIssues(rubric, '/rubric/dimensions');
  }
  if (contract === 'evaluation-result') issues = evaluationResultIssues(value);
  if (contract === 'study-session') issues = studySessionIssues(value as StudySession);
  if (issues.length) throw new ContractError(contract, issues);
}
export interface Rubric {
  schema_version: '1.0.0'; rubric_id: string; rubric_version: string; title: string;
  dimensions: { criterion_id: string; name: string; levels: Record<'0' | '1' | '2' | '3' | '4', string> }[];
}
export interface EvaluationRequest {
  schema_version: '1.0.0'; evaluation_id: string; evaluator_version: string; mode: string;
  task_brief?: string | null; rubric_id?: string | null; rubric_version?: string | null;
  rubric?: Rubric | null; criterion_ids: string[]; source_pack_id: string | null;
  time_limit_minutes: number | null;
  submission?: { content?: string | null; submitted_at: string; declared_assistance: string[] } | null;
  execution_metadata: { active_minutes: number | null; attempts: number; interruptions: number | null };
  preflight_checks?: Partial<Record<PreflightCheckName, PreflightCheck>>;
}
export function loadRequest(path: string): EvaluationRequest {
  const input: unknown = JSON.parse(readFileSync(path, 'utf8'));
  validate('evaluation-request', input);
  return input as EvaluationRequest;
}
export function loadCommonRubric(): Rubric {
  const rubric: unknown = parse(readFileSync(new URL('rubrics/common-rubric.v1.yml', root), 'utf8'));
  validate('rubric', rubric);
  return rubric as Rubric;
}

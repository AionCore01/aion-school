import { requiredPreflightChecks, validate, type EvaluationRequest } from '../contracts/index.js';

type Blocker = { code: string; message: string; kind: 'missing_required_input' | 'system_failure' };
type Warning = { code: string; message: string; attribution: 'sistema'; affects_observation: true };
export function preflight(input: unknown, timestamp = new Date().toISOString()) {
  validate('evaluation-request', input);
  const request = input as EvaluationRequest;
  const blockers: Blocker[] = [];
  const warnings: Warning[] = [];
  const missing = (code: string, message: string) => blockers.push({ code, message, kind: 'missing_required_input' });
  const failure = (code: string, message: string) => blockers.push({ code, message, kind: 'system_failure' });
  const warn = (code: string, message: string) => warnings.push({ code, message, attribution: 'sistema', affects_observation: true });
  if (!request.task_brief?.trim()) missing('MISSING_TASK', 'Falta la consigna exacta.');
  if (typeof request.submission?.content !== 'string' || !request.submission.content.trim()) missing('MISSING_SUBMISSION', 'Falta la producción.');
  if (!request.rubric || !request.rubric_id || !request.rubric_version) {
    missing('MISSING_RUBRIC', 'Falta la rúbrica o su identificación y versión.');
  } else {
    if (request.rubric.rubric_id !== request.rubric_id || request.rubric.rubric_version !== request.rubric_version) {
      failure('RUBRIC_MISMATCH', 'La rúbrica suministrada no coincide con la referencia declarada.');
    }
    const ids = request.rubric.dimensions.map(d => d.criterion_id);
    if (request.criterion_ids.some(id => !ids.includes(id))) failure('UNKNOWN_CRITERION', 'Un criterio seleccionado no existe en la rúbrica.');
  }
  for (const name of requiredPreflightChecks) {
    const check = request.preflight_checks?.[name];
    if (!check) missing(`MISSING_CHECK_${name.toUpperCase()}`, `Falta el control obligatorio ${name}.`);
    else if (check.state === 'NOT_CHECKED') failure(`NOT_CHECKED_${name.toUpperCase()}`, `El control obligatorio ${name} no fue ejecutado.`);
    else if (check.state === 'FAIL') failure(`FAILED_CHECK_${name.toUpperCase()}`, `El control obligatorio ${name} no fue aprobado.`);
  }
  const materialsCheck = request.preflight_checks?.required_materials_available;
  if (request.source_pack_id !== null && materialsCheck?.state === 'PASS') {
    warn('MATERIALS_AVAILABILITY_DECLARED', 'La disponibilidad de materiales fue recibida como declaración trazable; el preflight determinista no inspeccionó el paquete de fuentes.');
  }
  if (request.mode === 'cronometrado') {
    if (request.time_limit_minutes === null) failure('MISSING_TIME_LIMIT', 'La modalidad cronometrada necesita un límite declarado.');
    if (request.execution_metadata.active_minutes === null) warn('TIME_UNOBSERVED', 'No hay medición de tiempo activo; no permite inferir incumplimiento de la estudiante.');
  }
  const status = blockers.length ? 'NO_EVALUABLE' : warnings.length ? 'LISTO_CON_ADVERTENCIAS' : 'LISTO';
  const output = {
    schema_version: '1.0.0', evaluation_id: request.evaluation_id, status: 'preflight_only',
    preflight: { status, warnings, blockers, checks: request.preflight_checks ?? {}, confidence_limit: blockers.length ? 'baja' : warnings.length ? 'media' : 'alta' },
    result: blockers.length ? 'NO_EVALUABLE' : null, result_confidence: null,
    executive_summary: 'Preflight determinista. No se evaluó desempeño ni se asignaron puntuaciones. LISTO indica únicamente que no se detectaron bloqueos en las comprobaciones implementadas.',
    criteria: [], findings: [], strengths: [], priority_corrections: [],
    uncertainties: ['No se verificó semánticamente la consigna, la correspondencia de la respuesta ni la suficiencia de la evidencia.'],
    alternative_interpretations: [], mastery_updates: [], repair_task: null,
    appeal: { available: false, rubric_frozen_at: null },
    audit: { evaluator_version: request.evaluator_version, prompt_version: null, rubric_version: request.rubric_version ?? null, timestamp, model: null }
  };
  validate('evaluation-result', output);
  return output;
}

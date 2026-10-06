import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCommonRubric, requiredPreflightChecks, root, validate } from '../src/contracts/index.js';
import { preflight } from '../src/preflight/index.js';

const requestPath = new URL('tests/fixtures/manual-calibration/request.json', root);
const resultPath = new URL('tests/fixtures/manual-calibration/manual-result.json', root);
const sourcePath = new URL('tests/manual-calibration.test.ts', root);
const submittedAt = '2000-01-01T00:00:00.000Z';
const checkedAt = '2000-01-01T00:01:00.000Z';
const auditTimestamp = '2000-01-01T00:02:00.000Z';
const taskBrief = 'Caso simulado. Registro R1: el procedimiento A produjo dos piezas y el procedimiento B produjo dos piezas; no se aportan otros datos. Decidí si este registro permite sostener que B es superior a A. Fundamentá tu conclusión con el dato pertinente y citá R1; explicitá el alcance de esa evidencia. Se evalúa únicamente EV (Evidencia), obligatorio, con los descriptores 0 a 4 de common-rubric 1.0.0 incluidos en el paquete. No se permiten fuentes externas ni asistencia. No se evalúan estilo ni extensión.';
const submission = 'El procedimiento B es superior al A. La conclusión es sólida y debe adoptarse.';
const expectedChecks = {
  artifact_readable: { state: 'PASS', asserted_by: 'HUMAN_REVIEW', assertion_ref: 'P02-CHECK-01', checked_at: checkedAt },
  artifact_not_truncated: { state: 'PASS', asserted_by: 'HUMAN_REVIEW', assertion_ref: 'P02-CHECK-02', checked_at: checkedAt },
  required_materials_available: { state: 'PASS', asserted_by: 'HUMAN_REVIEW', assertion_ref: 'P02-CHECK-03', checked_at: checkedAt },
  response_matches_task: { state: 'PASS', asserted_by: 'HUMAN_REVIEW', assertion_ref: 'P02-CHECK-04', checked_at: checkedAt },
  task_brief_semantically_complete: { state: 'PASS', asserted_by: 'HUMAN_REVIEW', assertion_ref: 'P02-CHECK-05', checked_at: checkedAt },
  criteria_and_restrictions_disclosed: { state: 'PASS', asserted_by: 'HUMAN_REVIEW', assertion_ref: 'P02-CHECK-06', checked_at: checkedAt }
};
const expectedPreflight = {
  schema_version: '1.0.0',
  evaluation_id: 'P02-EVAL-001',
  status: 'preflight_only',
  preflight: { status: 'LISTO', warnings: [], blockers: [], checks: expectedChecks, confidence_limit: 'alta' },
  result: null,
  result_confidence: null,
  executive_summary: 'Preflight determinista. No se evaluó desempeño ni se asignaron puntuaciones. LISTO indica únicamente que no se detectaron bloqueos en las comprobaciones implementadas.',
  criteria: [],
  findings: [],
  strengths: [],
  priority_corrections: [],
  uncertainties: ['No se verificó semánticamente la consigna, la correspondencia de la respuesta ni la suficiencia de la evidencia.'],
  alternative_interpretations: [],
  mastery_updates: [],
  repair_task: null,
  appeal: { available: false, rubric_frozen_at: null },
  audit: { evaluator_version: 'manual-reference-P02-v1', prompt_version: null, rubric_version: '1.0.0', timestamp: auditTimestamp, model: null }
};
const expectedManualResult = {
  schema_version: '1.0.0',
  evaluation_id: 'P02-EVAL-001',
  status: 'completed',
  preflight: { status: 'LISTO', warnings: [], blockers: [], checks: expectedChecks, confidence_limit: 'alta' },
  result: 'REHACER',
  result_confidence: 'alta',
  executive_summary: 'La respuesta afirma que B es superior a A, pero no aporta evidencia para esa afirmación. EV recibe 0 y el dictamen manual esperado es REHACER por ausencia de la evidencia central requerida. El paquete está completo. Este caso sintético no acredita desempeño de una estudiante ni capacidad evaluadora automática.',
  criteria: [{ criterion_id: 'EV', score: 0, required: true, findings: ['P02-F-001'], reason: 'El párrafo completo afirma superioridad y recomienda adopción sin aportar un dato que sustente la afirmación central; corresponde EV nivel 0 por ausencia de evidencia, sin atribuir fabricación.' }],
  findings: [{ schema_version: '1.0.0', finding_id: 'P02-F-001', criterion_id: 'EV', observation: submission, evidence_locator: 'submission.content, párrafo 1 completo (oraciones 1 y 2)', comparison: 'EV nivel 0: No aporta evidencia para la afirmación central o presenta evidencia fabricada.', classification: 'omisión', severity: 'mayor', interpretation: 'La respuesta completa no aporta evidencia para la superioridad afirmada. Se aplica la alternativa de ausencia de evidencia; no se afirma fabricación ni inferioridad de B.', confidence: 'alta', remediation: 'Fundamentar la conclusión con el dato de R1, su localización y su alcance.', decision: 'Asignar EV=0 y REHACER por no producir la evidencia central requerida, conforme a la Especificación §9.1.' }],
  strengths: [],
  priority_corrections: ['Fundamentar la conclusión con el dato de R1, su localización y su alcance.'],
  uncertainties: ['El dictamen se limita a esta submission sintética y no permite inferir capacidades de una persona.'],
  alternative_interpretations: ['La ausencia de evidencia en la respuesta no demuestra que B sea inferior a A.'],
  mastery_updates: [],
  repair_task: { required: true, objective: 'Sustentar una conclusión con evidencia localizada y alcance explícito.', instruction: 'Reescribí la respuesta usando el dato de R1, citá R1 y explicá qué permite y qué no permite concluir.', success_condition: 'La respuesta vincula su conclusión con las dos piezas de A y las dos de B, cita R1 y no afirma superioridad a partir de ese único registro.' },
  appeal: { available: false, rubric_frozen_at: null },
  audit: { evaluator_version: 'manual-reference-P02-v1', prompt_version: null, rubric_version: '1.0.0', timestamp: auditTimestamp, model: null }
};

function readJson(path: URL): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

type BoundaryViolation = { rule: string; detail: string };
type SourceLiteral = { start: number; end: number; value: string };

function inspectBoundarySource(source: string): BoundaryViolation[] {
  // Finite lexical check for this frozen file; human inspection remains necessary.
  const code = source.split('');
  const literals: SourceLiteral[] = [];
  const blank = (start: number, end: number): void => {
    for (let i = start; i < end; i++) if (code[i] !== '\n' && code[i] !== '\r') code[i] = ' ';
  };
  for (let i = 0; i < source.length;) {
    const start = i;
    const ch = source[i];
    if (ch === '/' && source[i + 1] === '/') {
      i = source.indexOf('\n', i + 2);
      if (i < 0) i = source.length;
      blank(start, i);
    } else if (ch === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      i = end < 0 ? source.length : end + 2;
      blank(start, i);
    } else if (ch === '/') {
      i++;
      let inClass = false;
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue; }
        if (source[i] === '[') inClass = true;
        if (source[i] === ']') inClass = false;
        if (source[i] === '/' && !inClass) { i++; break; }
        i++;
      }
      while (/[a-z]/i.test(source[i] ?? '')) i++;
      blank(start, i);
    } else if (ch === "'" || ch === '"' || ch === '\u0060') {
      i++;
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue; }
        if (source[i] === ch) { i++; break; }
        i++;
      }
      literals.push({ start, end: i, value: source.slice(start + 1, i - 1) });
      blank(start, i);
    } else i++;
  }
  const visible = code.join('');
  const violations: BoundaryViolation[] = [];
  const add = (rule: string, detail: string): void => { violations.push({ rule, detail }); };
  const allowed = new Set(['node:test', 'node:assert/strict', 'node:fs', '../src/contracts/index.js', '../src/preflight/index.js']);
  const literalsIn = (start: number, end: number): SourceLiteral[] => literals.filter(item => item.start >= start && item.end <= end);
  let offset = 0;
  for (const line of visible.split('\n')) {
    if (/^\s*import\b/.test(line)) {
      const modules = literalsIn(offset, offset + line.length);
      if (modules.length !== 1 || !allowed.has(modules[0].value)) add('UNAUTHORIZED_MODULE', modules[0]?.value ?? 'missing literal module');
    }
    offset += line.length + 1;
  }
  const patterns: Array<[string, RegExp]> = [
    ['DYNAMIC_IMPORT', /\bimport\s*\(/g],
    ['EVAL', /\b(?:globalThis\s*\.\s*)?eval\s*\(/g],
    ['PROCESS_EXECUTION', /\b(?:require\s*\(|child_process\b|(?:process|globalThis\.process)\s*\.\s*(?:exec|spawn|execFile|fork)\s*\()/g],
    ['NETWORK', /\b(?:(?:globalThis\s*\.\s*)?fetch|(?:globalThis\s*\.\s*)?WebSocket|(?:globalThis\s*\.\s*)?XMLHttpRequest)\s*\(/g],
    ['CLOCK', /\b(?:(?:globalThis\s*\.\s*)?Date\s*\.\s*now|performance\s*\.\s*now|process\s*\.\s*hrtime)\s*\(/g],
    ['RANDOM', /\b(?:Math\s*\.\s*random|(?:crypto|globalThis\.crypto)\s*\.\s*randomUUID|randomUUID|randomBytes)\s*\(/g]
  ];
  for (const [rule, pattern] of patterns) if (pattern.test(visible)) add(rule, pattern.source);
  for (const match of visible.matchAll(/\bnew\s+(?:globalThis\s*\.\s*)?Date\s*\(([^)]*)\)/g)) {
    const inside = literalsIn(match.index! + match[0].indexOf('(') + 1, match.index! + match[0].length - 1);
    if (inside.length !== 1 || !['2000-01-01T00:00:00.000Z', '2000-01-01T00:01:00.000Z', '2000-01-01T00:02:00.000Z'].includes(inside[0].value)) add('CLOCK', 'new Date without a frozen literal');
  }
  for (const match of visible.matchAll(/\b(?:readFileSync|readFile|createReadStream)\s*\(([^)]*)/g)) {
    const start = match.index! + match[0].indexOf('(') + 1;
    const comma = visible.indexOf(',', start);
    const close = visible.indexOf(')', start);
    const end = comma >= 0 && comma < close ? comma : close;
    const operand = visible.slice(start, end).trim();
    const pathLiterals = literalsIn(start, end);
    if (pathLiterals.some(item => /(?:\.env\b|credencial|credential|token|secret|api[_-]?key|\bclave\b|(?:^|[\\/])config(?:[\\/]|$))/i.test(item.value)) || /\bprocess\s*\.\s*env\b/.test(operand)) add('CREDENTIAL_READ', 'sensitive fs operand');
    if (pathLiterals.length || !['path', 'sourcePath', 'requestPath', 'resultPath'].includes(operand)) add('NONLOCAL_READ', 'fs operand outside local paths');
  }
  for (const match of visible.matchAll(/\breadJson\s*\(([^)]*)\)/g)) {
    if (!['requestPath', 'resultPath'].includes(match[1].trim()) && !visible.slice(Math.max(0, match.index! - 20), match.index).includes('function ')) add('NONLOCAL_READ', 'readJson operand outside fixtures');
  }
  const bodyEnd = (start: number): number => {
    if (visible[start] !== '{') {
      const end = visible.indexOf(';', start);
      return end < 0 ? visible.length : end;
    }
    let depth = 0;
    for (let i = start; i < visible.length; i++) {
      if (visible[i] === '{') depth++;
      if (visible[i] === '}' && --depth === 0) return i + 1;
    }
    return visible.length;
  };
  const functions = [
    ...visible.matchAll(/\bfunction\s+\w+\s*\(([^)]*)\)\s*(?::[^{]+)?\{/g),
    ...visible.matchAll(/\b(?:const|let)\s+\w+\s*=\s*\(([^)]*)\)\s*(?::[^=]+)?=>\s*/g)
  ];
  for (const match of functions) {
    const start = match.index! + match[0].length - (match[0].endsWith('{') ? 1 : 0);
    const end = bodyEnd(start);
    const body = visible.slice(start, end);
    const sensitive = /\b(?:request|result|submission|content|text)\b/.test(match[1]) || /\breadJson\s*\(/.test(body);
    const outcome = literalsIn(start, end).some(item => /^(?:REHACER|COMPETENTE|P02-F-001)$/.test(item.value)) || /\bscore\s*:\s*0\b/.test(body);
    if (sensitive && outcome) add('SEMANTIC_OUTCOME_DERIVATION', 'function derives a frozen outcome from content');
  }
  return violations;
}

test('P02:request', () => {
  const request = readJson(requestPath) as any;
  validate('evaluation-request', request);
  assert.deepEqual(request.rubric, loadCommonRubric());
  assert.deepEqual(request.criterion_ids, ['EV']);
  assert.equal(request.evaluation_id, 'P02-EVAL-001');
  assert.equal(request.evaluator_version, 'manual-reference-P02-v1');
  assert.equal(request.mode, 'calibración');
  assert.equal(request.course_id, 'P02-COURSE');
  assert.equal(request.lesson_id, 'P02-LESSON');
  assert.equal(request.task_id, 'P02-TASK');
  assert.equal(request.locale, 'es-AR');
  assert.equal(request.task_brief, taskBrief);
  assert.deepEqual(request.allowed_materials, ['Registro R1 incluido en la consigna.', 'Rúbrica common-rubric 1.0.0 incluida en el paquete.']);
  assert.deepEqual(request.prohibited_assistance, ['Fuentes externas y asistencia.']);
  assert.deepEqual(request.expected_evidence, ['Conclusión fundamentada con el dato pertinente de R1, su localización y su alcance.']);
  assert.deepEqual(request.competency_ids, ['P02-COMP-EV']);
  assert.equal(request.rubric_id, 'common-rubric');
  assert.equal(request.rubric_version, '1.0.0');
  assert.equal(request.source_pack_id, null);
  assert.equal(request.time_limit_minutes, null);
  assert.deepEqual(request.submission, { content: submission, submitted_at: submittedAt, declared_assistance: [] });
  assert.deepEqual(request.execution_metadata, { active_minutes: null, attempts: 1, interruptions: null });
  assert.deepEqual(request.preflight_checks, expectedChecks);
  assert.deepEqual(request.rubric.dimensions.find((dimension: any) => dimension.criterion_id === 'EV').levels, {
    '0': 'No aporta evidencia para la afirmación central o presenta evidencia fabricada.',
    '1': 'Aporta un dato relacionado, pero no identifica su origen ni permite localizarlo.',
    '2': 'Aporta evidencia para parte de las afirmaciones; faltan ubicaciones verificables en otras.',
    '3': 'Vincula las afirmaciones centrales con evidencia localizable e identifica vacíos secundarios.',
    '4': 'Sustenta las afirmaciones relevantes con evidencia pertinente, suficiente y localizable, y explicita su alcance.'
  });
});

test('P02:manual-result', () => {
  const result = readJson(resultPath) as any;
  validate('evaluation-result', result);
  validate('finding', result.findings[0]);
  assert.deepEqual(result, expectedManualResult);
  assert.equal(new Set(result.criteria.map((criterion: any) => criterion.criterion_id)).size, result.criteria.length);
  assert.equal(result.findings[0].finding_id, result.criteria[0].findings[0]);
  assert.equal(result.findings[0].observation, submission);
  assert.equal(result.findings[0].evidence_locator, 'submission.content, párrafo 1 completo (oraciones 1 y 2)');
  assert.equal(result.evaluation_id, 'P02-EVAL-001');
  assert.equal(result.result, 'REHACER');
  assert.equal(result.result_confidence, 'alta');
  assert.equal(result.findings[0].severity, 'mayor');
  assert.equal(result.findings[0].classification, 'omisión');
  assert.deepEqual(result.appeal, { available: false, rubric_frozen_at: null });
  assert.deepEqual(result.mastery_updates, []);
});

test('P02:preflight', () => {
  const request = readJson(requestPath);
  const output = preflight(request, auditTimestamp);
  assert.deepEqual(output, expectedPreflight);
  validate('evaluation-result', output);
  assert.equal(output.preflight.status, 'LISTO');
  assert.deepEqual(output.preflight.warnings, []);
  assert.deepEqual(output.preflight.blockers, []);
  assert.equal(output.preflight.confidence_limit, 'alta');
  assert.deepEqual(output.preflight.checks, expectedChecks);
  assert.equal((request as any).submission.submitted_at, submittedAt);
  for (const name of requiredPreflightChecks) assert.equal((request as any).preflight_checks[name].checked_at, checkedAt);
  assert.equal(output.audit.timestamp, auditTimestamp);
});

test('P02:boundaries', () => {
  const source = readFileSync(sourcePath, 'utf8');
  assert.deepEqual(inspectBoundarySource("const label = 'REHACER'; // fetch('example')"), []);
  const attacks: Array<[string, string]> = [
    ['UNAUTHORIZED_MODULE', "import ts from 'typescript';"],
    ['UNAUTHORIZED_MODULE', "import http from 'node:http';"],
    ['UNAUTHORIZED_MODULE', "import https from 'node:https';"],
    ['UNAUTHORIZED_MODULE', "import net from 'node:net';"],
    ['UNAUTHORIZED_MODULE', "import tls from 'node:tls';"],
    ['UNAUTHORIZED_MODULE', "import dgram from 'node:dgram';"],
    ['DYNAMIC_IMPORT', "const module = import('node:https');"],
    ['EVAL', "globalThis.eval('1 + 1');"],
    ['PROCESS_EXECUTION', "require('node:child_process');"],
    ['NETWORK', 'fetch("/api");'],
    ['NETWORK', 'globalThis.fetch("/api");'],
    ['NETWORK', 'new WebSocket("/socket");'],
    ['NETWORK', 'new XMLHttpRequest();'],
    ['CLOCK', 'Date.now();'],
    ['CLOCK', 'new Date();'],
    ['RANDOM', 'Math.random();'],
    ['RANDOM', 'crypto.randomUUID();'],
    ['RANDOM', 'randomBytes(16);'],
    ['CREDENTIAL_READ', "readFileSync('.env', 'utf8');"],
    ['CREDENTIAL_READ', "readFileSync('config/api-keys.json', 'utf8');"],
    ['SEMANTIC_OUTCOME_DERIVATION', "function decide(submission: string) { return submission ? 'COMPETENTE' : 'REHACER'; }"],
    ['SEMANTIC_OUTCOME_DERIVATION', "const decide = (text: string) => text ? 'REHACER' : 'COMPETENTE';"]
  ];
  for (const [rule, attack] of attacks) assert.ok(inspectBoundarySource(attack).some(violation => violation.rule === rule), rule + ': ' + attack);
  assert.deepEqual(inspectBoundarySource(source), []);
});

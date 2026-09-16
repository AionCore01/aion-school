import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { root, validate, loadCommonRubric, requiredPreflightChecks, ContractError } from '../src/contracts/index.js';
import { preflight } from '../src/preflight/index.js';
import { cases, fixture, checkFixture } from './fixtures.js';

for (const item of cases) {
  test(`Contrato: ${item.file}`, () => checkFixture(item));
  if (item.preflight) test(`Preflight: ${item.file} → ${item.preflight}`, () => {
    const result = preflight(fixture(item.file), '2026-09-15T18:00:00Z');
    assert.equal(result.preflight.status, item.preflight);
    validate('evaluation-result', result);
    assert.deepEqual(result.mastery_updates, []);
    assert.equal(result.result_confidence, null);
  });
  if (item.exit !== undefined) test(`CLI: ${item.file} → exit ${item.exit}`, () => {
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('dist/src/preflight/cli.js', root)), fileURLToPath(new URL(`tests/fixtures/${item.file}`, root)), '--json'], { encoding: 'utf8' });
    assert.ifError(run.error);
    assert.equal(run.status, item.exit, run.stderr);
    if (item.valid) assert.equal(JSON.parse(run.stdout).preflight.status, item.preflight);
    else assert.match(run.stderr, /Paquete inválido/);
  });
}
test('Rúbrica: doce dimensiones y cinco niveles no vacíos', () => {
  const rubric = loadCommonRubric();
  assert.deepEqual(rubric.dimensions.map(d => d.criterion_id), ['EV','FI','HA','RC','IN','CF','ST','TR','LT','TC','RV','AU']);
  for (const dimension of rubric.dimensions) {
    assert.deepEqual(Object.keys(dimension.levels), ['0','1','2','3','4']);
    assert.equal(new Set(Object.values(dimension.levels)).size, 5);
  }
  assert.deepEqual(fixture('valid-request.json').rubric, rubric);
});
test('Copias normativas preservadas byte por byte', () => {
  for (const name of ['AION_Manifiesto_Criterio_Academico.md', 'AION_Especificacion_IA_Evaluadora_v0.1.md']) {
    assert.deepEqual(readFileSync(new URL(name, root)), readFileSync(new URL(`docs/foundation/${name}`, root)));
  }
});
test('Ausencias, null y blancos de los tres insumos esenciales', () => {
  for (const key of ['task_brief', 'submission', 'rubric']) {
    for (const value of [undefined, null, ...(key === 'task_brief' ? ['', '  \n '] : [])]) {
      const input = fixture('valid-request.json');
      if (value === undefined) delete input[key]; else input[key] = value;
      assert.equal(preflight(input).preflight.status, 'NO_EVALUABLE');
    }
  }
  const input = fixture('valid-request.json');
  input.submission.content = '   ';
  assert.equal(preflight(input).preflight.status, 'NO_EVALUABLE');
});
test('Advertencia limita confianza sin culpa ni nota', () => {
  const output = preflight(fixture('warning-request.json'));
  assert.equal(output.preflight.confidence_limit, 'media');
  assert.equal(output.preflight.warnings[0].attribution, 'sistema');
  assert.equal(output.result, null);
  assert.deepEqual(output.criteria, []);
});
test('Misma entrada y fecha producen exactamente la misma salida', () => {
  assert.deepEqual(preflight(fixture('valid-request.json'), '2026-09-15T18:00:00Z'), preflight(fixture('valid-request.json'), '2026-09-15T18:00:00Z'));
});
test('Identidad de rúbrica, criterios y fuente declarada bloquean sin calificar', () => {
  for (const mutate of [
    (x: any) => x.rubric_version = '2.0.0',
    (x: any) => x.criterion_ids = ['DESCONOCIDO'],
    (x: any) => { x.preflight_checks.required_materials_available.state = 'FAIL'; }
  ]) {
    const input = fixture('valid-request.json'); mutate(input);
    const output = preflight(input);
    assert.equal(output.preflight.status, 'NO_EVALUABLE');
    assert.equal(output.preflight.blockers[0].kind, 'system_failure');
  }
});
test('Contratos rechazan campos anidados ajenos y formatos inválidos', () => {
  for (const mutate of [
    (x: any) => x.submission.secret = 'dato irrelevante',
    (x: any) => x.submission.submitted_at = 'ayer',
    (x: any) => x.rubric_version = 'v1',
    (x: any) => x.execution_metadata.attempts = -1,
    (x: any) => x.mode = 'oficial'
  ]) {
    const input = fixture('valid-request.json'); mutate(input);
    assert.throws(() => validate('evaluation-request', input), ContractError);
  }
});
test('Hallazgo rechazado específicamente por localizador ausente', () => {
  assert.throws(() => validate('evaluation-result', fixture('missing-locator-result.json')), (error: unknown) => error instanceof ContractError && error.details.some(e => e.keyword === 'required' && e.params.missingProperty === 'evidence_locator'));
});
test('Resumen ejecutivo admite 120 palabras y rechaza 121', () => {
  const output = fixture('valid-result.json');
  output.executive_summary = Array(120).fill('palabra').join(' ');
  validate('evaluation-result', output);
  output.executive_summary += ' palabra';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});
test('Un preflight no admite calificación ni avance de competencia', () => {
  const output = preflight(fixture('valid-request.json'));
  output.result = 'COMPETENTE';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});
test('CLI maneja archivo ausente y JSON malformado', () => {
  for (const file of ['no-existe.json','malformed.json']) {
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('dist/src/preflight/cli.js', root)), fileURLToPath(new URL(`tests/fixtures/${file}`, root))], { encoding: 'utf8' });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /Paquete inválido/);
  }
});

test('Rechaza confianza alta cuando el preflight limita a media', () => {
  const output = fixture('valid-result.json');
  output.preflight.status = 'LISTO_CON_ADVERTENCIAS';
  output.preflight.confidence_limit = 'media';
  output.preflight.warnings = [{ code: 'W-001', message: 'Observación limitada.', attribution: 'sistema', affects_observation: true }];
  output.result_confidence = 'alta';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza COMPETENTE sin criterios ni evidencia localizada', () => {
  const output = fixture('valid-result.json');
  output.criteria = [];
  output.findings = [];
  output.strengths = [];
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza NO_EVALUABLE con preflight LISTO', () => {
  const output = fixture('valid-result.json');
  output.result = 'NO_EVALUABLE';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza resultado sustantivo con preflight NO_EVALUABLE', () => {
  const output = fixture('valid-result.json');
  output.preflight.status = 'NO_EVALUABLE';
  output.preflight.confidence_limit = 'baja';
  output.preflight.blockers = [{ code: 'SYSTEM', message: 'Control fallido.', kind: 'system_failure' }];
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza apelación disponible mientras el mecanismo no existe', () => {
  const output: any = preflight(fixture('valid-request.json'));
  output.appeal = { available: true, rubric_frozen_at: 'common-rubric@1.0.0' };
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Control obligatorio ausente produce NO_EVALUABLE', () => {
  const output = preflight(fixture('missing-control-request.json'));
  assert.equal(output.preflight.status, 'NO_EVALUABLE');
  assert.ok(output.preflight.blockers.some(b => b.code === 'MISSING_CHECK_RESPONSE_MATCHES_TASK'));
});

test('Control obligatorio NOT_CHECKED produce NO_EVALUABLE', () => {
  const output = preflight(fixture('not-checked-control-request.json'));
  assert.equal(output.preflight.status, 'NO_EVALUABLE');
  assert.ok(output.preflight.blockers.some(b => b.code === 'NOT_CHECKED_RESPONSE_MATCHES_TASK'));
});

test('Todos los controles aprobados producen LISTO', () => {
  const input = fixture('valid-request.json');
  assert.deepEqual(Object.keys(input.preflight_checks), [...requiredPreflightChecks]);
  assert.ok(Object.values(input.preflight_checks).every((check: any) => check.state === 'PASS'));
  assert.equal(preflight(input).preflight.status, 'LISTO');
});

test('Rechaza IDs de criterio duplicados en rúbrica y solicitud', () => {
  const rubric = fixture('valid-rubric.json');
  rubric.dimensions.push(structuredClone(rubric.dimensions[0]));
  assert.throws(() => validate('rubric', rubric), ContractError);
  const input = fixture('valid-request.json');
  input.rubric.dimensions.push(structuredClone(input.rubric.dimensions[0]));
  assert.throws(() => validate('evaluation-request', input), ContractError);
});

test('Acepta SemVer 2.0.0 con prerelease y metadata', () => {
  const version = '1.2.3-rc.1+build.5';
  const rubric = fixture('valid-rubric.json');
  rubric.rubric_version = version;
  validate('rubric', rubric);
  const input = fixture('valid-request.json');
  input.rubric_version = version;
  input.rubric.rubric_version = version;
  validate('evaluation-request', input);
});

test('Rechaza resumen ejecutivo vacío o compuesto sólo por espacios en completed', () => {
  for (const summary of ['', '   \n ']) {
    const output = fixture('valid-result.json');
    output.executive_summary = summary;
    assert.throws(() => validate('evaluation-result', output), ContractError);
  }
});

test('Submission sin content llega al preflight como MISSING_SUBMISSION', () => {
  const output = preflight(fixture('missing-content-request.json'));
  assert.equal(output.preflight.status, 'NO_EVALUABLE');
  assert.ok(output.preflight.blockers.some(b => b.code === 'MISSING_SUBMISSION'));
});

test('El preflight determinista siempre declara apelación no disponible', () => {
  for (const name of ['valid-request.json', 'missing-rubric-request.json']) {
    const output = preflight(fixture(name));
    assert.deepEqual(output.appeal, { available: false, rubric_frozen_at: null });
  }
});

test('Rechaza COMPETENTE con hallazgo crítico', () => {
  const output = fixture('valid-result.json');
  output.findings[0].severity = 'crítica';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza DESTACADO con hallazgo crítico', () => {
  const output = fixture('valid-result.json');
  output.result = 'DESTACADO';
  output.findings[0].severity = 'crítica';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza resultado positivo aunque el hallazgo crítico tenga score 0 y clasificación error', () => {
  const output = fixture('valid-result.json');
  output.criteria[0].score = 0;
  output.criteria[0].reason = 'El hallazgo crítico activa la compuerta.';
  output.findings[0].classification = 'error';
  output.findings[0].severity = 'crítica';
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Rechaza resultado positivo cuando al menos uno de varios hallazgos es crítico', () => {
  const output = fixture('valid-result.json');
  const critical = structuredClone(output.findings[0]);
  critical.finding_id = 'F-002';
  critical.classification = 'error';
  critical.severity = 'crítica';
  output.findings.push(critical);
  output.criteria[0].findings.push('F-002');
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Acepta REHACER cuando existe un hallazgo crítico', () => {
  const output = fixture('valid-result.json');
  output.result = 'REHACER';
  output.result_confidence = 'media';
  output.criteria[0].score = 0;
  output.findings[0].classification = 'error';
  output.findings[0].severity = 'crítica';
  validate('evaluation-result', output);
});

test('Resultado sin hallazgos críticos conserva su comportamiento', () => {
  const output = fixture('valid-result.json');
  assert.ok(output.findings.every((finding: any) => finding.severity !== 'crítica'));
  validate('evaluation-result', output);
});

test('Rechaza criterion_id duplicado en evaluation-result.criteria aunque difieran sus campos', () => {
  const output = fixture('valid-result.json');
  const duplicate = structuredClone(output.criteria[0]);
  duplicate.score = 0;
  duplicate.reason = 'Razón diferente.';
  duplicate.findings = [];
  output.criteria.push(duplicate);
  assert.throws(() => validate('evaluation-result', output), ContractError);
});

test('Acepta múltiples criterios de resultado con IDs diferentes', () => {
  const output = fixture('valid-result.json');
  output.criteria.push({ criterion_id: 'EV', score: 3, required: true, findings: [], reason: 'Criterio adicional con ID único.' });
  validate('evaluation-result', output);
});

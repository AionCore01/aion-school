import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { root, validate, ContractError } from '../src/contracts/index.js';
import { summarizeSessions, exportForEvaluator, parseTemporalInput, TemporalError } from '../src/temporal/index.js';
import { temporalCases, temporalFixture, checkTemporalFixture } from './temporal-fixtures.js';

const events = (name: string) => temporalFixture(name).events;
const summary = (name: string) => summarizeSessions(events(name))[0];
for (const item of temporalCases) test(`Temporal fixture: ${item.file}`, () => checkTemporalFixture(item));

test('Temporal: activación explícita fija T0 y fecha en zona local', () => {
  const input = events('single-event.json');
  input[0].timestamp = '2026-09-16T01:00:00Z';
  const result = summarizeSessions(input)[0];
  assert.equal(result.started_at, '2026-09-16T01:00:00.000Z');
  assert.equal(result.date, '2026-09-15');
  input[0].data.activation = 'comenzar';
  assert.throws(() => summarizeSessions(input), ContractError);
});

test('Temporal: umbral inclusivo de 45 minutos y configuración explícita', () => {
  const input = events('manual.json');
  input[1].timestamp = '2026-09-16T10:45:00-03:00';
  assert.equal(summarizeSessions(input)[0].active_minutes, 45);
  input[1].timestamp = '2026-09-16T10:45:01-03:00';
  const gap = summarizeSessions(input)[0];
  assert.equal(gap.active_minutes, 0);
  assert.equal(gap.gaps.length, 1);
  assert.equal(summarizeSessions(input, { gap_threshold_minutes: 46 })[0].active_minutes, 45.016667);
  for (const invalid of [0, -1, NaN, Infinity, '45', null]) {
    assert.throws(() => summarizeSessions(input, { gap_threshold_minutes: invalid } as any), TemporalError);
  }
});

test('Temporal: brecha no cuenta y nuevas interacciones requieren reanudación explícita', () => {
  const input = events('gap.json');
  input.push({ ...input[2], event_id: 'E-4', timestamp: '2026-09-16T11:20:00-03:00' });
  const provisional = summarizeSessions(input)[0];
  assert.equal(provisional.active_minutes, 15);
  assert.equal(provisional.status, 'PROVISIONAL');
  input.push({ ...input[2], event_id: 'E-5', type: 'SESSION_RESUMED', origin: 'HUMAN', timestamp: '2026-09-16T11:30:00-03:00' });
  input.push({ ...input[2], event_id: 'E-6', type: 'SESSION_CLOSED', origin: 'HUMAN', timestamp: '2026-09-16T11:40:00-03:00' });
  const closed = summarizeSessions(input)[0];
  assert.equal(closed.active_minutes, 25);
  assert.equal(closed.status, 'CLOSED');
  assert.equal(closed.gaps[0].threshold_minutes, 45);
  assert.equal(closed.confidence, 'BAJA');
});

test('Temporal: pausa larga queda excluida sin crear brecha de actividad', () => {
  const result = summary('pause.json');
  assert.equal(result.active_minutes, 25);
  assert.equal(result.gaps.length, 0);
  assert.deepEqual(result.pauses, [{ started_at: '2026-09-16T13:10:00.000Z', ended_at: '2026-09-16T14:20:00.000Z', event_ids: ['E-2', 'E-3'] }]);
});

test('Temporal: pausa sin reanudación excluye tiempo hasta cierre o fin del registro', () => {
  const input = events('pause.json');
  input.splice(2, 1);
  assert.equal(summarizeSessions(input)[0].active_minutes, 10);
  input.pop();
  const open = summarizeSessions(input)[0];
  assert.equal(open.active_minutes, 10);
  assert.equal(open.status, 'OPEN');
  assert.equal(open.pauses[0].ended_at, null);
});

test('Temporal: offline declarado conserva origen y no se vuelve medición manual', () => {
  const result = summary('offline.json');
  assert.equal(result.mode, 'DECLARADO');
  assert.equal(result.segments.length, 1);
  assert.deepEqual(result.segments[0].provenance, [{ event_id: 'E-2', origin: 'HUMAN', source_ref: 'registro-local:2' }]);
  assert.equal(result.confidence, 'BAJA');
});

test('Temporal: modo mixto conserva por separado chat y offline durante pausa', () => {
  const input = events('pause.json');
  input.splice(2, 0, { ...events('offline.json')[1], event_id: 'OFFLINE', timestamp: '2026-09-16T11:00:00-03:00', data: { started_at: '2026-09-16T10:20:00-03:00', ended_at: '2026-09-16T10:40:00-03:00' } });
  const result = summarizeSessions(input)[0];
  assert.equal(result.active_minutes, 45);
  assert.equal(result.mode, 'MIXTO');
  assert.deepEqual(result.segments.map(s => s.mode), ['CHAT_ESTIMADO', 'DECLARADO', 'CHAT_ESTIMADO']);
});

test('Temporal: rechaza doble conteo, offline futuro o anterior a T0', () => {
  const input = events('continuous.json');
  const offline = events('offline.json')[1];
  input.push({ ...offline, event_id: 'OFFLINE', timestamp: '2026-09-16T11:00:00-03:00' });
  assert.throws(() => summarizeSessions(input), /superpuestos/);
  const future = events('offline.json');
  future[1].data.ended_at = '2026-09-16T10:36:00-03:00';
  assert.throws(() => summarizeSessions(future), /después de su declaración/);
  future[1].data.ended_at = '2026-09-16T10:30:00-03:00';
  future[1].data.started_at = '2026-09-16T09:59:00-03:00';
  assert.throws(() => summarizeSessions(future), /anterior a T0/);
});

test('Temporal: correcciones encadenadas conservan segmentos y valores anteriores', () => {
  const input = events('correction.json');
  input.push({ ...input[3], event_id: 'E-5', timestamp: '2026-09-16T11:05:00-03:00', data: { ...input[3].data, previous_minutes: 22, new_minutes: 24, reason: 'Revisión de la estimación anterior.' } });
  const original = structuredClone(input);
  const result = summarizeSessions(input)[0];
  assert.deepEqual(result.corrections.map(c => [c.previous_minutes, c.new_minutes]), [[30, 22], [22, 24]]);
  assert.equal(result.active_minutes, 24);
  assert.equal(result.segments.reduce((n, s) => n + s.minutes, 0), 24);
  assert.equal(result.corrections[0].replaced_segments.reduce((n, s) => n + s.minutes, 0), 30);
  assert.equal(result.corrections[1].timestamp, '2026-09-16T14:05:00.000Z');
  assert.deepEqual(input, original);
  assert.deepEqual(summarizeSessions(input), summarizeSessions(input));
});

test('Temporal: rechaza corrección obsoleta, negativa, sin razón o no humana', () => {
  for (const mutate of [
    (e: any) => e.data.previous_minutes = 29,
    (e: any) => e.data.new_minutes = -1,
    (e: any) => e.data.reason = ' ',
    (e: any) => e.origin = 'CHAT'
  ]) {
    const input = events('correction.json');
    mutate(input[3]);
    assert.throws(() => summarizeSessions(input));
  }
});

test('Temporal: rechaza cierre anterior, IDs repetidos y sesiones no iniciadas', () => {
  const early = events('manual.json');
  early[1].timestamp = '2026-09-16T09:59:00-03:00';
  assert.throws(() => summarizeSessions(early), /fuera de orden/);
  const duplicate = events('manual.json');
  duplicate[1].event_id = duplicate[0].event_id;
  assert.throws(() => summarizeSessions(duplicate), /event_id duplicado/);
  assert.throws(() => summarizeSessions([events('manual.json')[1]]), /Falta SESSION_STARTED/);
  const starts = events('single-event.json');
  starts.push({ ...starts[0], event_id: 'E-2' });
  assert.throws(() => summarizeSessions(starts), /session_id ya iniciado/);
});

test('Temporal: rechaza transiciones inválidas de pausa, reanudación y cierre', () => {
  const noPause = events('manual.json');
  noPause[1].type = 'SESSION_RESUMED';
  assert.throws(() => summarizeSessions(noPause), /Reanudación sin pausa/);
  const duringPause = events('pause.json');
  duringPause[2].type = 'INTERACTION_RECORDED';
  assert.throws(() => summarizeSessions(duringPause), /Interacción durante pausa/);
  const closed = events('manual.json');
  closed.push({ ...closed[1], event_id: 'E-3' });
  assert.throws(() => summarizeSessions(closed), /sesión cerrada/);
});

test('Temporal: sin dos anclas temporales no inventa minutos', () => {
  assert.equal(summary('single-event.json').active_minutes, 0);
  const input = events('single-event.json');
  input.push({ ...input[0], event_id: 'E-2', type: 'INTERACTION_RECORDED', data: {} });
  assert.equal(summarizeSessions(input)[0].active_minutes, 0);
  assert.throws(() => summarizeSessions([input[1]]), /Falta SESSION_STARTED/);
});

test('Temporal: múltiples sesiones se mantienen independientes', () => {
  const a = events('manual.json');
  const b = a.map((e: any) => ({ ...e, session_id: 'S-002', event_id: `B-${e.event_id}` }));
  const result = summarizeSessions([a[0], b[0], a[1], b[1]]);
  assert.deepEqual(result.map(s => [s.session_id, s.active_minutes]), [['S-001', 30], ['S-002', 30]]);
});

test('Temporal: BLIND no expone duración, pausas, modo ni tiempos indirectos', () => {
  const result = exportForEvaluator(summary('blind.json'));
  assert.deepEqual(result, { visibility: 'BLIND', temporal_data_withheld: true });
  for (const name of ['gap.json', 'pause.json', 'correction.json']) {
    assert.deepEqual(Object.keys(exportForEvaluator(summary(name))), ['visibility', 'temporal_data_withheld']);
  }
});

test('Temporal: TIMED_TASK sólo expone la lista autorizada por consigna', () => {
  const result = exportForEvaluator(summary('timed-task.json'));
  assert.deepEqual(result, { session_id: 'S-001', visibility: 'TIMED_TASK', artifact_refs: [], competency_ids: [], task_id: 'TASK-001', task_brief_ref: 'consigna:cronometrada-v1', temporal: { active_minutes: 30 } });
  const input = events('pause.json');
  input[0].data.timed_task = { ...events('timed-task.json')[0].data.timed_task, authorized_fields: ['pauses'] };
  const projected = exportForEvaluator(summarizeSessions(input)[0]);
  assert.ok('temporal' in projected);
  assert.deepEqual(projected.temporal, { pauses: [{ started_at: '2026-09-16T13:10:00.000Z', ended_at: '2026-09-16T14:20:00.000Z' }] });
});

test('Temporal: rechaza autorización temporal ausente, falsa o excesiva', () => {
  for (const mutate of [
    (t: any) => t.time_declared = false,
    (t: any) => delete t.task_brief_ref,
    (t: any) => t.authorized_fields = ['segments'],
    (t: any) => t.authorized_fields = []
  ]) {
    const input = events('timed-task.json');
    mutate(input[0].data.timed_task);
    assert.throws(() => summarizeSessions(input), ContractError);
  }
  const blind = summary('blind.json');
  blind.visibility = 'TIMED_TASK';
  assert.throws(() => exportForEvaluator(blind), ContractError);
});

test('Temporal: minimización rechaza contenido, propiedades extra y notas extensas', () => {
  for (const mutate of [
    (e: any) => e.transcript = 'conversación',
    (e: any) => e.data.conversation = 'conversación',
    (e: any) => e.provenance.content = 'conversación',
    (e: any) => e.references = { content: 'conversación' },
    (e: any) => e.references = { note: 'x'.repeat(241) }
  ]) {
    const input = events('single-event.json');
    mutate(input[0]);
    assert.throws(() => summarizeSessions(input), ContractError);
  }
  const input = events('single-event.json');
  input[0].references = { note: 'x'.repeat(240) };
  summarizeSessions(input);
});

test('Temporal: contratos rechazan versiones, timestamps y zonas inválidas', () => {
  for (const mutate of [
    (e: any) => e.schema_version = '2.0.0',
    (e: any) => e.timestamp = 'ayer',
    (e: any) => e.data.timezone = 'zona-inexistente'
  ]) {
    const input = events('single-event.json');
    mutate(input[0]);
    assert.throws(() => summarizeSessions(input));
  }
});

test('Temporal: salida validada no admite puntuación, afinidad ni campos ocultos', () => {
  const session = summary('manual.json');
  const fields = ['schema_version', 'session_id', 'date', 'timezone', 'area', 'activity_type', 'tutor', 'started_at', 'ended_at', 'active_minutes', 'mode', 'confidence', 'pauses', 'artifact_refs', 'competency_ids', 'segments', 'corrections', 'gaps', 'event_ids', 'visibility', 'timed_task', 'status'];
  assert.deepEqual(Object.keys(session), fields);
  for (const field of ['score', 'affinity', 'enthusiasm', 'result', 'mastery_updates', 'conversation']) {
    assert.throws(() => validate('study-session', { ...session, [field]: 1 }), ContractError);
  }
  const extra = structuredClone(session);
  (extra.segments[0] as any).hidden = true;
  assert.throws(() => validate('study-session', extra), ContractError);
});

test('Temporal: el paquete no admite opciones o campos desconocidos', () => {
  assert.throws(() => parseTemporalInput({ events: [], content: 'privado' }), TemporalError);
  assert.throws(() => parseTemporalInput({ events: [], options: { telemetry: true } }), TemporalError);
  assert.throws(() => parseTemporalInput({ events: [], options: null }), TemporalError);
  assert.throws(() => summarizeSessions([]), TemporalError);
});

const cli = fileURLToPath(new URL('dist/src/temporal/cli.js', root));
const path = (file: string) => fileURLToPath(new URL(`tests/fixtures/temporal/${file}`, root));
test('Temporal CLI: salida compacta, JSON y exportación ciega/cronometrada', () => {
  const cases: [string, string[]][] = [['manual.json', []], ['correction.json', ['--json']], ['blind.json', ['--for-evaluator']], ['timed-task.json', ['--for-evaluator']]];
  for (const [file, flags] of cases) {
    const run = spawnSync(process.execPath, [cli, path(file), ...flags], { encoding: 'utf8' });
    assert.ifError(run.error);
    assert.equal(run.status, 0, run.stderr);
    if (file === 'manual.json') assert.match(run.stdout, /S-001 \| CLOSED \| 30 min \| MANUAL/);
    else {
      const expected = flags.includes('--for-evaluator') ? exportForEvaluator(summary(file)) : summary(file);
      assert.deepEqual(JSON.parse(run.stdout), [expected]);
    }
  }
});

test('Temporal CLI: errores de archivo, JSON, cronología, privacidad y argumentos', () => {
  for (const args of [[], [path('missing.json')], [fileURLToPath(new URL('tests/fixtures/malformed.json', root))], [path('unordered.json')], [path('unauthorized-content.json')], [path('manual.json'), '--unsafe'], [path('manual.json'), '--json', '--json']]) {
    const run = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
    assert.ifError(run.error);
    assert.equal(run.status, 1);
    assert.equal(run.stdout, '');
    assert.match(run.stderr, /Paquete temporal inválido/);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, validateBlindExport, ContractError } from '../src/contracts/index.js';
import { summarizeSessions, exportForEvaluator, OPEN_ANCHOR_CORRECTION_ERROR, TemporalError, type StudySession } from '../src/temporal/index.js';
import { temporalFixture } from './temporal-fixtures.js';

const blind = { visibility: 'BLIND', temporal_data_withheld: true };
const sum = (s: StudySession) => s.segments.reduce((total, segment) => total + segment.minutes, 0);
function base(): any[] {
  const events = temporalFixture('manual.json').events;
  events[1].timestamp = '2026-09-16T10:10:00-03:00';
  return events;
}
function correct(events: any[], previous: number, next: number): void {
  const n = events.length + 1;
  events.push({
    schema_version: '1.0.0', event_id: `COR-${n}`, session_id: events[0].session_id,
    timestamp: `2026-09-16T10:${10 + n}:00-03:00`, type: 'ESTIMATE_CORRECTED', origin: 'HUMAN',
    provenance: { source_ref: `revision:${n}` },
    data: { target: 'active_minutes', previous_minutes: previous, new_minutes: next, reason: `Corrección humana ${previous} a ${next}.` }
  });
}
function openCorrection(next = 5): any[] {
  const events = temporalFixture('single-event.json').events;
  events[0].timestamp = '2026-09-16T10:00:00-03:00';
  events.push({
    schema_version: '1.0.0', event_id: 'COR-OPEN', session_id: events[0].session_id,
    timestamp: '2026-09-16T10:05:00-03:00', type: 'ESTIMATE_CORRECTED', origin: 'HUMAN',
    provenance: { source_ref: 'revision:open-anchor' },
    data: { target: 'active_minutes', previous_minutes: 0, new_minutes: next, reason: 'Intento durante actividad abierta.' }
  });
  return events;
}

const attacks: [string, (events: any[]) => void][] = [
  ['session_id codifica horario', e => e.forEach(x => x.session_id = 'S-20260916-1000-1030')],
  ['artifact_refs codifica duration-30-min', e => e[0].references = { artifact_ref: 'duration-30-min' }],
  ['competency_ids codifica TIME:30', e => e[0].references = { competency_ids: ['TIME:30'] }],
  ['task_id codifica horario', e => e[0].references = { task_id: 'TASK-1000-1030' }],
  ['nota codifica duración', e => e[0].references = { note: 'Duración: 30 minutos, de 10:00 a 10:30.' }],
  ['procedencia codifica duración', e => e[0].provenance.source_ref = 'source:duration-30-min'],
  ['thread_id codifica duración', e => e[0].references = { thread_id: 'THREAD-TIME-30' }]
];
for (const [name, mutate] of attacks) test(`Corrección BLIND: ${name} produce payload fijo`, () => {
  const events = base();
  mutate(events);
  const session = summarizeSessions(events)[0];
  validate('study-session', session);
  assert.deepEqual(exportForEvaluator(session), blind);
});

test('Corrección BLIND: sesiones materialmente distintas tienen exportaciones idénticas', () => {
  const a = summarizeSessions(base())[0];
  const b = summarizeSessions(temporalFixture('correction.json').events)[0];
  assert.notDeepEqual(a, b);
  assert.equal(JSON.stringify(exportForEvaluator(a)), JSON.stringify(exportForEvaluator(b)));
  assert.deepEqual(exportForEvaluator(a), blind);
});

test('Corrección BLIND: schema rechaza propiedades extra y valores no constantes', () => {
  validateBlindExport(blind);
  for (const field of ['session_id', 'thread_id', 'artifact_refs', 'competency_ids', 'task_id', 'timestamp', 'minutes', 'segments', 'pauses', 'corrections', 'provenance', 'confidence', 'mode', 'note', 'unknown']) {
    assert.throws(() => validateBlindExport({ ...blind, [field]: 'duration-30-min' }), ContractError);
  }
  for (const value of [false, 'true', 1, null, undefined]) {
    assert.throws(() => validateBlindExport({ visibility: 'BLIND', temporal_data_withheld: value }), ContractError);
  }
  assert.throws(() => validateBlindExport({ visibility: 'BLIND' }), ContractError);
  const projected = exportForEvaluator(summarizeSessions(base())[0]);
  assert.throws(() => Object.assign(projected, { session_id: 'duration-30-min' }), TypeError);
});

for (const next of [7, 13]) test(`Corrección efectiva: base 10 a ${next} conserva igualdad y valida`, () => {
  const events = base();
  correct(events, 10, next);
  const session = summarizeSessions(events)[0];
  assert.equal(sum(session), next);
  assert.equal(session.active_minutes, next);
  assert.deepEqual(session.segments.map(s => [s.kind, s.minutes, s.mode]), [['ADJUSTMENT', next, 'DECLARADO']]);
  assert.equal(session.corrections[0].replaced_segments[0].minutes, 10);
  assert.equal(session.corrections[0].delta_minutes, next - 10);
  validate('study-session', session);
});

test('Corrección efectiva: cadena 10 a 7 a 9 conserva historial completo y eventos', () => {
  const events = base();
  correct(events, 10, 7);
  correct(events, 7, 9);
  const original = structuredClone(events);
  const s = summarizeSessions(events)[0];
  assert.equal(sum(s), 9);
  assert.equal(s.active_minutes, 9);
  assert.deepEqual(s.corrections.map(c => [c.previous_minutes, c.new_minutes, c.delta_minutes]), [[10, 7, -3], [7, 9, 2]]);
  assert.deepEqual(s.corrections.map(c => c.replaced_segments.reduce((n, x) => n + x.minutes, 0)), [10, 7]);
  for (const [i, correction] of s.corrections.entries()) {
    assert.equal(correction.target, 'active_minutes');
    assert.equal(correction.reason, events[i + 2].data.reason);
    assert.equal(correction.timestamp, new Date(events[i + 2].timestamp).toISOString());
    assert.deepEqual(correction.provenance, { event_id: events[i + 2].event_id, origin: 'HUMAN', source_ref: events[i + 2].provenance.source_ref });
  }
  assert.deepEqual(events, original);
  validate('study-session', s);
});

test('Corrección efectiva: una corrección negativa y un segmento negativo son rechazados', () => {
  const events = base();
  correct(events, 10, -1);
  assert.throws(() => summarizeSessions(events), ContractError);
  events[2].data.new_minutes = 7;
  const session = summarizeSessions(events)[0];
  session.segments[0].minutes = -1;
  assert.throws(() => validate('study-session', session), ContractError);
});

test('Corrección efectiva: no borra intervalos para volver a contar offline superpuesto', () => {
  for (const corrected of [0, 7, 13]) {
    const events = base();
    correct(events, 10, corrected);
    events.push({ ...events[2], event_id: 'OFFLINE', type: 'OFFLINE_TIME_DECLARED', timestamp: '2026-09-16T10:20:00-03:00', data: { started_at: '2026-09-16T10:02:00-03:00', ended_at: '2026-09-16T10:08:00-03:00' } });
    assert.throws(() => summarizeSessions(events), /superpuestos/);
  }
});

test('Corrección efectiva: combinación de chat y offline conserva ambas procedencias', () => {
  const events = temporalFixture('pause.json').events;
  events.splice(2, 0, {
    ...temporalFixture('offline.json').events[1], event_id: 'OFFLINE', timestamp: '2026-09-16T11:00:00-03:00',
    data: { started_at: '2026-09-16T10:20:00-03:00', ended_at: '2026-09-16T10:40:00-03:00' }
  });
  events.push({ ...events[0], event_id: 'CORRECTION', type: 'ESTIMATE_CORRECTED', timestamp: '2026-09-16T11:40:00-03:00', data: { target: 'active_minutes', previous_minutes: 45, new_minutes: 40, reason: 'Revisión humana del total.' } });
  const s = summarizeSessions(events)[0];
  assert.equal(sum(s), 40);
  assert.equal(s.active_minutes, 40);
  assert.equal(s.mode, 'MIXTO');
  assert.deepEqual(s.corrections[0].replaced_segments.map(x => x.mode), ['CHAT_ESTIMADO', 'DECLARADO', 'CHAT_ESTIMADO']);
  assert.equal(s.corrections[0].replaced_segments[1].provenance[0].event_id, 'OFFLINE');
  assert.equal(s.segments[0].provenance[0].event_id, 'CORRECTION');
});

test('Corrección efectiva: actividad posterior suma una sola vez y permite otra corrección', () => {
  const events = base();
  events[1].type = 'PAUSE_DECLARED';
  correct(events, 10, 7);
  events.push({ ...events[1], event_id: 'RESUME', type: 'SESSION_RESUMED', timestamp: '2026-09-16T10:15:00-03:00' });
  events.push({ ...events[1], event_id: 'CLOSE', type: 'SESSION_CLOSED', timestamp: '2026-09-16T10:20:00-03:00' });
  const s = summarizeSessions(events)[0];
  assert.equal(s.active_minutes, 12);
  assert.equal(sum(s), 12);
  events.push({ ...events[2], event_id: 'COR-LAST', timestamp: '2026-09-16T10:25:00-03:00', data: { ...events[2].data, previous_minutes: 12, new_minutes: 10 } });
  const last = summarizeSessions(events)[0];
  assert.equal(sum(last), 10);
  assert.equal(last.active_minutes, 10);
  validate('study-session', last);
});

test('Corrección efectiva: admite cero y ajuste desde cero sin fabricar intervalos', () => {
  const events = base();
  correct(events, 10, 0);
  correct(events, 0, 3);
  const s = summarizeSessions(events)[0];
  assert.equal(s.active_minutes, 3);
  assert.equal(sum(s), 3);
  assert.equal(s.segments[0].kind, 'ADJUSTMENT');
  assert.equal('started_at' in s.segments[0], false);
});

test('Corrección efectiva: validador cruzado rechaza total, delta o historial adulterados', () => {
  const events = base(); correct(events, 10, 7); correct(events, 7, 9);
  for (const mutate of [
    (s: StudySession) => s.active_minutes = 10,
    (s: StudySession) => s.corrections[0].delta_minutes = 0,
    (s: StudySession) => s.corrections[0].replaced_segments[0].minutes = 11,
    (s: StudySession) => s.corrections[1].previous_minutes = 10,
    (s: StudySession) => s.segments.push(structuredClone(s.segments[0])),
    (s: StudySession) => s.corrections.splice(0, 1)
  ]) {
    const s = summarizeSessions(events)[0]; mutate(s);
    assert.throws(() => validate('study-session', s), ContractError);
  }
});

test('Corrección efectiva: conserva fracciones y no introduce un total redondeado competidor', () => {
  const events = base(); correct(events, 10, 0.0000001);
  const s = summarizeSessions(events)[0];
  assert.equal(s.active_minutes, 0.0000001);
  assert.equal(sum(s), s.active_minutes);
});

test('Corrección BLIND: TIMED_TASK conserva exactamente su payload auditado', () => {
  const s = summarizeSessions(temporalFixture('timed-task.json').events)[0];
  assert.deepEqual(exportForEvaluator(s), { session_id: 'S-001', visibility: 'TIMED_TASK', artifact_refs: [], competency_ids: [], task_id: 'TASK-001', task_brief_ref: 'consigna:cronometrada-v1', temporal: { active_minutes: 30 } });
});

test('Corrección efectiva: procedencia equivalente no depende del orden de propiedades JSON', () => {
  const events = base(); correct(events, 10, 7);
  const s = summarizeSessions(events)[0];
  const source = s.corrections[0].provenance;
  s.corrections[0].provenance = { source_ref: source.source_ref, origin: source.origin, event_id: source.event_id };
  validate('study-session', s);
});

test('Corrección con ancla abierta: START minuto 0 y corrección 0 a 5 minuto 5 se rechazan de forma estable', () => {
  const events = openCorrection(5);
  assert.throws(() => summarizeSessions(events), (error: unknown) => error instanceof TemporalError && error.message === OPEN_ANCHOR_CORRECTION_ERROR);
});

test('Corrección con ancla abierta: una corrección negativa se rechaza antes de mutar el replay', () => {
  const events = openCorrection(-5);
  const original = structuredClone(events);
  assert.throws(() => summarizeSessions(events), (error: unknown) => error instanceof TemporalError && error.message === OPEN_ANCHOR_CORRECTION_ERROR);
  assert.deepEqual(events, original);
  const prefix = summarizeSessions(events.slice(0, 1))[0];
  assert.deepEqual(prefix.segments, []);
  assert.deepEqual(prefix.corrections, []);
  assert.equal(prefix.active_minutes, 0);
  assert.equal(prefix.status, 'OPEN');
});

test('Corrección con ancla abierta: PAUSE posterior no puede producir una sesión aceptada', () => {
  const events = openCorrection();
  events.push({ ...events[0], event_id: 'PAUSE-AFTER-CORRECTION', timestamp: '2026-09-16T10:10:00-03:00', type: 'PAUSE_DECLARED', data: {} });
  assert.throws(
    () => summarizeSessions(events),
    (error: unknown) => error instanceof TemporalError && error.message === OPEN_ANCHOR_CORRECTION_ERROR,
  );
});

test('Corrección con ancla abierta: el ataque START, CORRECTION, END rechaza antes de fabricar 15 minutos', () => {
  const events = openCorrection();
  events.push({ ...events[0], event_id: 'END-AFTER-CORRECTION', timestamp: '2026-09-16T10:10:00-03:00', type: 'SESSION_CLOSED', data: {} });
  assert.throws(
    () => summarizeSessions(events),
    (error: unknown) => error instanceof TemporalError && error.message === OPEN_ANCHOR_CORRECTION_ERROR,
  );
  const valid = summarizeSessions([events[0], events.at(-1)!])[0];
  assert.equal(valid.active_minutes, 10);
  assert.equal(sum(valid), 10);
});

test('Corrección con ancla abierta: START, PAUSE, CORRECTION, RESUME, END se acepta sin doble conteo', () => {
  const events = openCorrection();
  events.splice(1, 0, { ...events[0], event_id: 'PAUSE-BEFORE-CORRECTION', timestamp: '2026-09-16T10:10:00-03:00', type: 'PAUSE_DECLARED', data: {} });
  events[2].data.previous_minutes = 10;
  events[2].timestamp = '2026-09-16T10:11:00-03:00';
  events.push({ ...events[0], event_id: 'RESUME-AFTER-CORRECTION', timestamp: '2026-09-16T10:15:00-03:00', type: 'SESSION_RESUMED', data: {} });
  events.push({ ...events[0], event_id: 'END-AFTER-RESUME', timestamp: '2026-09-16T10:20:00-03:00', type: 'SESSION_CLOSED', data: {} });
  const session = summarizeSessions(events)[0];
  assert.equal(session.active_minutes, 10);
  assert.equal(sum(session), 10);
  assert.deepEqual(session.segments.map(s => s.minutes), [5, 5]);
  assert.deepEqual(session.corrections[0].replaced_segments.map(s => s.minutes), [10]);
});

test('Corrección con ancla abierta: START, END y corrección cerrada siguen siendo válidos', () => {
  const events = base();
  correct(events, 10, 7);
  const session = summarizeSessions(events)[0];
  assert.equal(session.active_minutes, 7);
  assert.equal(sum(session), 7);
  assert.equal(session.corrections.length, 1);
});

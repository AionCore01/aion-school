import { validate, validateBlindExport } from '../contracts/index.js';
import type { StudyEvent, StudySession, StartData, TemporalOptions, TemporalInput, Provenance, Segment, IntervalSegment, BlindTemporalExport, TemporalField } from './types.js';
export type * from './types.js';

export class TemporalError extends Error {}
export const OPEN_ANCHOR_CORRECTION_ERROR = 'Corrección requiere pausar o cerrar antes de modificar active_minutes.';
function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) throw new TemporalError(message);
}
function instant(timestamp: string): number {
  const value = Date.parse(timestamp);
  ensure(Number.isFinite(value), 'Timestamp no representable.');
  return value;
}
const iso = (timestamp: string) => new Date(instant(timestamp)).toISOString();
const minutesBetween = (a: string, b: string) => (instant(b) - instant(a)) / 60000;
const rounded = (n: number) => Math.round(n * 1e6) / 1e6;
const provenance = (e: StudyEvent): Provenance => ({ event_id: e.event_id, origin: e.origin, source_ref: e.provenance.source_ref });

function localDate(timestamp: string, timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(timestamp));
    const part = (type: string) => parts.find(p => p.type === type)!.value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  } catch {
    throw new TemporalError('Zona horaria no reconocida por el runtime.');
  }
}

function optionThreshold(options: TemporalOptions): number {
  ensure(options !== null && typeof options === 'object' && !Array.isArray(options), 'Opciones inválidas.');
  ensure(Object.keys(options).every(k => k === 'gap_threshold_minutes'), 'Opción temporal desconocida.');
  const threshold = 'gap_threshold_minutes' in options ? options.gap_threshold_minutes : 45;
  ensure(typeof threshold === 'number' && Number.isFinite(threshold) && threshold > 0, 'El umbral debe ser un número finito positivo.');
  return threshold;
}

interface Context { session: StudySession; initialMode: StartData['mode']; anchor: StudyEvent | null; paused: boolean }
function recordedSegments(session: StudySession): Segment[] {
  return [...session.corrections.flatMap(c => c.replaced_segments), ...session.segments];
}
function effectiveMinutes(session: StudySession): number {
  return session.segments.reduce((total, segment) => total + segment.minutes, 0);
}
function addSegment(context: Context, from: string, to: string, mode: Segment['mode'], sources: Provenance[]): void {
  const session = context.session;
  ensure(instant(to) >= instant(from), 'Duración negativa.');
  ensure(instant(from) >= instant(session.started_at), 'Segmento anterior a T0.');
  if (session.status === 'CLOSED') ensure(instant(to) <= instant(session.ended_at!), 'Tiempo declarado posterior al cierre.');
  const duration = minutesBetween(from, to);
  if (duration === 0) return;
  const history = recordedSegments(session);
  const intervals = history.filter((s): s is IntervalSegment => s.kind === 'INTERVAL');
  ensure(!intervals.some(s => instant(from) < instant(s.ended_at) && instant(to) > instant(s.started_at)), 'Segmentos superpuestos: se rechaza el doble conteo.');
  session.segments.push({ segment_id: `SEG-${history.length + 1}`, kind: 'INTERVAL', started_at: iso(from), ended_at: iso(to), minutes: rounded(duration), mode, provenance: sources });
  session.active_minutes = effectiveMinutes(session);
  if (session.status === 'PROVISIONAL' && instant(to) > instant(session.ended_at!)) session.ended_at = iso(to);
}

function refresh(context: Context): void {
  const { session, initialMode } = context;
  const modes = new Set(recordedSegments(session).map(s => s.mode));
  if (session.corrections.length) modes.add('DECLARADO');
  session.mode = modes.size > 1 ? 'MIXTO' : modes.values().next().value ?? initialMode;
  // Confidence describes temporal evidence only; never ability or engagement.
  session.confidence = session.status !== 'CLOSED' || session.active_minutes === 0 || session.gaps.length > 0 || modes.has('DECLARADO')
    ? 'BAJA' : modes.has('CHAT_ESTIMADO') ? 'MEDIA' : 'ALTA';
}

/** Replay explicit events only. No clock, watcher, persistence or evaluation calls. */
export function summarizeSessions(input: unknown, options: TemporalOptions = {}): StudySession[] {
  const threshold = optionThreshold(options);
  ensure(Array.isArray(input) && input.length > 0, 'Se requiere al menos un evento.');
  const contexts = new Map<string, Context>();
  const seen = new Set<string>();
  let previous = -Infinity;
  for (const raw of input) {
    // This must precede schema validation and every replay mutation: even a malformed
    // correction cannot turn an open anchor into an adjustment or a synthetic boundary.
    const pending = raw as { type?: unknown; session_id?: unknown } | null;
    if (pending && typeof pending === 'object' && pending.type === 'ESTIMATE_CORRECTED' && typeof pending.session_id === 'string' && contexts.get(pending.session_id)?.anchor) {
      throw new TemporalError(OPEN_ANCHOR_CORRECTION_ERROR);
    }
    validate('study-event', raw);
    const event = structuredClone(raw) as StudyEvent;
    const time = instant(event.timestamp);
    ensure(time >= previous, 'Eventos fuera de orden cronológico.');
    ensure(!seen.has(event.event_id), 'event_id duplicado.');
    seen.add(event.event_id);
    previous = time;
    let context = contexts.get(event.session_id);
    if (event.type === 'SESSION_STARTED') {
      ensure(!context, 'session_id ya iniciado.');
      const data = event.data;
      const session: StudySession = {
        schema_version: '1.0.0', session_id: event.session_id,
        date: localDate(event.timestamp, data.timezone), timezone: data.timezone,
        area: data.area, activity_type: data.activity_type, tutor: data.tutor ?? null,
        started_at: iso(event.timestamp), ended_at: null, active_minutes: 0,
        mode: data.mode, confidence: 'BAJA', pauses: [], artifact_refs: [], competency_ids: [],
        segments: [], corrections: [], gaps: [], event_ids: [],
        visibility: data.timed_task ? 'TIMED_TASK' : 'BLIND', timed_task: data.timed_task ?? null, status: 'OPEN'
      };
      context = { session, initialMode: data.mode, anchor: event, paused: false };
      contexts.set(event.session_id, context);
    } else {
      ensure(context, 'Falta SESSION_STARTED para session_id.');
      const { session } = context;
      const administrative = event.type === 'OFFLINE_TIME_DECLARED' || event.type === 'ESTIMATE_CORRECTED';
      ensure(session.status !== 'CLOSED' || administrative, 'La sesión cerrada sólo admite declaraciones offline o correcciones.');

      // Administrative records never establish evidence of continuous activity.
      if (context.anchor && !context.paused && session.status === 'OPEN' && minutesBetween(context.anchor.timestamp, event.timestamp) > threshold) {
        session.gaps.push({ from: iso(context.anchor.timestamp), to: iso(event.timestamp), threshold_minutes: threshold, event_ids: [context.anchor.event_id, event.event_id] });
        session.status = 'PROVISIONAL';
        session.ended_at = iso(context.anchor.timestamp);
        context.anchor = null;
      }
      if (event.type === 'OFFLINE_TIME_DECLARED') {
        ensure(instant(event.data.ended_at) <= time, 'El tiempo offline no puede terminar después de su declaración.');
        addSegment(context, event.data.started_at, event.data.ended_at, 'DECLARADO', [provenance(event)]);
      } else if (event.type === 'ESTIMATE_CORRECTED') {
        ensure(event.data.previous_minutes === session.active_minutes, 'La corrección no coincide con el valor anterior vigente.');
        const segmentId = `SEG-${recordedSegments(session).length + 1}`;
        session.corrections.push({
          ...event.data, event_id: event.event_id, timestamp: iso(event.timestamp), provenance: provenance(event),
          delta_minutes: event.data.new_minutes - event.data.previous_minutes,
          replaced_segments: structuredClone(session.segments)
        });
        session.segments = [{ segment_id: segmentId, kind: 'ADJUSTMENT', minutes: event.data.new_minutes, mode: 'DECLARADO', correction_event_id: event.event_id, provenance: [provenance(event)] }];
        session.active_minutes = effectiveMinutes(session);
      } else if (event.type === 'SESSION_RESUMED') {
        ensure(context.paused || session.status === 'PROVISIONAL', 'Reanudación sin pausa ni corte provisional.');
        if (context.paused) {
          const pause = session.pauses.at(-1)!;
          pause.ended_at = iso(event.timestamp);
          pause.event_ids.push(event.event_id);
        }
        context.paused = false;
        context.anchor = event;
        session.status = 'OPEN';
        session.ended_at = null;
      } else {
        if (event.type === 'PAUSE_DECLARED') ensure(!context.paused, 'Pausa duplicada sin reanudación.');
        if (event.type === 'INTERACTION_RECORDED') ensure(!context.paused, 'Interacción durante pausa: reanudar primero.');
        if (context.anchor && !context.paused && session.status === 'OPEN') {
          if (context.initialMode === 'MANUAL') ensure(context.anchor.origin === 'HUMAN' && event.origin === 'HUMAN', 'Un intervalo manual requiere extremos humanos declarados.');
          if (context.initialMode !== 'DECLARADO') addSegment(context, context.anchor.timestamp, event.timestamp, context.initialMode, [provenance(context.anchor), provenance(event)]);
          context.anchor = event;
        }
        if (event.type === 'PAUSE_DECLARED') {
          session.pauses.push({ started_at: iso(event.timestamp), ended_at: null, event_ids: [event.event_id] });
          context.paused = true;
          context.anchor = null;
        } else if (event.type === 'SESSION_CLOSED') {
          if (context.paused) {
            const pause = session.pauses.at(-1)!;
            pause.ended_at = iso(event.timestamp);
            pause.event_ids.push(event.event_id);
          }
          session.status = 'CLOSED';
          session.ended_at = iso(event.timestamp);
          context.paused = false;
          context.anchor = null;
        }
        // An interaction after a gap remains provisional until explicit resume/close.
      }
    }
    context.session.event_ids.push(event.event_id);
    const refs = event.references;
    if (refs?.artifact_ref && !context.session.artifact_refs.includes(refs.artifact_ref)) context.session.artifact_refs.push(refs.artifact_ref);
    for (const id of refs?.competency_ids ?? []) if (!context.session.competency_ids.includes(id)) context.session.competency_ids.push(id);
    refresh(context);
  }
  return [...contexts.values()].map(({ session }) => {
    validate('study-session', session);
    return session;
  });
}

/** Narrow allowlist projection. Never forward the full observer summary to an evaluator. */
export function exportForEvaluator(session: StudySession): BlindTemporalExport | Record<string, unknown> {
  validate('study-session', session);
  if (session.visibility === 'BLIND') {
    const blind = Object.freeze({ visibility: 'BLIND', temporal_data_withheld: true } as const);
    validateBlindExport(blind);
    return blind;
  }
  const output: Record<string, unknown> = {
    session_id: session.session_id, visibility: session.visibility,
    artifact_refs: [...session.artifact_refs], competency_ids: [...session.competency_ids]
  };
  if (session.visibility === 'TIMED_TASK') {
    const task = session.timed_task!;
    output.task_id = task.task_id;
    output.task_brief_ref = task.task_brief_ref;
    const temporal: Partial<Pick<StudySession, TemporalField>> = {};
    for (const field of task.authorized_fields) {
      // Pause provenance is internal even when pause intervals are authorized.
      Object.assign(temporal, { [field]: field === 'pauses'
        ? session.pauses.map(({ started_at, ended_at }) => ({ started_at, ended_at }))
        : structuredClone(session[field]) });
    }
    output.temporal = temporal;
  }
  return output;
}

export function parseTemporalInput(value: unknown): TemporalInput {
  ensure(value !== null && typeof value === 'object' && !Array.isArray(value), 'Se requiere un objeto con events y options opcional.');
  ensure(Object.keys(value).every(k => k === 'events' || k === 'options'), 'Campo no autorizado en el paquete temporal.');
  const input = value as TemporalInput;
  ensure(Array.isArray(input.events), 'events debe ser una lista.');
  if ('options' in input) optionThreshold(input.options!);
  return input;
}

export function compactSummary(session: StudySession): string {
  return `${session.session_id} | ${session.status} | ${session.active_minutes} min | ${session.mode} | confianza temporal ${session.confidence} | pausas ${session.pauses.length} | cortes ${session.gaps.length} | correcciones ${session.corrections.length}`;
}

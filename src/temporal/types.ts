export type MeasurementMode = 'MANUAL' | 'CHAT_ESTIMADO' | 'DECLARADO';
export type TemporalField = 'active_minutes' | 'started_at' | 'ended_at' | 'pauses' | 'mode' | 'confidence';
export interface TimedTask {
  task_id: string;
  task_brief_ref: string;
  time_declared: true;
  authorized_fields: TemporalField[];
}
export interface Provenance { event_id: string; origin: 'HUMAN' | 'CHAT'; source_ref: string }
export interface References {
  thread_id?: string; task_id?: string; artifact_ref?: string; competency_ids?: string[]; note?: string;
}
interface EventBase {
  schema_version: '1.0.0'; event_id: string; session_id: string; timestamp: string;
  origin: 'HUMAN' | 'CHAT'; provenance: { source_ref: string }; references?: References;
}
export interface StartData {
  activation: 'Pez en el agua'; timezone: string; area: string; activity_type: string;
  tutor?: string; mode: MeasurementMode; timed_task?: TimedTask;
}
export interface CorrectionData {
  target: 'active_minutes'; previous_minutes: number; new_minutes: number; reason: string;
}
export type StudyEvent = EventBase & (
  | { type: 'SESSION_STARTED'; data: StartData }
  | { type: 'INTERACTION_RECORDED' | 'PAUSE_DECLARED' | 'SESSION_RESUMED' | 'SESSION_CLOSED'; data: Record<string, never> }
  | { type: 'OFFLINE_TIME_DECLARED'; data: { started_at: string; ended_at: string } }
  | { type: 'ESTIMATE_CORRECTED'; data: CorrectionData }
);
export interface IntervalSegment {
  kind: 'INTERVAL';
  segment_id: string; started_at: string; ended_at: string; minutes: number;
  mode: MeasurementMode; provenance: Provenance[];
}
export interface AdjustmentSegment {
  kind: 'ADJUSTMENT'; segment_id: string; minutes: number; mode: 'DECLARADO';
  correction_event_id: string; provenance: Provenance[];
}
export type Segment = IntervalSegment | AdjustmentSegment;
export interface BlindTemporalExport { readonly visibility: 'BLIND'; readonly temporal_data_withheld: true }
export interface Pause { started_at: string; ended_at: string | null; event_ids: string[] }
export interface Gap { from: string; to: string; threshold_minutes: number; event_ids: string[] }
export interface Correction extends CorrectionData {
  event_id: string; timestamp: string; provenance: Provenance;
  delta_minutes: number; replaced_segments: Segment[];
}
export interface StudySession {
  schema_version: '1.0.0'; session_id: string; date: string; timezone: string;
  area: string; activity_type: string; tutor: string | null;
  started_at: string; ended_at: string | null; active_minutes: number;
  mode: MeasurementMode | 'MIXTO'; confidence: 'ALTA' | 'MEDIA' | 'BAJA';
  pauses: Pause[]; artifact_refs: string[]; competency_ids: string[];
  segments: Segment[]; corrections: Correction[]; gaps: Gap[]; event_ids: string[];
  visibility: 'BLIND' | 'TIMED_TASK'; timed_task: TimedTask | null;
  status: 'OPEN' | 'PROVISIONAL' | 'CLOSED';
}
export interface TemporalOptions { gap_threshold_minutes?: number }
export interface TemporalInput { events: StudyEvent[]; options?: TemporalOptions }

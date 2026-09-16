import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { root } from '../src/contracts/index.js';
import { parseTemporalInput, summarizeSessions, type StudySession } from '../src/temporal/index.js';

export interface TemporalCase { file: string; valid: boolean; expected?: Partial<StudySession> }
export const temporalCases: TemporalCase[] = JSON.parse(readFileSync(new URL('tests/fixtures/temporal/manifest.json', root), 'utf8'));
export function temporalFixture(file: string): any {
  return JSON.parse(readFileSync(new URL(`tests/fixtures/temporal/${file}`, root), 'utf8'));
}
export function checkTemporalFixture(item: TemporalCase): void {
  const input = parseTemporalInput(temporalFixture(item.file));
  if (!item.valid) {
    assert.throws(() => summarizeSessions(input.events, input.options));
    return;
  }
  const sessions = summarizeSessions(input.events, input.options);
  assert.equal(sessions.length, 1);
  for (const [field, expected] of Object.entries(item.expected!)) {
    assert.deepEqual(sessions[0][field as keyof StudySession], expected, `${item.file}: ${field}`);
  }
}

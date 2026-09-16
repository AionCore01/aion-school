import { readFileSync } from 'node:fs';
import { root, validate, type ContractName } from '../src/contracts/index.js';

export interface FixtureCase {
  file: string; contract: ContractName; valid: boolean;
  preflight?: string; exit?: number;
}
export const cases: FixtureCase[] = JSON.parse(readFileSync(new URL('tests/fixtures/manifest.json', root), 'utf8'));
export function fixture(file: string): any {
  return JSON.parse(readFileSync(new URL(`tests/fixtures/${file}`, root), 'utf8'));
}
export function checkFixture(item: FixtureCase): void {
  let accepted = true;
  try { validate(item.contract, fixture(item.file)); } catch { accepted = false; }
  if (accepted !== item.valid) throw new Error(`Resultado inesperado: ${item.file}; válido esperado=${item.valid}`);
}

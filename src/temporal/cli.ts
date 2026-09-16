import { readFileSync } from 'node:fs';
import { summarizeSessions, exportForEvaluator, compactSummary, parseTemporalInput } from './index.js';

try {
  const args = process.argv.slice(2);
  const flags = args.filter(arg => arg.startsWith('--'));
  const paths = args.filter(arg => !arg.startsWith('--'));
  if (paths.length !== 1 || new Set(flags).size !== flags.length || flags.some(flag => !['--json', '--for-evaluator'].includes(flag))) {
    throw new Error('Uso: npm run summarize:session -- <fixture.json> [--json] [--for-evaluator]');
  }
  const input = parseTemporalInput(JSON.parse(readFileSync(paths[0], 'utf8')));
  const sessions = summarizeSessions(input.events, input.options);
  if (flags.includes('--for-evaluator')) console.log(JSON.stringify(sessions.map(exportForEvaluator), null, 2));
  else if (flags.includes('--json')) console.log(JSON.stringify(sessions, null, 2));
  else for (const session of sessions) console.log(compactSummary(session));
} catch (error) {
  // Do not echo input payloads or parser excerpts that may contain private text.
  console.error(error instanceof SyntaxError ? 'Paquete temporal inválido: JSON malformado.' : `Paquete temporal inválido: ${error instanceof Error ? error.message : 'error desconocido'}`);
  process.exitCode = 1;
}

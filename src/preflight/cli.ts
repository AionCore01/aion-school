import { loadRequest } from '../contracts/index.js';
import { preflight } from './index.js';

try {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const paths = args.filter(a => a !== '--json');
  if (paths.length !== 1 || paths[0].startsWith('--')) {
    throw new Error('Uso: npm run preflight -- <paquete.json> [--json]');
  }
  const output = preflight(loadRequest(paths[0]));
  if (json) console.log(JSON.stringify(output, null, 2));
  else {
    console.log(`AION · ${output.evaluation_id}\nPreflight: ${output.preflight.status}`);
    for (const item of output.preflight.blockers) console.log(`Bloqueo [${item.code}]: ${item.message}`);
    for (const item of output.preflight.warnings) console.log(`Advertencia [${item.code}] (${item.attribution}): ${item.message}`);
    console.log(`Límite de confianza de observación: ${output.preflight.confidence_limit}`);
    console.log(output.executive_summary);
  }
  process.exitCode = output.preflight.blockers.some(b => b.kind === 'missing_required_input') ? 2 : 0;
} catch (error) {
  console.error(`Paquete inválido: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

import { cases, checkFixture } from './fixtures.js';
import { loadCommonRubric, contractNames } from '../src/contracts/index.js';
loadCommonRubric();
for (const item of cases) {
  checkFixture(item);
  console.log(`OK ${item.file}: ${item.valid ? 'aceptado' : 'rechazado según lo esperado'}`);
}
console.log(`${contractNames.length} schemas compilados; rúbrica validada; ${cases.length} fixtures verificados.`);

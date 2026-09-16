import { cases, checkFixture } from './fixtures.js';
import { loadCommonRubric, contractNames } from '../src/contracts/index.js';
import { temporalCases, checkTemporalFixture } from './temporal-fixtures.js';
loadCommonRubric();
for (const item of cases) {
  checkFixture(item);
  console.log(`OK ${item.file}: ${item.valid ? 'aceptado' : 'rechazado según lo esperado'}`);
}
for (const item of temporalCases) {
  checkTemporalFixture(item);
  console.log(`OK temporal/${item.file}: ${item.valid ? 'aceptado' : 'rechazado según lo esperado'}`);
}
console.log(`${contractNames.length} schemas compilados; rúbrica validada; ${cases.length + temporalCases.length} fixtures verificados (${cases.length} fundacionales, ${temporalCases.length} temporales).`);

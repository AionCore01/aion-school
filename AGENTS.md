# AION School: instrucciones operativas

Escuela personal, independiente y no oficial. No certifica aptitud institucional ni promete ingreso laboral.

## Autoridad y continuidad

- Leer completos `docs/foundation/AION_Mision_Fundacional_Astra_v0.1.md`, el Manifiesto y la Especificación de esa carpeta antes de cambiar contratos o evaluación; consultar `STATUS.md`, `NEXT.md` y el ADR.
- Preservar los documentos normativos y los originales de la raíz sin reescribirlos. Registrar contradicciones como decisiones pendientes; nunca resolverlas silenciosamente.
- Conservar entradas, evidencias, errores y decisiones anteriores. Una revisión debe quedar vinculada a su original.
- Inspeccionar el trabajo existente y presentar un plan breve antes de modificarlo. No sobrescribir trabajo previo incompatible. No cambiar la identidad Git ni crear commits o publicar sin autorización explícita.
- Esta misión termina con el fundamento determinista. No iniciar el incremento siguiente sin una nueva solicitud.

## Reglas de evaluación

- Definir → comparar → clasificar → documentar. Puntuar sólo criterios previamente informados y versionados.
- Cada hallazgo separa observación, comparación, interpretación y decisión; incluye localizador de evidencia primaria.
- Ausencia de evidencia no equivale a evidencia negativa. Falta de consigna, rúbrica o producción implica `NO_EVALUABLE`.
- Fallos y advertencias del sistema no se atribuyen a la estudiante. Declarar límites de observación e incertidumbre.
- No inferir personalidad, salud mental, lealtad ni idoneidad oficial; no premiar retórica, extensión o afinidad.
- No confundir validación de schema con evaluación semántica. No presentar resultados sintéticos ni pruebas no ejecutadas como desempeño verificado.
- Las compuertas críticas deben citar criterios y evidencia; el total no reemplaza el análisis por criterio.
- `DEMOSTRADA` exige producción abierta satisfactoria; `TRANSFERIDA` exige problema nuevo sin guía central. Ningún preflight actualiza dominio.
- Una mala ejecución no borra dominio automáticamente. Conservar historial y razones de propuestas de cambio.
- Apelaciones con rúbrica congelada; la revisión humana tiene autoridad final en disputas.
- Evaluación sumativa y de transferencia futura: extracción ciega seguida de juicio rubricado. No afirmar que exista todavía.
- Minimizar datos personales; problemas simulados y fuentes legales; seguridad defensiva en laboratorio autorizado.

## Trabajo técnico

- Node.js, TypeScript y npm; dependencias locales, stack liviano, sin monorepo.
- No agregar campus, usuarios, cronómetro, currículo, tutores, servicios, modelos, credenciales, base de datos ni despliegue a este incremento.
- Versionar contratos y rúbricas. No alterar retrospectivamente una evaluación con una nueva rúbrica.
- Ejecutar `npm test`, `npm run typecheck` y `npm run validate:fixtures` ante cambios pertinentes. Actualizar `STATUS.md` sólo con evidencia real.
- Mantener `NEXT.md` limitado a un incremento pequeño. Documentar límites semánticos y decisiones pendientes en el ADR.

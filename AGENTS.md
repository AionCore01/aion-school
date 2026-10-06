# AION School: instrucciones operativas

Escuela personal, independiente y no oficial. No certifica aptitud institucional ni promete ingreso laboral.

## Autoridad y continuidad

- Leer completos `docs/foundation/AION_Mision_Fundacional_Astra_v0.1.md`, el Manifiesto y la Especificación de esa carpeta antes de cambiar contratos o evaluación; consultar `STATUS.md`, `NEXT.md` y el ADR.
- Antes de abrir una línea nueva, leer `docs/governance/CUSTODIO.md` y respetar su checkpoint y carril activo. Las ideas fuera de perímetro van a backlog o requieren replanificación explícita.
- Para materiales, usar la taxonomía de `docs/governance/MATERIAL-PROVENANCE.md`; no confundir fuentes de investigación con currículo para el alumno.
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

## Selección operativa de capacidad y modelo

Política vigente para trabajo futuro en Codex, revisable cuando cambie la familia de modelos:

- **Luna:** exploración del repo, búsquedas, inspecciones simples, cambios mecánicos pequeños, ejecución rutinaria de comandos conocidos y documentación trivial.
- **GPT-6.1 Sol ligero/medio:** opción por defecto para trabajo serio; implementar contratos ya diseñados, reparar código cuyo problema ya está entendido, cambios coordinados entre varias piezas, fixtures, schemas, wiring, diagnóstico técnico ordinario y materialización de diseños ya fijados.
- **GPT-6.1 Sol High:** muchas restricciones simultáneas, invariantes complejos, auditorías técnicas difíciles, contraejemplos y problemas de alta complejidad cuyo marco conceptual sigue siendo válido.
- **Astra:** incertidumbre epistemológica, cuestionar la abstracción, arquitectura nueva, contradicciones conceptuales persistentes, auditoría adversarial independiente de alto nivel y decidir si la evidencia distingue realmente hipótesis rivales.

Regla compacta: «Luna explora → 6.1 Sol construye → 6.1 Sol High pelea → Astra juzga».

No escalar a Astra sólo por volumen o dificultad técnica; escalar cuando esté en duda el marco conceptual o interpretativo. El modelo seleccionado en Codex puede persistir entre tareas: verificar el nivel antes de trabajos triviales para evitar consumo innecesario. Multiagente/subagentes sólo cuando exista paralelismo real con valor metodológico; no usar paralelismo por defecto.

Esta política no cambia la autoridad ni las prohibiciones del proyecto y no autoriza automáticamente modelos externos desde el código del repo.

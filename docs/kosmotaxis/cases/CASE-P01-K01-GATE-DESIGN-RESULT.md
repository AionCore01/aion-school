# CASE-P01 — Resultado vinculado del diseño de compuertas K1

## Estado del resultado

- case_status: `COMPLETED_DOCUMENTALLY`
- experimental_conclusion: `NO_CONCLUYENTE`
- K1: `NOT_AUTHORIZED`
- next_requirement: otro bloque de software prospectivo, no autorreferencial, con política de acceso y retención acordada antes de ejecutarse

Este documento registra el resultado posterior de CASE-P01. No modifica, completa ni reescribe el prerregistro histórico.

## Vinculación y procedencia documental

### HECHOS VERIFICADOS POR GIT

- K0: commit `6a3e2f1`.
- Prerregistro de CASE-P01: commit `7f43e96`.
- Protocolo K0.1 aprobado: commit `c8c29af`.
- Rama: `experiment/kosmotaxis`.
- Ascendencia documental: `6a3e2f1 → 7f43e96 → c8c29af`.
- El prerregistro está preservado en su commit anterior.

Git prueba el orden entre versiones registradas en esta historia. No prueba hora real, identidad, modelo seleccionado, anterioridad real de la selección o ejecución, ni ejecución efectiva fuera de lo que puede inspeccionarse en el contenido versionado.

## Ruta declarada y resultado por bloque

### K0.1-DESIGN-001

- recommended_model: `Astra`
- recommended_level: `Medium`
- recommendation_evidence: prerregistro en `7f43e96`
- selected_model: `Astra`
- selected_level: `Medium`
- execution_surface: `Desktop`
- selection_and_execution_evidence: `DECLARACIÓN DISPONIBLE` aportada por la usuaria; no verificada por Git
- result: producción documental K0.1
- result_evidence: cambios inspeccionados y commit `c8c29af`
- escalation: ninguna declarada

### K0.1-REVIEW-001

- recommended_model: `Sol`
- recommended_level: `High`
- selected_model: `Sol`
- selected_level: `High`
- execution_surface: `Desktop`
- selection_and_execution_evidence: `DECLARACIÓN DISPONIBLE`
- result: `APTO PARA COMMIT K0.1` con dos hallazgos menores
- reviewer_separation: separación funcional y contextual; no independencia absoluta

### K0.1-FIX-001

- recommended_model: `Luna`
- recommended_level: `Medium`
- selected_model: `Luna`
- selected_level: `Medium`
- execution_surface: `Desktop`
- selection_and_execution_evidence: `DECLARACIÓN DISPONIBLE`
- result: corrección de procedencia histórica y regla de recomposición
- escalation: ninguna declarada

### K0.1-REAUDIT-001

- recommended_model: `Terra`
- recommended_level: `Medium`
- selected_model: `Terra`
- selected_level: `Medium`
- execution_surface: `Desktop`
- selection_and_execution_evidence: `DECLARACIÓN DISPONIBLE`
- result: `APTO PARA COMMIT K0.1`
- reviewer_separation: separación funcional y contextual; no independencia absoluta

La recomendación, la selección, la ejecución, el resultado y la revisión se conservan como anotaciones separadas. La revisión distingue separación funcional de independencia absoluta.

## Restricción operativa de disponibilidad

Puede registrarse cualitativamente que la CLI mostraba capacidad disponible reducida y que Desktop fue seleccionado como superficie operativa con mayor disponibilidad declarada. No se registran porcentajes, duración, timestamps, consumo ni datos de Pez en el agua.

## Resultado del caso

El protocolo K0.1 fue producido, revisado, corregido, reauditable y committed. La recomendación, selección, ejecución y resultado pudieron mantenerse separados. El prerregistro conservó sus valores originales `PENDING` y `NOT_STARTED`; el resultado posterior vive en este documento vinculado.

K1 permanece no autorizado.

## Hallazgos del caso

- La primera construcción volvió a clasificar incorrectamente la limpieza histórica como hecho verificable.
- La recomposición del bloque padre era deducible, pero no literal.
- Ambos hallazgos fueron corregidos.
- La revisión distinguió separación funcional de independencia absoluta.
- Git aportó orden documental, pero no anterioridad real de selección y ejecución.
- El procedimiento produjo una carga documental material.

## Preguntas negativas

| Pregunta | Estado prudente | Fundamento limitado |
|---|---|---|
| ¿La recomendación fue útil? | `NO CONCLUYENTE` | Produjo una salida revisable, pero no existe contrafactual. |
| ¿La cápsula omitió información decisiva? | `PARCIALMENTE` | No evitó la repetición del error de procedencia ni la ambigüedad de recomposición. |
| ¿Hubo capacidad excesiva? | `UNKNOWN` | No existe comparación controlada. |
| ¿Hubo capacidad insuficiente? | `UNKNOWN` | Los hallazgos no permiten atribuir causa al modelo. |
| ¿El escalamiento añadió retrabajo? | `NO CONCLUYENTE` | Hubo revisión, reparación y reauditoría, pero no se estableció contrafactual. |
| ¿La carga documental superó el valor? | `NO CONCLUYENTE` | La carga fue visible; su utilidad sostenida requiere otros casos. |
| ¿Kosmotaxis quedó validada? | `NO` | Un caso autorreferencial y documental no valida el método en general. |
| ¿Debe K1 comenzar? | `NO` | Permanece sin autorización específica y con compuertas pendientes. |

## Qué puede aprenderse

- El procedimiento manual es ejecutable.
- Separar prerregistro y resultado evita reescritura silenciosa.
- `UNKNOWN` puede conservarse sin forzar una conclusión.
- Las categorías permiten describir una ruta sin convertirla en score.
- Aparecen costos reales de documentación.

## Qué no puede aprenderse

Este caso no demuestra superioridad de un modelo, ahorro causal, calidad comparativa, identidad o independencia absoluta, anterioridad real fuera del orden Git, generalización, conveniencia de automatizar ni autorización de K1.

## Privacidad y límites de retención

No se incluyen conversaciones, prompts completos, chain-of-thought, nombres personales, timestamps, duración, porcentajes de disponibilidad, datos temporales ni contenido innecesario de artefactos.

## Invariantes preservadas

- El prerregistro no fue modificado ni completado retrospectivamente.
- Las declaraciones de modelo no se presentan como hechos Git.
- `APTO PARA COMMIT` no se presenta como validación de Kosmotaxis.
- No se modifican `STATUS.md`, `NEXT.md`, README, ADR ni el protocolo.
- No se implementan código ni schemas.

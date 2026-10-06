# CASE-P02 — Referencia manual local

## Identidad y secuencia documental

- `CASE_ID`: `CASE-P02`
- En `9a9ad2c4c652878966f8851425d21a80f5ac82bb` se creó primero esta referencia de custodia: `BOUND`, implementación `NOT_STARTED` y selección del ejecutor `PENDING`. Esos eran los estados preparatorios registrados entonces; no se reescriben como si la implementación ya hubiera existido.
- Estado local posterior: implementación ejecutable presente en los tres archivos indicados abajo y verificaciones técnicas locales completadas. La aceptación integral tras esta actualización documental y `P02-AUDIT-001` siguen pendientes. No se declara selección de ejecutor ni autorización de K1.
- Perímetro del caso local: esta referencia y sólo `tests/fixtures/manual-calibration/request.json`, `tests/fixtures/manual-calibration/manual-result.json` y `tests/manual-calibration.test.ts`.

## Procedencia documental inmutable

- `PREREG_COMMIT`: `f8928cdf68d8c217c606e79cd26a6773584d5b08`
- `PREREG_PATH`: `docs/kosmotaxis/cases/CASE-P02-MANUAL-SEMANTIC-CALIBRATION-PREREGISTRATION.md`
- `PREREG_BLOB`: `24620480bf31286b2cfdb3e9b32853a90808c629`

La fuente normativa se leyó desde la referencia inmutable:

```text
git show f8928cdf68d8c217c606e79cd26a6773584d5b08:docs/kosmotaxis/cases/CASE-P02-MANUAL-SEMANTIC-CALIBRATION-PREREGISTRATION.md
```

El contenido usado se obtuvo mediante `PREREG_COMMIT:PREREG_PATH`. Esa combinación resolvió exactamente `PREREG_BLOB` = `24620480bf31286b2cfdb3e9b32853a90808c629`.

La primera versión de esta referencia fijaba únicamente identidad y procedencia documental. No permitía alterar la submission, la rúbrica, los criterios, la evidencia, el dictamen, los controles, los timestamps sintéticos, el resultado esperado ni el alcance futuro. Esta actualización conserva esa restricción.

Cualquier divergencia futura entre `PREREG_COMMIT`, `PREREG_PATH`, `PREREG_BLOB` o el contenido identificado produce estado `BLOQUEADO`.

El prerregistro no fue copiado ni incorporado a esta rama. La operación inicial de custodia no acreditaba selección, ejecución, calidad ni resultado.

## Límite de la operación inicial

La creación inicial de este archivo fue preparatoria de custodia documental únicamente. No constituyó selección del ejecutor, implementación, evaluación semántica, ejecución de CASE-P02, resultado, auditoría ni autorización de K1.

## Paquete sintético congelado

Es un único caso local, simulado y sin datos personales. R1 está íntegro en la consigna; no hay paquete externo ni producción real de una estudiante. La rúbrica incorporada en `request.json` es la copia íntegra de `common-rubric` `1.0.0` (`schema_version: 1.0.0`), cuyo archivo de referencia tiene SHA-256 `DE7556E0F98EEC19013AEB5F17870A758D0F3EEDF0E1424F72D6CF358BBE8E3C`. Sólo se evalúa `EV`, nombre `Evidencia`, `required: true`; las demás dimensiones de la rúbrica no reciben puntuación.

Consigna exacta (`task_brief`, una sola cadena sin salto final):

```text
Caso simulado. Registro R1: el procedimiento A produjo dos piezas y el procedimiento B produjo dos piezas; no se aportan otros datos. Decidí si este registro permite sostener que B es superior a A. Fundamentá tu conclusión con el dato pertinente y citá R1; explicitá el alcance de esa evidencia. Se evalúa únicamente EV (Evidencia), obligatorio, con los descriptores 0 a 4 de common-rubric 1.0.0 incluidos en el paquete. No se permiten fuentes externas ni asistencia. No se evalúan estilo ni extensión.
```

Submission exacta (`submission.content`, una sola cadena sin salto final):

```text
El procedimiento B es superior al A. La conclusión es sólida y debe adoptarse.
```

La entrada usa `schema_version: "1.0.0"`, `evaluation_id: "P02-EVAL-001"`, `evaluator_version: "manual-reference-P02-v1"`, `mode: "calibración"`, `course_id: "P02-COURSE"`, `lesson_id: "P02-LESSON"`, `task_id: "P02-TASK"`, `locale: "es-AR"`, `competency_ids: ["P02-COMP-EV"]`, `criterion_ids: ["EV"]`, `rubric_id: "common-rubric"`, `rubric_version: "1.0.0"`, `source_pack_id: null`, `time_limit_minutes: null`, `submission.declared_assistance: []` y `execution_metadata: {"active_minutes": null, "attempts": 1, "interruptions": null}`. `attempts: 1` es contenido sintético, no medición de actividad.

Los materiales permitidos son `["Registro R1 incluido en la consigna.", "Rúbrica common-rubric 1.0.0 incluida en el paquete."]`; la asistencia prohibida es `["Fuentes externas y asistencia."]`; la evidencia esperada es `["Conclusión fundamentada con el dato pertinente de R1, su localización y su alcance."]`.

Descriptores literales del único criterio evaluado:

| EV | Descriptor congelado |
|---|---|
| 0 | No aporta evidencia para la afirmación central o presenta evidencia fabricada. |
| 1 | Aporta un dato relacionado, pero no identifica su origen ni permite localizarlo. |
| 2 | Aporta evidencia para parte de las afirmaciones; faltan ubicaciones verificables en otras. |
| 3 | Vincula las afirmaciones centrales con evidencia localizable e identifica vacíos secundarios. |
| 4 | Sustenta las afirmaciones relevantes con evidencia pertinente, suficiente y localizable, y explicita su alcance. |

## Controles y literales temporales

Los tres valores siguientes son `CONTRACT_PLACEHOLDER`: son cadenas sintéticas contractuales, no fechas observadas, medidas de duración ni prueba de anterioridad.

| Campo | Valor exacto |
|---|---|
| `submission.submitted_at` | `2000-01-01T00:00:00.000Z` |
| `preflight_checks.<nombre>.checked_at` en la entrada y `preflight.checks.<nombre>.checked_at` en el resultado, para los seis controles | `2000-01-01T00:01:00.000Z` |
| `audit.timestamp` del resultado y del preflight esperado | `2000-01-01T00:02:00.000Z` |

Cada control tiene exactamente `state: "PASS"`, `asserted_by: "HUMAN_REVIEW"` y el `checked_at` indicado. Estas son declaraciones sintéticas prerregistradas, no prueba de revisión humana ya realizada.

| Clave de `preflight_checks` / `preflight.checks` | `assertion_ref` | Fundamento manual esperado |
|---|---|---|
| `artifact_readable` | `P02-CHECK-01` | Submission textual íntegra y legible. |
| `artifact_not_truncated` | `P02-CHECK-02` | Coincide exactamente con las dos oraciones congeladas. |
| `required_materials_available` | `P02-CHECK-03` | R1 y la rúbrica están incorporados. |
| `response_matches_task` | `P02-CHECK-04` | La respuesta trata la superioridad de B frente a A; pertinencia no implica cumplimiento. |
| `task_brief_semantically_complete` | `P02-CHECK-05` | Se fijan pregunta, datos, evidencia requerida y límites. |
| `criteria_and_restrictions_disclosed` | `P02-CHECK-06` | Se informa EV y se incluye la rúbrica completa junto con las restricciones. |

El preflight determinista esperado es `schema_version: "1.0.0"`, `evaluation_id: "P02-EVAL-001"`, `status: "preflight_only"`, `preflight.status: "LISTO"`, `warnings: []`, `blockers: []`, `confidence_limit: "alta"` y copia exacta de los seis controles. Sus `result` y `result_confidence` son `null`; `criteria`, `findings`, `strengths`, `priority_corrections`, `alternative_interpretations` y `mastery_updates` son `[]`; `repair_task: null`; `appeal: {"available": false, "rubric_frozen_at": null}`. Su `executive_summary` exacto es `Preflight determinista. No se evaluó desempeño ni se asignaron puntuaciones. LISTO indica únicamente que no se detectaron bloqueos en las comprobaciones implementadas.` Su única incertidumbre es `No se verificó semánticamente la consigna, la correspondencia de la respuesta ni la suficiencia de la evidencia.` El objeto `audit` usa `evaluator_version: "manual-reference-P02-v1"`, `prompt_version: null`, `rubric_version: "1.0.0"`, `timestamp: "2000-01-01T00:02:00.000Z"` y `model: null`.

`LISTO` acredita sólo comprobaciones deterministas sobre declaraciones; no asigna EV=0, no emite `REHACER` ni actualiza dominio.

## Dictamen manual esperado

La regla congelada asigna `EV=0` por ausencia de evidencia para la afirmación central, primera alternativa del descriptor 0. No acusa fabricación. La falta de fundamentación en una respuesta presente no convierte el paquete en `NO_EVALUABLE`. El resultado manual de referencia es `REHACER` por falta de evidencia central según la Especificación §9.1, con confianza `alta`; no se declara hallazgo crítico ni se infiere que B sea inferior a A.

El resultado esperado tiene `schema_version: "1.0.0"`, `evaluation_id: "P02-EVAL-001"`, `status: "completed"`, `preflight` igual al objeto interno `LISTO` anterior, `result: "REHACER"` y `result_confidence: "alta"`. Su resumen ejecutivo literal es:

> La respuesta afirma que B es superior a A, pero no aporta evidencia para esa afirmación. EV recibe 0 y el dictamen manual esperado es REHACER por ausencia de la evidencia central requerida. El paquete está completo. Este caso sintético no acredita desempeño de una estudiante ni capacidad evaluadora automática.

Criterio literal del resultado:

```json
{
  "criterion_id": "EV",
  "score": 0,
  "required": true,
  "findings": ["P02-F-001"],
  "reason": "El párrafo completo afirma superioridad y recomienda adopción sin aportar un dato que sustente la afirmación central; corresponde EV nivel 0 por ausencia de evidencia, sin atribuir fabricación."
}
```

Hallazgo literal; el localizador apunta a toda la producción primaria:

```json
{
  "schema_version": "1.0.0",
  "finding_id": "P02-F-001",
  "criterion_id": "EV",
  "observation": "El procedimiento B es superior al A. La conclusión es sólida y debe adoptarse.",
  "evidence_locator": "submission.content, párrafo 1 completo (oraciones 1 y 2)",
  "comparison": "EV nivel 0: No aporta evidencia para la afirmación central o presenta evidencia fabricada.",
  "classification": "omisión",
  "severity": "mayor",
  "interpretation": "La respuesta completa no aporta evidencia para la superioridad afirmada. Se aplica la alternativa de ausencia de evidencia; no se afirma fabricación ni inferioridad de B.",
  "confidence": "alta",
  "remediation": "Fundamentar la conclusión con el dato de R1, su localización y su alcance.",
  "decision": "Asignar EV=0 y REHACER por no producir la evidencia central requerida, conforme a la Especificación §9.1."
}
```

`repair_task` literal:

```json
{
  "required": true,
  "objective": "Sustentar una conclusión con evidencia localizada y alcance explícito.",
  "instruction": "Reescribí la respuesta usando el dato de R1, citá R1 y explicá qué permite y qué no permite concluir.",
  "success_condition": "La respuesta vincula su conclusión con las dos piezas de A y las dos de B, cita R1 y no afirma superioridad a partir de ese único registro."
}
```

Los demás literales del resultado son `strengths: []`, `priority_corrections: ["Fundamentar la conclusión con el dato de R1, su localización y su alcance."]`, `uncertainties: ["El dictamen se limita a esta submission sintética y no permite inferir capacidades de una persona."]`, `alternative_interpretations: ["La ausencia de evidencia en la respuesta no demuestra que B sea inferior a A."]`, `mastery_updates: []` y `appeal: {"available": false, "rubric_frozen_at": null}`. Su `audit` usa los mismos cinco valores fijados para el preflight. No hay transición de dominio ni apelación ejecutable.

## Verificación técnica local y estado pendiente

En la intervención ejecutable anterior, separada de esta actualización documental, se registró:

| Comprobación | Resultado observado |
|---|---|
| `npm.cmd run build` | Código 0. |
| `P02:request`, `P02:manual-result`, `P02:preflight`, `P02:boundaries` | Cada filtro ejecutó exactamente 1 prueba: 1 aprobada, 0 fallidas, omitidas o canceladas. |
| `npm.cmd test` | Código 0; 133 aprobadas, 0 fallidas, omitidas o canceladas. |
| `npm.cmd run typecheck` | Código 0. |
| `npm.cmd run validate:fixtures` | Código 0; 7 schemas, rúbrica y 28 fixtures históricos verificados. Este comando no recorre por sí solo los dos JSON nuevos. |
| `git diff --check` | Código 0; el diff rastreado no incluía los tres untracked. |
| Áreas protegidas | Sin cambios rastreados ni staged. |
| Scan complementario | Coincidencias revisadas: patrón del inspector, cadenas de pruebas adversariales e identificador local de schema; ninguna llamada observada a red, modelos o procesos. |
| Placeholders | Los tres valores exactos se conservaron en los archivos del caso; `P02:preflight` verificó la salida sin sustitución dinámica. |

Estas verificaciones acreditan comportamiento técnico local y coincidencias literales, no suficiencia del dictamen semántico manual, capacidad de una evaluadora automática ni desempeño real de una estudiante. Esta actualización documental aún no tuvo repetición de la aceptación completa. La auditoría separada `P02-AUDIT-001` y una decisión de aceptación definitiva permanecen pendientes.

El caso no contiene datos temporales reales, identidad personal, duración real ni contenido de Pez en el agua. Los tres placeholders son la única excepción temporal y no autentican identidad u orden real. No se ejecutó un motor semántico ni se autorizó K1.

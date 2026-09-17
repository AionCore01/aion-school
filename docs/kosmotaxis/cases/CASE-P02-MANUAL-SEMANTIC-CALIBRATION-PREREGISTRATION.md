# CASE-P02 · Prerregistro de calibración semántica manual

## 1. Estado y alcance

- design_block: `P02-PREREG-DESIGN-001`
- case_status: `PRE_REGISTERED`
- design_status: `FROZEN_PENDING_REVIEW`
- implementation: `NOT_STARTED`
- semantic_automation: `PROHIBITED`
- K1: `NOT_AUTHORIZED`

Este documento fija un único paquete local, sintético, autocontenido, sin datos personales y reproducible sin internet. Su propósito es comprobar en una intervención futura que un dictamen manual fijado previamente puede representarse de manera trazable con los contratos existentes. No implementa el caso, no contiene fixtures ejecutables y no acredita capacidad de una evaluadora para producir el dictamen. El resultado esperado queda sujeto a revisión humana antes de implementar; no se presenta como adjudicación humana ya realizada.

HECHO VERIFICADO al retomar el diseño: rama `experiment/kosmotaxis`, HEAD `e2272d6`, árbol limpio y archivo de destino ausente. `dev` apunta a `aab4da4`; la comparación de ese commit con HEAD no mostró diferencias en `src/`, `schemas/`, `rubrics/`, `tests/`, `package.json` ni `package-lock.json`. Son comprobaciones del contenido local, sin autenticación de identidad ni prueba de anterioridad real.

## 2. Autoridad y continuidad

DECLARACIÓN DISPONIBLE, recibida como autorización humana para CASE-P02; no identidad autenticada:

> Autorizo CASE-P02 para diseñar e implementar un único caso local de calibración semántica con dictamen manual, en una rama nueva derivada de dev.
>
> Antes de implementar, los criterios del dictamen manual deben quedar fijados como parte del prerregistro, para que no puedan ajustarse retrospectivamente al resultado observado.
>
> La autorización no incluye evaluación semántica automática, llamadas a modelos externos, campus, base de datos, cambios en rúbricas fundacionales ni integración con Pez en el agua.
>
> Kosmotaxis debe permanecer como capa de observación separada de la implementación que supervisa. La recomendación de modelo, la selección humana, cualquier escalamiento, retrabajo y resultado deben conservarse aunque contradigan la hipótesis inicial.

La autorización cubre exclusivamente CASE-P02 y no autoriza K1 general. Esta intervención sólo crea este documento. No selecciona ejecutor, cambia de rama, implementa, prepara cambios en el índice, crea commits, tags ni publica.

Antecedente conservado: el diseño quedó inicialmente `BLOQUEADO` por la prohibición indiferenciada de timestamps frente a campos contractuales obligatorios. Se recibió una aclaración humana que autoriza exclusivamente los tres valores sintéticos de §3. La corrección posterior precisó que son contenido literal del futuro fixture y ordenó no investigar ahora mecanismos de sustitución temporal. No se amplía la excepción a datos temporales reales.

Fuentes normativas preservadas: `AGENTS.md`, los tres documentos de `docs/foundation/`, `docs/architecture/ADR-0001-foundation.md`, los cinco schemas fundacionales, `rubrics/common-rubric.v1.yml` y los contratos TypeScript. Continuidad consultada: `README.md`, `STATUS.md`, `NEXT.md`, `tests/acceptance/semantic-cases.md` y fixtures fundacionales. Para observación: ADR-0003, ADR-0004, K0-CHARTER, K0.1-PROSPECTIVE-MANUAL-PROTOCOL y el resultado preservado de CASE-P01.

Delimitación explícita frente a `NEXT.md`: éste propone dos estilos y una posible asociación temporal. La misión actual autoriza una sola submission y excluye esa asociación. No se modifica NEXT ni se afirma haber cubierto invariancia de estilo. La inclusión aquí del contenido sintético exacto responde a la misión explícita de prerregistro; no habilita copiar artefactos reales o conversaciones a Kosmotaxis.

## 3. Literales temporales autorizados

Clasificación de los tres valores: `CONTRACT_PLACEHOLDER`.

| Campo literal del futuro caso | Cadena exacta congelada |
|---|---|
| `submission.submitted_at` | `2000-01-01T00:00:00.000Z` |
| `checked_at` de cada uno de los seis controles obligatorios | `2000-01-01T00:01:00.000Z` |
| `evaluation-result.audit.timestamp` | `2000-01-01T00:02:00.000Z` |

En el contrato existente los controles se representan como `preflight_checks.<nombre>` en la entrada y `preflight.checks.<nombre>` en el resultado; no se agregará un campo `controls[]`. `audit.timestamp` designa el miembro `timestamp` del objeto `audit`, no una propiedad raíz con punto.

Son valores sintéticos, fijos y prerregistrados. Su única función es satisfacer campos obligatorios y expresar una secuencia contractual artificial. No representan fechas reales, no proceden del reloj ni de Pez en el agua, no prueban anterioridad, duración u orden cronológico real y no autentican identidad. `CONTRACT_PLACEHOLDER` es una clasificación documental, no una propiedad adicional de los schemas.

Quedan prohibidos en el contenido del caso `Date.now()`, timestamps generados, reloj local, valores aleatorios, sustitución dinámica y cualquier otro timestamp. La implementación futura debe reproducir estas cadenas exactamente y las pruebas deben verificar igualdad exacta, también en las copias de controles y en la salida de preflight del caso. Si entonces se descubre rechazo, sustitución por hora del sistema u otra relación temporal obligatoria incompatible, detenerse con `BLOQUEADO`; no elegir otros valores ni modificar contratos, validadores o preflight. No se investiga ni ejecuta ese mecanismo en esta intervención documental.

## 4. Criterio mínimo y regla manual congelada

Rúbrica: `common-rubric`, versión `1.0.0`, `schema_version: 1.0.0`. Se conservará la copia íntegra de la rúbrica existente en el paquete, sin recortes ni cambios. Referencia de contenido: archivo `rubrics/common-rubric.v1.yml` en `aab4da4`, SHA-256 `DE7556E0F98EEC19013AEB5F17870A758D0F3EEDF0E1424F72D6CF358BBE8E3C`.

Único `criterion_id` evaluado: `EV`, nombre exacto `Evidencia`. Un criterio basta para contrastar la omisión de evidencia central. No se puntúan estilo, incertidumbre, causalidad, autonomía ni otras dimensiones por extensión.

Descriptores exactos existentes, informados como parte de la rúbrica del paquete:

| Nivel | Descriptor literal de EV |
|---|---|
| 0 | No aporta evidencia para la afirmación central o presenta evidencia fabricada. |
| 1 | Aporta un dato relacionado, pero no identifica su origen ni permite localizarlo. |
| 2 | Aporta evidencia para parte de las afirmaciones; faltan ubicaciones verificables en otras. |
| 3 | Vincula las afirmaciones centrales con evidencia localizable e identifica vacíos secundarios. |
| 4 | Sustenta las afirmaciones relevantes con evidencia pertinente, suficiente y localizable, y explicita su alcance. |

Aplicación fijada: `EV = 0`, `required = true`, por la primera alternativa del descriptor 0: no aporta evidencia para la afirmación central. No se acusa fabricación. No corresponde nivel 1 porque la submission no aporta siquiera un dato relacionado; sólo contiene afirmación y recomendación retórica.

Clasificación global: `REHACER`, conforme a Especificación §9.1: no se produjo la evidencia central. Severidad del único hallazgo: `mayor`; no se declara hallazgo crítico. No se utiliza un promedio ni se inventa un umbral global. La regla crítica → REHACER permanece intacta, pero este caso no pretende ponerla a prueba con un hallazgo crítico.

La consigna, los materiales y la producción existen: la falta de fundamentación dentro de una respuesta completa no equivale a falta de insumos del paquete. Por ello el preflight esperado es `LISTO`, no `NO_EVALUABLE`. Tampoco se concluye que B sea inferior: ausencia de sustento no prueba la negación de la afirmación.

## 5. Contenido exacto de entrada

Los siguientes son literales documentales para transcripción futura. No son un fixture ejecutado. Las cadenas no llevan comillas delimitadoras dentro del valor ni salto de línea final; se conserva puntuación, acentos y espacios. La presentación JSON puede variar sólo según §10.

### Consigna exacta (`task_brief`)

```text
Caso simulado. Registro R1: el procedimiento A produjo dos piezas y el procedimiento B produjo dos piezas; no se aportan otros datos. Decidí si este registro permite sostener que B es superior a A. Fundamentá tu conclusión con el dato pertinente y citá R1; explicitá el alcance de esa evidencia. Se evalúa únicamente EV (Evidencia), obligatorio, con los descriptores 0 a 4 de common-rubric 1.0.0 incluidos en el paquete. No se permiten fuentes externas ni asistencia. No se evalúan estilo ni extensión.
```

### Submission exacta (`submission.content`)

```text
El procedimiento B es superior al A. La conclusión es sólida y debe adoptarse.
```

Es una única línea, un único párrafo y dos oraciones. Ancla primaria congelada: `submission.content, párrafo 1 completo (oraciones 1 y 2)`. El fragmento de evidencia es toda la submission literal. La primera oración contiene la afirmación central; la segunda añade seguridad retórica sin dato, fuente ni vínculo probatorio. Inspeccionar ambas evita inferir una omisión desde una cita parcial.

### Resto de la entrada

| Campo | Valor exacto |
|---|---|
| `schema_version` | `"1.0.0"` |
| `evaluation_id` | `"P02-EVAL-001"` |
| `evaluator_version` | `"manual-reference-P02-v1"` |
| `mode` | `"calibración"` |
| `course_id` | `"P02-COURSE"` |
| `lesson_id` | `"P02-LESSON"` |
| `task_id` | `"P02-TASK"` |
| `locale` | `"es-AR"` |
| `allowed_materials` | `["Registro R1 incluido en la consigna.", "Rúbrica common-rubric 1.0.0 incluida en el paquete."]` |
| `prohibited_assistance` | `["Fuentes externas y asistencia."]` |
| `expected_evidence` | `["Conclusión fundamentada con el dato pertinente de R1, su localización y su alcance."]` |
| `competency_ids` | `["P02-COMP-EV"]` |
| `criterion_ids` | `["EV"]` |
| `rubric_id` | `"common-rubric"` |
| `rubric_version` | `"1.0.0"` |
| `rubric` | Objeto íntegro obtenido del YAML congelado de §4; sin añadir ni quitar dimensiones. |
| `source_pack_id` | `null` |
| `time_limit_minutes` | `null` |
| `submission.submitted_at` | `"2000-01-01T00:00:00.000Z"` |
| `submission.declared_assistance` | `[]` |
| `execution_metadata` | `{"active_minutes": null, "attempts": 1, "interruptions": null}` |
| `preflight_checks` | Los seis objetos definidos en §6. |

Los IDs con prefijo P02 son identificadores técnicos locales al caso, no personas ni competencias acreditadas. `attempts: 1` es contenido sintético, no medición de actividad. Los campos temporales anulables quedan en null. No existe paquete externo que abrir: R1 está íntegro en la consigna.

## 6. Controles y preflight congelados

Cada clave siguiente tendrá exactamente `state: "PASS"`, `asserted_by: "HUMAN_REVIEW"`, `checked_at: "2000-01-01T00:01:00.000Z"` y la referencia indicada:

| Clave | `assertion_ref` exacto | Fundamento del PASS manual esperado |
|---|---|---|
| `artifact_readable` | `P02-CHECK-01` | Submission textual íntegra y legible. |
| `artifact_not_truncated` | `P02-CHECK-02` | Coincide exactamente con las dos oraciones congeladas. |
| `required_materials_available` | `P02-CHECK-03` | R1 y la rúbrica están incorporados. |
| `response_matches_task` | `P02-CHECK-04` | La respuesta trata la superioridad de B frente a A; pertinencia no implica cumplimiento. |
| `task_brief_semantically_complete` | `P02-CHECK-05` | Se fijan pregunta, datos, evidencia requerida y límites. |
| `criteria_and_restrictions_disclosed` | `P02-CHECK-06` | Se informa EV y se incluye la rúbrica completa junto con las restricciones. |

Estas referencias se resolverán en la documentación específica del caso futuro. Son declaraciones sintéticas prerregistradas, pendientes de revisión humana; no prueban una inspección humana ya ocurrida ni identidad. Si la revisión no sostiene un PASS, detenerse y conservar la objeción: no acomodar silenciosamente el control.

Salida de preflight esperada, separada del resultado manual:

- `schema_version: "1.0.0"`, `evaluation_id: "P02-EVAL-001"`, `status: "preflight_only"`.
- `preflight.status: "LISTO"`, `warnings: []`, `blockers: []`, `confidence_limit: "alta"`; `checks` es copia exacta de los seis controles.
- `result: null`, `result_confidence: null`.
- `criteria`, `findings`, `strengths`, `priority_corrections`, `alternative_interpretations` y `mastery_updates`: cada uno `[]`.
- `repair_task: null`; `appeal: {"available": false, "rubric_frozen_at": null}`.
- `executive_summary`: `Preflight determinista. No se evaluó desempeño ni se asignaron puntuaciones. LISTO indica únicamente que no se detectaron bloqueos en las comprobaciones implementadas.`
- `uncertainties`: `["No se verificó semánticamente la consigna, la correspondencia de la respuesta ni la suficiencia de la evidencia."]`.
- `audit`: `{"evaluator_version": "manual-reference-P02-v1", "prompt_version": null, "rubric_version": "1.0.0", "timestamp": "2000-01-01T00:02:00.000Z", "model": null}`.

LISTO sólo acredita las comprobaciones deterministas implementadas sobre declaraciones. No asigna EV=0, no produce REHACER y no actualiza dominio. Una discrepancia futura con esta salida se conserva y escala; no se modifica preflight ni se adapta la expectativa al resultado observado.

## 7. Resultado manual exacto esperado

El objeto de resultado tendrá los campos siguientes. `preflight` será exactamente el objeto interno descrito en §6, incluidos los seis controles, sin el resto de la salida `preflight_only`. No se agregan propiedades ajenas al schema.

| Campo | Valor exacto |
|---|---|
| `schema_version` | `"1.0.0"` |
| `evaluation_id` | `"P02-EVAL-001"` |
| `status` | `"completed"` |
| `result` | `"REHACER"` |
| `result_confidence` | `"alta"` |
| `executive_summary` | `"La respuesta afirma que B es superior a A, pero no aporta evidencia para esa afirmación. EV recibe 0 y el dictamen manual esperado es REHACER por ausencia de la evidencia central requerida. El paquete está completo. Este caso sintético no acredita desempeño de una estudiante ni capacidad evaluadora automática."` |
| `criteria` | Un único objeto, fijado debajo. |
| `findings` | Un único objeto, fijado debajo. |
| `strengths` | `[]` |
| `priority_corrections` | `["Fundamentar la conclusión con el dato de R1, su localización y su alcance."]` |
| `uncertainties` | `["El dictamen se limita a esta submission sintética y no permite inferir capacidades de una persona."]` |
| `alternative_interpretations` | `["La ausencia de evidencia en la respuesta no demuestra que B sea inferior a A."]` |
| `mastery_updates` | `[]` |
| `appeal` | `{"available": false, "rubric_frozen_at": null}` |
| `audit` | `{"evaluator_version": "manual-reference-P02-v1", "prompt_version": null, "rubric_version": "1.0.0", "timestamp": "2000-01-01T00:02:00.000Z", "model": null}` |

Criterio, literal documental:

```json
{
  "criterion_id": "EV",
  "score": 0,
  "required": true,
  "findings": ["P02-F-001"],
  "reason": "El párrafo completo afirma superioridad y recomienda adopción sin aportar un dato que sustente la afirmación central; corresponde EV nivel 0 por ausencia de evidencia, sin atribuir fabricación."
}
```

Hallazgo, literal documental:

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

`repair_task`, literal documental:

```json
{
  "required": true,
  "objective": "Sustentar una conclusión con evidencia localizada y alcance explícito.",
  "instruction": "Reescribí la respuesta usando el dato de R1, citá R1 y explicá qué permite y qué no permite concluir.",
  "success_condition": "La respuesta vincula su conclusión con las dos piezas de A y las dos de B, cita R1 y no afirma superioridad a partir de ese único registro."
}
```

Confianza manual alta: la totalidad de la respuesta es accesible, breve y no contiene datos ni referencias; el descriptor 0 se aplica directamente. Esta confianza se limita a la omisión observada y no excede el techo alto del preflight. La severidad mayor afecta la evidencia central; no se presume engaño, riesgo grave o rasgo personal. No hay bloqueadores de preflight ni advertencias del sistema; la corrección académica se representa en el hallazgo y `repair_task`, no como fallo del sistema.

`audit.model: null` y `prompt_version: null` expresan que el artefacto esperado es una referencia manual, sin ejecución de evaluadora automática. No identifican ni niegan la herramienta que ayuda a diseñar este documento. El modo calibración no modifica a una estudiante: no habrá archivo competency-update ni transición de dominio.

La congelación es documental: versión de rúbrica, contenido preservado y criterios previos. No existe mecanismo de apelación, ledger ni sellado implementado. Por eso `rubric_frozen_at` permanece null y `available` false; una revisión humana de este prerregistro no se presenta como apelación ejecutable.

## 8. Compatibilidad revisada y límites de la comprobación

Comprobación manual de diseño contra schemas y `src/contracts/index.ts`; no ejecución del caso ni de la suite:

| Restricción existente | Compatibilidad del diseño |
|---|---|
| Propiedades obligatorias, enums y rechazo de propiedades adicionales | Campos de entrada, resultado, criterio y hallazgo enumerados; sin metadatos Kosmotaxis ni CONTRACT_PLACEHOLDER dentro de los JSON. |
| Formato date-time | Las tres cadenas autorizadas tienen formato ISO explícito; aceptación ejecutada pendiente de implementación. |
| Rúbrica y criterios | `EV` existe una vez; copia íntegra, identidad y versión coincidentes; un único criterio en resultado. |
| Seis controles para LISTO | Todos declarados PASS con fuente, referencia y literal checked_at. |
| Confianza y NO_EVALUABLE | Alta no supera alta; LISTO acompaña resultado sustantivo manual. No se inventan ausencias esenciales. |
| Hallazgo crítico → REHACER | Ningún hallazgo crítico; REHACER se justifica por ausencia de evidencia central. No se relaja el validador. |
| Evidencia mínima y resumen | Hallazgo con localizador primario no vacío, cuatro capas separadas y resumen inferior a 120 palabras; no se usa COMPETENTE sin evidencia. |
| Apelación | false/null, conforme a `appealNotImplemented`. |
| Dominio | `mastery_updates: []`; no afirmación DEMOSTRADA o TRANSFERIDA. |
| Preflight | Sólo comprobaciones deterministas; listas evaluativas vacías y resultado null en su propia salida. |

El validador no demuestra que una cita sea verdadera, que el hallazgo esté bien juzgado ni que un ID de hallazgo resuelva al fragmento correcto. Las pruebas futuras verificarán enlaces, igualdad y estructura; la auditoría manual juzgará suficiencia semántica. No basta una prueba que compare un fixture consigo mismo: las expectativas deben estar fijadas como literales independientes derivados de este prerregistro.

## 9. Ruta futura y separación

### P02-IMPLEMENT-001

- recommended_capability: `EXECUTOR`
- recommended_model: `Terra`
- recommended_reasoning_level: `High`
- selected_model: `PENDING`
- selected_reasoning_level: `PENDING`
- execution_surface: `PENDING`
- selection: `PENDING`
- execution: `NOT_STARTED`
- result: `PENDING`

Justificación cualitativa: el contenido, dictamen, archivos e invariantes quedan fijados. La tarea posterior consiste en transcribirlos, conectarlos con validaciones existentes y probarlos sin rediseñar su significado. La recomendación no acredita disponibilidad, selección efectiva, ejecución ni superioridad de Terra High.

### P02-AUDIT-001

- recommended_capability: `AUDITOR / REASONER`
- recommended_model: `Sol`
- recommended_reasoning_level: `High`
- selected_model: `PENDING`
- selected_reasoning_level: `PENDING`
- execution_surface: `PENDING`
- selection: `PENDING`
- execution: `NOT_STARTED`
- result: `PENDING`

Auditoría en sesión separada y sólo lectura. Debe reconstruir la aplicación de EV desde consigna, rúbrica y submission, contrastar el artefacto con esta cápsula y buscar subdeterminación o sobredeterminación. Otra sesión o modelo no prueba independencia absoluta: registrar por separado actor, modelo, contexto, misión, fuente primaria, autoridad de modificación y participación previa; lo no acreditado queda UNKNOWN. La revisión de este documento por su autor no es esa auditoría.

Rama futura: `feature/manual-calibration-case`, derivada de `dev` en `aab4da4`, salvo avance explícito de dev antes de crearla. Un avance exige identificar el nuevo commit y revisar compatibilidad antes de implementar; no habilita cambios semánticos. Kosmotaxis permanece en `experiment/kosmotaxis`. No mezclar, copiar ni hacer cherry-pick de documentos Kosmotaxis hacia la rama de implementación.

### Anclaje normativo inmutable poscommit

Este prerregistro todavía no puede contener el hash del commit que lo incorporará. Después de que este documento sea auditado y confirmado, su fuente normativa inmutable será el hash completo de 40 caracteres del commit que incorpore por primera vez este archivo aprobado, en la ruta exacta `docs/kosmotaxis/cases/CASE-P02-MANUAL-SEMANTIC-CALIBRATION-PREREGISTRATION.md`.

Antes de seleccionar o iniciar la implementación, deberán resolverse y registrarse `PREREG_COMMIT` (ese hash completo), `PREREG_PATH` (esa ruta exacta) y `PREREG_BLOB` (el blob Git obtenido al resolver `PREREG_COMMIT:PREREG_PATH`). La implementación deberá leer el contenido normativo desde esa referencia inmutable, conceptualmente equivalente a `git show PREREG_COMMIT:PREREG_PATH`.

No son fuentes normativas el tip de `experiment/kosmotaxis`, una rama móvil, `origin/experiment/kosmotaxis`, `HEAD`, una copia sin procedencia ni una etiqueta meramente textual como «aprobada». No es necesario copiar, fusionar ni hacer cherry-pick del documento Kosmotaxis en la rama de implementación. La documentación del caso contendrá únicamente el material semántico y técnico necesario, sin rutas de modelos ni observaciones Kosmotaxis.

La implementación deberá registrar los tres identificadores en `docs/calibration/CASE-P02-MANUAL-REFERENCE.md` y declarar que el contenido usado fue obtenido desde `PREREG_COMMIT:PREREG_PATH` y que resolvió `PREREG_BLOB`. La creación y el registro de esos identificadores no cuentan como selección, ejecución, resultado ni validación de Kosmotaxis.

Anterioridad real de recomendación frente a selección/ejecución: UNKNOWN. No se completa mediante placeholders, autoría Git o este archivo sin commit. Una futura copia preservada y una constancia separada podrán revisarse por su alcance; mientras falte evidencia independiente, la observación Kosmotaxis será exploratoria y no calibración prospectiva validada. Esto no impide diseñar la referencia semántica manual autorizada.

## 10. Congelación y variables operativas

Exactos e inmutables: consigna, submission, contexto R1, rúbrica, IDs, criterio y score, fragmentos y anclas, dictamen, confianza, todos los textos de salida, hallazgo y severidad, reparación, resumen, controles, placeholders, expectativa de preflight, apelación, ausencia de actualización de dominio, archivos permitidos, comandos de aceptación y preguntas negativas.

Únicas variables operativas permitidas:

1. Directorio absoluto del checkout local; todas las rutas relativas de §11 permanecen fijas.
2. Indentación y orden de claves de los JSON; no valores, orden de arrays ni contenido de cadenas. Archivos UTF-8, sin BOM; un salto final del archivo no pertenece a las cadenas.
3. Nombres de variables internas y organización de funciones de pruebas, sin cambiar expectativas ni introducir un motor semántico. Los nombres de pruebas invocados por los comandos permanecen fijos.
4. Invocación `npm.cmd` en PowerShell como equivalente de `npm`, sin modificar scripts ni política de ejecución.
5. Commit base alternativo sólo por avance explícito de dev según §9, con verificación previa y registro separado; no decisión unilateral del implementador.
6. `PREREG_COMMIT` y `PREREG_BLOB`, junto con `PREREG_PATH` fijo: sus valores concretos sólo podrán conocerse después del commit que incorpore por primera vez este archivo aprobado. Sólo fijan procedencia e identidad documental; no permiten modificar submission, criterios, evidencia, dictamen, controles, placeholders, archivos futuros ni resultado esperado.

No se permiten IDs aleatorios ni rutas alternativas de fixtures. Todo lo no enumerado queda congelado. Cambiar significado requiere detenerse, conservar esta versión y preparar una revisión vinculada antes de cualquier nueva implementación; nunca ajustar el original tras observar resultados.

## 11. Área futura mínima autorizada

Crear exclusivamente estos cuatro archivos, ninguno creado en esta misión:

| Ruta exacta | Contenido autorizado |
|---|---|
| `tests/fixtures/manual-calibration/request.json` | Único paquete completo congelado, incluida rúbrica íntegra. |
| `tests/fixtures/manual-calibration/manual-result.json` | Único resultado manual de referencia congelado. |
| `tests/manual-calibration.test.ts` | Validación estructural, igualdad literal, enlaces y preflight determinista del caso; no adjudicación semántica. |
| `docs/calibration/CASE-P02-MANUAL-REFERENCE.md` | Consigna, submission, criterio, dictamen, controles P02-CHECK-01 a 06, placeholders, procedencia sintética, `PREREG_COMMIT`, `PREREG_PATH`, `PREREG_BLOB`, declaración de lectura desde `PREREG_COMMIT:PREREG_PATH`, confirmación de resolución de `PREREG_BLOB`, aceptación y límites; sin documentos ni política Kosmotaxis. |

Modificar archivos existentes: ninguno. El test queda bajo el patrón actual `tests/*.test.ts`; no se necesita cambiar package.json. El manifiesto histórico de fixtures queda intacto: la validación explícita del nuevo paquete y resultado se hará con los comandos específicos de §12, no se afirmará que el manifiesto los recorre.

Leer como fuentes normativas, sin editar: `AGENTS.md`; `docs/foundation/AION_Mision_Fundacional_Astra_v0.1.md`; `docs/foundation/AION_Manifiesto_Criterio_Academico.md`; `docs/foundation/AION_Especificacion_IA_Evaluadora_v0.1.md`; `docs/architecture/ADR-0001-foundation.md`; `schemas/evaluation-request.schema.json`; `schemas/evaluation-result.schema.json`; `schemas/finding.schema.json`; `schemas/rubric.schema.json`; `schemas/competency-update.schema.json`; `rubrics/common-rubric.v1.yml`; este prerregistro únicamente mediante `PREREG_COMMIT:PREREG_PATH` y `PREREG_BLOB` resuelto según §9.

Leer como contexto técnico: `README.md`, `STATUS.md`, `NEXT.md`, `package.json`, `package-lock.json`, `tsconfig.json`, `src/contracts/index.ts`, `src/preflight/index.ts`, `tests/foundation.test.ts`, `tests/fixtures.ts`, `tests/validate-fixtures.ts`, `tests/acceptance/semantic-cases.md`, `tests/fixtures/manifest.json`, `tests/fixtures/valid-request.json`, `tests/fixtures/valid-result.json`, `tests/fixtures/valid-finding.json`. Los imports existentes pueden cargar sus dependencias locales y schemas temporales sin editarlos ni usarlos como datos del caso.

No autorizar cambios en fundamentos, rúbrica, schemas, validadores, preflight, motor temporal, Kosmotaxis, dependencias, lockfile, manifiestos ni scripts. Sin campus, usuarios, currículo, tutores, servicios, modelos externos, credenciales, base de datos o despliegue. Cualquier necesidad de modificar estas áreas exige detenerse y escalar. No se autoriza commit, stage, push, tag ni publicación por este documento.

## 12. Aceptación futura congelada

Comandos desde la raíz del futuro checkout, con dependencias locales ya disponibles y sin internet. Si faltan, bloquear y declarar la restricción; no instalar ni conectar servicios dentro del caso. Son comandos previstos, no ejecutados en este diseño.

```powershell
npm test
npm run typecheck
npm run validate:fixtures
node --test --test-name-pattern="^P02:request$" dist/tests/manual-calibration.test.js
node --test --test-name-pattern="^P02:manual-result$" dist/tests/manual-calibration.test.js
node --test --test-name-pattern="^P02:preflight$" dist/tests/manual-calibration.test.js
node --test --test-name-pattern="^P02:boundaries$" dist/tests/manual-calibration.test.js
git diff --check
git status --porcelain=v1 --untracked-files=all
git diff --name-only aab4da4 -- src schemas rubrics package.json package-lock.json
```

Si dev avanza con autorización explícita, el último comando sustituye únicamente `aab4da4` por el commit base verificado según §10. No se ejecuta aquí ninguno de los comandos de pruebas futuros.

Resultados exigidos:

- `npm test`: código 0, cero regresiones; conservar las 129 pruebas actuales sin modificar, omitir, cancelar ni dejar pendientes. La cifra es la base documentada en STATUS, no una ejecución repetida en este diseño. No se predice el total final; informar el total realmente ejecutado en el futuro.
- `npm run typecheck`: código 0, sin errores.
- `npm run validate:fixtures`: código 0; conservar los siete schemas, rúbrica y 28 fixtures históricos verificados según expectativas. Este comando no valida por sí solo los dos nuevos JSON.
- Cada comando `P02:*`: código 0 y exactamente una prueba con ese nombre ejecutada y aprobada; cero coincidencias es fracaso. Las pruebas fuera del filtro no cuentan como validación del caso; la suite completa no admite omisiones.
- `P02:request`: usar `validate('evaluation-request', ...)`, comprobar copia íntegra de rúbrica, `criterion_ids: ['EV']`, metadatos, consigna, submission, controles y todos los literales contra expectativas independientes del fixture. Ningún archivo se genera en el test.
- `P02:manual-result`: usar `validate('evaluation-result', ...)` y `validate('finding', ...)`; comprobar igualdad del resultado completo con lo congelado, unicidad de EV, resolución de P02-F-001, igualdad del fragmento y ancla, coherencia de IDs entrada/salida, resumen, apelación false/null y dominio vacío. No calcular puntuaciones desde el texto.
- `P02:preflight`: comparar la salida completa con §6 y validar su contrato, separados del resultado manual. Verificar igualdad exacta de los tres placeholders en sus campos correspondientes, sin valores dinámicos ni sustituciones. Ante comportamiento incompatible, bloquear en esa implementación.
- `P02:boundaries`: comprobar que el código nuevo sólo importa `node:test`, `node:assert/strict`, `node:fs`, `../src/contracts/index.js` y `../src/preflight/index.js`; uso de fs limitado a lectura local. Rechazar imports adicionales, carga dinámica, eval, ejecución de procesos, APIs de red, lectura de credenciales y generación temporal o aleatoria. La comprobación de código y la revisión de sus dependencias locales son necesarias además de correr el caso sin internet. No basta una búsqueda por nombre de proveedor.
- `git diff --check`: código 0. Comprobar también directamente whitespace de los cuatro archivos nuevos, porque Git no incluye archivos sin seguimiento en ese diff.
- Estado final: únicamente los cuatro archivos nuevos de §11, sin cambios en índice ni archivos rastreados; diff de áreas protegidas vacío. No admitir artefactos de caso adicionales. La compilación ordinaria puede producir `dist/` ignorado, sin convertirlo en área de implementación autorizada.

Comprobación explícita complementaria de llamadas a modelos o red, después de implementar:

```powershell
rg -n -i 'fetch\s*\(|https?://|node:(http|https|net|tls|dgram)|WebSocket|XMLHttpRequest|openai|anthropic|gemini|child_process|import\s*\(|eval\s*\(' tests/manual-calibration.test.ts src/contracts/index.ts src/preflight/index.ts
```

Revisar cada coincidencia; los identificadores `$id` de schemas bajo `https://aion.school.local/` son referencias locales, no llamadas. El código de salida 1 de rg significa ausencia de coincidencias; 0 exige clasificación, no prueba una infracción por sí mismo. La aceptación requiere inspección completa de imports y operaciones del test y de los dos módulos existentes, ninguna llamada a red o modelos y funcionamiento sin internet. No transformar el código de salida de rg en prueba automática de ausencia de red.

## 13. Preguntas negativas congeladas

Todas quedan `PENDING`; se responderán después de la ejecución y auditoría con referencia de evidencia permitida. No completar por inferencia:

1. ¿La cápsula permitió implementar sin reinterpretar el dictamen?
2. ¿Terra necesitó cambiar algún criterio semántico?
3. ¿Apareció incertidumbre estructural?
4. ¿Fue necesario escalar?
5. ¿Se introdujo evaluación automática accidental?
6. ¿El caso exigió modificar fundamentos?
7. ¿La auditoría encontró que el dictamen estaba sobredeterminado o subdeterminado?
8. ¿La carga de Kosmotaxis fue proporcional al valor obtenido?
9. ¿La recomendación de Terra High resultó excesiva, insuficiente o no concluyente?
10. ¿Debe CASE-P02 aceptarse, rehacerse o abandonarse?

Comparar evidencia con criterios previos y distinguir fallo de ejecución, cápsula, selección, política, restricción externa o resultado no concluyente. Conservar retrabajo, escalamiento, selección diferente de la recomendación y resultados adversos. Un caso no prueba superioridad de modelo, ahorro causal ni utilidad general de Kosmotaxis; sin contraste suficiente, no concluir qué otro modelo habría bastado.

## 14. Fracaso, revisión y privacidad

Fracaso o bloqueo si falta cualquiera de `PREREG_COMMIT`, `PREREG_PATH` o `PREREG_BLOB` antes de selección o ejecución; si el commit no contiene la ruta exacta; si el blob resuelto no coincide con `PREREG_BLOB`; si se intenta usar una referencia móvil; o si el contenido usado no es el identificado por commit + ruta. También hay fracaso o bloqueo si se ajustan criterios tras observar la implementación; el dictamen no puede justificarse con submission y rúbrica informada en su contexto congelado; se modifican fundamentos para acomodarlo; aparece evaluación semántica automática; se llama a modelos o servicios externos; la implementación modifica o incorpora documentos Kosmotaxis; el auditor no reconstruye el dictamen; se ocultan retrabajo o escalamiento; se completa PENDING por inferencia; o los placeholders son rechazados o sustituidos. No rescatar el caso cambiando significado o expectativas.

Si una objeción previa a implementar refuta el dictamen, conservarla y mantener implementación sin iniciar; preparar revisión vinculada sujeta a decisión humana. La autoridad final sobre disputas sigue siendo humana. Aceptar este prerregistro no equivale a aceptar una implementación inexistente ni a habilitar K1.

Fuentes futuras permitidas: los cuatro archivos del caso, diferencias de contenido, conteos y códigos de salida de verificaciones, y declaraciones mínimas de selección/escalamiento/resultado. Acceso y custodia propuestos: responsable humana del caso como custodio local; ejecutor con acceso al material de implementación y auditor con acceso mínimo de sólo lectura a la cápsula y evidencia primaria. El acuerdo operativo y acceso efectivo deben confirmarse antes de ejecutar; no se presume custodia independiente ni autenticación. Conservar el prerregistro y revisiones mínimas hasta cierre de revisión y disputas; al cierre, revisar necesidad de notas transitorias sin borrar objeciones o resultados negativos permitidos. Una disputa abierta requiere decisión explícita de retención por un nuevo hito. No se implementa almacenamiento ni control de acceso.

Prohibidos conversaciones, prompts completos, chain-of-thought, nombres personales, identificadores personales persistentes, timestamps reales, duración, porcentajes de uso, datos de Pez en el agua y contenido real de una estudiante. No copiar reportes crudos que incluyan esos datos; conservar sólo evidencia mínima revisada. Los tres CONTRACT_PLACEHOLDER son la única excepción temporal y no habilitan otros valores. Ningún dato temporal real se incorporó al contenido de este prerregistro.

## 15. Verificación de esta entrega documental

Alcance de comprobación: lectura de fuentes, existencia de EV y literalidad de sus descriptores, inspección manual de campos e invariantes, revisión del área futura y de los comandos. Sin ejecución de CASE-P02, creación de fixtures, llamada a modelos o servicios externos ni suite de pruebas. La aceptación ejecutada de placeholders y objetos completos queda pendiente para la futura implementación.

HECHO VERIFICADO durante la revisión documental: los cinco descriptores de EV coinciden literalmente con el YAML; sólo aparecen los tres valores temporales autorizados; los tres fragmentos JSON documentales tienen sintaxis legible. `git diff --check`, comparación de archivos rastreados e índice devolvieron código 0; la comprobación directa del archivo nuevo no encontró whitespace final ni terminación incorrecta. Git mostró únicamente este documento sin seguimiento, en `experiment/kosmotaxis`, HEAD `e2272d6`. Estas comprobaciones no validan un paquete ejecutable ni adjudican semánticamente el caso.

Las fuentes y antecedentes permanecen intactos. El resultado posterior y las respuestas a §13 deberán vivir en un registro vinculado separado, mediante otra intervención autorizada; este prerregistro conserva sus PENDING y NOT_STARTED.

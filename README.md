# AION School · fundamento y observación temporal

Escuela personal, independiente y no oficial. Este proyecto implementa contratos, un preflight y un observador temporal local determinista. Todavía no evalúa desempeño. El tiempo es evidencia contextual y no produce calificaciones.

## Ejecutar en Windows / PowerShell

Requisitos: Node.js 22 o posterior y npm. Verificado con Node.js 24.21.0 y npm 12.0.2. Desde esta carpeta:

```powershell
npm ci
npm run typecheck
npm test
npm run validate:fixtures
npm run preflight -- tests/fixtures/valid-request.json
npm run preflight -- tests/fixtures/missing-submission-request.json
npm run preflight -- tests/fixtures/warning-request.json --json
npm run summarize:session -- tests/fixtures/temporal/manual.json
npm run summarize:session -- tests/fixtures/temporal/blind.json --for-evaluator
```

La instalación inicial necesita acceso al registro npm. La ejecución posterior usa sólo archivos locales; no solicita credenciales ni conecta modelos. No instalar herramientas globales.

Para obtener sólo JSON, sin los mensajes de npm, compilar una vez y ejecutar:

```powershell
npm run build
node dist/src/preflight/cli.js tests/fixtures/valid-request.json --json
```

### Códigos de salida de la CLI

| Código | Significado |
|---|---|
| 0 | Paquete válido: LISTO, LISTO_CON_ADVERTENCIAS o NO_EVALUABLE por fallo declarado del sistema |
| 1 | Entrada inválida: archivo inaccesible, JSON malformado, schema incumplido o uso incorrecto |
| 2 | NO_EVALUABLE por falta de consigna, producción o rúbrica/identificación/versionado |

En particular, código 0 **no implica** que el paquete sea evaluable. Consumir `preflight.status` y sus bloqueos. Esta convención cumple la restricción de salida de la misión.

## Qué contiene

Kosmotaxis comienza en modo sombra exclusivamente documental: [Carta experimental K0](docs/kosmotaxis/K0-CHARTER.md), vocabulario provisional y reconstrucción retrospectiva temporal. No selecciona modelos ni integra Pez en el agua o la evaluadora. K1 es futuro, no iniciado; ver [ADR-0003](docs/architecture/ADR-0003-kosmotaxis-shadow-mode.md).

La propuesta de [protocolo prospectivo manual K0.1](docs/kosmotaxis/K0.1-PROSPECTIVE-MANUAL-PROTOCOL.md) y el [ADR-0004](docs/architecture/ADR-0004-kosmotaxis-prospective-manual-evidence.md) delimitan reglas y compuertas para revisión conceptual. No validan la política ni autorizan K1. CASE-P01 conserva su prerregistro; su resultado corresponde a una intervención posterior.

- `docs/foundation/`: fuentes normativas intactas y misión fundacional.
- `schemas/`: siete contratos JSON Schema Draft 7, versión 1.0.0: cinco fundacionales y dos temporales.
- `rubrics/common-rubric.v1.yml`: doce dimensiones y sesenta descriptores observables.
- `src/contracts/`: carga y validación AJV sin coerción ni eliminación de propiedades.
- `src/preflight/`: comprobaciones deterministas y CLI.
- `src/temporal/`: reconstrucción de sesiones, proyección para evaluadora y CLI.
- `tests/fixtures/`: ejemplos sintéticos positivos y negativos, con manifiesto de expectativas.
- `tests/fixtures/temporal/`: doce paquetes temporales con expectativas verificables.
- `tests/acceptance/`: diez casos semánticos documentados, pendientes de implementación.
- `STATUS.md`, `NEXT.md`, `docs/architecture/ADR-0001-foundation.md`: continuidad y decisiones.

Las pruebas comprueban que Manifiesto y Especificación coinciden byte por byte con sus copias originales disponibles en la raíz. La Misión tiene un hash registrado, pero el repositorio no contiene el ZIP original ni una segunda copia independiente que permita verificar su igualdad histórica.

## Contrato de entrada y límites

El JSON recibido es directamente el objeto `evaluation_request` descrito en la especificación, sin un envoltorio adicional. Añade `schema_version`, `criterion_ids` y una copia de la `rubric` para validación local reproducible. `rubric_id` y `rubric_version` deben coincidir con ella. Ver [contratos y decisiones](docs/architecture/ADR-0001-foundation.md).

El schema permite que consigna, producción y rúbrica estén ausentes o sean null para que el preflight pueda informar `NO_EVALUABLE` de manera estructurada. `submission` también puede omitir `content`: el preflight lo informa como `MISSING_SUBMISSION`. Esto no habilita su evaluación. Los demás metadatos obligatorios ausentes invalidan el paquete. Contenidos vacíos o con sólo espacios equivalen a insumo faltante. Las versiones de rúbrica admiten SemVer 2.0.0 completo, incluidos prerelease y metadata.

Las referencias de artefactos y fuentes son texto: no se abren rutas, enlaces ni archivos arbitrarios. Para esta vertical se recomienda producción textual incorporada; una referencia externa no prueba acceso al artefacto.

`preflight_checks` admite seis controles: `artifact_readable`, `artifact_not_truncated`, `required_materials_available`, `response_matches_task`, `task_brief_semantically_complete` y `criteria_and_restrictions_disclosed`. Cada uno registra `state` (`PASS`, `FAIL` o `NOT_CHECKED`), `asserted_by` (`SYSTEM`, `HUMAN_REVIEW` o `AUTHORIZED_COMPONENT`), `assertion_ref` y `checked_at`. Es una declaración trazable recibida por el preflight, no una comprobación semántica ejecutada por este núcleo. Un control ausente, `FAIL` o `NOT_CHECKED` produce `NO_EVALUABLE`; todos deben estar en `PASS` para emitir `LISTO` o `LISTO_CON_ADVERTENCIAS`.

`LISTO` significa que todos los controles obligatorios fueron declarados y aprobados por sus fuentes identificadas. No transforma esas declaraciones en verificación propia ni acredita una competencia. Una advertencia limita `confidence_limit` a media; no produce culpa, nota ni cambio de competencia.

La salida real conserva los controles y su procedencia, tiene `status: preflight_only`, resultado null salvo `NO_EVALUABLE`, confianza evaluativa null, listas evaluativas vacías y auditoría sin modelo ni prompt. Declara `appeal.available: false` y `rubric_frozen_at: null`: no existe todavía un mecanismo de apelación o congelación. La CLI valida esa salida antes de mostrarla. `valid-result.json` es un ejemplo de estructura completada **escrito a mano**, no una evaluación realizada.

Además del JSON Schema, la validación cruzada TypeScript rechaza resultados incompatibles entre preflight, resultado y confianza; `COMPETENTE` sin criterios o evidencia localizada; cualquier resultado distinto de `REHACER` cuando existe un hallazgo crítico; IDs repetidos en `evaluation-result.criteria`; resúmenes vacíos en `completed`; apelación ficticia; y criterios duplicados en rúbricas. Son comprobaciones deterministas de coherencia, no evaluación semántica.

## Observación temporal · Pez en el agua

El evento explícito `SESSION_STARTED` con activación `Pez en el agua` fija T0. La CLI recibe un archivo `{ "events": [...] }`; no captura el chat ni observa ventanas o teclas. El motor conserva segmentos, pausas, procedencia, brechas y correcciones. Un inicio aislado produce cero minutos. El umbral de continuidad predeterminado es 45 minutos, configurable con `options.gap_threshold_minutes`; una brecha mayor se excluye por completo y deja un corte provisional hasta reanudación o cierre explícitos.

El modo distingue `MANUAL`, `CHAT_ESTIMADO`, `DECLARADO` y `MIXTO`. El tiempo offline y las correcciones permanecen declarados; no se transforman en tiempo medido. La confianza temporal sólo describe la evidencia temporal. No se infieren foco, entusiasmo, afinidad ni rendimiento.

El total siempre coincide con la suma de `segments[].minutes`. Una corrección sólo se admite sin ancla activa: el productor debe pausar o cerrar antes, corregir las contribuciones materializadas y reanudar explícitamente si continúa. Una corrección sustituye las contribuciones vigentes por un ajuste declarado; conserva las contribuciones anteriores en `corrections[].replaced_segments`, junto con valor previo, nuevo, delta, motivo, momento y procedencia. Es global sobre `active_minutes`, no selectiva por segmento: mencionarlo en el motivo no lo vuelve verificable. Esas copias históricas no se suman otra vez, pero sus intervalos siguen impidiendo el doble conteo por superposición. Los eventos originales no se modifican.

```powershell
npm run summarize:session -- tests/fixtures/temporal/pause.json
npm run summarize:session -- tests/fixtures/temporal/correction.json --json
npm run summarize:session -- tests/fixtures/temporal/timed-task.json --for-evaluator
```

Sin flags: salida compacta para observación local. `--json`: resumen completo local. **Para la evaluadora, usar siempre `--for-evaluator`**: cada exportación `BLIND` es exactamente `{ "visibility": "BLIND", "temporal_data_withheld": true }`, sin identificadores ni strings del productor y con rechazo de propiedades adicionales. La asociación sesión/evaluación queda fuera del payload, en la capa llamadora o ledger futuro. `TIMED_TASK` conserva su lista de campos autorizados por la declaración de consigna del evento inicial y su límite aceptado de autorización estructural no autenticada. El resumen local completo sí contiene tiempo aun cuando la visibilidad sea `BLIND`. La exportación no consulta la consigna ni se conecta a una evaluadora; valida la declaración recibida. Código 0: reconstrucción válida, incluso abierta/provisional; código 1: entrada o uso inválidos, sin salida parcial.

Ver [protocolo operativo](docs/protocols/pez-en-el-agua.md) y [decisiones y límites temporales](docs/architecture/ADR-0002-temporal-observation.md). Drive/Sheets, auditoría mensual e interfaz quedan pendientes. La calibración manual de `NEXT.md` podrá asociarse a una sesión, sin iniciarse en este incremento.

No hay campus, usuarios, cronómetro automático, currículo, tutores, evaluadora IA, captura automática, registro persistente de evaluaciones, base de datos ni publicación. La CLI lee archivos locales y no los modifica.

# CASE-P02 — Registro posterior de auditoría y cierre acotado

## Vinculación e identidad

- `IMPLEMENTATION_COMMIT`: `d051a92427aa261c5e3d1f99c89893abfff1a968`
- `IMPLEMENTATION_PARENT`: `9a9ad2c4c652878966f8851425d21a80f5ac82bb`
- `PREREG_COMMIT`: `f8928cdf68d8c217c606e79cd26a6773584d5b08`
- `PREREG_PATH`: `docs/kosmotaxis/cases/CASE-P02-MANUAL-SEMANTIC-CALIBRATION-PREREGISTRATION.md`
- `PREREG_BLOB`: `24620480bf31286b2cfdb3e9b32853a90808c629`

Git confirma el commit de implementación, su parent y el blob resuelto por `PREREG_COMMIT:PREREG_PATH`. El commit de implementación conserva los cuatro archivos del caso: `docs/calibration/CASE-P02-MANUAL-REFERENCE.md`, `tests/fixtures/manual-calibration/request.json`, `tests/fixtures/manual-calibration/manual-result.json` y `tests/manual-calibration.test.ts`. Este registro es posterior y vinculado; no altera esos cuatro archivos ni el prerregistro.

## Hechos técnicos ejecutados

La aceptación local del estado documentado dio `ACCEPTANCE_PASS`. En la verificación mínima previa al commit, y en la aceptación completa anterior, se observaron los siguientes resultados:

| Comprobación | Resultado |
|---|---|
| `P02:request` | 1/1 PASS. |
| `P02:manual-result` | 1/1 PASS. |
| `P02:preflight` | 1/1 PASS. |
| `P02:boundaries` | 1/1 PASS. |
| Suite completa | 133/133 PASS; sin fallidas, omitidas ni canceladas. |
| Typecheck | PASS. |
| `validate:fixtures` | 7 schemas, rúbrica y 28 fixtures históricos verificados. |
| Áreas protegidas | Sin cambios respecto de la base verificada. |
| Placeholders | Conservados exactamente en el caso; el preflight del caso no los sustituyó dinámicamente. |
| Scan complementario | Coincidencias clasificadas; no se observaron llamadas a red, modelos o procesos en el perímetro revisado. |

Estas pruebas verifican estructura, literales y funcionamiento local. No adjudican por sí mismas la suficiencia semántica del dictamen ni acreditan capacidad de una evaluadora automática.

## Reconstrucciones y resultados de auditoría

Los resultados de auditoría de esta sección son las declaraciones mínimas suministradas para el cierre. Este archivo no incorpora informes crudos, identidad de auditores ni prueba de independencia cognitiva absoluta.

### P02-AUDIT-001

- `FINAL_VERDICT`: `AUDIT_PASS_WITH_RESERVATIONS`
- `CASE_P02_RECOMMENDATION`: `ACCEPT`

Reservas conservadas: la reconstrucción no fue completamente ciega porque la referencia documental expuso el resultado esperado antes de terminarla; `severity = mayor` es defendible, pero la norma no la determina de forma única; CASE-P02 está sobredeterminado como caso mínimo y no demuestra capacidad general. La independencia de esta auditoría fue limitada.

### P02-AUDIT-002, fase 1: reconstrucción ciega

La reconstrucción declarada como sellada se hizo antes de revelar resultado, referencia o prerregistro. Concluyó: caso evaluable; `EV = 0`; `EV = 1` no razonablemente defendible; ausencia de evidencia, sin fabricación; `REHACER`. Consideró `severity = mayor` un juicio provisional defendible, pero no único. Asignó confianza alta a EV, evaluabilidad y `REHACER`, y menor confianza a la severidad.

### P02-AUDIT-002, fase 2: contraste revelado

- `FINAL_AUDIT_002_VERDICT`: `BLIND_RECONSTRUCTION_CONFIRMED`
- `CASE_P02_FINAL_RECOMMENDATION`: `ACCEPT`

| Dimensión comparada | Resultado |
|---|---|
| Evaluabilidad | `MATCH` |
| `EV = 0` | `MATCH` |
| Fundamento | `MATCH` |
| Rechazo de `EV = 1` | `MATCH` |
| `REHACER` | `MATCH` |
| Severidad | `PARTIAL_MATCH`: subdeterminación normativa |
| Omisión, sin fabricación | `MATCH` |
| Localizador | `MATCH` semántico, con distinta representación |
| `repair_task` | `MATCH` semántico |
| `mastery_updates: []` | `MATCH` |

La fase 2 dejó de ser ciega al comparar con la referencia revelada. La concordancia de este caso no acredita independencia cognitiva absoluta ni alcance general.

## Decisión acotada y reserva de diseño

- `CASE-P02`: `ACCEPTED_AS_MINIMAL_MANUAL_CALIBRATION_CASE`
- `SEVERITY_POLICY_UNDERSPECIFIED`: deuda futura de diseño.

La severidad `mayor` coincide entre prerregistro y reconstrucción ciega, pero las normas actuales no la determinan de forma única. Se conserva la reserva sin corregir retrospectivamente CASE-P02. La decisión acepta este caso mínimo de calibración semántica manual; no acepta una evaluadora automática ni una capacidad semántica general.

## Preguntas negativas del prerregistro §13

| Nº | Pregunta | Resultado y estado conservados |
|---|---|---|
| 1 | ¿La cápsula permitió implementar sin reinterpretar el dictamen? | Compatible con YES según artefactos y reconstrucción, pero la motivación interna del implementador no es observable. Estado final: `SUPPORTED_WITH_LIMIT`. |
| 2 | ¿Terra necesitó cambiar algún criterio semántico? | No se observaron cambios de criterio. Si el ejecutor “necesitó” cambiarlo internamente es `UNKNOWN`. Estado final: `SUPPORTED_NO_OBSERVED_CHANGE`. |
| 3 | ¿Apareció incertidumbre estructural? | No apareció incompatibilidad estructural. Sí apareció subdeterminación semántica de severidad. Estado final: `NO_STRUCTURAL_BLOCK / SEMANTIC_RESERVATION`. |
| 4 | ¿Fue necesario escalar? | `UNKNOWN`. No se completa por inferencia. |
| 5 | ¿Se introdujo evaluación automática accidental? | No observada en el perímetro implementado. El resultado sigue siendo referencia manual. Estado final: `NO_OBSERVED_AUTOMATIC_ADJUDICATION`. |
| 6 | ¿El caso exigió modificar fundamentos? | `NO`. Las áreas protegidas permanecieron sin cambios. |
| 7 | ¿La auditoría encontró el dictamen sobredeterminado o subdeterminado? | `EV = 0` y `REHACER` están fuertemente determinados en este caso mínimo; el caso está sobredeterminado para discriminación general; `severity = mayor` está subdeterminada normativamente. Estado final: `MIXED`. |
| 8 | ¿La carga de Kosmotaxis fue proporcional al valor obtenido? | `PENDING`. Falta medida y contraste autorizados. |
| 9 | ¿La recomendación de Terra High resultó excesiva, insuficiente o no concluyente? | `PENDING`. CASE-P02 no compara modelos. |
| 10 | ¿Debe CASE-P02 aceptarse, rehacerse o abandonarse? | `ACCEPT`, exclusivamente como caso mínimo de calibración semántica manual. |

## Límites del cierre

Este cierre no demuestra superioridad de Terra High, desempeño real de una estudiante, validación general de Kosmotaxis ni capacidad semántica general. No habilita K1. Los resultados de auditoría conservan sus reservas y los estados `UNKNOWN` y `PENDING` anteriores; no se sustituyen por inferencias. La autoridad humana final en disputas permanece fuera de este artefacto técnico y documental.

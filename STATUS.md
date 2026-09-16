# Estado comprobado · fundamento y misión Pez en el agua v0.1

Actualizado: 2026-09-16. Proyecto local: `C:\Users\nucle\aion-school`.

**Resultado:** fundamento determinista y observación temporal implementados y probados. No existe todavía una evaluadora de desempeño ni un campus. AION es una escuela personal, independiente y no oficial.

## Observación temporal implementada (2026-09-16)

- Contratos `study-event` y `study-session` versión 1.0.0, con AJV estricto y rechazo de propiedades desconocidas. El proyecto compila ahora siete schemas; los cinco fundacionales no se modificaron.
- Motor local en `src/temporal/`: T0 explícito, continuidad con umbral configurable de 45 minutos, cortes provisionales sin contar la brecha, pausa/reanudación/cierre, intervalos offline declarados y correcciones encadenadas sin borrar valores anteriores. Una corrección se rechaza de forma estable si existe un ancla activa; primero se pausa o cierra, luego se corrige y se reanuda explícitamente si corresponde.
- Rechazo de eventos desordenados, IDs repetidos, transiciones inválidas, duraciones negativas y superposiciones dentro de la misma sesión. Una sesión con sólo el inicio produce cero minutos.
- Procedencia por segmento, modo manual/estimado/declarado/mixto y confianza temporal. Ninguna duración puntúa, infiere afinidad ni modifica resultados o competencias.
- Exportación `BLIND` fija: `{ "visibility": "BLIND", "temporal_data_withheld": true }`, sin identificadores ni strings controlados por el productor. Su contrato rechaza propiedades adicionales. La asociación sesión/evaluación queda en la capa llamadora o ledger futuro, fuera del payload. `TIMED_TASK` conserva el comportamiento auditado y su autorización estructural no autenticada.
- Correcciones con segmentos efectivos: `active_minutes` coincide con la suma de `segments[].minutes`. Cada ajuste global sobre `active_minutes` sustituye el estado previo; v1 no implementa ajustes selectivos por segmento y un motivo textual no los acredita. `corrections[].replaced_segments` conserva su copia histórica, junto con objetivo, valor previo, nuevo, delta, razón, timestamp y procedencia. Esas copias no se suman, pero sus intervalos siguen impidiendo superposiciones. La igualdad y reconstrucción del estado efectivo se comprueban en el validador cruzado TypeScript.
- CLI `npm run summarize:session -- <fixture>`: salida compacta, JSON completo local o proyección para evaluadora. Doce fixtures temporales (nueve aceptados y tres rechazos esperados), manifiesto, 35 pruebas temporales iniciales y 27 regresiones añadidas por los tres hallazgos materiales. Se conservaron las 102 pruebas anteriores; sólo se adaptaron las expectativas incompatibles con las correcciones y un estrechamiento de tipo. Las 67 fundacionales permanecen intactas.
- ADR-0002 y protocolo operativo documentan las decisiones, privacidad y límites. Se reutilizan las dependencias existentes; no hubo instalación ni cambios en el lockfile.

## Verificación temporal: resultados ejecutados (2026-09-16)

Entorno verificado: Windows, Node.js **v24.21.0**, npm **12.0.2**. Se invocó `npm.cmd` desde PowerShell.

| Comando / comprobación | Resultado |
|---|---|
| `npm test` | Código 0; **129 pruebas, 129 aprobadas, 0 fallidas, 0 canceladas, 0 omitidas, 0 pendientes**; 102 anteriores y 27 nuevas. Duración informada: **64158.0455 ms**. |
| `npm run typecheck` | Código 0; `tsc --noEmit` sin errores. |
| `npm run validate:fixtures` | Código 0; **7 schemas compilados, rúbrica validada y 28 fixtures verificados**: 16 fundacionales y 12 temporales, incluidos los rechazos esperados. |
| CLI temporal dentro de la suite | Salida compacta, JSON, BLIND y TIMED_TASK: código 0. Archivo ausente, JSON inválido, cronología inválida, contenido no autorizado o argumentos incorrectos: código 1, sin resumen parcial. |
| `npm run summarize:session -- tests/fixtures/temporal/correction.json --json` | Código 0; sesión CLOSED, `active_minutes: 22`, un segmento efectivo ADJUSTMENT de 22, historial 30 → 22 con delta −8 y segmentos anteriores de 20 y 10 conservados en `replaced_segments`. |
| `git diff --check` | Código 0; sin errores de whitespace. |
| Preservación | `git diff` sin cambios en `docs/foundation/`, cinco schemas fundacionales, preflight, pruebas fundacionales y `package-lock.json`; hashes normativos coinciden con los registrados abajo. |
| Referencias Git | Rama `dev`; HEAD, `main` y commit del tag fundacional conservan `773cb39df1212c01375a98012405c58cdfdf2a16`. No se creó commit ni se prepararon cambios en el índice. |

La ejecución inicial anterior a la auditoría había aprobado 102 pruebas en 36104.3853 ms. La auditoría independiente posterior encontró los canales laterales de BLIND, la discrepancia entre total y segmentos corregidos y la posibilidad de doble conteo tras una corrección con ancla abierta. Estas intervenciones se limitan a esos tres hallazgos.

Preflight de la corrección: rama `dev`, HEAD y referencias iguales a los de la auditoría, mismo listado de 6 archivos modificados y 22 nuevos; ninguno de los 67 archivos del proyecto tenía una fecha de escritura posterior al inicio de esa auditoría. No se detectaron cambios adicionales. La comparación de estado y fechas no equivale a disponer de un manifiesto histórico completo de hashes publicado por la auditoría.

Dictamen de la corrección: **LISTO PARA REAUDITORÍA**. La interrupción de consumo no produjo pérdida observada de archivos ni resultados: se recuperó la ejecución en curso y se completaron las verificaciones sobre la versión final.

### Límites temporales y pendientes

- Sólo contrato, motor, CLI y pruebas locales: no hay integración con chat, captura automática ni almacenamiento. El operador debe conservar los eventos originales. La inactividad se detecta únicamente al llegar otro evento.
- El umbral es una heurística; el modo manual registra anclas declaradas y el chat estima continuidad. No se comprueba actividad real, foco, entusiasmo, interés o afinidad. La confianza es exclusivamente temporal.
- Las correcciones humanas sustituyen los segmentos efectivos y conservan los anteriores en el historial; el total coincide con las contribuciones vigentes. El ajuste sigue siendo una declaración no autenticada, no una nueva medición. No hay firma ni ledger.
- La exportación cronometrada valida una declaración y referencia de consigna, sin leerla. Los identificadores deben ser opacos y las notas mínimas. El schema no detecta información sensible dentro de un campo permitido.
- No se suman ni se deduplican tiempos entre sesiones diferentes. La disponibilidad de zonas horarias depende del runtime. No se probó este incremento con Node.js 22 ni en otro equipo.
- Drive/Sheets, auditoría mensual e interfaz están pendientes. El caso manual de calibración sigue en `NEXT.md`, asociable a una sesión y **no iniciado**.

## Fundamento implementado

- Misión, Manifiesto y Especificación conservados en `docs/foundation/`, después de su lectura íntegra.
- Manifiesto y Especificación coinciden byte por byte con sus copias originales disponibles en la raíz. La Misión tiene un hash registrado; el repositorio no contiene el ZIP original ni una segunda copia independiente para verificar su igualdad histórica.
- Cinco contratos Draft 7 con IDs, versión 1.0.0, campos obligatorios, enums, límites y rechazo de propiedades desconocidas.
- Rúbrica común 1.0.0: EV, FI, HA, RC, IN, CF, ST, TR, LT, TC, RV y AU; cinco descriptores por dimensión.
- Carga de JSON y rúbrica YAML, validación AJV estricta, preflight de tres estados, salida estructurada validada y CLI legible/JSON.
- Seis controles obligatorios con estado y procedencia trazable; ausencia, `FAIL` o `NOT_CHECKED` producen `NO_EVALUABLE` y sólo seis `PASS` permiten `LISTO` o `LISTO_CON_ADVERTENCIAS`.
- Validación cruzada de resultado/preflight/confianza, evidencia mínima para `COMPETENTE`, compuerta crítica obligatoria a `REHACER`, unicidad de criterios en rúbrica y resultado, resumen no vacío y apelación deshabilitada.
- Ausencias esenciales, incluido `submission` sin `content`; SemVer 2.0.0 completo; comprobación de identidad de rúbrica y criterios seleccionados; advertencias no atribuibles a la estudiante.
- 16 fixtures registrados (13 aceptados y 3 rechazados intencionalmente), más un JSON malformado para pruebas de CLI.
- Instrucciones operativas, README, ADR, diez casos semánticos pendientes y un único incremento propuesto en NEXT.

## Fundamento: registro histórico de verificación (2026-09-15)

Entorno: Windows, Node.js **v24.21.0**, npm **12.0.2**.

| Comando / comprobación | Resultado |
|---|---|
| `npm install --no-audit --no-fund` | 10 paquetes instalados localmente; lockfile creado. El primer intento restringido no finalizó; se interrumpió y se reintentó con permiso ampliado. |
| `npm run typecheck` | Código 0; `tsc --noEmit` sin errores. |
| `npm test` | Código 0; **67 pruebas, 67 aprobadas, 0 fallidas, 0 canceladas, 0 omitidas, 0 pendientes**. Duración informada de la suite: 27377.8699 ms. |
| `npm run validate:fixtures` | Código 0; **5 schemas compilados, rúbrica validada, 16 fixtures verificados** según sus expectativas positivas y negativas. |
| `node dist/src/preflight/cli.js tests/fixtures/valid-request.json` | Código 0; salida legible `LISTO`, sin calificación ni evaluación de desempeño. |
| CLI sobre fixtures, desde la suite | Válido y advertencia: 0; falta consigna/producción/rúbrica: 2; propiedad desconocida: 1; truncamiento declarado: NO_EVALUABLE con 0 según la misión. Archivo inexistente y JSON malformado: 1. |
| Preservación | Manifiesto y Especificación coinciden con las copias originales disponibles; la Misión sólo dispone de hash registrado dentro del repositorio. |

Durante la corrección posterior a la auditoría, una primera regresión detectó tipos de objeto no explícitos en condiciones nuevas del schema. Se declararon los tipos y se repitió la suite completa con el resultado anterior. No se desactivó la validación estricta.

Las seis pruebas mínimas de la misión están cubiertas: válido, falta de producción, falta de rúbrica, advertencia del sistema, propiedad desconocida y hallazgo sin localizador. Esta última comprueba específicamente el error `required: evidence_locator`.

También están cubiertas las once regresiones de la reauditoría: techo de confianza, evidencia de `COMPETENTE`, coherencia de `NO_EVALUABLE`, apelación no disponible, control ausente, `NOT_CHECKED`, controles aprobados, criterio duplicado, SemVer con prerelease/metadata, resumen vacío y `submission` sin contenido. Se añadió además el caso inverso de preflight `NO_EVALUABLE` con resultado sustantivo.

La corrección acotada posterior añade ocho regresiones: cuatro resultados incompatibles con al menos un hallazgo crítico, un caso válido `REHACER` con hallazgo crítico, un resultado válido sin hallazgos críticos, un rechazo de `criterion_id` duplicado aunque cambien los demás campos y un caso válido con IDs distintos. La unicidad por propiedad y la compuerta crítica pertenecen al validador cruzado TypeScript; JSON Schema no expresa por sí solo esas relaciones.

### Integridad SHA256

- Misión: `9EDF47794C41AC5C5DE4921BF58EC6DABD5CAA5F58C906005A493433A8D4B588`.
- Manifiesto: `40B0068D1519F87288A07DBD440B7FDB1A9E0D44D26DE4722972F1C36EEF5432`.
- Especificación: `22CFB70C56B8ABD47103680F3913ADDDB3AB2D191DD6680D7ACE71AC40E68C76`.

## No probado / no implementado

- Los diez casos semánticos de la Especificación §19: documentados en `tests/acceptance/semantic-cases.md`, sin evaluadora real ni dictamen ejecutado.
- Calidad académica empírica de los descriptores, calibración, sesgos, veracidad de fuentes, interpretación de consigna y evidencia, determinación semántica de qué constituye un hallazgo crítico y fundamento de puntuaciones. La coherencia estructural entre severidad crítica y `REHACER` sí está implementada y probada.
- Dos pasadas, cambios efectivos de dominio, apelaciones reales, persistencia, congelación criptográfica, registro de fallos de IA y revisión humana integrada. `appeal.available` permanece en false.
- Lectura de artefactos o fuentes externas: los controles son declaraciones trazables con procedencia; el núcleo decide sobre ellas pero no realiza por sí mismo la revisión humana o semántica.
- Instalación limpia mediante `npm ci` en otro equipo y compatibilidad ejecutada con Node.js 22. Sólo se usó el entorno indicado; no se ejecutó auditoría de dependencias.
- Campus, usuarios, cronómetro automático, currículo, tutores, modelos/servicios externos, credenciales, base de datos, despliegue y publicación: excluidos y ausentes. La nueva misión incorpora reconstrucción temporal a partir de eventos explícitos.

## Pendiente y continuidad

- Especializar y revisar criterios antes de puntuar una actividad; detalles de interpretación y límites en el ADR.
- Próximo incremento único propuesto en `NEXT.md`: un caso local de calibración con dictamen manual, ahora asociable a una sesión temporal. **No iniciado**.
- La observación temporal queda sujeta a auditoría. Drive/Sheets, auditoría mensual e interfaz permanecen pendientes; no se implementó su integración.

## Git

En el cierre histórico fundacional se verificó `master` sin commits. Al iniciar esta misión se verificó **dev**, árbol limpio y HEAD `773cb39df1212c01375a98012405c58cdfdf2a16`, con el fundamento ya confirmado. `main` y el commit del tag `v0.1.0-foundation` apuntaban a ese mismo fundamento. Esta misión no crea commits, no cambia ramas ni prepara archivos en el índice. Sus modificaciones y archivos nuevos quedan locales para auditoría; `node_modules/` y `dist/` permanecen ignorados.

Después de la corrección acotada: `dev` conserva ese HEAD, `main` y el tag fundacional permanecen iguales, hay 6 archivos rastreados modificados y 23 sin seguimiento (22 preexistentes y el nuevo test de regresión), sin cambios en el índice. No se hizo commit. `NEXT.md`, scripts npm, lockfile, CLI, eventos y fixtures conservaron sus contenidos de inicio de la corrección.

# Protocolo Pez en el agua · v0.1

Estado: contrato, reconstrucción temporal, CLI y pruebas locales. Sin integración automática con chat, tutor o evaluadora.

## Activar y crear T0

La estudiante declara **Pez en el agua**. Quien registra crea un `SESSION_STARTED` con esa cadena exacta en `data.activation`, ID de evento y sesión nuevos, timestamp ISO-8601 con offset, origen humano, referencia de procedencia, zona horaria, área, tipo de actividad y modo. Ese timestamp es T0; no se inventa una hora anterior. Tutor y referencias son opcionales. Esta CLI no escucha ni interpreta el chat: recibe el evento preparado explícitamente.

Modos iniciales:

- `MANUAL`: anclas humanas declaradas de inicio, interacción, pausa y cierre.
- `CHAT_ESTIMADO`: intervalos estimados entre marcas explícitas, sin almacenar mensajes.
- `DECLARADO`: trabajo informado retrospectivamente mediante intervalos offline; el lapso entre mensajes no se suma.

`MIXTO` aparece sólo al combinar procedencias. La zona horaria queda fija para esa sesión y la fecha corresponde a T0 en esa zona. Una sesión con sólo el inicio registra cero minutos activos.

## Continuar, pausar y reanudar

Registrar `INTERACTION_RECORDED` con datos vacíos y referencias mínimas opcionales. El motor puede sumar hasta **45 minutos inclusive** entre anclas, excluidas pausas. El umbral se configura en el paquete; no demuestra que cada minuto haya sido trabajo efectivo.

Registrar `PAUSE_DECLARED` al pausar; el intervalo anterior elegible queda registrado. La pausa excluye tiempo hasta `SESSION_RESUMED`. Mientras la pausa está abierta, una interacción se rechaza: se debe registrar antes la reanudación explícita. El cierre puede terminar una pausa sin sumar el tiempo pausado. Una pausa larga declarada no se convierte en brecha ni en trabajo.

Si entre una ancla y la próxima entrada transcurren más de 45 minutos, el motor conserva el último intervalo comprobable, excluye toda la brecha y deja un cierre **provisional** en la última ancla. Los siguientes mensajes no reactivan por sí solos el conteo. Declarar `SESSION_RESUMED` para iniciar otra continuidad en la misma sesión, o `SESSION_CLOSED` para confirmar el cierre. No hay temporizador: sin evento posterior, no se detecta ni se cierra automáticamente la inactividad.

## Trabajo fuera del chat

Registrar `OFFLINE_TIME_DECLARED` con un inicio y final explícitos, sin transcribir lo trabajado. La marca del evento es el momento de la declaración y no puede preceder al final declarado. Se conserva como tiempo `DECLARADO`, confianza temporal baja; nunca como medido.

Al combinar chat y offline, declarar una pausa de chat que contenga el trabajo externo. El sistema rechaza superposiciones con segmentos ya contados, intervalos anteriores a T0 o posteriores al cierre confirmado. Se puede informar después del cierre un intervalo previo no contado. Para rectificar una estimación ya contada, usar una corrección, sin agregar una segunda copia del intervalo.

## Corrección humana sin borrado

Registrar `ESTIMATE_CORRECTED` sólo cuando no haya actividad abierta: primero declarar `PAUSE_DECLARED` o `SESSION_CLOSED` para materializar el tramo activo. Si existe una ancla abierta, el motor rechaza el evento con `Corrección requiere pausar o cerrar antes de modificar active_minutes.` y no modifica totales, segmentos, historial, pausas, cierre ni la entrada. Para continuar después de una corrección realizada durante una pausa, registrar `SESSION_RESUMED` explícitamente.

La corrección tiene `target: "active_minutes"`, el valor anterior vigente, el nuevo total no negativo y un motivo breve obligatorio (hasta 240 caracteres). El timestamp identifica cuándo se corrigió. El motor conserva objetivo, ambos valores, delta, motivo, timestamp, procedencia y una copia de los segmentos sustituidos en `corrections[].replaced_segments`. Los eventos originales y las correcciones previas se conservan. Un valor previo obsoleto se rechaza. La corrección v1 ajusta el total activo global; no identifica ni modifica selectivamente un segmento. Un motivo que menciona un segmento es sólo texto y no vuelve verificable esa atribución.

Ejemplo: total original 30; corrección humana 30 → 22 por interrupción no registrada. `segments` pasa a contener un ajuste declarado de 22 minutos, y su suma coincide con `active_minutes`. La corrección conserva los segmentos anteriores, valor previo 30, nuevo 22 y delta −8. Las copias históricas y deltas no se suman al estado vigente. Una segunda corrección debe partir de 22. La nueva actividad válida suma nuevas contribuciones; los intervalos históricos siguen impidiendo superposiciones. El ajuste global no inventa un intervalo de reloj y limita la confianza temporal a baja.

## Cerrar y compartir

`SESSION_CLOSED` fija el final declarado. No rellena brechas ni pausas. Después del cierre se aceptan sólo correcciones o declaraciones offline dentro del período cerrado; para nueva actividad se crea otro `session_id`.

Salida compacta de ejemplo sintético:

```text
S-001 | CLOSED | 30 min | MANUAL | confianza temporal ALTA | pausas 0 | cortes 0 | correcciones 0
```

La confianza es temporal: alta para intervalos manuales de una sesión cerrada sin cortes; media cuando hay estimación por chat; baja si hay declaraciones, correcciones, cortes, cero minutos o una sesión sin cierre. No expresa esfuerzo, afinidad, interés, competencia ni calidad de producción.

La evaluadora permanece `BLIND` por defecto: recibe exactamente `{ "visibility": "BLIND", "temporal_data_withheld": true }`. No se envía ningún identificador o texto del productor y se rechazan propiedades adicionales. La capa llamadora o un ledger futuro conserva la asociación sesión/evaluación fuera del payload visible; no debe adjuntar identificadores como envoltorio de la salida ciega.

Para una tarea cronometrada, el evento de inicio debe declarar `timed_task` con tarea, referencia de consigna, `time_declared: true` y una lista de campos autorizados. La lista sólo puede incluir `active_minutes`, `started_at`, `ended_at`, `pauses`, `mode` y `confidence`. No se puede habilitar retrospectivamente mediante un flag de exportación. `TIMED_TASK` conserva su autorización estructural no autenticada: la comprobación humana de la consigna sigue siendo necesaria.

## CLI local

El paquete es un objeto `{ "events": [...] }`, con `options` opcional. Ejemplo configurable: `"options": { "gap_threshold_minutes": 30 }`. Se procesa en orden; los eventos inválidos rechazan el paquete entero.

```powershell
npm run summarize:session -- tests/fixtures/temporal/manual.json
npm run summarize:session -- tests/fixtures/temporal/gap.json --json
npm run summarize:session -- tests/fixtures/temporal/blind.json --for-evaluator
npm run summarize:session -- tests/fixtures/temporal/timed-task.json --for-evaluator
```

Sin flags: resumen compacto para observación local. `--json`: resúmenes completos para observación local. `--for-evaluator`: sólo la proyección autorizada en JSON; tiene precedencia sobre `--json`. Para JSON sin mensajes de npm, ejecutar `node dist/src/temporal/cli.js <archivo> --for-evaluator` después de compilar. Código 0: paquete procesado, incluso si la sesión sigue abierta o provisional. Código 1: entrada o uso inválido, sin resumen parcial.

El resumen completo contiene tiempo aun cuando su visibilidad sea `BLIND`: esa visibilidad manda sobre la exportación para evaluadora. Entregarle sólo `--for-evaluator`, sin identificadores o metadatos añadidos. En el registro local las notas deben ser mínimas; el schema no detecta información sensible escondida en un campo permitido, pero la exportación ciega no incluye ninguno de esos campos.

## Conservación y pendientes

Conservar el archivo original de eventos y sus revisiones para reconstruir la sesión. La CLI no escribe ni reemplaza archivos. Las correcciones se agregan a la lista, no borran eventos. No hay captura de teclas, ventanas, conversaciones ni telemetría; tampoco almacenamiento automático.

Drive/Sheets, auditoría mensual e interfaz están pendientes. El siguiente incremento propuesto sigue siendo un caso local de calibración manual, asociable a una sesión temporal y ciego al tiempo salvo consigna cronometrada explícita. Este incremento no inicia esa calibración.

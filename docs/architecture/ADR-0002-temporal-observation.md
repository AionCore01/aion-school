# ADR-0002 · observación temporal local

Fecha: 2026-09-16. Estado: implementado para la misión Pez en el agua v0.1, sujeto a auditoría temporal.

## Alcance y separación

El observador reconstruye sesiones a partir de eventos explícitos. Es independiente de tutores, preflight y evaluadora: no importa esos motores, no cambia resultados ni competencias y no puntúa. El tiempo es evidencia contextual. Un tutor futuro podrá usarlo para adaptar el ritmo; la auditoría mensual futura podrá cruzarlo con otras evidencias obtenidas de forma explícita. Este incremento no mide foco, interés, entusiasmo, fricción, retorno voluntario ni afinidad y no produce una clasificación «pez en el agua».

La nueva misión autoriza la observación temporal después del fundamento. Las exclusiones de la misión fundacional se preservan como historia de aquel incremento. No se implementan campus, tutores, modelos, Drive/Sheets, base de datos, servicios ni automatización en esta versión.

## Contratos y procedencia

Se agregan `study-event` y `study-session`, versión `1.0.0`, Draft 7, al cargador AJV existente. Sus IDs son identificadores lógicos locales. No hay nuevas dependencias. Cada evento registra ID único, versión, sesión, timestamp con offset, tipo, origen `HUMAN` o `CHAT` y `provenance.source_ref`. Inicio, pausa, reanudación, cierre, offline y corrección exigen origen humano declarado; las interacciones pueden tener origen chat. Esto registra una atribución, no autentica identidad ni verifica que la fuente diga la verdad.

El motor valida schemas y además comprueba cronología global no decreciente, unicidad de eventos e inicios, transiciones, intervalos y valor previo de las correcciones. Timestamps iguales mantienen el orden recibido. Nunca ordena ni repara entradas silenciosamente. Una nueva sesión requiere otro `session_id`; una lista puede contener varias sesiones. No se suman sus duraciones entre sí ni se detectan solapamientos entre sesiones diferentes.

La fecha se obtiene de T0 en la zona horaria reconocida por `Intl` del runtime; los límites temporales se normalizan a UTC. Se usa aritmética de instantes, no restas entre horas locales. El schema valida estructura y formatos; la zona horaria y las relaciones cronológicas se comprueban en TypeScript. Un resumen externo validado sólo por schema no acredita que provenga de un replay correcto.

## Reglas temporales

1. `SESSION_STARTED`, con `activation: "Pez en el agua"`, fija T0. El modo inicial es `MANUAL`, `CHAT_ESTIMADO` o `DECLARADO`; `MIXTO` se deriva cuando hay fuentes de más de un modo.
2. Los intervalos se cierran entre anclas explícitas de actividad: inicio/reanudación y las siguientes interacciones, pausa o cierre. Un único evento o dos anclas en el mismo instante generan cero minutos. No se proyecta actividad hasta la hora actual.
3. Umbral predeterminado: **45 minutos**, configurable mediante `options.gap_threshold_minutes`, finito y mayor que cero. Hasta el umbral inclusive puede contarse continuidad; por encima, no se cuenta ninguna parte de la brecha, tampoco se la recorta a 45 minutos. Es una heurística operativa configurable, no una medida absoluta de actividad real. También se aplica al modo manual para no atribuir actividad continua sin señales suficientes.
4. Una brecha deja `PROVISIONAL`, con final en la última ancla observada y un registro de la brecha. Interacciones posteriores se conservan como IDs, pero no reabren ni suman continuidad. `SESSION_RESUMED` explícito abre una nueva continuidad en la misma sesión; `SESSION_CLOSED` confirma un cierre sin sumar la brecha. El historial de cortes permanece y limita la confianza. Un intervalo offline declarado puede extender el final provisional hasta su propio final, sin convertir la brecha en tiempo medido.
5. Una pausa explícita excluye tiempo hasta reanudación o cierre; puede quedar abierta. No se aplica el umbral a una pausa ya declarada. Una interacción durante pausa se rechaza hasta que haya reanudación. Una pausa declarada al detectarse un corte conserva ese corte; no lo rellena.
6. `MANUAL` usa anclas humanas declaradas; no certifica atención efectiva. `CHAT_ESTIMADO` estima continuidad entre marcas, sin leer mensajes. `DECLARADO` no infiere actividad del intervalo entre eventos: suma exclusivamente intervalos offline declarados. Cada segmento conserva modo y procedencia.
7. `OFFLINE_TIME_DECLARED` contiene inicio y final, ambos no posteriores a la declaración, dentro de la sesión. Se calcula su duración, siempre como `DECLARADO`. No se aceptan duraciones negativas, intervalos anteriores a T0, posteriores al cierre confirmado ni superposiciones con segmentos existentes. Para combinar chat y offline se declara una pausa; así el mismo intervalo no se cuenta dos veces. Una futura ancla que solape un intervalo ya declarado también se rechaza.
8. `ESTIMATE_CORRECTED` sólo se admite cuando no existe una ancla activa abierta. Si `context.anchor` está presente, el replay rechaza el evento con `Corrección requiere pausar o cerrar antes de modificar active_minutes.` antes de validar el evento o mutar estado. El productor debe emitir `PAUSE_DECLARED` o `SESSION_CLOSED` válido para materializar las contribuciones y sólo después corregir; puede reanudar mediante `SESSION_RESUMED` explícito. No se mueve el ancla, no se sintetizan eventos y no se completa un intervalo implícitamente.

   La corrección v1 es global sobre `active_minutes`, no selectiva por segmento. Sustituye las contribuciones efectivas vigentes por un segmento `kind: ADJUSTMENT`, `mode: DECLARADO`, cuyos `minutes` son el nuevo total no negativo. Exige valor previo coincidente, razón de hasta 240 caracteres y origen humano. El historial conserva objetivo, valor previo, nuevo, `delta_minutes`, motivo, timestamp, procedencia y una copia `replaced_segments` de las contribuciones sustituidas. El delta puede ser negativo; ningún segmento ni total puede serlo. Los eventos originales no se mutan y las correcciones previas no se borran. Actividad posterior, tras una reanudación explícita, agrega intervalos nuevos; una siguiente corrección parte de ese estado efectivo. No se inventa a qué intervalo corresponde un ajuste global ni se le asignan timestamps de actividad ficticios. Un motivo textual que nombre un segmento no convierte la corrección en selectiva ni prueba que afecte ese segmento.
9. Después de `CLOSED` sólo se admiten correcciones y declaraciones offline referidas a intervalos anteriores al cierre. Reiniciar actividad requiere otra sesión. Una sesión pausada sigue `OPEN`, con pausa abierta, porque no existe estado `PAUSED` en el contrato solicitado.
10. Las duraciones de intervalos se redondean a seis decimales de minuto. El total se calcula siempre como la suma numérica de las contribuciones efectivas, sin otro redondeo que cree un total distinto. Los ajustes conservan el valor humano recibido y la resta numérica entre nuevo y previo. Se usa aritmética numérica JavaScript; sus decimales no acreditan precisión de la observación.

### Invariante de segmentos efectivos

`active_minutes = suma de segments[].minutes`. El schema identifica `minutes` como la única contribución al total. `segments` contiene exclusivamente el estado efectivo: intervalos `INTERVAL` no reemplazados y ajustes `ADJUSTMENT` vigentes. Las copias en `corrections[].replaced_segments` y los deltas son historia; no se suman otra vez. Ejemplo: 10 → 7 → 9 deja un ajuste efectivo de 9, dos correcciones con deltas −3 y +2 y copias históricas que conservan las contribuciones de 10 y 7.

La validación cruzada TypeScript comprueba la igualdad, unicidad de IDs, deltas, valores previos, correspondencia del ajuste con su corrección y reconstrucción del estado efectivo por orden de eventos. También mantiene la comprobación de superposición sobre los intervalos originales, incluidos los ya sustituidos: una corrección a cero no habilita volver a declarar el mismo intervalo. La procedencia manual, estimada y offline permanece en las copias históricas; cada ajuste conserva su propia procedencia humana declarada. Se reemplaza así la decisión anterior que permitía discrepancias entre el total y los segmentos expuestos.

## Confianza temporal

- `ALTA`: sesión cerrada con tiempo positivo compuesto sólo por intervalos manuales y sin cortes.
- `MEDIA`: sesión cerrada con tiempo positivo que incluye estimación de chat, sin tiempo declarado/correcciones ni cortes.
- `BAJA`: sesión abierta o provisional, cero minutos, presencia de cortes, tiempo offline o correcciones humanas.

Es una regla conservadora de esta versión sobre la procedencia temporal. No mide credibilidad personal, esfuerzo, calidad, capacidad ni certeza académica. Ninguna duración dispara una nota, una inferencia o una actualización de competencia.

## Privacidad y exportación

Los eventos no tienen campos para mensajes, conversaciones, teclas, ventanas o telemetría. Sólo admiten referencias acotadas (`thread_id`, `artifact_ref`, `task_id`, `competency_ids`) y una nota opcional de hasta 240 caracteres. Las referencias y razones también tienen límites. No se resuelven URLs ni se abren artefactos referenciados. Los límites estructurales no detectan datos personales introducidos dentro de una nota permitida: quien registra debe mantenerla mínima y sin transcripciones.

El resumen completo es para observación local, no para entregarlo directamente a la evaluadora. La función `exportForEvaluator` construye una proyección por lista permitida:

- `BLIND` por defecto: exactamente `{ "visibility": "BLIND", "temporal_data_withheld": true }`. Ambos valores son constantes; no contiene identificadores, referencias, notas, procedencia ni ningún string controlado por el productor. No se sanitizan identificadores: se excluyen por completo. La definición `blindExport` de `study-session.schema.json` rechaza propiedades adicionales y valores diferentes; `validateBlindExport` aplica ese contrato y el exportador devuelve un objeto congelado.
- `TIMED_TASK`: sólo si el inicio contiene una declaración explícita con `task_id`, referencia de consigna, `time_declared: true` y `authorized_fields`. Expone únicamente los campos temporales enumerados: `active_minutes`, `started_at`, `ended_at`, `pauses`, `mode` o `confidence`. Las pausas exportadas omiten los IDs de procedencia. La referencia de consigna se conserva; no se lee ni se verifica semánticamente su contenido. No existe un flag CLI que convierta una sesión ciega en cronometrada.

La asociación entre sesión y evaluación pertenece a la capa llamadora o a un ledger futuro, fuera del payload visible para la evaluadora ciega. No se implementa un ledger en esta corrección. Sesiones materialmente distintas producen la misma exportación `BLIND` incluso si sus identificadores codifican tiempo. Para `TIMED_TASK` permanece el comportamiento auditado y la limitación aceptada: autorización estructural no autenticada, sin firma ni lectura de la consigna. No se modifica el contrato fundacional de evaluación ni se conecta automáticamente su `execution_metadata`. El consumidor debe usar la proyección, sin adjuntar el resumen completo o metadatos que reintroduzcan el canal lateral.

## Reproducción y límites

El motor es una función determinista de eventos y opciones, sin reloj real, red, escritura persistente ni tareas en segundo plano. La CLI lee el archivo indicado y escribe stdout/stderr. Se rechazan propiedades desconocidas y entrada inválida sin producir un resumen parcial. Los eventos y sus copias anteriores deben conservarse en archivos por quien opere el sistema; aquí no hay ledger, sellado o almacenamiento automático.

Una sesión sin evento posterior no se cierra por inactividad: detectar la brecha requiere otra entrada. La disponibilidad de zonas horarias depende de los datos de `Intl` del runtime. No se verifican veracidad de declaraciones, contenido de referencias ni actividad fuera del registro. Drive/Sheets, auditoría mensual, interfaz y captura automática quedan pendientes.

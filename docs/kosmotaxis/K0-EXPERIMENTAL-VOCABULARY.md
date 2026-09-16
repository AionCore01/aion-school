# Kosmotaxis · vocabulario de trabajo

Estado: EXPERIMENTAL. Propuesta K0.1. No es un schema, contrato ni API estable. Nombres y relaciones pueden cambiar durante la calibración, sin compatibilidad prometida. No se añaden al registro de contratos ni se ejecutan.

## Eventos propuestos

| Nombre EXPERIMENTAL | Qué expresaría | Qué no demuestra |
|---|---|---|
| BLOCK_DEFINED | Objetivo, límites, aceptación y revisión del bloque | Recomendación o ejecución |
| ROUTE_RECOMMENDED | Perfil propuesto, modelo recomendado si se conoce, nivel propuesto y fundamento observable | Selección, ejecución o acierto |
| ROUTE_SELECTED | Decisión efectiva, selector con fuente propia, modelo/nivel seleccionados y restricciones | Uso efectivo de esa ruta |
| EXECUTION_STARTED | Inicio acreditado y ejecutor/modelo/nivel observados cuando se conozcan | Respeto de la selección o finalización |
| BLOCK_COMPLETED | Resultado declarado, referencia de artefacto y verificaciones con fuente separada | Aceptación auditada o cumplimiento real de todos los criterios |
| BLOCK_ESCALATED | Obstáculo, evidencia, ruta previa y nueva propuesta o decisión con estado de adopción | Fracaso automático, selección o ejecución nuevas |
| AUDIT_RECORDED | Dictamen referenciado, alcance, fuente, límites y resultado revisado | Independencia del auditor sin evidencia |
| BLOCK_CLOSED | Disposición: aceptado, cancelado o sustituido; autoridad y pendientes | Éxito de cualquier salida o imposibilidad de revisión posterior |

No se impone una máquina de estados implementada. Puede haber recomendaciones alternativas, selecciones distintas, verificaciones fallidas y auditorías posteriores. Completar no es cerrar. Una revisión conserva el cierre previo y la nueva evidencia; si cambia el objetivo se vincula otro bloque.

## Procedencia propuesta

Cada anotación distinguiría referencia opaca propia, bloque y revisión, versión del vocabulario, momento conceptual, fuente de la afirmación, actor declarado y actor acreditado si difieren, referencias opacas de evidencia, límites y relación con anotaciones anteriores. Autor de la anotación, recomendador, selector, ejecutor y auditor son roles distintos aunque los ocupe una misma persona.

La anterioridad requiere evidencia propia: referencia a versión preservada y constancia de orden revisable en un futuro procedimiento manual. K0 no implementa sellado, ledger, autenticación ni timestamps de eventos. No importa marcas o duraciones de Pez en el agua. Una referencia no se resuelve automáticamente ni se considera verificada por existir.

Modelo recomendado, seleccionado y observado en ejecución se conservan separados. También perfil de capacidad, nivel solicitado, nivel observado y disponibilidad/restricción operativa. La disponibilidad no acredita idoneidad. Las discrepancias no se completan a partir del nombre comercial, del estilo de salida ni de la recomendación.

## Estatuto de afirmaciones y UNKNOWN

- HECHO VERIFICADO: observación concreta con fuente inspeccionada y alcance explícito.
- DECLARACIÓN DISPONIBLE: la fuente afirma algo sin corroboración independiente en este registro.
- INFERENCIA RETROSPECTIVA: interpretación posterior con premisas y límites; no se convierte en evento histórico.
- UNKNOWN: falta evidencia suficiente; no equivale a un valor negativo ni a que algo no ocurrió.

Permanecen UNKNOWN sin fuente: selector, ejecutor, modelo usado, nivel, motivo de cambio, disponibilidad histórica, anterioridad de recomendación e independencia de auditoría. Puede conocerse selección y desconocerse ejecución. Corregir procedencia conserva la afirmación previa y la nueva fuente.

## Ejemplo hipotético, no ejecutable

Ante un contraejemplo de software se podría recomendar análisis de invariantes. Modelo recomendado: UNKNOWN si no se propone uno. Selección y ejecución siguen UNKNOWN. Si luego una fuente acredita una selección, se registra sin completar el modelo ejecutado. Un artefacto demuestra su existencia, no quién lo produjo.

Un dictamen sobre otra transición vulnerable podría motivar BLOCK_ESCALATED hacia revisión adversarial. Es propuesta hasta que una selección independiente quede acreditada. Sólo referencias opacas y síntesis mínima del obstáculo, sin copiar prompt, código o dictamen. El ejemplo no es prueba de Kosmotaxis ni fixture.

## Ambigüedades abiertas

Granularidad útil de los bloques, trabajo intercalado, evidencia mínima de ejecución y anterioridad compatible con privacidad, e independencia parcial de auditorías. Falta contrastar si las categorías separan necesidades reales o sólo renombran desenlaces. No resolver creando campos obligatorios o algoritmos en K0. Futuras revisiones identificarán qué cambia y por qué, sin prometer migración automática.

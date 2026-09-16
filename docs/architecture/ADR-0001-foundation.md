# ADR-0001 · fundamento ejecutable local

Fecha: 2026-09-15. Estado: adoptado para la misión fundacional; no implica aprobación académica de una evaluadora.

## Contexto y fuentes

Se leyeron completos la misión, el Manifiesto y la Especificación 0.1 antes de implementar. Manifiesto y Especificación coinciden byte por byte con sus copias originales disponibles en la raíz. La Misión conserva un hash registrado, pero el repositorio no contiene el ZIP original ni una segunda copia independiente que permita verificar su igualdad histórica. No se detectó trabajo previo incompatible.

No se detectaron contradicciones directas entre Manifiesto y Especificación. Las siguientes delimitaciones se registran explícitamente para evitar convertir decisiones de implementación en normas académicas nuevas.

## Decisiones

1. **Stack:** Node.js + TypeScript estricto + npm. AJV y ajv-formats validan Draft 7 y fechas; YAML carga la rúbrica. `node:test` evita otro framework y TypeScript compila CLI y pruebas. Dependencias locales exactas y lockfile; sin monorepo ni instalación global.
2. **Versiones:** misión/especificación 0.1; contratos y rúbrica ejecutable 1.0.0. Cada schema tiene `$id` bajo `https://aion.school.local/schemas/v1/`. Son identificadores lógicos, no servicios ni dominios que se consulten. AJV resuelve referencias registradas localmente.
3. **Entrada tolerante a ausencia esencial:** `task_brief`, `submission`, `rubric`, `rubric_id` y `rubric_version` pueden faltar/ser null exclusivamente para emitir NO_EVALUABLE. Si `submission` existe pero `content` falta, es null o está en blanco, llega al preflight como `MISSING_SUBMISSION`. Tipos erróneos, propiedades ajenas y otros metadatos obligatorios ausentes son errores de schema. No se corrige silenciosamente la entrada.
4. **Rúbrica incorporada:** el paquete incluye una copia de la rúbrica y criterios seleccionados, además de su referencia. El preflight comprueba coincidencia de ID/versión, unicidad de criterios y pertenencia de seleccionados. Esto no implementa un ledger ni impide por sí mismo manipular el contenido conservando una versión.
5. **Niveles 1 y 3:** la especificación §8 los remite a rúbricas específicas, mientras la misión exige completar todos los niveles comunes. Se cumplen los 60 descriptores como base común de esta misión. Su especialización por actividad sigue pendiente y no puede introducir exigencias retrospectivas. Ningún score se aplica automáticamente; ausencia de evidencia en un paquete incompleto no recibe cero.
6. **Modos y estados:** el contrato admite los siete modos de §4; el ejemplo de §5 enumera cuatro. Esto modela vocabulario, no implementa esos modos. Estados de competencia normalizados a INTRODUCIDA, EN_PRÁCTICA, DEMOSTRADA y TRANSFERIDA según §9. Cambios sólo propuestos y provisionales, nunca ejecutados por preflight.
7. **Salida parcial e invariantes cruzadas:** se agrega `preflight_only` para no inventar una evaluación `completed`. Resultado/confianza/repair_task pueden ser null; para preflight no se permiten puntuaciones, hallazgos ni actualizaciones. Una validación explícita TypeScript complementa JSON Schema: limita la confianza final al techo del preflight; vincula bidireccionalmente `NO_EVALUABLE`; exige criterios y evidencia localizada para `COMPETENTE`; prohíbe bloqueadores con ese resultado; obliga a `REHACER` ante cualquier hallazgo crítico; exige IDs únicos en `evaluation-result.criteria`; y rechaza resúmenes vacíos en `completed`. Estas reglas comprueban coherencia entre campos, no la calidad semántica de los juicios. Hallazgo agrega `decision` para conservar la cuarta capa de §7.
8. **Controles y procedencia:** seis controles son obligatorios antes de `LISTO` o `LISTO_CON_ADVERTENCIAS`: legibilidad, ausencia de truncamiento, materiales disponibles, correspondencia con la tarea, completitud semántica de la consigna, y criterios/restricciones informados. Cada declaración lleva `PASS`, `FAIL` o `NOT_CHECKED`, clase de fuente (`SYSTEM`, `HUMAN_REVIEW` o `AUTHORIZED_COMPONENT`), referencia y fecha. Ausencia, `FAIL` o `NOT_CHECKED` bloquean. El preflight conserva las declaraciones y decide determinísticamente sobre ellas; no afirma haber realizado la revisión humana o semántica. Una fuente externa declarada disponible genera advertencia y techo de confianza media, sin culpa para la estudiante. Metadatos temporales no crean un cronómetro.
9. **Apelación no disponible:** el contrato representa `available: false` con `rubric_frozen_at: null`. El validador de esta versión rechaza `available: true`, incluso si se aporta una referencia, hasta que existan congelación real, revisión y persistencia. No se implementa el procedimiento de apelación.
10. **Versiones y criterios:** `rubric_version` implementa SemVer 2.0.0, incluidos prerelease y metadata. La unicidad de `criterion_id` en rúbricas y en `evaluation-result.criteria` se valida explícitamente en TypeScript porque JSON Schema Draft 7 no puede expresar unicidad por una propiedad interna de objetos distintos.
11. **CLI:** inválido=1; insumo esencial faltante=2; resto=0, incluso NO_EVALUABLE por fallo del sistema. El consumidor debe leer el estado, según la condición estricta de la misión. No se resuelven referencias externas ni se ejecuta texto del paquete.
12. **Determinismo:** mismos datos y timestamp producen la misma salida. La CLI registra la hora real; el núcleo permite inyectarla en pruebas. Sin aleatoriedad, modelos ni red durante la ejecución.
13. **Git:** repositorio inicializado en la rama real `master`; se consultó la identidad existente sin modificarla. Sin commit: la solicitud autoriza el fundamento local, y no se necesita un commit para probarlo. Contratos versionados por archivo/identificador, aún sin instantánea commit.

## Límites y decisiones pendientes

- Confirmar descriptores específicos por actividad y evidencia esperada antes de aplicar puntuaciones. No hay ponderaciones, promedio ni umbrales de aprobación inventados.
- Reglas de compuertas, reducción tras dos fallos comparables, correspondencia entre hallazgos y criterios, fundamentación del resumen, satisfacción de producción abierta y revisión humana necesitan validación semántica futura. El schema sólo comprueba estructura y algunas condiciones explícitas (p. ej., transferencia exige declarar problema nuevo y sin guía central).
- El contrato de salida conserva la forma futura de apelación, deshabilitada y sin referencia congelada; no implementa apelaciones, ledger, hashing, sellado ni verificación histórica. Diagnóstico y calibración no tienen motor de transición.
- Una referencia de fuente/artefacto no garantiza disponibilidad. El preflight mínimo no interpreta archivos externos, determina completitud conceptual ni detecta fuentes inventadas.
- La amplitud de la Especificación §18 pertenece a la futura evaluadora. La misión actual termina antes de extracción, juicio, registro de fallos y actualización efectiva.
- Si aparece contradicción normativa futura, registrarla aquí como PENDIENTE con los pasajes afectados y detener sólo la decisión incompatible.

## Consecuencia

Existe un fundamento pequeño, inspeccionable y ejecutable sin infraestructura externa. Los contratos válidos no certifican veracidad, justicia evaluativa ni idoneidad oficial.

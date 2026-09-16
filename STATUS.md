# Estado comprobado · misión fundacional v0.1

Fecha: 2026-09-15. Proyecto local: `C:\Users\nucle\aion-school`.

**Resultado:** fundamento determinista implementado y probado. No existe todavía una evaluadora de desempeño ni un campus. AION es una escuela personal, independiente y no oficial.

## Implementado

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

## Probado: resultados reales

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
- Campus, usuarios, cronómetro, currículo, tutores, modelos/servicios externos, credenciales, base de datos, despliegue y publicación: excluidos y ausentes.

## Pendiente y continuidad

- Especializar y revisar criterios antes de puntuar una actividad; detalles de interpretación y límites en el ADR.
- Próximo incremento único propuesto en `NEXT.md`: un caso local de calibración con dictamen manual. **No iniciado**.
- La corrección queda lista para reauditoría; la decisión de crear el primer commit sigue reservada a esa revisión y a autorización humana.

## Git

Repositorio inicializado; rama verificada: **master**, sin commits. Identidad existente consultada y preservada, sin reproducir datos personales aquí. No se creó commit, no se agregó contenido al índice ni se configuró publicación. Los archivos permanecen sin seguimiento; `node_modules/` y `dist/` están ignorados. Los contratos tienen versiones explícitas, todavía sin instantánea en un commit.

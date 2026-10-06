# Custodio AION · protocolo operativo v0.1

Estado: **PROVISIONAL OPERATIVO**. Este documento gobierna la continuidad del trabajo; no define todavía el currículo ni implementa una app.

## Propósito

Custodio protege la secuencia del proyecto. No enseña, no evalúa desempeño, no decide contenido académico y no reemplaza autoridad humana. Su función es mantener visible qué objetivo está activo, qué está permitido tocar, qué evidencia permite cerrar un checkpoint y qué ideas deben esperar.

Regla central:

> No se abre el checkpoint siguiente por entusiasmo, comodidad o aparición de una idea nueva. Se abre cuando el checkpoint activo satisface sus condiciones de salida o cuando una replanificación explícita queda registrada.

## Separación de carriles

Toda tarea o idea nueva se clasifica antes de ejecutarse:

- `GOBERNANZA`: continuidad, checkpoints, decisiones, trazabilidad.
- `CURRICULO`: capacidades de egreso, áreas, materias, secuencia.
- `CONTENIDO`: materiales de aprendizaje concretos.
- `PEDAGOGIA_TUTORIA`: cómo se enseña y cómo adapta apoyo el Tutor.
- `EVALUACION`: rúbricas, Evaluadora, calibración y auditoría.
- `INVESTIGACION`: evidencia externa usada para decidir.
- `CODIGO`: implementación, contratos, pruebas e infraestructura local.
- `CAMPUS_GRUPO`: interacción interpersonal y grupal.
- `APP_INFRA`: integración ChatGPT/MCP, servicios, persistencia y despliegue.

Una idea fuera del carril activo se registra en backlog. No cambia por sí sola el objetivo del día.

## Estados de checkpoint

`PENDIENTE -> EN_TRABAJO -> EVIDENCIA_REUNIDA -> REVISADO -> DECIDIDO -> CONGELADO`

`BLOQUEADO` puede coexistir con cualquier estado no final y debe registrar la causa.

Cada checkpoint debe declarar objetivo, perímetro permitido, fuera de alcance, artefactos esperados, evidencia mínima de cierre, decisiones abiertas, estado y fecha/referencia de cierre.

## Ritual diario

### Check-in

Al iniciar una sesión:

1. Pez en el agua registra el inicio temporal cuando exista integración disponible.
2. Custodio lee el checkpoint activo y el último cierre.
3. Emite una **Orden de trabajo diaria** con objetivo primario único, carril activo, entregable esperado, condición de terminado, tareas explícitamente bloqueadas y referencias necesarias.
4. Cualquier desvío se captura como backlog, salvo replanificación explícita.

### Durante la sesión

Custodio no interrumpe por cada idea. Sólo actúa cuando una acción propuesta cambia de carril, adelanta un checkpoint, contradice una decisión congelada, pretende convertir investigación en doctrina sin decisión o mezcla contenido, código o evaluación sin trazabilidad.

En esos casos: `CONTINUAR / APARCAR / REPLANIFICAR / BLOQUEAR`.

### Check-out

Al cerrar:

1. Pez en el agua cierra o pausa la sesión temporal.
2. Se registra qué se hizo realmente, no lo planificado.
3. Se listan artefactos y evidencia producida.
4. Se separan decisiones tomadas de hipótesis e ideas.
5. Se actualiza el estado del checkpoint sólo si cumple la condición de salida.
6. Custodio propone el próximo objetivo, pero no lo declara cerrado por anticipado.

## Checkpoints curriculares iniciales

Estos checkpoints ordenan el trabajo descubierto el 2026-10-06. No congelan sus respuestas.

- **CP-00 · Gobierno operativo:** Custodio, procedencia de materiales y backlog visibles.
- **CP-01 · Definición operacional:** qué significa “formación en inteligencia” para AION.
- **CP-02 · Capacidades de egreso:** qué debe poder demostrar una persona formada por AION.
- **CP-03 · Arquitectura de capas:** separar tronco común, capacidades transversales, especializaciones, optativos y fuera de alcance.
- **CP-04 · Autoconocimiento:** decidir su lugar por función y evidencia pertinente, sin derivarlo de su frecuencia en currículos ajenos.
- **CP-05 · Familias curriculares:** traducir capacidades y conocimientos a áreas/materias provisionales.
- **CP-06 · Estrategia de materiales:** decidir qué crea, selecciona, recomienda o sólo investiga AION.
- **CP-07 · Mapeo formativo:** vincular currículo con ejercicios, Tutoría y Evaluadora.
- **CP-08 · Secuencia:** prerrequisitos, niveles, rutas y autonomía progresiva.
- **CP-09 · Piloto mínimo:** diseñar una implementación acotada.
- **CP-10 · Auditoría:** medir, revisar y decidir si escalar.

CASE-P03, Campus, capa afectiva, automatización de Pez en el agua y otras líneas existentes permanecen conservadas. Custodio decide cuándo vuelven al carril activo; no se consideran canceladas.

## Autoridad

- Una decisión normativa requiere registro explícito; Custodio no la inventa.
- Investigación externa informa decisiones, pero no las sustituye.
- Una frecuencia observada en programas de terceros es evidencia descriptiva, no una regla automática para AION.
- La revisión humana conserva autoridad final.

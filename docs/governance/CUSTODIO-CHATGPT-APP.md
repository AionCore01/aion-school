# Custodio como plugin/app de ChatGPT · diseño de integración v0.1

Estado: **FACTIBILIDAD DOCUMENTADA; NO IMPLEMENTADO**.

## Hipótesis de producto

Custodio puede materializarse como un plugin/app de AION invocable desde ChatGPT, con herramientas MCP y una interfaz opcional. El estado duradero debe vivir en almacenamiento controlado por AION; la UI del chat no debe ser la única fuente de verdad.

Referencias oficiales consultadas el 2026-10-06:

- https://developers.openai.com/plugins
- https://developers.openai.com/plugins/build/chatgpt-ui
- https://developers.openai.com/plugins/build/mcp-events
- https://help.openai.com/en/articles/20001256-plugins-in-chatgpt
- https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt

## Flujo objetivo

`CHECK_IN -> PEZ_EN_EL_AGUA -> CUSTODIO -> ORDEN_DIARIA`

`CHAT / CODEX / INVESTIGACION -> ARTEFACTOS + EVIDENCIA -> CUSTODIO`

`CHECK_OUT -> INFORME_DEL_DIA -> ESTADO_CHECKPOINT -> PROPUESTA_SIGUIENTE`

## Herramientas MCP candidatas

Primera versión conceptual, no contrato final:

- `get_active_checkpoint`
- `start_day`
- `classify_new_item`
- `record_evidence`
- `park_backlog_item`
- `request_replan`
- `close_day`
- `get_material_registry`
- `register_material`

Las acciones que cambien estado deben ser explícitas y auditables.

## Persistencia

Separar:

- datos autoritativos: servidor/almacenamiento AION;
- estado de presentación: widget de ChatGPT;
- artefactos normativos y decisiones congeladas: repositorio versionado;
- eventos temporales: Pez en el agua, sin convertir duración en puntuación.

Git puede conservar normas, decisiones y snapshots, pero no conviene usar commits como base de datos transaccional de cada interacción diaria.

## Automatización

No asumir “se ejecuta automáticamente al abrir ChatGPT”. El diseño base requiere check-in explícito o una tarea programada/evento compatible. Las tareas programadas de ChatGPT pueden servir para recordatorios o aperturas diarias cuando estén disponibles; MCP Events puede servir más adelante para eventos emitidos por AION en superficies compatibles.

## Fases

1. **Ahora:** gobernanza documental en repo.
2. **Después:** prototipo local de herramientas Custodio sin UI.
3. **Luego:** MCP remoto con persistencia y autenticación.
4. **Luego:** UI dentro de ChatGPT para check-in, checkpoint y cierre.
5. **Sólo tras auditoría:** automatizaciones/eventos.

No se implementa ninguna de estas fases técnicas en este incremento.

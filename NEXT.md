# Próximo objetivo de diseño · Evaluadora

**Seleccionar el siguiente caso semántico de calibración con mayor poder discriminativo que CASE-P02.**

CASE-P02 ya fue implementado, aceptado como caso mínimo manual y publicado bajo `v0.3.0-case-p02`; su cierre está en `docs/calibration/CASE-P02-AUDIT-RESULT.md`. El próximo paso es comparar candidatas, sin diseñar todavía P03 completo ni iniciar un experimento.

El próximo caso debería:

- Evitar una respuesta donde el nivel correcto sea casi tautológico.
- Introducir una frontera semántica razonable entre dos adjudicaciones posibles.
- Preservar evaluación ciega antes de revelar el resultado congelado.
- Mantener separación entre implementación y auditoría.
- Explorar al menos una zona donde la norma requiera juicio real.
- Considerar `SEVERITY_POLICY_UNDERSPECIFIED` como hallazgo de diseño, sin asumir todavía que severidad deba ser el foco.

**Decisión PENDIENTE:** comparar varias candidatas antes de elegir el próximo experimento. Esta continuidad no selecciona un caso, no fija su dictamen ni autoriza su ejecución.

Tutoría queda posterior a consolidar mejor la Evaluadora y el modelo pedagógico; no se inicia todavía. Drive/Sheets, auditoría mensual e interfaz permanecen pendientes fuera de este objetivo. Sin campus, proveedor externo, credenciales ni ejecución de IA desde el repo. Se requiere una nueva solicitud para iniciar el trabajo de diseño.

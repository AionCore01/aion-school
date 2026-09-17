# ADR-0004 · Evidencia prospectiva manual de Kosmotaxis

Estado: PROPUESTO para revisión conceptual K0.1. No sustituye ADR-0003 ni autoriza K1.

## Contexto

K0 deja abiertas granularidad, separación de momentos, independencia parcial y anterioridad compatible con privacidad. CASE-P01 preserva una recomendación documental y criterios de salida, pero no acredita selección efectiva, modelo ejecutado ni independencia. Diseñar el mecanismo usando ese mismo caso introduce circularidad.

## Decisión propuesta

Adoptar para futuros casos autorizados el [protocolo prospectivo manual](../kosmotaxis/K0.1-PROSPECTIVE-MANUAL-PROTOCOL.md) como guía experimental, después de revisión y acuerdo de condiciones. No convertirlo en schema estable ni procedimiento ejecutable.

- Delimitar bloques por objetivo, aceptación, evidencia necesaria y autoridad; separar operaciones mecánicas y subbloques. Cambio material exige sucesor; cambio de ejecutor o escalamiento puede conservar el bloque. Revisiones de cierre preservan el original.
- Separar evento declarado, estado derivado, observación, recomendación, decisión, ejecución, resultado, verificación y auditoría. Los rótulos compuestos de K0 no sirven por sí solos como prueba de todas sus partes.
- Describir independencia por actor, modelo, contexto, misión/incentivo, fuente, autoridad de modificación y participación previa. Separación funcional puede bastar para una comprobación local; no acredita independencia de procedencia.
- Usar Git sólo para la prueba de contenido y orden documental que permite inspeccionar. Para calibración válida conservar la exigencia K0 de evidencia independiente de recomendación previa a selección y ejecución; no resolverla con fechas o autoría Git.
- Minimizar referencias y síntesis, acordar acceso y retención por hitos, y suspender donde privacidad y trazabilidad sean incompatibles. No implementar almacenamiento ni acceso.
- Acordar contraste negativo antes de cada caso; distinguir fallos de ejecución, cápsula, selección, política, restricción externa y resultado no concluyente. Admitir simplificación, suspensión y abandono sin scores.

## Alternativas y razones

| Alternativa | Tratamiento propuesto |
|---|---|
| Un bloque por misión o por comando | Descartar como regla general: oculta decisiones separables o produce registro sin utilidad |
| Tratar escalamiento/completado como hechos indivisibles | Descartar: confunde obstáculo, propuesta, adopción y prueba |
| Independencia binaria o exigencia absoluta para toda revisión | Descartar: oculta coincidencias relevantes o impide comprobaciones funcionales legítimas |
| Commit previo como prueba suficiente de ejecución posterior | Descartar: confunde orden documental con orden real y custodia independiente |
| Importar tiempo, conversaciones o identidad para resolver el orden | Descartar: excede el alcance y vulnera minimización |
| Exigir Git en cualquier entorno | Descartar: puede ser insuficiente o revelar metadatos; custodia manual separada es candidata, no infraestructura implementada |
| Automatizar ahora las reglas | Descartar: todavía no se ha contrastado su utilidad ni operabilidad |
| Mantener exploración manual rotulada y UNKNOWN explícito | Proponer: permite observar límites sin declarar calibración válida ni rebajar K0 |

## Consecuencias y límites

La propuesta ofrece reglas discutibles antes del desenlace y conserva resultados negativos. Puede aumentar carga y requerir simplificación. Una referencia opaca no autentica una fuente; su resolución puede revelar datos. Borrar un archivo de Git no garantiza eliminar su historia. La guía no proporciona controles técnicos de acceso, autenticación ni borrado.

CASE-P01 se utiliza sólo para examinar aplicabilidad conceptual, no para validar eficacia. Su prerregistro permanece inmutable; no se completan PENDING ni se atribuye selección por la presencia del ejecutor. Otra intervención registrará el resultado después y describirá su separación real. Los criterios nuevos del protocolo no se aplican retroactivamente como prerregistro de P01. Un caso autorreferencial no valida generalización.

No se detecta necesidad de modificar fuentes normativas, contratos ni evaluación para formular esta propuesta. La posible tensión entre aceptar Git y exigir evidencia independiente del orden se conserva como decisión pendiente de suficiencia por caso: Git solo no resuelve G5. Si aparece una contradicción con K0, debe declararse y elevarse; este ADR propuesto no tiene autoridad para modificarlo.

## Decisiones pendientes y compuerta K1

La tabla del protocolo §10 es la lista explícita de condiciones necesarias. G1 revisión conceptual, G2 granularidad, G3 separación de momentos, G4 separación revisora, G5 anterioridad, G6 privacidad/acceso/retención, G7 refutación/utilidad, G8 bloque futuro y G9 autorización permanecen sin cierre suficiente. G5 tiene evidencia parcial del orden Git; no prueba suficiente del orden real. Las demás soluciones documentales son propuestas, no validaciones.

La revisión conceptual puede continuar. Casos manuales exploratorios requieren acuerdo previo de sus fuentes y condiciones; si faltan privacidad o acceso, no se abren. Una exposición no contenible o la imposibilidad de observar con privacidad puede suspender todo el experimento. K1 sigue pendiente de resolver todas las compuertas y de una nueva autorización humana; ésta tampoco autorizaría automáticamente implementación, integración o selección automática de modelos.

## Verificación documental prevista

Comprobar rama/HEAD y limpieza inicial, preservar el prerregistro byte por byte, limitar cambios a los cinco archivos documentales autorizados, revisar estatutos probatorios y enlaces, ejecutar `git diff --check` e inspeccionar estado final. No ejecutar suite al no cambiar código. Los resultados efectivamente obtenidos se informan en la entrega; este apartado no los anticipa.

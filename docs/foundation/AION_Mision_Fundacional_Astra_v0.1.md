# AION School | Misión fundacional para GPT-6 Astra

## Rol

Actuá como arquitecto principal y primer implementador de AION School, una escuela personal, independiente y no oficial orientada al desarrollo y demostración de capacidades compatibles con tareas profesionales de análisis e inteligencia.

Los archivos `AION_Manifiesto_Criterio_Academico.md` y `AION_Especificacion_IA_Evaluadora_v0.1.md` son fuentes normativas. Preservalos sin reescribir su contenido. Si detectás una contradicción entre ambos, registrala como decisión pendiente; no la resuelvas silenciosamente.

## Objetivo de esta intervención

Crear el fundamento ejecutable y versionable del proyecto. Esta misión termina con contratos validados, una primera vertical determinista funcionando y documentación de continuidad. No construyas todavía el campus visual ni conectes modelos de IA.

## Condiciones del entorno

- Windows 11 y VS Code.
- Equipo de recursos modestos: priorizar herramientas livianas y tiempos de instalación razonables.
- Usar Node.js, TypeScript y `npm`; evitar monorepos y dependencias innecesarias.
- El sistema debe ser local-first en esta etapa.
- No usar servicios pagos, bases de datos externas, API keys ni autenticación.
- No instalar globalmente herramientas si una dependencia local o `npx` alcanza.
- No modificar otros proyectos o directorios.

## Método obligatorio

1. Inspeccioná el directorio actual y confirmá que es el proyecto correcto.
2. Si contiene trabajo previo, preservalo y adaptá el plan; no sobrescribas archivos.
3. Presentá un plan breve antes de las modificaciones.
4. Implementá en cambios pequeños y verificables.
5. Ejecutá las pruebas pertinentes.
6. Terminá con un informe de archivos creados, comandos ejecutados, resultados, riesgos y siguiente paso recomendado.

No detengas la misión por decisiones rutinarias. Preguntá solamente si una elección cambia materialmente el alcance, puede destruir trabajo existente o requiere credenciales/permisos nuevos.

## Alcance requerido

### 1. Repositorio y memoria operativa

Crear o completar:

```text
AGENTS.md
README.md
STATUS.md
NEXT.md
docs/
  foundation/
  architecture/
    ADR-0001-foundation.md
schemas/
rubrics/
src/
  contracts/
  preflight/
tests/
  fixtures/
  acceptance/
```

- Copiar los dos documentos normativos a `docs/foundation/` sin alterar su texto.
- `AGENTS.md` debe convertir sus reglas esenciales en instrucciones operativas para futuros agentes.
- `STATUS.md` debe describir sólo lo realmente implementado y probado.
- `NEXT.md` debe contener el siguiente incremento pequeño, no una lista infinita.
- `ADR-0001-foundation.md` debe registrar las decisiones de stack, límites y razones.

Si no existe repositorio Git, inicializalo. No inventes ni cambies `user.name` o `user.email`. No hagas commit si la identidad no está configurada; informalo al final.

### 2. Contratos versionados

Implementar JSON Schemas válidos para:

- `evaluation-request.schema.json`
- `evaluation-result.schema.json`
- `finding.schema.json`
- `rubric.schema.json`
- `competency-update.schema.json`

Los schemas deben incluir identificadores, versión, campos obligatorios, enumeraciones, límites básicos y rechazo de propiedades desconocidas donde corresponda.

No agregues datos personales que no sean necesarios para evaluar la tarea.

### 3. Rúbrica común

Crear `rubrics/common-rubric.v1.yml` con las doce dimensiones definidas en la especificación:

`EV`, `FI`, `HA`, `RC`, `IN`, `CF`, `ST`, `TR`, `LT`, `TC`, `RV`, `AU`.

Completar descriptores observables para los niveles 0, 1, 2, 3 y 4. Evitar adjetivos vagos como “bueno”, “excelente” o “pobre” sin conducta asociada.

### 4. Primera vertical determinista

Implementar sin llamadas a modelos:

- carga y validación de un paquete de evaluación;
- preflight con estados `LISTO`, `LISTO_CON_ADVERTENCIAS` y `NO_EVALUABLE`;
- detección mínima de ausencia de consigna, rúbrica o producción;
- validación de una salida estructurada contra su schema;
- CLI local simple para ejecutar el preflight sobre un fixture.

La CLI debe mostrar un resultado legible y devolver código de salida distinto de cero sólo cuando el paquete sea inválido o `NO_EVALUABLE` por falta de un insumo obligatorio.

### 5. Pruebas

Crear fixtures y pruebas automatizadas para, como mínimo:

1. paquete válido → `LISTO`;
2. falta la producción → `NO_EVALUABLE`;
3. falta la rúbrica → `NO_EVALUABLE`;
4. advertencia no atribuible a la estudiante → `LISTO_CON_ADVERTENCIAS`;
5. propiedad desconocida prohibida → falla de schema;
6. resultado con hallazgo sin localizador de evidencia → falla de schema.

Dejar documentados, sin fingir que están implementados, los diez casos semánticos de aceptación contenidos en la especificación para una fase posterior con evaluadora real.

### 6. Calidad y cierre

Configurar scripts mínimos:

```text
npm test
npm run typecheck
npm run validate:fixtures
```

Ejecutarlos y registrar el resultado real en `STATUS.md`.

No construir en esta misión:

- interfaz del campus;
- sistema de usuarios;
- cronómetro;
- contenido curricular;
- tutores por área;
- conexión con OpenAI, Gemini u otros proveedores;
- base de datos;
- despliegue o publicación.

## Criterios de aceptación

La misión queda completa cuando:

- los documentos normativos están preservados;
- los cinco schemas validan;
- la rúbrica común contiene descriptores 0–4 observables;
- la vertical de preflight funciona por CLI;
- las seis pruebas mínimas pasan;
- `STATUS.md` diferencia implementado, probado, no probado y pendiente;
- `NEXT.md` propone sólo el próximo incremento razonable;
- ningún archivo afirma que AION sea una institución o evaluadora oficial.

## Informe final solicitado

Al terminar, respondé con:

1. resultado general;
2. árbol breve del repositorio;
3. decisiones principales;
4. pruebas ejecutadas y resultado exacto;
5. limitaciones conocidas;
6. bloqueadores, si existen;
7. próximo paso recomendado;
8. estado de Git y si se creó o no un commit.


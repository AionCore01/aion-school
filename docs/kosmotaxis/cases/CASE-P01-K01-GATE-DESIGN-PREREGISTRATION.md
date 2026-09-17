# CASE-P01 — Diseño de compuertas K1

## Estado

PRE_REGISTERED

Este caso fue documentado antes de seleccionar y ejecutar el bloque principal. La evidencia candidata de anterioridad será el commit que introduzca por primera vez este archivo.

La existencia del commit demuestra orden dentro del historial Git, no hora real, identidad humana, independencia ni ejecución efectiva.

## Naturaleza

- Tipo: experimento prospectivo documental.
- Perfil: software.
- Modo: sombra manual.
- Alcance: Kosmotaxis K0.1.
- K1: no iniciado.
- Carácter: caso autorreferencial; no constituye evidencia de generalización.

## Bloque principal

- block_id: K0.1-DESIGN-001
- mission: diseñar un protocolo prospectivo manual y criterios explícitos para las compuertas previas a K1.
- uncertainty: estructural y transversal.
- recommended_capability: ORCHESTRATOR.
- recommended_model: Astra.
- recommended_reasoning_level: Medium.
- selected_model: PENDING.
- selected_reasoning_level: PENDING.
- selector: PENDING.
- execution: NOT_STARTED.
- result: PENDING.
- audit: PENDING.

## Procedencia de la recomendación

La recomendación fue formulada por el orquestador de la sesión de trabajo antes de crear este prerregistro.

Estado probatorio: DECLARACIÓN DISPONIBLE hasta que exista evidencia externa suficiente. El documento no autentica autoría, identidad ni momento real.

## Justificación cualitativa

El bloque combina varias incertidumbres todavía abiertas:

- granularidad y límites de bloques;
- dependencia, intercalado y reapertura;
- separación entre evento, estado, observación y decisión;
- independencia parcial entre roles;
- anterioridad sin importar datos temporales;
- minimización, acceso y retención;
- condiciones observables de fracaso o abandono.

La dificultad principal no es ejecutar cambios conocidos, sino coordinar decisiones estructurales relacionadas.

## Área autorizada

Únicamente documentación Kosmotaxis y actualizaciones documentales mínimas de estado.

Quedan prohibidos:

- código;
- schemas;
- tests;
- dependencias;
- automatización;
- conmutación de modelos;
- integración con Pez en el agua;
- integración con la evaluadora;
- modificación de docs/foundation/.

## Criterios de salida

El bloque principal deberá producir una propuesta documental que:

1. defina una granularidad experimental utilizable;
2. separe evento, estado, observación y decisión;
3. represente independencia por dimensiones, no como atributo binario;
4. proponga evidencia de anterioridad compatible con privacidad;
5. establezca minimización, acceso y retención;
6. formule preguntas observables de resultado negativo y condiciones de abandono;
7. mantenga K1 sin implementar;
8. declare incertidumbres que continúen abiertas.

## Escalar si

- resolver las compuertas exige código o schemas;
- no puede preservarse privacidad sin eliminar trazabilidad;
- la evidencia de anterioridad requiere copiar timestamps de Pez en el agua;
- aparece una contradicción con K0;
- se intenta presentar este único caso como validación general.

## Condiciones negativas admitidas

El caso puede concluir que:

- el orden Git no prueba anterioridad suficiente;
- la granularidad propuesta no es operable;
- la separación de roles no acredita independencia;
- el registro añade más burocracia que información;
- K1 debe permanecer bloqueado;
- Kosmotaxis necesita reducirse o abandonarse.

## Invariantes

La recomendación no prueba selección.

La selección no prueba ejecución.

La ejecución no prueba resultado.

El resultado no prueba calidad.

La auditoría no prueba verdad ni independencia.

Los valores PENDING y UNKNOWN no deben completarse por inferencia.

VERIFICACIÓN

- comprobar que sólo exista ese archivo nuevo;
- ejecutar git diff --check;
- no hacer commit, stage, push, tag ni cambiar de rama.

RETORNO

Informar:

- archivo creado;
- confirmación de que ningún otro archivo cambió;
- resultado de git diff --check;
- estado Git final;
- LISTO PARA COMMIT DE PRERREGISTRO o BLOQUEADO.

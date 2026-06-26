# Decisiones arquitectonicas y trade-offs

Clean Architecture no es una receta fija. Es una herramienta para tomar decisiones explicitas.

## Preguntas antes de aplicarla

- Que partes del sistema cambian mas?
- Que reglas deben sobrevivir aunque cambie el framework?
- Que integraciones externas son criticas?
- Que flujos necesitan pruebas rapidas?
- Que nivel de complejidad puede asumir el equipo?

## Costes

- Mas archivos.
- Mas conceptos.
- Mas disciplina en dependencias.
- Curva de aprendizaje mayor.
- Posible friccion con frameworks muy opinados.

## Beneficios

- Reglas de negocio mas protegidas.
- Tests mas rapidos.
- Menos acoplamiento a frameworks.
- Cambios tecnicos menos traumaticos.
- Mejor separacion entre decision de producto y detalle tecnico.

## Decision record

Una buena practica es registrar decisiones importantes:

```txt
ADR: Separar dominio de infraestructura

Contexto:
La aplicacion crece y los controladores empiezan a mezclar reglas, SQL y errores HTTP.

Decision:
Crear casos de uso y repositorios como puertos.

Consecuencias:
Habra mas archivos, pero los tests de negocio seran mas simples.
```

## Trade-off principal

La arquitectura limpia compra mantenibilidad con complejidad inicial. La pregunta correcta no es si es "buena" o "mala", sino si el problema merece ese coste.

## Regla practica

Empieza simple. Extrae arquitectura cuando aparezcan reglas, integraciones o cambios que justifiquen proteger el centro del sistema.

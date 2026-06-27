# Modelado estrategico

El modelado estrategico ayuda a decidir donde invertir esfuerzo y como dividir un sistema grande.

## Subdominios

No todas las partes de un sistema tienen la misma importancia.

- Core domain: lo que diferencia el negocio.
- Supporting domain: necesario, pero no diferencial.
- Generic domain: comun en muchas empresas.

## Ejemplo

En una plataforma educativa:

```txt
Core domain:
  aprendizaje adaptativo
  evaluacion personalizada

Supporting domain:
  catalogo de cursos
  mensajeria

Generic domain:
  autenticacion
  facturacion basica
```

## Invertir donde importa

El core domain merece mas modelado, pruebas y conversaciones. Un dominio generico puede resolverse con herramientas existentes.

## Context mapping

Un context map muestra relaciones entre contextos:

```txt
Catalog --customer/supplier--> Learning
Learning --event--> Billing
Identity --shared kernel--> All
```

## Relaciones comunes

- Customer/Supplier: un contexto consume el contrato de otro.
- Conformist: un contexto acepta el modelo de otro.
- Anti-corruption layer: un contexto traduce para protegerse.
- Shared kernel: se comparte una parte pequena y gobernada.

## Checklist

- El core domain esta identificado.
- No se sobredisena lo generico.
- Los contextos estan mapeados.
- Las relaciones tienen contratos claros.
- Las decisiones reflejan valor de negocio, no solo comodidad tecnica.

# Manual de Domain-Driven Design

Domain-Driven Design, o DDD, es una forma de disenar software alrededor del conocimiento del negocio. Su objetivo principal no es aplicar patrones, sino conseguir que el codigo hable el mismo idioma que el dominio que representa.

DDD aporta mas valor cuando el problema tiene reglas, excepciones, vocabulario propio y decisiones que no se entienden solo mirando tablas o pantallas.

## Capitulos previstos

1. [Introduccion a DDD](01-introduccion-a-ddd.md)
2. [Lenguaje ubicuo](02-lenguaje-ubicuo.md)
3. [Entidades value objects y agregados](03-entidades-value-objects-y-agregados.md)
4. [Repositorios servicios y eventos](04-repositorios-servicios-y-eventos.md)
5. [Bounded contexts](05-bounded-contexts.md)
6. [Integracion entre contextos](06-integracion-entre-contextos.md)
7. [Buenas practicas](07-buenas-practicas.md)
8. [Modelado estrategico](08-modelado-estrategico.md)
9. [Eventos de dominio](09-eventos-de-dominio.md)
10. [DDD tactico en backend](10-ddd-tactico-en-backend.md)
11. [Testing del dominio](11-testing-del-dominio.md)
12. [Proyecto final](12-proyecto-final.md)

## Por que existe DDD

En muchos proyectos el codigo acaba reflejando tecnologia, no negocio:

```txt
controllers/
services/
repositories/
models/
```

Eso puede funcionar, pero no siempre explica conceptos como:

- Pedido confirmado.
- Factura vencida.
- Cliente con riesgo.
- Cupo agotado.
- Matricula cancelable.
- Producto reservable.

DDD intenta que esos conceptos vivan en el modelo y no solo en conversaciones, tickets o documentacion externa.

## Dos niveles de DDD

### DDD estrategico

Ayuda a dividir el sistema:

- Subdominios.
- Bounded contexts.
- Context maps.
- Relaciones entre equipos y modelos.

### DDD tactico

Ayuda a disenar el modelo interno:

- Entidades.
- Value objects.
- Agregados.
- Repositorios.
- Servicios de dominio.
- Eventos de dominio.

## Cuando usar DDD

- El negocio tiene reglas complejas.
- Hay muchas excepciones.
- Distintas areas usan palabras diferentes.
- El sistema va a crecer durante anos.
- Los errores de interpretacion son caros.

## Cuando no compensa

- CRUDs simples.
- Prototipos rapidos.
- Scripts internos.
- Aplicaciones donde la logica vive casi toda en otra plataforma.

## Idea central

DDD no empieza en el codigo. Empieza entendiendo el dominio con personas que lo conocen y llevando ese lenguaje al diseno del sistema.

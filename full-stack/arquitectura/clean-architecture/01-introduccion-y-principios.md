# Manual de Clean Architecture

Clean Architecture es una forma de organizar software para que las reglas de negocio no dependan de frameworks, bases de datos, interfaces graficas ni servicios externos.

El objetivo no es llenar el proyecto de carpetas, sino proteger lo importante: casos de uso, entidades, reglas de negocio y decisiones que cambian menos que la tecnologia usada alrededor.

## Capitulos previstos

1. [Introduccion y principios](01-introduccion-y-principios.md)
2. [Capas y reglas de dependencia](02-capas-y-reglas-de-dependencia.md)
3. [Entidades casos de uso y adaptadores](03-entidades-casos-de-uso-y-adaptadores.md)
4. [Aplicacion en backend](04-aplicacion-en-backend.md)
5. [Testing](05-testing.md)
6. [Errores comunes](06-errores-comunes.md)
7. [Decisiones arquitectonicas y trade-offs](07-decisiones-arquitectonicas-y-trade-offs.md)
8. [Fronteras modulos y paquetes](08-fronteras-modulos-y-paquetes.md)
9. [Integracion con DDD y arquitectura hexagonal](09-integracion-con-ddd-y-hexagonal.md)
10. [Observabilidad y operacion](10-observabilidad-y-operacion.md)
11. [Refactorizacion hacia Clean Architecture](11-refactorizacion-hacia-clean-architecture.md)
12. [Proyecto final](12-proyecto-final.md)

## Idea principal

La regla mas importante es la regla de dependencia:

```txt
Frameworks y drivers
        |
Adaptadores
        |
Casos de uso
        |
Dominio
```

Las dependencias apuntan hacia dentro. El dominio no conoce Express, Django, Spring, React, PostgreSQL ni Kafka. La infraestructura conoce al dominio porque lo implementa, lo persiste o lo expone.

## Cuando aporta valor

- Aplicaciones con reglas de negocio que van a crecer.
- Equipos donde frontend, backend, datos y producto cambian a ritmos distintos.
- Sistemas con varias interfaces: API REST, jobs, CLI, eventos o panel administrativo.
- Proyectos donde el framework no debe dictar todas las decisiones.
- Codigo que necesita pruebas rapidas sin levantar base de datos ni servidor.

## Cuando puede ser excesiva

- Scripts muy pequenos.
- CRUDs internos con vida corta.
- Prototipos donde el objetivo es validar una idea en horas.
- Equipos que todavia no dominan bien el lenguaje o framework base.

## Principios clave

- El dominio debe ser independiente.
- Los casos de uso coordinan acciones, no almacenan detalles tecnicos.
- Los adaptadores traducen entre el exterior y el modelo interno.
- La infraestructura se cambia mas facil cuando esta detras de interfaces.
- Los tests deben poder ejecutar reglas importantes sin arrancar todo el sistema.

## Ejemplo mental

En vez de pensar:

```txt
Controller -> ORM -> tabla
```

Piensa:

```txt
Controller -> caso de uso -> puerto -> repositorio concreto -> base de datos
```

El controlador no decide la regla de negocio. El ORM no define el modelo del negocio. La base de datos es importante, pero no manda sobre el corazon de la aplicacion.

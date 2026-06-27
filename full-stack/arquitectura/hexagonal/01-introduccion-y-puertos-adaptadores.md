# Manual de Arquitectura Hexagonal

La arquitectura hexagonal organiza una aplicacion alrededor de su dominio y sus casos de uso. El exterior se conecta mediante puertos y adaptadores, de forma que HTTP, bases de datos, colas o proveedores externos no dicten el diseno interno.

Tambien se conoce como ports and adapters.

## Capitulos previstos

1. [Introduccion y puertos adaptadores](01-introduccion-y-puertos-adaptadores.md)
2. [Dominio y casos de uso](02-dominio-y-casos-de-uso.md)
3. [Adaptadores de entrada](03-adaptadores-de-entrada.md)
4. [Adaptadores de salida](04-adaptadores-de-salida.md)
5. [Testing](05-testing.md)
6. [Aplicacion practica](06-aplicacion-practica.md)
7. [Puertos de entrada y salida](07-puertos-de-entrada-y-salida.md)
8. [Transacciones errores y eventos](08-transacciones-errores-y-eventos.md)
9. [Integracion con frameworks](09-integracion-con-frameworks.md)
10. [Observabilidad y operacion](10-observabilidad-y-operacion.md)
11. [Migracion desde arquitectura por capas](11-migracion-desde-arquitectura-por-capas.md)
12. [Proyecto final](12-proyecto-final.md)

## Idea central

```txt
              HTTP Controller
                    |
CLI Command -> Puerto de entrada -> Caso de uso -> Puerto de salida -> Repositorio SQL
                    |                                  |
             Event Consumer                            -> Cliente externo
```

El caso de uso no sabe si viene de HTTP, CLI, cron o Kafka. Tampoco sabe si guarda en PostgreSQL, MongoDB o un servicio externo.

## Puertos

Un puerto es un contrato.

- Puerto de entrada: lo que la aplicacion ofrece.
- Puerto de salida: lo que la aplicacion necesita.

## Adaptadores

Un adaptador conecta un puerto con tecnologia real.

- Entrada: REST controller, GraphQL resolver, job, consumer.
- Salida: repositorio SQL, cliente HTTP, cache, cola, filesystem.

## Beneficio principal

La tecnologia se vuelve sustituible. El dominio y los casos de uso quedan protegidos de decisiones externas.

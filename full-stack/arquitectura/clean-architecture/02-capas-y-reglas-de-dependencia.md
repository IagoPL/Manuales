# Capas y reglas de dependencia

La arquitectura limpia separa el sistema por responsabilidad. Cada capa tiene un motivo distinto para cambiar y una relacion clara con las demas.

## Capas habituales

```txt
src/
  domain/
  application/
  infrastructure/
  presentation/
```

## Domain

Contiene reglas de negocio puras:

- Entidades.
- Value objects.
- Reglas invariantes.
- Errores del dominio.
- Servicios de dominio cuando una regla no pertenece a una sola entidad.

No debe importar frameworks, ORM, HTTP, colas, logs ni librerias de UI.

## Application

Contiene casos de uso. Coordina una intencion del sistema:

- Crear un pedido.
- Publicar un articulo.
- Registrar un usuario.
- Calcular una factura.
- Procesar un pago.

Puede depender del dominio y de puertos abstractos, pero no de adaptadores concretos.

## Infrastructure

Contiene detalles tecnicos:

- Repositorios SQL.
- Clientes HTTP.
- Productores Kafka.
- Lectores de archivos.
- Servicios de email.
- Adaptadores de cache.

Esta capa cambia cuando cambia la tecnologia.

## Presentation

Es la entrada al sistema:

- Controladores REST.
- GraphQL resolvers.
- CLI commands.
- Jobs programados.
- Consumers de eventos.

Su trabajo es traducir entrada externa a comandos internos y devolver respuestas entendibles.

## Regla de dependencia

```txt
presentation -> application -> domain
infrastructure -> application -> domain
```

El dominio no apunta a nadie. La aplicacion no debe conocer controladores, ORM ni frameworks web. La infraestructura implementa contratos definidos por la aplicacion o por el dominio.

## Ejemplo practico

```txt
POST /orders
  -> OrderController
  -> CreateOrderUseCase
  -> OrderRepository
  -> SqlOrderRepository
```

El caso de uso sabe que necesita guardar un pedido. No sabe si el guardado ocurre en PostgreSQL, MongoDB, un archivo o un mock de test.

## Senales de mala dependencia

- Una entidad importa un modelo de ORM.
- Un caso de uso recibe un objeto Request de Express, Django, Laravel o Spring.
- Una regla de negocio lee variables de entorno directamente.
- Un test de dominio necesita arrancar Docker.
- Cambiar de proveedor de email obliga a tocar controladores y entidades.

## Checklist

- Las dependencias del dominio son cero o casi cero.
- Los casos de uso reciben datos simples o DTOs propios.
- Los adaptadores se pueden sustituir sin tocar reglas de negocio.
- Las interfaces estan cerca del caso de uso que las necesita.
- La infraestructura se configura en el borde de la aplicacion.

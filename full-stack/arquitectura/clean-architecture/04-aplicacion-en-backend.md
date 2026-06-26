# Aplicacion en backend

Clean Architecture en backend se nota especialmente cuando una API deja de ser una coleccion de controladores con consultas SQL y pasa a expresar casos de uso claros.

## Estructura orientativa

```txt
src/
  modules/
    orders/
      domain/
        Order.ts
        OrderLine.ts
        OrderStatus.ts
      application/
        CreateOrderUseCase.ts
        ConfirmOrderUseCase.ts
        OrderRepository.ts
      infrastructure/
        SqlOrderRepository.ts
        OrderMapper.ts
      presentation/
        OrderController.ts
        OrderRoutes.ts
```

La estructura puede variar por lenguaje, pero la intencion es la misma: las reglas quedan en el centro y los detalles en los bordes.

## Controladores finos

Un controlador no deberia decidir reglas de negocio. Debe leer parametros, validar forma basica, llamar al caso de uso, traducir errores a HTTP y devolver una respuesta.

```txt
Controller
  parsea request
  crea command
  ejecuta use case
  devuelve status code
```

## Servicios de aplicacion

El caso de uso coordina, pero no deberia convertirse en una clase gigante.

Debe contener:

- Flujo de la operacion.
- Orquestacion entre repositorios y gateways.
- Transacciones cuando aplique.
- Publicacion de eventos de aplicacion.

No debe contener SQL, serializacion HTTP, detalles de framework ni renderizado de plantillas.

## Persistencia

El repositorio concreto vive en infraestructura.

```txt
application/OrderRepository
infrastructure/PostgresOrderRepository
```

El mapper evita que el modelo del ORM se filtre hacia el dominio.

## Transacciones

Las transacciones suelen gestionarse en el nivel de aplicacion o infraestructura, no dentro de la entidad.

```txt
transaction {
  order = repository.find(id)
  order.confirm()
  repository.save(order)
  eventBus.publish(order.events)
}
```

## Frameworks

En Spring Boot, Django, FastAPI, Laravel, Express o NestJS puedes aplicar la misma idea, aunque cada framework empuje a una estructura concreta.

La clave es no confundir comodidad del framework con arquitectura del negocio.

## Checklist

- Los controladores no contienen consultas.
- Los casos de uso tienen nombres de accion.
- Los repositorios son contratos claros.
- El dominio no importa clases del framework.
- Los errores se traducen en el borde HTTP.

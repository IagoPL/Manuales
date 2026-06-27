# DDD tactico en backend

DDD tactico se aplica en backend cuando el codigo necesita proteger reglas de negocio reales.

## Estructura por modulo

```txt
src/
  modules/
    orders/
      domain/
        Order.ts
        Money.ts
        OrderConfirmed.ts
      application/
        ConfirmOrderUseCase.ts
        OrderRepository.ts
      infrastructure/
        PostgresOrderRepository.ts
      presentation/
        OrderController.ts
```

## Dominio

Debe contener comportamiento:

```txt
Order.confirm()
  validate has lines
  validate not cancelled
  change status
  record OrderConfirmed
```

## Aplicacion

Coordina:

```txt
ConfirmOrderUseCase
  order = repository.findById(id)
  order.confirm()
  repository.save(order)
  eventBus.publish(order.pullEvents())
```

## Infraestructura

Traduce:

```txt
SQL row -> Order
Order -> SQL row
```

## DTOs

Los DTOs pertenecen a los bordes. No deben convertirse automaticamente en entidades.

```txt
ConfirmOrderRequest -> ConfirmOrderCommand -> Order
```

## Checklist

- El dominio no importa framework.
- Los casos de uso expresan intenciones.
- Los repositorios devuelven agregados.
- Los mappers evitan filtrar ORM.
- Los eventos se publican desde aplicacion o infraestructura controlada.

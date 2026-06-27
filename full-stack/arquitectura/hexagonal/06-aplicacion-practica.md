# Aplicacion practica

Vamos a aplicar arquitectura hexagonal a una API de pedidos.

## Caso de uso

Confirmar un pedido:

```txt
El cliente confirma un pedido en borrador.
El pedido debe tener lineas.
El pedido no puede estar cancelado.
Se guarda el cambio.
Se publica OrderConfirmed.
```

## Estructura

```txt
orders/
  domain/
    Order
    OrderStatus
  application/
    ConfirmOrderUseCase
    OrderRepository
    EventPublisher
  infrastructure/
    PostgresOrderRepository
    KafkaEventPublisher
  presentation/
    ConfirmOrderController
```

## Flujo

```txt
HTTP
  -> ConfirmOrderController
  -> ConfirmOrderCommand
  -> ConfirmOrderUseCase
  -> OrderRepository
  -> PostgresOrderRepository
  -> EventPublisher
  -> KafkaEventPublisher
```

## Variacion

El mismo caso de uso puede ejecutarse desde CLI:

```txt
confirm-order --order-id 123
  -> ConfirmOrderCommand
  -> ConfirmOrderUseCase
```

No hay que duplicar logica.

## Resultado esperado

La aplicacion puede cambiar REST por GraphQL, PostgreSQL por MongoDB o Kafka por RabbitMQ sin tocar las reglas de confirmacion del pedido.

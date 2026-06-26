# Microservicios y eventos

NestJS incluye abstracciones para microservicios con transportes como TCP, Redis, NATS, RabbitMQ y Kafka.

## Event-driven

En sistemas modernos, NestJS puede publicar y consumir eventos.

```ts
@EventPattern('order.created')
handleOrderCreated(@Payload() event: OrderCreatedEvent) {
  return this.ordersService.handleCreated(event)
}
```

## Kafka

```ts
ClientsModule.register([
  {
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'orders-service' },
    },
  },
])
```

## Idempotencia

Los consumidores deben tolerar duplicados.

```txt
event_id procesado -> ignorar
event_id nuevo -> procesar y registrar
```

## Buenas practicas

- Define contratos de eventos.
- Consumidores idempotentes.
- DLT para errores definitivos.
- Correlation IDs.
- No uses eventos como RPC disfrazado.

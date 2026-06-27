# Adaptadores de entrada

Los adaptadores de entrada permiten que el mundo exterior ejecute casos de uso.

## Tipos habituales

- Controladores REST.
- GraphQL resolvers.
- Consumers de eventos.
- Jobs programados.
- CLI commands.
- Webhooks.

## Responsabilidades

Un adaptador de entrada debe:

- Leer datos externos.
- Validar formato basico.
- Traducir a comando interno.
- Llamar al puerto o caso de uso.
- Traducir la respuesta.
- Mapear errores al protocolo correspondiente.

## Ejemplo REST

```txt
POST /orders/{id}/confirm
  -> ConfirmOrderController
  -> ConfirmOrderCommand
  -> ConfirmOrderUseCase
```

El controlador no confirma el pedido. Solo traduce HTTP a una intencion interna.

## Ejemplo consumer

```txt
PaymentCaptured event
  -> PaymentCapturedConsumer
  -> ConfirmPaidOrderCommand
  -> ConfirmPaidOrderUseCase
```

El consumer no deberia filtrar detalles del broker hacia el caso de uso.

## Errores

Cada protocolo traduce errores de forma distinta:

- HTTP: status code y cuerpo JSON.
- CLI: exit code y mensaje.
- Kafka: retry, dead-letter o ack.
- Cron: logs, metricas y alerta.

## Checklist

- El adaptador no contiene reglas de negocio.
- El caso de uso no recibe objetos del framework.
- Los errores se traducen en el borde.
- La validacion profunda vive dentro.
- Hay tests para el mapeo de entrada.

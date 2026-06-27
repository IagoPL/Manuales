# Eventos de dominio

Un evento de dominio representa algo importante que ya ocurrio dentro del negocio.

## Nombres en pasado

```txt
OrderConfirmed
PaymentCaptured
CoursePublished
StudentEnrolled
InvoiceOverdue
```

El pasado importa porque el evento no pide permiso: informa un hecho.

## Que debe contener

Un evento debe contener datos suficientes para que los consumidores actuen sin conocer el modelo interno.

```json
{
  "eventId": "evt_123",
  "type": "OrderConfirmed",
  "occurredAt": "2026-06-27T10:30:00Z",
  "orderId": "ord_123",
  "customerId": "cus_456"
}
```

## Eventos internos y externos

- Internos: coordinan partes del mismo bounded context.
- Externos: forman parte de un contrato publicado.

Los externos deben versionarse y documentarse mejor.

## Outbox pattern

Para evitar guardar en base de datos y fallar al publicar evento:

```txt
transaction
  save aggregate
  save event in outbox

publisher
  read outbox
  publish event
  mark as published
```

## Idempotencia

Los consumidores deben tolerar eventos duplicados. Usa `eventId`, claves naturales o tablas de procesado.

## Checklist

- Los eventos representan hechos del negocio.
- Se nombran en pasado.
- Incluyen identificadores y fecha.
- Los eventos externos tienen contrato.
- Los consumidores son idempotentes.

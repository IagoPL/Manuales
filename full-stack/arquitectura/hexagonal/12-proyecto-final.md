# Proyecto final

El proyecto final consiste en construir una aplicacion de reservas con arquitectura hexagonal.

## Dominio

```txt
Booking
Room
Guest
DateRange
Payment
```

## Casos de uso

- CreateBooking.
- ConfirmBooking.
- CancelBooking.
- CapturePayment.
- SendBookingConfirmation.
- ListAvailableRooms.

## Adaptadores de entrada

- API REST.
- CLI para administracion.
- Job de cancelacion de reservas expiradas.
- Webhook de proveedor de pagos.

## Adaptadores de salida

- Repositorio SQL.
- Gateway de pagos fake.
- Email sender.
- Event publisher.
- Clock.

## Reglas

- No se puede reservar una habitacion ocupada.
- Una reserva pendiente expira despues de un tiempo.
- Una reserva confirmada necesita pago capturado.
- Una reserva cancelada no puede confirmarse.

## Entregable

```txt
src/
  booking/
    domain/
    application/
    infrastructure/
    presentation/
```

Debe incluir tests del dominio, casos de uso, adaptadores y un flujo E2E.

## Criterio de calidad

El mismo caso de uso debe poder ejecutarse desde REST, CLI o job sin duplicar reglas. Esa es la senal de que los puertos y adaptadores estan haciendo su trabajo.

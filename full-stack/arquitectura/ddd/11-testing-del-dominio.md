# Testing del dominio

DDD facilita tests que describen reglas de negocio con claridad.

## Tests de entidades

```txt
given order without lines
when confirm
then it fails
```

Estos tests no necesitan base de datos ni HTTP.

## Tests de value objects

```txt
EmailAddress rejects invalid format
Money cannot have negative amount
DateRange requires end after start
```

Son pequenos, rapidos y muy valiosos.

## Tests de agregados

Prueban invariantes:

```txt
confirmed order cannot be cancelled after shipping
published course requires at least one lesson
invoice cannot be paid twice
```

## Tests de casos de uso

Usan repositorios en memoria y gateways fake:

```txt
given existing draft order
when confirm order use case runs
then order is saved as confirmed
and OrderConfirmed is published
```

## Tests de eventos

Comprueban:

- Evento emitido.
- Datos correctos.
- Idempotencia del consumidor.
- Version del contrato.

## Checklist

- Los tests usan lenguaje de negocio.
- Las reglas criticas estan cubiertas.
- Los tests de dominio son rapidos.
- Los casos de uso usan fakes simples.
- Los eventos publicados se verifican.

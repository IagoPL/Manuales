# Testing

La arquitectura hexagonal facilita tests rapidos porque los casos de uso se pueden probar sin servidores ni infraestructura real.

## Tests del nucleo

Prueban dominio y casos de uso con dobles simples.

```txt
ConfirmOrderUseCase
  InMemoryOrderRepository
  FakeEventPublisher
```

## Tests de adaptadores de entrada

Comprueban que el protocolo se traduce correctamente:

```txt
POST /orders/123/confirm
  -> ConfirmOrderCommand(orderId=123)
```

Tambien prueban status codes, errores y validacion superficial.

## Tests de adaptadores de salida

Comprueban integraciones:

- Repositorio contra base de datos real.
- Cliente HTTP contra mock server.
- Publicador contra broker de test.
- Mapper de ORM a dominio.

## Piramide

```txt
E2E pocos
Adaptadores algunos
Casos de uso muchos
Dominio muchos
```

## Fakes utiles

```txt
InMemoryOrderRepository
FakePaymentGateway
SpyEventPublisher
FixedClock
```

## Checklist

- El nucleo se prueba sin framework.
- Los adaptadores tienen tests propios.
- Los E2E cubren flujos criticos.
- Los fakes usan lenguaje del puerto.
- Los tests verifican errores y no solo camino feliz.

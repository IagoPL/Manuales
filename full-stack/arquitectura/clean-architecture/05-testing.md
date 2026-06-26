# Testing

Una de las grandes ventajas de Clean Architecture es que permite probar reglas importantes sin depender de servidores, bases de datos ni servicios externos.

## Piramide recomendada

```txt
E2E tests
Integration tests
Use case tests
Domain tests
```

Cuanto mas cerca del dominio, mas rapidos y estables deberian ser los tests.

## Tests de dominio

Prueban reglas puras.

```txt
given order without lines
when confirm
then error: order cannot be confirmed
```

No necesitan mocks complejos, base de datos ni servidor web.

## Tests de casos de uso

Prueban la coordinacion.

```txt
given existing cart
and valid payment
when checkout
then order is created
and payment is captured
and event is published
```

Aqui se pueden usar dobles de prueba para repositorios, gateways y event bus.

## Tests de infraestructura

Prueban adaptadores concretos:

- Repositorios contra base de datos real o contenedor.
- Clientes HTTP contra servidor fake.
- Serializadores y mappers.
- Consumers de eventos.

Estos tests son mas lentos, pero dan confianza en la integracion.

## Tests end to end

Prueban el sistema desde fuera:

```txt
POST /orders
GET /orders/{id}
```

No deben cubrir cada combinacion interna. Su funcion es confirmar que las piezas principales encajan.

## Estrategia de mocks

Usa mocks para dependencias externas, no para el dominio.

Buena senal:

```txt
FakePaymentGateway
InMemoryOrderRepository
```

Mala senal:

```txt
MockOrder
MockOrderLine
MockDomainRule
```

## Checklist

- Las reglas de dominio tienen tests rapidos.
- Los casos de uso se prueban sin HTTP.
- Los adaptadores tienen tests de integracion.
- Los tests E2E cubren flujos criticos.
- Los errores de negocio se prueban explicitamente.

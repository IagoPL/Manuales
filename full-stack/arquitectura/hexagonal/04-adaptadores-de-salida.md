# Adaptadores de salida

Los adaptadores de salida implementan lo que la aplicacion necesita del exterior.

## Tipos habituales

- Repositorios de base de datos.
- Clientes HTTP.
- Publicadores de eventos.
- Clientes de cache.
- Adaptadores de filesystem.
- Gateways de pago.
- Servicios de email.

## Puerto de salida

El caso de uso define lo que necesita:

```txt
PaymentGateway
  capture(paymentRequest)
```

La infraestructura decide como hacerlo:

```txt
StripePaymentGateway
FakePaymentGateway
AdyenPaymentGateway
```

## Repositorios

Un repositorio debe traducir entre persistencia y dominio.

```txt
SQL row -> Order
Order -> SQL row
```

Evita que modelos de ORM viajen hacia el dominio.

## Clientes externos

Los adaptadores de salida deben controlar:

- Timeouts.
- Reintentos.
- Errores.
- Circuit breakers si aplica.
- Logs y metricas.
- Traduccion de respuestas externas.

## Anticorrupcion

Si un proveedor usa conceptos distintos, traduce.

```txt
ProviderPaymentStatus = SETTLED
  -> PaymentStatus.captured
```

## Checklist

- Cada adaptador implementa un puerto claro.
- Los detalles externos no entran al dominio.
- Hay mappers explicitos.
- Los errores externos se traducen.
- Los timeouts estan configurados.

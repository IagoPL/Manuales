# Integracion con DDD y arquitectura hexagonal

Clean Architecture, DDD y arquitectura hexagonal no son enemigos. Suelen encajar muy bien.

## Relacion entre enfoques

- DDD ayuda a modelar el negocio.
- Hexagonal ayuda a aislar puertos y adaptadores.
- Clean Architecture ayuda a ordenar dependencias por capas.

## Mapa mental

```txt
DDD:
  entidades, value objects, agregados, bounded contexts

Hexagonal:
  puertos de entrada, puertos de salida, adaptadores

Clean Architecture:
  dominio, aplicacion, infraestructura, presentacion
```

## Ejemplo de combinacion

```txt
orders/
  domain/
    Order
    OrderLine
    Money
  application/
    ConfirmOrderUseCase
    OrderRepository
    PaymentGateway
  infrastructure/
    PostgresOrderRepository
    StripePaymentGateway
  presentation/
    OrderController
```

DDD da sentido al modelo. Hexagonal marca los puertos. Clean Architecture ordena la dependencia.

## Cuando usar DDD

DDD aporta valor cuando el negocio tiene reglas complejas, hay conversaciones frecuentes con personas de negocio o el sistema no es solo CRUD.

## Cuando usar hexagonal

Hexagonal es especialmente util cuando hay varias formas de entrada, varias integraciones externas o necesitas tests aislados de adaptadores.

## Error comun

Pensar que hay que aplicar todos los patrones a la vez. Puedes empezar con casos de uso y repositorios, despues introducir value objects, luego eventos y finalmente bounded contexts si el sistema lo pide.

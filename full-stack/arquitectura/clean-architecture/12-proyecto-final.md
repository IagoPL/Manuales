# Proyecto final

El proyecto final consiste en construir una API de gestion de pedidos aplicando Clean Architecture de forma pragmatica.

## Objetivo

Crear un backend con usuarios, catalogo de productos, carrito, pedidos, pagos simulados, eventos de dominio y tests de dominio, aplicacion e integracion.

## Estructura propuesta

```txt
src/
  modules/
    orders/
      domain/
      application/
      infrastructure/
      presentation/
    catalog/
    identity/
  shared/
    kernel/
    observability/
```

## Funcionalidades

1. Crear carrito.
2. Anadir productos.
3. Confirmar pedido.
4. Simular pago.
5. Publicar evento `OrderConfirmed`.
6. Consultar historial de pedidos.
7. Cancelar pedido si aun no fue enviado.

## Requisitos arquitectonicos

- El dominio no depende del framework.
- Los casos de uso no reciben objetos HTTP.
- Los repositorios se definen como puertos.
- La infraestructura implementa adaptadores concretos.
- Los errores se traducen en el borde de presentacion.
- Los eventos incluyen correlation id.

## Tests minimos

- Confirmar pedido sin lineas falla.
- Confirmar pedido valido cambia estado.
- Cancelar pedido enviado falla.
- Crear pedido guarda entidad.
- El endpoint `POST /orders` ejecuta el caso de uso correcto.

## Entregable

El resultado debe poder explicarse con este diagrama:

```txt
HTTP API
  -> application use cases
  -> domain model
  -> ports
  -> infrastructure adapters
```

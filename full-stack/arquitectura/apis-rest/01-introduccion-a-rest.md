# Manual de Diseno de APIs REST

Una API REST bien disenada no es solo una coleccion de endpoints. Es un contrato entre sistemas, equipos y consumidores que debe ser claro, estable, seguro y operable.

## Capitulos previstos

1. [Introduccion a REST](01-introduccion-a-rest.md)
2. [Recursos rutas y metodos](02-recursos-rutas-y-metodos.md)
3. [Codigos de estado y errores](03-codigos-de-estado-y-errores.md)
4. [Paginacion filtros y ordenacion](04-paginacion-filtros-y-ordenacion.md)
5. [Versionado](05-versionado.md)
6. [Seguridad](06-seguridad.md)
7. [Documentacion OpenAPI](07-documentacion-openapi.md)
8. [Buenas practicas](08-buenas-practicas.md)
9. [Contratos compatibilidad y evolucion](09-contratos-compatibilidad-y-evolucion.md)
10. [Observabilidad y diagnostico](10-observabilidad-y-diagnostico.md)
11. [Rendimiento cache y rate limiting](11-rendimiento-cache-y-rate-limiting.md)
12. [Testing de APIs REST](12-testing-de-apis-rest.md)
13. [Gobierno de APIs](13-gobierno-de-apis.md)
14. [Proyecto final](14-proyecto-final.md)

## Que significa REST

REST es un estilo arquitectonico basado en recursos, representaciones, identificadores, operaciones uniformes y comunicacion sin estado.

En la practica, una API REST suele trabajar con:

- Recursos: usuarios, pedidos, productos, facturas.
- URLs: identificadores de recursos.
- Metodos HTTP: GET, POST, PUT, PATCH, DELETE.
- Codigos de estado: 200, 201, 400, 401, 404, 409, 500.
- Representaciones: normalmente JSON.

## Objetivos de una buena API

- Ser facil de entender.
- Ser consistente.
- Ser segura por defecto.
- Tener errores accionables.
- Evolucionar sin romper clientes.
- Ser observable en produccion.
- Estar documentada como contrato.

## Ejemplo basico

```txt
GET    /orders
POST   /orders
GET    /orders/{orderId}
PATCH  /orders/{orderId}
DELETE /orders/{orderId}
```

## REST no es solo CRUD

Muchas APIs empiezan como CRUD, pero los sistemas reales tienen acciones de negocio:

```txt
POST /orders/{orderId}/confirm
POST /invoices/{invoiceId}/send
POST /subscriptions/{subscriptionId}/cancel
```

Estas rutas pueden ser validas cuando representan transiciones claras del dominio.

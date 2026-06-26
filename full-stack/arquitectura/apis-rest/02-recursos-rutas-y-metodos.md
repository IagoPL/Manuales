# Recursos rutas y metodos

El diseno de rutas es una de las partes mas visibles de una API. Una ruta buena comunica el modelo mental del sistema.

## Recursos

Un recurso es una cosa del dominio que se puede identificar.

Ejemplos:

- `/users`
- `/orders`
- `/products`
- `/invoices`
- `/projects`

Usa sustantivos, no verbos:

```txt
Bien: /orders
Mal:  /getOrders
```

## Colecciones e items

```txt
GET /orders          lista pedidos
POST /orders         crea pedido
GET /orders/{id}     obtiene pedido
PATCH /orders/{id}   modifica parcialmente
DELETE /orders/{id}  elimina o desactiva
```

## Recursos anidados

Usalos cuando la relacion sea parte natural del acceso.

```txt
GET /orders/{orderId}/items
POST /orders/{orderId}/items
DELETE /orders/{orderId}/items/{itemId}
```

Evita anidamiento excesivo:

```txt
/companies/{companyId}/departments/{departmentId}/teams/{teamId}/users/{userId}
```

Si una ruta es demasiado profunda, quizas necesitas filtros:

```txt
GET /users?companyId=1&teamId=8
```

## Metodos HTTP

- `GET`: leer sin efectos secundarios.
- `POST`: crear o ejecutar una accion no idempotente.
- `PUT`: reemplazar un recurso completo.
- `PATCH`: modificar parcialmente.
- `DELETE`: eliminar, cancelar o desactivar segun contrato.

## Acciones de dominio

No fuerces todo a CRUD si el negocio tiene transiciones claras.

```txt
POST /orders/{id}/confirm
POST /orders/{id}/cancel
POST /invoices/{id}/send
```

## Checklist

- Las rutas usan sustantivos.
- Los metodos tienen significado HTTP correcto.
- Las acciones de negocio son explicitas.
- Los identificadores son estables.
- La profundidad de rutas se mantiene razonable.

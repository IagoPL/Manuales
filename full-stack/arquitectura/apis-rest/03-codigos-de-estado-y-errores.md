# Codigos de estado y errores

Los codigos HTTP permiten que clientes, proxies, herramientas y personas entiendan que ha ocurrido sin interpretar todo el cuerpo de la respuesta.

## Codigos comunes

- `200 OK`: lectura o modificacion correcta.
- `201 Created`: recurso creado.
- `202 Accepted`: operacion aceptada para procesamiento asincrono.
- `204 No Content`: operacion correcta sin cuerpo.
- `400 Bad Request`: request mal formada.
- `401 Unauthorized`: falta autenticacion.
- `403 Forbidden`: autenticado pero sin permisos.
- `404 Not Found`: recurso inexistente o no visible.
- `409 Conflict`: conflicto de estado.
- `422 Unprocessable Entity`: validacion semantica fallida.
- `429 Too Many Requests`: rate limit.
- `500 Internal Server Error`: fallo no controlado.

## Errores accionables

Un buen error ayuda al cliente a corregir el problema.

```json
{
  "type": "validation_error",
  "message": "The request contains invalid fields.",
  "traceId": "req_123",
  "errors": [
    {
      "field": "email",
      "code": "invalid_format",
      "message": "Email must be valid."
    }
  ]
}
```

## Separar errores

- Errores de formato: JSON invalido, parametros incorrectos.
- Errores de validacion: datos bien formados pero no aceptables.
- Errores de negocio: estado incompatible.
- Errores de permisos: identidad o autorizacion.
- Errores tecnicos: base de datos, red, proveedor externo.

## Conflictos

Usa `409 Conflict` cuando la peticion choca con el estado actual.

```txt
POST /orders/{id}/confirm
409 order_already_cancelled
```

## No filtrar detalles internos

Evita respuestas como:

```txt
SQLSTATE[23505] duplicate key value violates unique constraint
```

Mejor:

```json
{
  "type": "conflict",
  "code": "email_already_exists",
  "message": "A user with this email already exists."
}
```

## Checklist

- Cada error tiene codigo estable.
- Las validaciones indican campo y motivo.
- Los errores incluyen `traceId`.
- Los 500 no exponen stack traces.
- Los clientes pueden automatizar decisiones con `code` o `type`.

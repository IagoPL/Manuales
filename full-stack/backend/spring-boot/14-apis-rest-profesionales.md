# APIs REST profesionales

Una API REST profesional no es solo endpoints que devuelven JSON. Debe tener contratos claros, errores consistentes, paginacion, seguridad, versionado y documentacion.

## Recursos

Usa sustantivos:

```txt
/api/products
/api/products/{id}
/api/orders
/api/orders/{id}
```

Evita rutas orientadas a acciones salvo casos justificados.

## Filtros y orden

```txt
GET /api/products?search=keyboard&page=0&size=20&sort=price,asc
```

Documenta limites de `size` para evitar abusos.

## Idempotencia

`PUT` debe ser idempotente. `POST` normalmente no.

Para operaciones sensibles, usa idempotency keys:

```txt
Idempotency-Key: 7f1c...
```

## Errores

Formato estable:

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "Product not found",
  "timestamp": "2026-06-26T10:00:00Z"
}
```

## OpenAPI

Dependencia habitual:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.6.0</version>
</dependency>
```

Expone documentacion interactiva:

```txt
/swagger-ui.html
```

## Versionado

Opciones:

```txt
/api/v1/products
Accept: application/vnd.company.v1+json
```

Elige una politica y mantenla.

## Rate limiting

Spring no trae rate limiting completo por defecto. Puedes integrarlo con gateway, Redis o librerias especializadas.

## Buenas practicas

- Contratos documentados.
- Errores estables.
- Paginacion en colecciones.
- Validacion de entrada.
- Autorizacion real en backend.
- OpenAPI actualizado en CI.
- Tests de contrato en endpoints criticos.


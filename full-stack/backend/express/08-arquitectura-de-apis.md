# Arquitectura de APIs

Express no impone arquitectura. Esa libertad exige convenciones claras.

## Estructura

```txt
src/
  app.js
  server.js
  modules/
    products/
      product.routes.js
      product.controller.js
      product.service.js
      product.repository.js
      product.schema.js
  shared/
    errors.js
    logger.js
```

## Capas

```txt
route -> controller -> service -> repository
```

## Controllers

Traducen HTTP.

## Services

Contienen casos de uso.

## Repositories

Acceden a datos.

## Buenas practicas

- Separar HTTP de negocio.
- Centralizar validación.
- Errores consistentes.
- Versionado de API si hace falta.
- Documentación OpenAPI.

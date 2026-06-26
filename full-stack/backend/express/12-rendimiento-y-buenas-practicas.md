# Rendimiento y buenas practicas

Express suele ser rápido si no bloqueas el event loop y cuidas base de datos, payloads y dependencias.

## Event loop

Evita CPU intensivo dentro del request.

## Compresión

```js
import compression from 'compression'
app.use(compression())
```

## Paginación

Limita resultados:

```js
GET /products?limit=50&cursor=abc
```

## Timeouts

Configura timeouts en clientes HTTP y base de datos.

## Buenas practicas

- No bloquear event loop.
- Paginación.
- Pool de conexiones.
- Cache con invalidación.
- Medir p95/p99.
- Evitar payloads enormes.

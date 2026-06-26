# Rendimiento y buenas practicas

NestJS corre sobre Node.js. El rendimiento depende de I/O, base de datos, serializacion, event loop y despliegue.

## Event loop

No bloquees el event loop con CPU intensiva.

## Paginacion

```ts
@Get()
findAll(@Query('limit', ParseIntPipe) limit = 50) {}
```

Limita maximos.

## Cache

Usa cache para lecturas frecuentes con invalidacion clara.

## Base de datos

El cuello suele estar en queries, indices o pool.

## Buenas practicas

- Validar input temprano.
- Paginacion siempre.
- Timeouts en clientes externos.
- Evitar CPU pesado en request.
- Medir p95/p99.
- Usar Fastify adapter si el caso lo justifica.

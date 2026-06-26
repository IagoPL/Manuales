# Observabilidad y errores

Una API Express necesita logs estructurados, métricas, health checks y trazas.

## Logging

Usa pino, winston u otro logger estructurado.

```js
logger.info({ requestId, path: req.path }, 'request received')
```

## Health

```js
app.get('/health', healthHandler)
```

## Métricas

Prometheus puede medir:

- Requests.
- Latencia.
- Errores.
- Event loop lag.

## Errores

Centraliza error handler y usa códigos estables.

## Buenas practicas

- Logs JSON.
- Request IDs.
- No stack traces al cliente.
- Alertas por 5xx.
- Trazas con OpenTelemetry.

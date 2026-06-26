# Observabilidad y errores

NestJS debe exponer errores consistentes, logs estructurados, metricas y trazas.

## Exception filter global

```ts
app.useGlobalFilters(new HttpExceptionFilter())
```

## Logging

Incluye:

- request id.
- method.
- path.
- status.
- duration.
- user id si aplica.

## Metrics

Prometheus puede medir:

- Requests.
- Latencia.
- Errores.
- Uso de memoria.

## Tracing

OpenTelemetry permite seguir peticiones entre servicios.

## Buenas practicas

- Formato de error estable.
- No mostrar stack traces.
- Logs a stdout.
- Correlation IDs.
- Health endpoint.
- Alertas accionables.

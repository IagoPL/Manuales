# Observabilidad y errores

Django en producción debe tener logs, métricas, health checks, trazas y errores controlados.

## Logging

Configura `LOGGING` para salida estructurada y niveles por módulo.

## Health check

Endpoint simple:

```python
def health(request):
    return JsonResponse({"status": "ok"})
```

## Errores

No muestres páginas técnicas con `DEBUG=True` en producción.

## Métricas

Puedes usar Prometheus, OpenTelemetry o herramientas SaaS.

## Buenas practicas

- Logs a stdout.
- Sentry o similar para errores.
- Health check.
- Métricas de latencia.
- Alertas por 5xx.

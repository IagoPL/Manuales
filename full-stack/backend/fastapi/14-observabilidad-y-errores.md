# Observabilidad y errores

Una API FastAPI debe exponer logs, metricas, trazas y errores consistentes.

## Error handler

```python
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message},
    )
```

## Logs estructurados

Incluye:

- request id.
- metodo.
- path.
- status code.
- duracion.
- user id si aplica.

## Metricas

Prometheus puede capturar:

- Request count.
- Latencia.
- Errores.
- Duracion de DB.

## Tracing

OpenTelemetry permite seguir peticiones entre servicios.

## Buenas practicas

- Errores con formato estable.
- No exponer stack traces.
- Logs a stdout.
- Correlation id.
- Health checks.
- Dashboards y alertas.

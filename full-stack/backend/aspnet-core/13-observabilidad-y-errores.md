# Observabilidad y errores

Una API ASP.NET Core necesita logs estructurados, métricas, tracing, health checks y errores consistentes.

## Logging

```csharp
logger.LogInformation("Product {ProductId} requested", id);
```

Usa propiedades estructuradas, no solo strings.

## Health checks

```csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString);
```

## OpenTelemetry

Permite trazas y métricas estándar.

## ProblemDetails

Usa un formato consistente para errores HTTP.

## Buenas practicas

- Logs estructurados.
- Correlation ID.
- Health checks.
- Métricas por endpoint.
- No exponer detalles internos.
- Alertas por 5xx y latencia.

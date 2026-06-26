# Observabilidad y diagnostico

Una API profesional debe poder diagnosticarse en produccion sin adivinar.

## Correlation id

Cada request deberia tener un identificador:

```txt
X-Request-Id: req_123
```

Este ID debe aparecer en logs, errores, trazas y eventos relacionados.

## Logs utiles

Registra:

- Metodo y ruta.
- Status code.
- Duracion.
- Usuario o cliente, si aplica.
- Error code.
- Request id.

Evita passwords, tokens, datos personales innecesarios y payloads completos sin control.

## Metricas

Metricas minimas:

- Requests por endpoint.
- Latencia p50, p95, p99.
- Ratio de errores 4xx y 5xx.
- Rate limit hits.
- Timeouts de dependencias.

## Trazas distribuidas

Una traza debe mostrar:

```txt
API Gateway
  -> Backend
  -> Database
  -> External API
  -> Queue
```

Esto es clave en microservicios y sistemas event-driven.

## Diagnostico de errores

Un error de API deberia incluir `traceId`, pero no detalles internos.

```json
{
  "type": "internal_error",
  "message": "Unexpected error.",
  "traceId": "req_123"
}
```

## Checklist

- Cada respuesta de error incluye trace id.
- Hay metricas por endpoint.
- Hay alertas sobre 5xx y latencia.
- Los logs no filtran secretos.
- Las dependencias externas se miden por separado.

# Rendimiento cache y rate limiting

El rendimiento de una API no depende solo del codigo. Tambien depende del contrato, la paginacion, la cache y los limites.

## Evitar respuestas gigantes

Toda lista debe tener limite.

```txt
GET /orders?limit=50
```

Define un maximo:

```txt
limit <= 100
```

## Cache HTTP

Headers utiles:

```txt
Cache-Control: public, max-age=60
ETag: "abc123"
```

Con ETag:

```txt
If-None-Match: "abc123"
304 Not Modified
```

## Cache privada

Para datos de usuario:

```txt
Cache-Control: private, max-age=30
```

No caches informacion sensible en caches compartidas.

## Compresion

Usa gzip o brotli para respuestas grandes, especialmente JSON.

## Rate limiting

Protege la API de abuso o errores de clientes:

```txt
429 Too Many Requests
Retry-After: 60
```

Define limites por IP, usuario, API key o endpoint critico.

## Timeouts

Toda llamada externa debe tener timeout. Una API sin timeouts puede agotar recursos muy rapido.

## Checklist

- Las listas tienen limite maximo.
- Los endpoints cacheables usan headers.
- Hay compresion.
- Hay rate limiting.
- Las dependencias tienen timeouts.
- Se monitoriza latencia p95 y p99.

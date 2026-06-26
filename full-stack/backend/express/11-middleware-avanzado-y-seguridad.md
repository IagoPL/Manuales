# Middleware avanzado y seguridad

El middleware permite añadir seguridad, logging, compresión, rate limiting y parsing.

## Helmet

```js
import helmet from 'helmet'

app.use(helmet())
```

## CORS

```js
import cors from 'cors'

app.use(cors({ origin: ['https://app.example.com'], credentials: true }))
```

## Rate limiting

```js
app.use(rateLimit({ windowMs: 60_000, limit: 100 }))
```

## Request id

Añade identificador por request para trazabilidad.

## Buenas practicas

- Helmet.
- CORS restrictivo.
- Rate limiting.
- Body size limit.
- Sanitizar entradas.
- No exponer stack traces.

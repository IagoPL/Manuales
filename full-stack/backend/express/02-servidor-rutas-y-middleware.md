# Servidor, rutas y middleware

Express es minimalista: ofrece una capa HTTP flexible basada en rutas y middleware.

## Servidor basico

```js
import express from 'express'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(3000)
```

## Router

```js
const router = express.Router()

router.get('/:id', getProduct)
router.post('/', createProduct)

app.use('/api/products', router)
```

## Middleware

```js
function requestLogger(req, res, next) {
  console.log(req.method, req.path)
  next()
}

app.use(requestLogger)
```

## Orden

El orden importa. Un middleware registrado antes se ejecuta antes.

## Buenas practicas

- Usa routers por dominio.
- Registra `express.json()`.
- Mantén handlers pequeños.
- Centraliza errores.
- No mezcles arranque del servidor con la app testeable.

# Request, response y errores

Express trabaja directamente con `req`, `res` y `next`. Una API profesional necesita respuestas consistentes y errores centralizados.

## Request params

```js
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id)
  res.json({ id })
})
```

## Query params

```js
app.get('/products', (req, res) => {
  const { search, page = '1' } = req.query
  res.json({ search, page: Number(page) })
})
```

## Response

```js
res.status(201).json(product)
```

## Error handler

```js
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode ?? 500).json({
    code: err.code ?? 'INTERNAL_ERROR',
    message: err.message ?? 'Unexpected error',
  })
})
```

## Async errors

En Express 5, errores en handlers async se propagan mejor. En Express 4, usa wrapper o `next(err)`.

## Buenas practicas

- Errores con formato estable.
- No exponer stack traces.
- Códigos HTTP coherentes.
- Request IDs.
- Tests de errores.

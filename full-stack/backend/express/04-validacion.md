# Validación

Express no trae validación integrada. Puedes usar Zod, Joi, Yup o express-validator.

## Zod

```js
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1).max(120),
  price: z.number().nonnegative(),
})
```

## Middleware de validación

```js
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', errors: result.error.flatten() })
    }
    req.body = result.data
    next()
  }
}
```

## Uso

```js
router.post('/', validateBody(createProductSchema), createProduct)
```

## Buenas practicas

- Valida body, params y query.
- No confíes en tipos del cliente.
- Reutiliza schemas.
- Devuelve errores claros.
- Valida negocio en servicios.

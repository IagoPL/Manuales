# Testing

Express se prueba bien separando `app` de `listen` y usando Supertest.

## App testeable

```js
export const app = express()
app.get('/health', healthHandler)
```

Servidor:

```js
app.listen(3000)
```

## Supertest

```js
import request from 'supertest'
import { app } from '../src/app.js'

test('health', async () => {
  await request(app).get('/health').expect(200)
})
```

## Tests de servicios

```js
test('calculates total', () => {
  expect(calculateTotal([{ price: 10 }, { price: 20 }])).toBe(30)
})
```

## Buenas practicas

- Testea handlers y servicios.
- Mockea clientes externos.
- Usa base de test.
- Cubre errores 400/401/403/404.
- Ejecuta tests en CI.

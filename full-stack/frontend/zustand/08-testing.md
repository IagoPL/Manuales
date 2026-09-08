# Testing

El usuario no ve Zustand. Prioriza **comportamiento** (RTL) y, si la lógica del store es densa, **acciones** con `getState`. Un store de módulo **conserva** state entre tests: hay que resetear.

Documentación: [testing](https://zustand.docs.pmnd.rs/learn/guides/testing).

## Store: acciones

```js
import { useCarritoStore } from './carritoStore'

const inicial = useCarritoStore.getInitialState()

beforeEach(() => {
  useCarritoStore.setState(inicial, true)
})

test('anadir empuja una linea', () => {
  useCarritoStore.getState().anadir('sku-1')
  expect(useCarritoStore.getState().lineas).toHaveLength(1)
})
```

`setState(inicial, true)` **reemplaza** (no merge). Sin `true` puedes dejar claves viejas.

La guía oficial mockea `zustand` para registrar cada `create`/`createStore` y resetear en `afterEach` con `getInitialState`. Úsalo cuando hay muchos stores; para uno, el `beforeEach` basta.

## Componentes: RTL + store real

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MiniCarrito } from './MiniCarrito'

test('al pulsar, el contador pasa a 1', async () => {
  const user = userEvent.setup()
  render(<MiniCarrito />)
  await user.click(screen.getByRole('button', { name: /carrito/i }))
  expect(screen.getByRole('button', { name: /carrito \(1\)/i })).toBeInTheDocument()
})
```

No mockees el hook de Zustand como primera estrategia. Prefiere estado controlado (`setState` antes del render) o un **store por test** con Provider (capítulo 6).

## Persist

No unit-testees `localStorage` en todos los casos. Si importa: storage de mentira o mock, y aserta `tema` tras `rehydrate`, no el JSON interno del middleware. La mayoría de tests pueden usar el store **sin** `persist`.

## Aislamiento

Tests que dependen del orden = el store global se filtró. Reset o `createStore()` fresco + Context. El mock oficial evita que el test B herede el carrito del A.

## Errores habituales

- Un `describe` que asume `lineas` vacío porque “el archivo anterior lo vació”.
- Snapshot del objeto middleware.
- Mock de `useCarritoStore` que no se parece al store.

## Buenas prácticas

- Reset explícito o mock de la guía.
- RTL para clicks; `getState` para reglas raras (`checkout` que vacía).
- Misma receta que Redux: no testees el type de la action.

## Ejercicio

1. Test de `anadir` + reset entre casos.
2. RTL sobre `MiniCarrito`.
3. Crea un store por test con `createStore` y envuélvelo.

Fin del manual Zustand.

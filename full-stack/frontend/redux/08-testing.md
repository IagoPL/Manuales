# Testing

El usuario no sabe si hay Redux. El equipo Redux recomienda **tests de integración**: componente + `Provider` + **store real**. Mockea la red, no `useSelector` / `useDispatch`.

Documentación: [Writing Tests](https://redux.js.org/usage/writing-tests), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [MSW](https://mswjs.io/).

## Integración (estrategia principal)

Vitest (o Jest) + RTL o **Vitest Browser Mode**. Store con `configureStore` y el mismo reducer que producción (o un `setupStore(preloadedState)`). MSW para `/api/tareas`.

```js
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { api } from './api'
import tareasReducer, { tareaAnadida } from './tareasSlice'
import { ListaTareas } from './ListaTareas'

function renderConStore(ui, { preloadedState } = {}) {
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer, tareas: tareasReducer },
    middleware: (gdm) => gdm().concat(api.middleware),
    preloadedState,
  })
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}

test('al pulsar, la tarea aparece como hecha', async () => {
  const user = userEvent.setup()
  renderConStore(<ListaTareas />, {
    preloadedState: {
      tareas: {
        items: [{ id: 't1', titulo: 'Pan', hecha: false }],
        filtro: 'todas',
      },
    },
  })

  await user.click(screen.getByRole('button', { name: /pendiente/i }))
  expect(screen.getByRole('button', { name: /hecha/i })).toBeInTheDocument()
})
```

No asserts de `store.getState()` salvo que depuren un fallo. Lo observable es el DOM.

Para Query, MSW responde `GET /api/tareas` y el test espera el título en pantalla, no `useGetTareasQuery`. Tras el test, `store.dispatch(api.util.resetApiState())` evita caché entre casos si reutilizas el store.

## Unitario: reducer o selector denso

Útil cuando la lógica es pura y fácil de equivocar (reglas de filtro, merge). El reducer de `createSlice` se exporta y se llama como función:

```js
import reducer, { tareaAlternada } from './tareasSlice'

const inicio = { items: [{ id: 't1', titulo: 'Pan', hecha: false }], filtro: 'todas' }
expect(reducer(inicio, tareaAlternada('t1')).items[0].hecha).toBe(true)
```

Si el mismo comportamiento ya lo cubre el test de la lista, no dupliques por deporte.

## Qué no hacer

```js
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: () => vi.fn(),
}))
```

Eso testea tu mock. Tampoco mockees selectors importados del slice como estrategia por defecto.

## Errores habituales

- Un test por cada action type (“el type es `tareas/tareaAnadida`”).
- Store singleton importado en todos los tests sin aislar estado.
- Esperar a `findBy` sin MSW y llorar por el `fetch` real.

## Buenas prácticas

- `setupStore` compartido (como en la doc oficial) con `preloadedState`.
- Hooks tipados (`useAppSelector`) se usan en producción; en el test no hace falta mockearlos.
- Cubre el camino feliz y un error de red (MSW 500 → mensaje).

## Ejercicio

1. Escribe el test de “marcar hecha” contra `ListaTareas`.
2. Añade MSW para `useGetTareasQuery` y espera un título.
3. Intenta (y descarta) mockear `useDispatch`: el test se vuelve inútil al cambiar el slice.

## Siguiente paso

Continúa con [Patrones y buenas prácticas](09-patrones-y-buenas-practicas.md).

# Redux Toolkit

RTK existe para que no escribas a mano action types, creators, `combineReducers`, thunk suelto y DevTools. El paquete oficial es `@reduxjs/toolkit`. Si hoy escribes Redux, **escribes RTK**.

Documentación: [Getting Started](https://redux-toolkit.js.org/introduction/getting-started), [createSlice](https://redux-toolkit.js.org/api/createSlice), [configureStore](https://redux-toolkit.js.org/api/configureStore), [Immer](https://redux-toolkit.js.org/usage/immer-reducers).

## `configureStore`

Además de juntar slices:

- Middleware **thunk** (incluido).
- En desarrollo: avisos si **mutas** el state de verdad o metes valores **no serializables**.
- Conexión a **Redux DevTools**.

Puedes sustituir o concatenar middleware; el capítulo 7 lo hace con listeners. No instales `redux-thunk` aparte: ya viene.

## `createSlice`: tareas

Un slice = nombre + estado inicial + reducers. RTK genera **action creators** y el **reducer**.

```js
import { createSlice } from '@reduxjs/toolkit'

const tareasSlice = createSlice({
  name: 'tareas',
  initialState: { items: [], filtro: 'todas' },
  reducers: {
    tareaAnadida(state, action) {
      state.items.push({
        id: action.payload.id,
        titulo: action.payload.titulo,
        hecha: false,
      })
    },
    tareaAlternada(state, action) {
      const tarea = state.items.find((t) => t.id === action.payload)
      if (tarea) tarea.hecha = !tarea.hecha
    },
    filtroCambiado(state, action) {
      state.filtro = action.payload
    },
  },
})

export const { tareaAnadida, tareaAlternada, filtroCambiado } = tareasSlice.actions
export default tareasSlice.reducer
```

`tareaAnadida({ id, titulo })` despacha algo como `{ type: 'tareas/tareaAnadida', payload: { id, titulo } }`. No declares constantes `TAREAS_ANADIDA`.

Store:

```js
import { configureStore } from '@reduxjs/toolkit'
import tareasReducer from './tareasSlice'

export const store = configureStore({
  reducer: { tareas: tareasReducer },
})
```

## Immer: parece mutar, no muta el state real

Dentro de los reducers de `createSlice` (y `createReducer`) puedes escribir `state.items.push(...)` o `tarea.hecha = !tarea.hecha`. **Immer** intercepta esas escrituras y produce el siguiente estado **inmutable**. El store sigue siendo inmutable; DevTools sigue viendo un diff.

No concluyas “Redux ahora permite mutar el estado”. Fuera del receta de Immer (un reducer a mano, un listener que haga `getState().tareas.items.push`) sigues rompiendo el contrato. Tampoco mutes `action.payload` si vas a reutilizar el objeto.

## En React

```jsx
import { useDispatch, useSelector } from 'react-redux'
import { tareaAnadida, tareaAlternada } from './tareasSlice'

export function ListaTareas() {
  const items = useSelector((state) => state.tareas.items)
  const dispatch = useDispatch()

  return (
    <ul>
      {items.map((t) => (
        <li key={t.id}>
          <button type="button" onClick={() => dispatch(tareaAlternada(t.id))}>
            {t.hecha ? 'Hecha' : 'Pendiente'}
          </button>
          {t.titulo}
        </li>
      ))}
    </ul>
  )
}
```

Un carrito (`lineas`, `cantidad`) o un contador (`increment`) son el mismo patrón; las tareas evitan que todo el manual sea `+1`.

## Errores habituales

- Un único slice `app` de 80 campos: parte por feature (`tareas`, `sesion`).
- Mutar el state **después** de `return` o fuera del reducer.
- Desactivar los checks de serialización “porque molestan” sin entender el valor no serializable.

## Buenas prácticas

- Un fichero de slice por feature; exporta actions, reducer y selectors.
- `name` del slice estable: cambia el `type` de todas las actions.
- Lee el check de serialización como un aliado (persist, DevTools, RTK Query).

## Ejercicio

1. Añade `tareaEliminada` que quite un `id` de `items`.
2. Despacha `tareaAnadida` y `filtroCambiado` y míralos en DevTools.
3. Intenta (en un reducer a mano, no en el slice) hacer `state.items.push` *sin* Immer y observa el aviso en desarrollo.

## Siguiente paso

Continúa con [Slices y async thunks](04-slices-y-async-thunks.md).

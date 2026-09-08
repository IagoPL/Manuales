# Patrones y buenas prácticas

Cierra el tablero: qué vive en Redux, cómo se lee y qué herramienta async usas. Las recomendaciones salen de la [Style Guide](https://redux.js.org/style-guide/) y de RTK.

## Qué guardar (y qué no)

**Sí — estado cliente compartido:** filtro del tablero, `tareaActivaId`, flags de un wizard, metadata de sesión que leen layout y rutas, líneas de un carrito con reglas.

**No, o casi nunca:**

- Valores que puedes **derivar** (`tareasHechas = items.filter(...)`): selector.
- No serializable (componentes, sockets, `Map`).
- Estado de un input que no sale del formulario.
- Una segunda copia de lo que **RTK Query** ya cachea.

## Selectors

```js
export const selectItems = (state) => state.tareas.items
export const selectFiltro = (state) => state.tareas.filtro
export const selectVisibles = (state) => {
  const items = selectItems(state)
  const filtro = selectFiltro(state)
  if (filtro === 'hechas') return items.filter((t) => t.hecha)
  if (filtro === 'pendientes') return items.filter((t) => !t.hecha)
  return items
}
```

Si la derivación es cara y el componente se renderiza mucho, `createSelector` (reexportado por RTK) memoiza por argumentos. **No** memoices todos los selectors el día uno. `useSelector(selectVisibles)` debe devolver la **misma referencia** si el resultado no cambió; si creas un array nuevo en cada llamada sin memo, el componente se pinta siempre.

Granularidad: un `useSelector` por dato que el componente usa, o un selector que devuelva un objeto memoizado. Evita `useSelector(s => s)` (cualquier action re-renderiza).

## Estructura

Organiza por **feature**: `features/tareas/tareasSlice.js`, `ListaTareas.jsx`, tests al lado. Un `store.js` que solo ensambla reducers y middleware. No un `actions/`, `reducers/`, `constants/` por tipo de fichero (el estilo 2016).

## TypeScript (sin convertirlo en un curso)

Infieres desde el store y usas hooks tipados (React-Redux actual):

```ts
import { useDispatch, useSelector } from 'react-redux'
import type { store } from './store'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

En JS, los mismos hooks sin tipos. No inventes `interface Action { type: string }` a mano para cada slice: `createSlice` ya los genera.

## Async: regla mental

```text
fetching / caché HTTP     →  RTK Query
orquestación async puntual →  createAsyncThunk
reaccionar a action/state  →  listener middleware
```

Redux-Saga o un thunk que reimplementa caché no son el default.

## DevTools y rendimiento

Usa DevTools para ver actions, diffs y time-travel. Si una action es enorme (pegar un blob), revisa qué metes en el payload.

Rendimiento: primero selectors y granularidad; `React.memo` en listas grandes; no “normalices todo” ni “memoices todo” por anticipado. El check de serialización en producción se apaga con el resto del middleware de dev.

## APIs que este manual no recomienda para código nuevo

| Legacy / low-level | En su lugar |
| --- | --- |
| `createStore` | `configureStore` |
| `switch` + constantes + creators a mano | `createSlice` |
| `connect` / `mapStateToProps` | `useSelector` / `useDispatch` |
| `redux-thunk` como dependencia extra | ya viene en RTK |
| Saga como efecto por defecto | listener / Query / thunk |

Siguen existiendo en repos viejos; mígralos por feature, no en un big-bang.

## Errores habituales

- Store como “base de datos del cliente”.
- Optimizar `selectVisibles` antes de medir.
- Copiar `data` de Query al entity adapter “por si acaso”.

## Buenas prácticas

- Un store, slices por feature, Query para el servidor, DevTools abiertas.
- Tests que pulsan la UI (capítulo 8).
- Pregunta de 01: ¿hace falta Redux aquí?

## Ejercicio

1. Extrae `selectVisibles` y úsalo en `ListaTareas`.
2. Añade `RootState` / `useAppSelector` si el repo es TS.
3. Relee el tablero 01–08 y marca cada dato: local / cliente / servidor.

Fin del manual Redux.

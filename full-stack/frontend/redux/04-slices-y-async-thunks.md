# Slices y async thunks

El slice del capítulo 3 solo reaccionaba a clicks. Cuando la lógica async **no** es “traer y cachear un recurso HTTP”, `createAsyncThunk` despacha `pending` / `fulfilled` / `rejected` y el slice las atiende en `extraReducers`.

Si el caso es lista + detalle + mutaciones de **datos de servidor**, el valor por defecto del equipo Redux es **RTK Query** (capítulo 6). No escribas un thunk + `loading` + caché artesanal para eso.

Documentación: [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk), [createSlice extraReducers](https://redux-toolkit.js.org/api/createSlice#the-extrareducers-builder-callback-notation).

## Estructura del slice async

Un thunk no vive “dentro” de `reducers:`: esas keys generan actions síncronas. Las actions del thunk se enganchan con el **builder**:

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const hidratarBorrador = createAsyncThunk(
  'tareas/hidratarBorrador',
  async (tableroId) => {
    const res = await fetch(`/interno/borradores/${tableroId}`)
    if (!res.ok) throw new Error('borrador')
    return res.json()
  },
)

const tareasSlice = createSlice({
  name: 'tareas',
  initialState: {
    items: [],
    filtro: 'todas',
    estado: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    tareaAnadida(state, action) {
      state.items.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hidratarBorrador.pending, (state) => {
        state.estado = 'loading'
        state.error = null
      })
      .addCase(hidratarBorrador.fulfilled, (state, action) => {
        state.estado = 'succeeded'
        state.items = action.payload.items
      })
      .addCase(hidratarBorrador.rejected, (state, action) => {
        state.estado = 'failed'
        state.error = action.error.message ?? 'error'
      })
  },
})
```

`hidratarBorrador` es un ejemplo de **orquestación** (un payload interno, no el CRUD público de tareas). El GET `/api/tareas` del producto va en el capítulo 6.

## `pending`, `fulfilled`, `rejected`

| Action | Cuándo | Uso típico |
| --- | --- | --- |
| `pending` | Antes del `await` | Spinner, desactivar el botón. |
| `fulfilled` | El payload que **devolviste** | Escribir en el state. |
| `rejected` | `throw` o `rejectWithValue` | Mensaje; no pises `items` si no debes. |

El thunk middleware (ya en `configureStore`) ejecuta la función async. No instales `redux-thunk` a mano.

## `unwrap()`

`dispatch(hidratarBorrador(id))` cumple siempre como Promise de action. Si en el componente quieres **éxito o excepción**:

```js
try {
  const datos = await dispatch(hidratarBorrador(tableroId)).unwrap()
  // datos === action.payload
} catch (err) {
  // rejected
}
```

Útil tras un submit. No sustituye pintar `estado === 'failed'` en la lista.

## Cuándo thunk y cuándo Query

| Situación | Herramienta |
| --- | --- |
| GET/POST REST, caché, deduplicar, invalidar | RTK Query |
| Varios pasos no HTTP, coordinar slices, one-shot | `createAsyncThunk` |
| “Cuando ocurra esta action, dispara un efecto” | Listener (capítulo 7) |

Los capítulos 04 y 06 no compiten: el thunk no es “el fetch oficial”; Query no borra toda la lógica async.

## Errores habituales

- Reimplementar caché (`Map` de URLs, stale-while-revalidate) en el slice.
- Tratar `rejected` como si `items` siguiera siendo la verdad del servidor sin criterio.
- Poner lógica async *dentro* de un reducer.

## Buenas prácticas

- Prefijo de tipo (`tareas/hidratarBorrador`) único.
- `rejectWithValue` cuando el cuerpo de error de la API importa en la UI.
- Deja el CRUD de tareas para `createApi`.

## Ejercicio

1. Despacha el thunk y sigue `pending` → `fulfilled` en DevTools.
2. Fuerza un `throw` y comprueba `estado === 'failed'` y `unwrap()`.
3. Escribe en una frase por qué el listado `/api/tareas` no debería vivir aquí.

## Siguiente paso

Continúa con [Normalización de estado](05-normalizacion-de-estado.md).

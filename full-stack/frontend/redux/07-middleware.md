# Middleware

Un middleware se sienta **entre** `dispatch` y el reducer: ve la action, puede loguear, retrasar, o despachar más cosas. El reducer sigue siendo puro.

```text
dispatch(action)  →  middleware…  →  reducer  →  nuevo state
```

Documentación: [Redux middleware](https://redux.js.org/understanding/history-and-design/middleware), [configureStore middleware](https://redux-toolkit.js.org/api/configureStore#middleware), [createListenerMiddleware](https://redux-toolkit.js.org/api/createListenerMiddleware).

## Lo que ya trae RTK

`configureStore` instala por defecto:

- **Thunk:** funciones como actions (y `createAsyncThunk`).
- **Inmutabilidad** (dev): avisa si mutaste el state de verdad.
- **Serialización** (dev): avisa si el state/action no es JSON-friendly.

No escribas un middleware custom para “añadir thunk” o “conectar DevTools”. No instales `redux-saga` como primera opción: es potente y legacy-común en repos antiguos; para “cuando ocurra X, haz Y” usa **listener middleware**.

Observables (`redux-observable`) igual: avanzado, no el default.

## Listener: reaccionar a una action

```js
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import tareasReducer, { tareaAlternada } from './tareasSlice'
import { api } from './api'

const listener = createListenerMiddleware()

// `items` es la forma de los caps. 3–4; con entity adapter usarías selectById.
listener.startListening({
  actionCreator: tareaAlternada,
  effect: async (action, listenerApi) => {
    const id = action.payload
    const tarea = listenerApi
      .getState()
      .tareas.items.find((t) => t.id === id)
    if (tarea.hecha) {
      // efecto: analítica, toast, persistencia local… no el GET de la lista
      console.info('tarea completada', id)
    }
  },
})

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    tareas: tareasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listener.middleware) // antes del check de serialización
      .concat(api.middleware),
})
```

`startListening` admite `actionCreator`, `type`, `matcher` o un `predicate` (incluido “cambió este trozo de state”). El `effect` corre **después** del reducer. `prepend` evita que el check de serialización se queje de las actions internas del listener (llevan funciones).

Esto no es para cachear `/api/tareas`: eso es Query.

## Middleware custom mínimo

Solo si RTK no cubre el caso (p. ej. un logger propio en un entorno sin DevTools):

```js
const crono = (storeApi) => (next) => (action) => {
  const t0 = performance.now()
  const result = next(action)
  if (performance.now() - t0 > 16) {
    console.warn('reducer lento', action.type)
  }
  return result
}
```

`next(action)` sigue la cadena. Olvidar `return next(...)` se traga la action. Encadena con `getDefaultMiddleware().concat(crono)`.

## Errores habituales

- Saga “porque en el curso de 2018 salía”.
- Middleware que muta `action.payload` para todos los slices.
- Listener que vuelve a implementar fetching (usa Query o un thunk).

## Buenas prácticas

- Efectos reactivos → listener; HTTP cacheable → Query; orquestación puntual → thunk.
- Un listener por intención (`tarea completada`), no un “god listener”.
- En tests, puedes omitir listeners no relacionados en un `configureStore` de prueba.

## Ejercicio

1. Completa una tarea y comprueba que el `effect` corre una vez por `tareaAlternada`.
2. Cambia el listener a un `predicate` que mire `items` hechas y no el type.
3. Quita `prepend` en un branch de prueba y lee el warning de serialización (dev).

## Siguiente paso

Continúa con [Testing](08-testing.md).

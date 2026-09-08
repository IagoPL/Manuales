# RTK Query

Los datos cuyo origen autoritativo es el backend son **server state**. RTK Query es la **recomendación por defecto** del equipo Redux para fetching y caché en una app Redux: deduplica peticiones, guarda el resultado, expone loading/error y genera hooks.

No sustituye toda la lógica async (capítulos 4 y 7). Sí sustituye el patrón `fetch` → thunk → `loading` → caché manual para CRUD HTTP habitual.

Documentación: [RTK Query overview](https://redux-toolkit.js.org/rtk-query/overview), [Queries](https://redux-toolkit.js.org/rtk-query/usage/queries), [Mutations](https://redux-toolkit.js.org/rtk-query/usage/mutations), [createApi](https://redux-toolkit.js.org/rtk-query/api/createApi).

## `createApi` + `fetchBaseQuery`

Con React, importa desde `@reduxjs/toolkit/query/react` para obtener los hooks.

```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Tareas'],
  endpoints: (build) => ({
    getTareas: build.query({
      query: () => 'tareas',
      providesTags: ['Tareas'],
    }),
    addTarea: build.mutation({
      query: (body) => ({ url: 'tareas', method: 'POST', body }),
      invalidatesTags: ['Tareas'],
    }),
  }),
})

export const { useGetTareasQuery, useAddTareaMutation } = api
```

`fetchBaseQuery` envuelve `fetch`. Un `baseUrl` por API; varios `createApi` si hay orígenes distintos.

## Store

Hay que registrar **reducer y middleware**. Sin el middleware no hay caché ni invalidación.

```js
import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import tareasReducer from './tareasSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    tareas: tareasReducer, // UI cliente: filtro, selección
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})
```

`tareasSlice` aquí es estado **cliente** (filtro), no una segunda copia de `/tareas`.

## Hooks: data, loading, error

```jsx
function Tablero() {
  const { data, error, isLoading } = useGetTareasQuery()
  const [addTarea, { isLoading: guardando }] = useAddTareaMutation()

  if (isLoading) return <p>Cargando…</p>
  if (error) return <p>No se pudieron cargar las tareas</p>

  return (
    <ul>
      {data.map((t) => (
        <li key={t.id}>{t.titulo}</li>
      ))}
    </ul>
  )
}
```

`isLoading` es la primera carga sin dato; `isFetching` incluye refetch con dato previo. La mutación **invalida** la etiqueta `Tareas` y Query vuelve a pedir `getTareas` (o marca el cache stale, según config).

`setupListeners(store.dispatch)` habilita `refetchOnFocus` / `refetchOnReconnect` si los activas en el endpoint o en `createApi`.

## Errores habituales

- Olvidar `api.middleware` y preguntarse por qué no refetch-ea.
- Copiar `data` al slice de entidades “para normalizarlo” sin necesidad (Query ya es la caché).
- Un `createApi` gigante con 40 endpoints no relacionados; parte por base URL / bounded context.

## Buenas prácticas

- Tags (`providesTags` / `invalidatesTags`) en lugar de `refetch()` por todas partes.
- Estado cliente (filtro, item seleccionado) **fuera** de `api`.
- Auth: `prepareHeaders` en `fetchBaseQuery` leyendo el token del `getState()`, no hardcodeado.

## Ejercicio

1. Monta `getTareas` + `addTarea` y comprueba en DevTools las actions `api/...`.
2. Quita `invalidatesTags` y observa que la lista no se actualiza tras el POST.
3. Añade un `filtro` en el slice de UI y filtra `data` en el componente o un selector.

## Siguiente paso

Continúa con [Middleware](07-middleware.md).

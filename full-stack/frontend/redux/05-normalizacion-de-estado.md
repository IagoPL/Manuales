# Normalización de estado

Anidar autores dentro de cada tarea duplica datos y complica un rename:

```text
tareas: [
  { id: 't1', titulo: 'Pan', autor: { id: 'u1', nombre: 'Ana' } },
  { id: 't2', titulo: 'Leche', autor: { id: 'u1', nombre: 'Ana' } },
]
```

Cambiar el nombre de Ana implica recorrer todas las tareas. La forma **normalizada** guarda cada entidad una vez y relaciona por id:

```text
usuarios.ids / usuarios.entities
tareas.ids / tareas.entities     (autorId: 'u1')
```

No todo el state debe ser `{ ids, entities }`. Un `filtro: 'todas'` o un `wizardStep` se quedan planos. Normaliza **colecciones** que actualizas por id o compartes entre pantallas.

Documentación: [Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape), [createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter).

## `createEntityAdapter`

RTK genera reducers CRUD y selectors memoizados sobre `{ ids, entities }`. El id por defecto es `entity.id`.

```js
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const tareasAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.titulo.localeCompare(b.titulo),
})

const usuariosAdapter = createEntityAdapter()

const tareasSlice = createSlice({
  name: 'tareas',
  initialState: tareasAdapter.getInitialState({ filtro: 'todas' }),
  reducers: {
    tareasRecibidas: tareasAdapter.setAll,
    tareaUpsert: tareasAdapter.upsertOne,
    tareaQuitada: tareasAdapter.removeOne,
  },
})

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: usuariosAdapter.getInitialState(),
  reducers: {
    usuariosRecibidos: usuariosAdapter.setAll,
  },
})

export const tareasSelectors = tareasAdapter.getSelectors((state) => state.tareas)
export const usuariosSelectors = usuariosAdapter.getSelectors((state) => state.usuarios)
```

`setAll` sustituye la colección (carga inicial). `upsertOne` crea o mezcla campos. `updateOne` espera `{ id, changes }`.

Relación: la tarea guarda `autorId`, no el objeto autor. El nombre se resuelve en un selector o en la vista:

```js
const tarea = tareasSelectors.selectById(state, 't1')
const autor = tarea ? usuariosSelectors.selectById(state, tarea.autorId) : undefined
```

`selectAll` devuelve el array ordenado; `selectById` es O(1) de cara al mapa.

## Qué no normalizar

- Un único `sesion.usuarioId` (no hay colección).
- Borradores efímeros de un formulario.
- Respuestas de RTK Query: **Query ya cachea** por endpoint/argumento. No copies esa lista a `tareas.entities` “para tenerla en Redux” (la tienes dos veces). Si necesitas ids para UI cliente, deriva con un selector sobre `api.endpoints...` o guarda solo selección (`tareaActivaId`).

## Errores habituales

- Normalizar un array de tres flags.
- Mutar `entities[id]` fuera del adapter (pierdes `ids` alineado).
- IDs no estables (índice del array como id).

## Buenas prácticas

- `getInitialState({ filtro })` para mezclar metadatos con la tabla.
- Selectors del adapter exportados junto al slice.
- Relaciones por id; joins en selectors, no en cada reducer.

## Ejercicio

1. Parte un JSON anidado (tarea + autor) en dos `setAll`.
2. Renombra un usuario y comprueba que las tareas no necesitan update.
3. Deja `filtro` fuera de `entities` y léelo con un selector propio.

## Siguiente paso

Continúa con [RTK Query](06-rtk-query.md).

# Store, actions, reducers y dispatch

El modelo mental no ha cambiado: un **store** guarda el **state**; un **reducer** es una función pura `(state, action) => nextState`; **dispatch** entrega la action al store. Un **selector** lee (y a veces deriva) sin escribir.

Documentación: [Redux core concepts](https://redux.js.org/tutorials/essentials/part-1-overview-concepts), [configureStore](https://redux-toolkit.js.org/api/configureStore), [inmutabilidad](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns).

## Piezas

| Pieza | Rol |
| --- | --- |
| **State** | Árbol serializable (objetos, arrays, primitivos). Nada de funciones, promesas ni instancias de clase. |
| **Action** | Objeto `{ type, payload? }` que *describe* lo ocurrido. |
| **Reducer** | Puro: mismo input → mismo output; no hace `fetch` ni toca el DOM. |
| **Store** | `getState()`, `dispatch()`, `subscribe()`. En la práctica lo crea RTK. |
| **Selector** | `state => state.tareas.items` o una derivación (`items.filter(...)`). |

**Inmutabilidad:** el reducer **devuelve** un estado nuevo (o el mismo referencia si no cambió). No hace `state.items.push(...)` a mano sobre el objeto real. En el capítulo 3 Immer *simula* mutaciones y genera esa copia por ti.

## Reducer conceptual (para entender el core)

Sin store todavía: una función que podrías testear con `expect(reducer(s, a)).toEqual(...)`.

```js
const inicial = { items: [] }

function tareasReducer(state = inicial, action) {
  if (action.type === 'tareas/anadida') {
    return { items: [...state.items, action.payload] }
  }
  return state
}

const despues = tareasReducer(inicial, {
  type: 'tareas/anadida',
  payload: { id: 't1', titulo: 'Comprar pan', hecha: false },
})
```

Esto es Redux “desnudo”: `switch (action.type)` y constantes `TAREAS_ANADIDA` son el mismo modelo, más verboso. **No** es cómo montas una app nueva.

`createStore` del paquete `redux` es la API de bajo nivel que RTK envuelve. El equipo la considera **obsoleta para código nuevo**; no la uses como receta.

## Implementación práctica: `configureStore`

```js
import { configureStore } from '@reduxjs/toolkit'
import tareasReducer from './tareasSlice'

export const store = configureStore({
  reducer: {
    tareas: tareasReducer,
  },
})

store.dispatch({
  type: 'tareas/anadida',
  payload: { id: 't1', titulo: 'Comprar pan', hecha: false },
})

const items = store.getState().tareas.items
```

Una llamada hace el trabajo que antes era `combineReducers` + thunk + DevTools + comprobaciones en desarrollo (mutación y serialización). El reducer del slice lo escribe `createSlice` en el [capítulo 3](03-redux-toolkit.md); aquí basta saber que **la clave `tareas` es la rama del estado**.

En React:

```jsx
import { Provider } from 'react-redux'
import { store } from './store'

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```

Dentro de `App`: `useDispatch()` para mandar actions; `useSelector(state => state.tareas.items)` para leer. `connect` / `mapStateToProps` es el puente de class components: legacy, no el camino de este manual.

## Errores habituales

- Mutar `state` en un reducer escrito a mano (`state.items.push`).
- Meter un `Date` o un axios instance en el state: DevTools y persistencia se rompen; el check de serialización avisa en desarrollo.
- Despachar desde el reducer.

## Buenas prácticas

- Actions con `type` estable y `payload` explícito; RTK las genera (cap. 3).
- Selectors pequeños en el mismo fichero del slice.
- Un store por app, no uno por pantalla.

## Ejercicio

1. Ejecuta el reducer conceptual dos veces seguidas con la misma action y comprueba que no reutilizas el array `items` (referencias distintas).
2. Monta `configureStore` con `{ tareas: tareasReducer }` y lee `getState()`.
3. Envuelve un componente en `Provider` y pinta `items.length` con `useSelector`.

## Siguiente paso

Continúa con [Redux Toolkit](03-redux-toolkit.md).

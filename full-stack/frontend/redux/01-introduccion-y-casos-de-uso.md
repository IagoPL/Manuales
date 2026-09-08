# Introducción y casos de uso

Redux guarda **estado global** en un único store y lo cambia solo con **acciones**. La UI no muta el estado a escondidas: despacha, el reducer calcula el siguiente valor, la UI se vuelve a pintar.

Tres piezas que no son lo mismo:

| Qué | Paquete / idea | Para qué |
| --- | --- | --- |
| **Redux** | El modelo: store, `dispatch`, reducer, estado. | Coordinar estado compartido. |
| **Redux Toolkit (RTK)** | `@reduxjs/toolkit` | Forma **oficial y recomendada** de escribir Redux hoy. |
| **React-Redux** | `react-redux` | Conectar ese store a componentes React (`Provider`, `useSelector`, `useDispatch`). |

Redux no exige React. Este manual vive en frontend y los ejemplos usan React porque es el caso habitual. Documentación: [Why RTK is how to use Redux today](https://redux.js.org/introduction/why-rtk-is-redux-today), [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts), [Getting Started (RTK)](https://redux-toolkit.js.org/introduction/getting-started), [React-Redux](https://react-redux.js.org/).

## El flujo

```text
UI  →  dispatch(action)  →  store / reducer  →  nuevo estado  →  UI
```

Unidireccional: no hay “el componente escribió en el store”. La extensión **Redux DevTools** enseña cada acción y el estado resultante; instálala en el navegador y RTK la conecta por defecto.

## Estado local, global, servidor

- **Local:** un input, un modal, un acordeón. `useState` o estado del propio componente.
- **Cliente global:** lo que varias zonas deben ver igual *ahora*: sesión/auth metadata, carrito con reglas, filtros de un tablero, un wizard de varios pasos, preferencias de UI.
- **Servidor:** el origen de verdad está en la API (lista de tareas, perfil). Eso es **caché**, no “el store como base de datos”. En Redux moderno va a **RTK Query** (capítulo 6), no a un `fetch` + flags a mano.

## Cuándo tiene sentido

- Auth/sesión que leen header, rutas y varios paneles.
- Carrito o tablero con reglas (cantidades, estados, undo).
- Preferencias o flags que atraviesan layouts.
- Workflows compartidos (selección + panel de detalle + atajos).

## Cuándo no lo necesitas

Una ficha con tres `useState`, un formulario aislado, o datos que solo vive un hook de React Query / el propio framework. Context basta para un tema o un usuario ya resuelto. **Redux no es obligatorio** en un proyecto React.

El dominio del manual: un **tablero de tareas** (título, hecha, autor). Los capítulos 2–3 montan el store; 4 y 6 se reparten async (thunk vs Query); 5 normaliza; 7–9 cierran efectos, tests y criterios.

## Errores habituales

- Meter *todo* el árbol de React en Redux “por si acaso”.
- Tratar el store como caché HTTP sin RTK Query (duplicas loading, refetch y consistencia).
- Empezar una app nueva con `createStore` + `switch` + constantes: es el núcleo, no el camino actual.

## Buenas prácticas

- Empieza con RTK (`configureStore`, `createSlice`). El core clásico sirve para *entender*, no para el esqueleto del repo.
- Pregunta: ¿quién más necesita este dato? Si la respuesta es “este componente”, no es Redux.
- Abre DevTools el primer día: ver acciones es más barato que adivinar.

## Ejercicio

1. Lista tres estados de una app que uses y clasifícalos: local / cliente global / servidor.
2. Instala Redux DevTools y reconoce la lista de acciones (aunque aún vacía).
3. Lee *Why RTK is how to use Redux today* y anota qué APIs sustituyen al boilerplate clásico.

## Siguiente paso

Continúa con [Store, actions, reducers y dispatch](02-store-actions-reducers-y-dispatch.md).

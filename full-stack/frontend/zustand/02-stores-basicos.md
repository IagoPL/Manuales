# Stores básicos

`create` fabrica un hook con el store enganchado: `getState`, `setState`, `subscribe`. Dentro, `set` y `get` actualizan y leen.

Documentación: [create](https://zustand.docs.pmnd.rs/reference/apis/create), [TypeScript](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript).

## `create`, `set`, `get`

```js
import { create } from 'zustand'

export const useCarritoStore = create((set, get) => ({
  lineas: [],
  anadir: (id) =>
    set((state) => ({
      lineas: [...state.lineas, { id, cantidad: 1 }],
    })),
  vaciar: () => set({ lineas: [] }),
  totalUnidades: () =>
    get().lineas.reduce((n, l) => n + l.cantidad, 0),
}))
```

- `set({ lineas: [] })` — objeto: **merge superficial** con el state actual.
- `set((state) => ({ … }))` — función: lees el state fresco (clicks rápidos, async).
- `get()` — lees sin suscribirte (acciones, no componentes).

`set` **no** hace deep merge. `set({ user: { nombre: 'Ana' } })` **sustituye** `user` entero. Nested:

```js
set((state) => ({
  usuario: {
    ...state.usuario,
    nombre: 'Ana',
  },
}))
```

Arrays: nuevo array (`map`, `filter`, spread). No `state.lineas.push(...)` sobre el array del store. Immer es opcional (capítulo 5), no un requisito.

`set(next, true)` **reemplaza** el state (el segundo argumento `replace`). Útil al resetear; peligroso si olvidas acciones.

## TypeScript (forma actual)

La forma **currificada** `create<T>()((set) => …)` es la recomendada para inferir middleware:

```ts
type CarritoStore = {
  lineas: { id: string; cantidad: number }[]
  anadir: (id: string) => void
}

export const useCarritoStore = create<CarritoStore>()((set) => ({
  lineas: [],
  anadir: (id) =>
    set((state) => ({
      lineas: [...state.lineas, { id, cantidad: 1 }],
    })),
}))
```

El resto del manual usa JS cuando simplifica; los snippets TS siguen este patrón.

## Inmutabilidad

El store notifica si la referencia de lo seleccionado cambia (`Object.is` en v5). Mutar `state.lineas[0].cantidad++` sin `set` no dispara bien a los suscriptores. Siempre `set` / `setState`.

## Errores habituales

- Creer que `set({ user: { … } })` conserva `user.email`.
- Guardar `totalUnidades` en el state en vez de calcularlo (capítulo 3).
- Import default `create`: en v5 los defaults se eliminaron; usa `import { create }`.

## Buenas prácticas

- Estado plano cuando puedas; spread consciente si anidas.
- Acciones de dominio (`anadir`, `vaciar`), no veinte `setCantidad1` sueltos.

## Ejercicio

1. Implementa `cambiarCantidad(id, n)` sin mutar `lineas`.
2. Llama `anadir` dos veces seguidas y comprueba que no pisa la primera línea.
3. Tipa el store con `create<CarritoStore>()`.

## Siguiente paso

Continúa con [Selectores y rendimiento](03-selectores-y-rendimiento.md).

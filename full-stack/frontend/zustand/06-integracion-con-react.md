# Integración con React

El caso habitual: el hook de `create` en un Client Component. Selectores (capítulo 3), eventos que llaman acciones, React pinta.

Documentación: [create](https://zustand.docs.pmnd.rs/reference/apis/create), [createStore](https://zustand.docs.pmnd.rs/reference/apis/create-store.html), [Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs), [SSR](https://zustand.docs.pmnd.rs/learn/guides/ssr-and-hydration).

## Hook global (sin Provider)

```jsx
import { useCarritoStore } from './carritoStore'

export function MiniCarrito() {
  const n = useCarritoStore((state) => state.lineas.length)
  const anadir = useCarritoStore((state) => state.anadir)

  return (
    <button type="button" onClick={() => anadir('sku-1')}>
      Carrito ({n})
    </button>
  )
}
```

No envuelves la app. El store es **estado de módulo**: un singleton en ese JS. En un SPA de cliente suele bastar.

## `create` vs `createStore` vs `useStore`

| API | Qué es |
| --- | --- |
| `create(...)` | Store vanilla **más** hook React (`useCarritoStore(selector)`). |
| `createStore(...)` (también `zustand/vanilla`) | Solo la API: `getState`, `setState`, `subscribe`. Sin hook. |
| `useStore(store, selector)` | Engancha un store vanilla a React (p. ej. el del Context). |

Tres nombres distintos. No llames “el store” al hook y al `createStore` como si fueran lo mismo.

## Provider cuando sí aporta

“Zustand no usa Provider” **no** es absoluto. Necesitas una **instancia**:

- el mismo widget dos veces (dos carritos de demo);
- tests aislados;
- props de arranque distintas;
- **SSR / Next**: un store **por request**, no un global compartido entre usuarios.

```jsx
import { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { carritoCreator } from './carritoCreator'

const CarritoCtx = createContext(null)

export function CarritoProvider({ children }) {
  const [store] = useState(() => createStore(carritoCreator))
  return <CarritoCtx.Provider value={store}>{children}</CarritoCtx.Provider>
}

export function useCarrito(selector) {
  const store = useContext(CarritoCtx)
  if (!store) throw new Error('CarritoProvider')
  return useStore(store, selector)
}
```

(`carritoCreator` es un `StateCreator`; el patrón oficial Next usa `useState(() => createCounterStore())`.)

## RSC / SSR (sin un curso de Next)

- Un store **global de módulo en el servidor** se comparte entre requests: no.
- Los Server Components **no** deben leer/escribir el store (no hay hooks ni Context en RSC).
- Hidrata el mismo HTML que pintó el server; `persist` + `localStorage` desincroniza (capítulo 4: `skipHydration` / `rehydrate` en cliente).

En un Vite SPA sin SSR, el singleton de `create` sigue siendo el camino corto.

## Errores habituales

- Store global en un layout Next App Router “porque en el tutorial de 2023 salía”.
- `useCarritoStore()` sin selector en un header que se pinta siempre.
- Confundir `useStore` (hook genérico) con el hook que devolvió `create`.

## Buenas prácticas

- Selectores en cada componente.
- Provider solo cuando la instancia importa.
- Client Components para cualquier hook de Zustand.

## Ejercicio

1. Monta `MiniCarrito` con dos selectores.
2. Duplica el widget con `CarritoProvider` y comprueba que no comparten líneas.
3. Marca qué ficheros serían `'use client'` en App Router.

## Siguiente paso

Continúa con [Patrones de arquitectura](07-patrones-de-arquitectura.md).

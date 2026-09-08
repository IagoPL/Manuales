# Selectores y rendimiento

El hook se suscribe a lo que **devuelve** el selector. En Zustand 5 la igualdad por defecto es `Object.is`. Por eso **no** conviene `useCarritoStore()` sin selector si solo necesitas un campo: cualquier `set` re-renderiza.

Documentación: [useShallow](https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow), [migración v5](https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5), [TypeScript / selectores](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript).

## Selector de un primitive

```js
const count = useCarritoStore((state) => state.lineas.length)
const vaciar = useCarritoStore((state) => state.vaciar)
```

Dos hooks: cada uno es estable si esa referencia/`Object.is` no cambia. `vaciar` (función del store) suele ser la misma mientras no recrees el store.

## El objeto anónimo

```js
// Problemático en v5: objeto nuevo en cada store update → bucle o renders de más
const { lineas, anadir } = useCarritoStore((state) => ({
  lineas: state.lineas,
  anadir: state.anadir,
}))
```

`create` **ya no** acepta una equality fn como segundo argumento (eso era v4). Opciones actuales:

1. **Dos selectores** (a menudo lo más claro).
2. **`useShallow`**: compara las **claves** del objeto/array, no la envoltura.

```js
import { useShallow } from 'zustand/react/shallow'

const { lineas, anadir } = useCarritoStore(
  useShallow((state) => ({
    lineas: state.lineas,
    anadir: state.anadir,
  })),
)
```

No uses `useShallow` “siempre”. Un `state.count` no lo necesita. Sirve cuando el selector **fabrica** un objeto o array nuevo (`Object.keys`, pick de varios campos).

`createWithEqualityFn` / `useStoreWithEqualityFn` viven en `zustand/traditional` si quieres el comportamiento v4. Este manual no los necesita para el caso habitual.

## Estado derivado

No guardes `totalUnidades` ni `lineasFiltradas` si salen de `lineas` + `filtro`:

```js
const visibles = useCarritoStore((state) =>
  state.filtro === 'todas'
    ? state.lineas
    : state.lineas.filter((l) => l.id === state.filtro),
)
```

Si el array filtrado es **nuevo** en cada llamada y duele, entonces `useShallow` o memoizar con criterio. Primero selector pequeño; no memoices por deporte.

## Errores habituales

- `const store = useStore()` y leer `store.x` en el render.
- Equality `shallow` pasada a `create` como en v4.
- Copiar `filteredItems` al state en cada tecla del filtro.

## Buenas prácticas

- Un dato, un selector, salvo pick consciente + `useShallow`.
- Derivar en el selector, no duplicar.

## Ejercicio

1. Sustituye un `useCarritoStore()` por selectores de `lineas.length` y `vaciar`.
2. Reproduce el objeto anónimo y envuélvelo en `useShallow`.
3. Calcula el total en el selector, no en el store.

## Siguiente paso

Continúa con [Persistencia](04-persistencia.md).

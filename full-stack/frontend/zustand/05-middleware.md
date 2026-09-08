# Middleware

En Zustand un middleware **envuelve** el `stateCreator`. No es la cadena `dispatch → reducer` de Redux. Compone funciones: `persist(devtools(immer(creator)))`.

Documentación: [persist](https://zustand.docs.pmnd.rs/reference/middlewares/persist), [devtools](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript) (ejemplo), [subscribeWithSelector](https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector), [immer](https://zustand.docs.pmnd.rs/reference/middlewares/immer).

## `devtools`

Habla con **Redux DevTools**. No estás usando Redux: solo el inspector (actions, diffs, time-travel). Opcional en desarrollo.

```js
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useCarritoStore = create(
  devtools(
    (set) => ({
      lineas: [],
      anadir: (id) =>
        set((state) => ({ lineas: [...state.lineas, { id, cantidad: 1 }] }), false, 'carrito/anadir'),
    }),
    { name: 'carrito' },
  ),
)
```

El tercer argumento de `set` (nombre) ayuda en el panel. No es obligatorio para que la app funcione.

## `subscribeWithSelector`

Quieres **reaccionar** a un trozo del state **sin** un componente (analytics, sync con no-React):

```js
import { subscribeWithSelector } from 'zustand/middleware'

// store creado con este middleware:
useCarritoStore.subscribe(
  (state) => state.lineas.length,
  (n) => {
    console.info('lineas', n)
  },
)
```

No sustituye a los hooks en la UI. Es la puerta **imperativa**.

## `immer`

`import { immer } from 'zustand/middleware/immer'` (paquete `immer` aparte). Permite `state.usuario.nombre = 'Ana'` **dentro** del `set` de immer. Útil si anidas mucho. Un carrito plano no lo necesita. No “Zustand requiere Immer”.

## `persist`

Capítulo 4. En un store combinado, **un** `persist` por fuera de los slices, no uno por slice.

## Orden y TypeScript

La forma currificada encaja middleware:

```ts
export const usePrefsStore = create<Prefs>()(
  devtools(
    persist(
      (set) => ({
        tema: 'system',
        setTema: (tema) => set({ tema }),
      }),
      { name: 'prefs-catalogo' },
    ),
    { name: 'prefs' },
  ),
)
```

`devtools` por fuera ve las updates de `persist`. Invierte el orden solo si sabes por qué. Con `immer`, suele ir **dentro** (el creator que “muta”). No apiles cinco capas el día uno.

Si TypeScript se queja, la doc de [middleware + TS](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript) usa `create<T>()(devtools(persist(...)))`. No inventes wrappers.

## Errores habituales

- Middleware dentro de cada slice (cap. 7).
- Creer que DevTools implica Redux Toolkit.
- Immer + mutar **fuera** de `set`.

## Buenas prácticas

- Empieza sin middleware; añade persist/devtools cuando duela.
- Nombres en DevTools para el carrito, no `set`.

## Ejercicio

1. Conecta DevTools y despacha `anadir`.
2. Suscríbete a `lineas.length` sin un componente.
3. Reescribe un update nested con y sin `immer`; elige el más legible.

## Siguiente paso

Continúa con [Integración con React](06-integracion-con-react.md).

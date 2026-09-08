# Patrones de arquitectura

Zustand crece **con el problema**. Un store de cinco campos no necesita `actions/`, `reducers/`, `effects/` ni un bus de eventos.

Documentación: [slices](https://zustand.docs.pmnd.rs/learn/guides/slices-pattern), [Flux inspired](https://zustand.docs.pmnd.rs/learn/guides/flux-inspired-practice), [varios stores (TS)](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript).

## Tres tamaños

**Archivo único** — `carritoStore.js` con state + acciones. El 80 % de los casos.

**Feature store** — `features/carrito/carrito.store.ts` junto a la UI del carrito. Otro fichero `features/prefs/prefs.store.ts` para tema/filtros. Varios stores **independientes** cuando los dominios no se pisan.

**Slices** — un store grande partido en funciones `createXSlice(set, get)` y un `create((...a) => ({ ...createCarritoSlice(...a), ...createPrefsSlice(...a) }))`. Middleware (`persist`, `devtools`) **solo** en el store combinado.

La guía Flux sugiere **un** store global y slices si crece. Zustand también permite varios stores (la propia doc TS). Elige: un bound store *o* stores separados. **No** una red que se importa en círculo (`carrito` llama `prefs` que llama `carrito`).

## No al mega-`useAppStore`

Meter auth, modal, carrito, toasts, productos, caché HTTP y formularios en un objeto “porque Flux dice un store” sin slices es un cajón. Si está junto, **parte**. Si no se tocan, **dos módulos**.

## Acciones de dominio

Junto al estado, sí. Setters `setNombre` / `setEmail` / `setEdad` por campo suelen ser ruido. Prefiere `actualizarPerfil({ nombre, email })`, `checkout()`, `resetFiltros()`, `anadir(id)`.

Siempre actualiza con `set` / `setState` (Flux). Puedes poner alguna acción **fuera** del store (`useCarritoStore.setState`) si hace falta; no es la primera opción.

No reconstruyas `dispatch` + `switch` salvo que el equipo ya viva en Redux. Existe `redux` middleware; este manual no lo recomienda como camino Zustand.

## Coordinar stores

Una acción rara puede leer `usePrefsStore.getState()` **desde** el carrito. Si eso se vuelve habitual, o unes en slices o tienes un olor. No diseñes un event bus “porque desacopla”.

## Zustand frente a Redux Toolkit

| | Zustand | RTK |
| --- | --- | --- |
| Tamaño mental | Store + `set` + selector | Slice, actions, store, a menudo Query |
| Stores | Uno o varios, o slices | Un store, varios slices |
| Server cache | No es el trabajo | RTK Query |
| Tooling | DevTools opcional | Convención + ecosistema |
| Provider | Opcional (sí en SSR/instancia) | `Provider` habitual |

Complementarios, no “el mismo producto con menos npm”. Tras el manual Redux: Zustand no es RTK Query más simple.

## Errores habituales

- Slices *y* seis stores que se llaman entre sí.
- Acciones vacías que solo hacen `set({ x })` con otro nombre.
- Copiar la carpeta `features/` de un tutorial Redux al milímetro.

## Buenas prácticas

- Empieza en un fichero; extrae feature o slice cuando el scroll duela.
- Acciones que nombran **qué hizo el usuario**.
- Client state aquí; server state fuera.

## Ejercicio

1. Parte `prefs` a otro store y deja el carrito solo.
2. Escribe un `createCarritoSlice` y combínalo.
3. Busca un `setFoo` y renómbralo a una intención (`aplicarCupon`).

## Siguiente paso

Continúa con [Testing](08-testing.md).

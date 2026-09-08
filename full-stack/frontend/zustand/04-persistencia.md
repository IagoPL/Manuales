# Persistencia

`persist` guarda un recorte del state en un storage (por defecto `localStorage` vía `createJSONStorage`). Sirve para **preferencias, tema, filtros, un draft pequeño**, no para el universo de la app.

Documentación: [persist](https://zustand.docs.pmnd.rs/reference/middlewares/persist).

## API

```js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePrefsStore = create(
  persist(
    (set) => ({
      tema: 'system',
      filtro: 'todas',
      setTema: (tema) => set({ tema }),
      setFiltro: (filtro) => set({ filtro }),
    }),
    {
      name: 'prefs-catalogo',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tema: state.tema, filtro: state.filtro }),
      version: 1,
      migrate: (persisted, version) => {
        if (version === 0) {
          return { ...persisted, filtro: persisted.filtro ?? 'todas' }
        }
        return persisted
      },
    },
  ),
)
```

- `name` — clave única.
- `storage` — el getter de `createJSONStorage` es **perezoso** (evita petar en SSR donde no hay `localStorage`).
- `sessionStorage` — misma API, dura la pestaña.
- `partialize` — **persiste menos**. Omite acciones (funciones), `loading`, errores, tokens.
- `version` + `migrate` — cuando cambia la forma del JSON.

`createJSONStorage` hace `JSON.parse` **sin validar**. Datos corruptos o metidos a mano no se detectan. En producción seria, un `PersistStorage` propio (p. ej. con Zod) es más honesto.

## Qué no persistir

Tokens, cookies de sesión, caché HTTP, flags `loading`, funciones, UI efímera (modal abierto). **Persistir menos suele ser mejor.**

`localStorage` **no es almacenamiento seguro**. Cualquier JS de la página lo lee. `persist` no es un mecanismo de seguridad.

El carrito *puede* persistirse si aceptas que el usuario edite el JSON; no guardes precios/stock como verdad (el servidor manda).

## Hidratación y SSR

Al cargar, hay un momento en que el state es el **inicial** y luego llega el JSON. En cliente puro, un flash de tema es el primo del FOUC.

En SSR el HTML del servidor **no** ve `localStorage`. Si pintas `tema` persistido solo en el cliente, hidratas distinto. APIs vigentes:

- `skipHydration: true` — no rehidrata al crear el store.
- `store.persist.rehydrate()` — lo haces en el cliente (efecto, no durante el render del servidor).

No conviertas esto en un tutorial Next; el capítulo 6 resume store por request. Aquí: **no asumas que persist es síncrono e idéntico en server y client**.

## Errores habituales

- Persistir el store entero “por si acaso”.
- Tratar `localStorage` como caja fuerte.
- Comparar HTML SSR con el tema ya leído en el cliente.

## Buenas prácticas

- `partialize` explícito.
- Una clave `name` por store/entorno.
- Versiona cuando cambies el shape.

## Ejercicio

1. Persiste solo `tema` y recarga.
2. Añade `version: 2` y un `migrate` que renombre un campo.
3. Lista tres valores que **nunca** meterías en `partialize`.

## Siguiente paso

Continúa con [Middleware](05-middleware.md).

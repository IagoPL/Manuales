# Introducción y casos de uso

Zustand es un store **pequeño y poco opinionado**: estado + acciones en un objeto, consumido con un **hook**. No intenta ser Redux sin boilerplate. El modelo es más corto: `set` actualiza, el selector decide quién se renderiza.

Documentación: [Zustand](https://zustand.docs.pmnd.rs/), [create](https://zustand.docs.pmnd.rs/reference/apis/create), [TypeScript](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript), [repo pmndrs/zustand](https://github.com/pmndrs/zustand).

```text
store
├── state     (líneas del carrito, filtro, tema)
└── actions   (anadirLinea, resetFiltros)

componente → action → set(...) → store cambia → selector afectado → render
```

En el caso **global básico** no hace falta `<Provider>`. El hook que devuelve `create` lee el módulo. Eso no es una ley: hay stores **por instancia** (capítulo 6).

## Client state, no caché HTTP

Zustand brilla en **estado cliente**: sidebar, draft, filtros, wizard, ítem seleccionado, preferencias, carrito coordinado entre header y página.

No lo uses como receta principal de:

```text
fetch → store → loading → caché → staleTime → invalidar a mano
```

Eso es trabajo de una librería de **server state** (TanStack Query, RTK Query, etc.). Una app seria suele combinar **ambas**: Query cachea `/productos`; Zustand guarda el carrito y el filtro de la UI.

## Cuándo sí / cuándo no

| Herramienta | Encaja |
| --- | --- |
| **useState** | Un input, un modal de un solo componente. |
| **Context** | Tema ya resuelto, “quién soy”, config que casi no cambia. |
| **Zustand** | Estado cliente compartido con updates y selectores sin Provider obligatorio. |
| **Redux Toolkit** | Convenciones, DevTools/tooling, RTK Query, un equipo que quiere ese flujo. |

Ni “Zustand siempre gana a Redux” ni lo contrario. Menos líneas no es mejor arquitectura. El [manual Redux](../redux/01-introduccion-y-casos-de-uso.md) cubre RTK; aquí el mismo carrito se resuelve con un store de 30 líneas **si** el problema es solo cliente.

No hace falta Zustand para tres `useState` en una ficha. Tampoco para sustituir la caché del backend.

## Errores habituales

- Un `useAppStore` con productos, auth, formularios y caché HTTP.
- Comparar solo el recuento de dependencias con RTK.

## Buenas prácticas

- Empieza por el estado que **varias** pantallas deben ver igual.
- Acciones junto al estado (capítulo 2); selectores pequeños (capítulo 3).

## Ejercicio

1. Lista tres estados de tu app: local / cliente compartido / servidor.
2. Elige uno que merezca Zustand y uno que no.
3. Lee la intro oficial y anota que `create` ya es un hook.

## Siguiente paso

Continúa con [Stores básicos](02-stores-basicos.md).

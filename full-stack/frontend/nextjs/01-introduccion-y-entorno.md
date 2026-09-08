# Introducción y entorno

Next.js es un **framework de React**: añade enrutado, bundling y formas de renderizar (cliente, servidor, estático) sobre la biblioteca. React solo pinta componentes; Next.js decide **qué URL** corresponde a qué archivo, cómo se empaqueta el código y cómo sale HTML al navegador.

Si solo necesitas una SPA que consume una API, Vite + React puede bastar (ver [Introducción a React](../react/01-introduccion.md)). Next.js merece la pena cuando quieres rutas de archivo, SSR/SSG, Route Handlers o un despliegue full-stack sin montar ese andamiaje a mano.

Documentación oficial: [Instalación](https://nextjs.org/docs/getting-started/installation).

## Requisitos

- Node.js **20.9** o superior.
- npm, pnpm, yarn o bun.
- Navegadores modernos (Chrome/Edge/Firefox 111+, Safari 16.4+).

```bash
node -v
```

## Crear el proyecto

La vía soportada es `create-next-app` (no Create React App):

```bash
npx create-next-app@latest mi-app
cd mi-app
npm run dev
```

Abre `http://localhost:3000`. `--yes` salta las preguntas y aplica los valores por defecto actuales del CLI (TypeScript, ESLint, Tailwind, App Router, alias `@/*`).

Durante la instalación puedes elegir:

- TypeScript o JavaScript.
- ESLint, Biome o sin linter.
- Tailwind.
- Carpeta `src/`.
- **App Router** (recomendado) o Pages Router.
- Alias de imports.

El App Router es el camino por defecto y el que usa este manual. El siguiente capítulo detalla `app/`, `layout.tsx` y `page.tsx`.

Scripts que deja el CLI:

| Script | Función |
| --- | --- |
| `next dev` | Servidor de desarrollo. Turbopack es el bundler por defecto. |
| `next build` | Build de producción. |
| `next start` | Sirve el build (`next start` después de `next build`). |

## React frente a Next.js

| | React (biblioteca) | Next.js (framework) |
| --- | --- | --- |
| Qué resuelve | UI con componentes | App: rutas, render, datos, empaquetado |
| Entrada típica | `createRoot` + Vite | `create-next-app` → carpeta `app/` |
| Routing | Lo eliges tú | Sistema de ficheros |
| Servidor | Opcional y manual | Integrado (SSR, Server Components, Route Handlers) |

No hace falta “aprender Next.js en lugar de React”: los componentes, props, estado y JSX son los mismos. Next.js añade convenciones (`page.tsx`, `layout.tsx`, Server Components) encima.

## Errores habituales

- Crear la app con `create-react-app` y “añadir Next después”. Empieza con `create-next-app`.
- Usar Node 18 u otro runtime por debajo de 20.9.
- Convertir todo a Client Component (`'use client'`) en el primer archivo. El valor del App Router está en dejar trabajo en el servidor cuando no hay interactividad.
- Copiar la estructura de `pages/` (Pages Router) en un proyecto App Router.

## Buenas prácticas

- Fija la versión de Next en `package.json` y actualiza con el flujo oficial (`npx next upgrade` cuando toque).
- Un proyecto, un router: App **o** Pages como principal, no mezcles por costumbre.
- Deja `app/` para rutas; extrae UI reutilizable a `components/` y lógica a `lib/` (el siguiente capítulo lo desarrolla).
- En desarrollo usa `npm run dev` y comprueba que el cambio en `app/page.tsx` recarga.

## Ejercicio

1. Genera `mi-app` con `create-next-app` y arranca `npm run dev`.
2. Cambia el texto de la home y confirma el HMR.
3. Anota si el CLI te creó `app/` o `src/app/` y abre el `layout` raíz: debe incluir `html` y `body`.

## Siguiente paso

Continúa con [App Router y estructura](02-app-router-y-estructura.md).

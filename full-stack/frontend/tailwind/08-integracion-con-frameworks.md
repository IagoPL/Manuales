# Integración con frameworks

Tailwind no se “instala distinto por cada framework” en el CSS: **siempre** hay un CSS global con `@import "tailwindcss";`. Cambia **quién procesa** ese CSS (plugin Vite, PostCSS, integración del meta-framework). No copies un snippet de Next en Angular.

Documentación: [Vite](https://tailwindcss.com/docs/installation/using-vite), [framework guides](https://tailwindcss.com/docs/installation/framework-guides), [compatibility Vue/Svelte/Astro](https://tailwindcss.com/docs/compatibility), [@reference](https://tailwindcss.com/docs/functions-and-directives#reference).

## Patrón común

1. Instala `tailwindcss` y el adaptador oficial de **tu** bundler.
2. Un `app.css` / `index.css` con `@import "tailwindcss";` (y `@theme` si hay tokens).
3. Importa ese CSS **una vez** en el entry (`main.tsx`, `app.vue`, layout raíz).
4. Clases en el markup: `class` (Vue/Svelte/HTML) o `className` (React).
5. Nombres de clase **completos** (capítulo 1). El scanner no entra en `node_modules` salvo `@source`.

## Vite

```js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

Vale para Vite + React, Vue, Svelte, Solid, etc. El framework no sustituye el plugin.

## Meta-frameworks

Next, Nuxt, SvelteKit, Astro, Laravel, Remix/React Router: usa la **guía oficial de ese stack** (entrada de CSS, App Router vs Pages, `globals.css`). La idea es la misma; los ficheros no.

Monorepo: si el cwd no es el paquete de la app, `@import "tailwindcss" source("../src")` o `@source` explícito.

## Vue, Svelte, Astro: `<style>` scoped

La recomendación actual: **utilities en el markup**, no reprocesar Tailwind en cada bloque `<style>`. Esos bloques se compilán **aislados**; no ven el theme del CSS global.

Si aun así usas `@apply` / `@variant` ahí, **`@reference`** importa el theme **sin duplicar** el CSS generado:

```vue
<template>
  <h1>Catálogo</h1>
</template>

<style scoped>
@reference "../app.css";
h1 {
  @apply text-2xl font-semibold;
}
</style>
```

Alternativa más barata: `color: var(--color-brand-500)` en el scoped CSS, sin `@apply`.

Tailwind v4 **no** está pensado para Sass/Less/Stylus en esos bloques.

## Qué no unificar

“En Next, Vue y Angular haz exactamente esto” es falso: Next puede usar el plugin de PostCSS o el de Vite según la versión; Angular tiene su propio pipeline. Enlaza la guía, no inventes un `tailwind.config` común.

Play CDN existe para demos: **no** es producción (runtime, sin el mismo control de CSS generado).

## Errores habituales

- Importar Tailwind en diez componentes en vez de un global.
- `class={`bg-${color}-500`}` en JSX.
- `@apply` en Vue sin `@reference` y un error opaco.

## Buenas prácticas

- Un CSS de entrada; componentes = `class`/`className`.
- `@source` solo para librerías ignoradas.
- Guía oficial del framework el día de instalar.

## Ejercicio

1. En Vite + React, importa `style.css` solo en `main`.
2. En un SFC Vue, mueve un `@apply` a clases en el template.
3. Abre la framework guide de tu stack y anota el fichero de CSS que piden.

## Siguiente paso

Continúa con [Buenas prácticas](09-buenas-practicas.md).

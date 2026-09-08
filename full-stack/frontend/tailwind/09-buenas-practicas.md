# Buenas prácticas

Cierra el modelo: clases detectables, tokens, componentes, CSS a propósito, responsive, a11y, dark y un CSS de build **honesto**.

Documentación: [detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files), [styling with utilities](https://tailwindcss.com/docs/styling-with-utility-classes), [dark mode](https://tailwindcss.com/docs/dark-mode), [orden de clases con Prettier](https://tailwindcss.com/docs/editor-setup#class-sorting-with-prettier).

## Clases estáticas

El scanner es texto. Mapas de strings completos, no `bg-${variant}-500`. Si una librería en `node_modules` trae utilities, `@source`.

## Tokens

`w-[37rem]` o `bg-[#1a2b3c]` una vez: bien. Tres veces: `@theme` o variable. Arbitrary no es el theme.

## Componentes vs CSS

Markup repetido + comportamiento → componente/template. CSS custom (`@layer`, `@utility`) cuando Tailwind no cubre el problema o hay que parchear un tercero. `@apply` no es la arquitectura (capítulo 5).

## Responsive

Base = móvil. `md:` / `lg:` = **desde ese ancho**. `@container` cuando el padre manda. Viewport meta.

## Accesibilidad

Tailwind **no** resuelve:

- Contraste (`text-zinc-400` puede ser ilegal sobre blanco).
- Semántica (`button` vs `div`).
- Foco de teclado (`focus-visible:outline`).
- `disabled` real.
- `prefers-reduced-motion` (`motion-reduce:`).

Un `hover:` sin `focus-visible:` deja el teclado a ciegas.

## Dark mode

Cada fondo tiene texto y borde en `dark:`. Default = sistema; clase o `data-theme` = `@custom-variant` + script temprano (FOUC).

## Orden de clases

No discutan el orden a mano. El [plugin de Prettier oficial](https://tailwindcss.com/docs/editor-setup#class-sorting-with-prettier) las agrupa de forma estable. No es una regla de negocio.

## CSS generado (performance)

Tailwind **escanea** y emite utilities usadas. En v4 no configuras `purge` ni `content: []` como receta diaria: la detección es automática (ajustable con `@source`).

Eso **no** significa “siempre el CSS mínimo imaginable”: safelist (`@source inline()`), CSS custom, y fuentes extra crecen el fichero. Habla de **CSS de build acotado a lo detectado**, no de milagros.

Play CDN y concatenación dinámica hacen lo contrario: o hinchan, o faltan clases.

## Recetas v3 que este manual no usa como camino principal

| v3 | Ahora |
| --- | --- |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` + `theme.extend` | `@theme` |
| `content: [...]` | detección + `@source` si hace falta |
| `darkMode: 'class'` | `@custom-variant dark (...)` |
| `npx tailwindcss init` | plugin Vite / CLI v4 |
| `purge` | no aplica como paso aparte |

`@config` existe para **migrar**.

## Errores habituales

- Theme flash por aplicar `.dark` después del primer paint.
- Optimizar el orden de clases y olvidar el contraste.
- Copiar un config JS enorme “por si el v4 lo necesita”.

## Buenas prácticas

- CSS-first; utilities en el markup; tokens cuando se repiten.
- Probar light, dark, teclado, y un viewport estrecho.
- La doc oficial es el catálogo de utilities; este manual es el modelo mental.

## Ejercicio

1. Busca concatenaciones dinámicas en tu repo y sustituye por mapas.
2. Activa Prettier + plugin y deja de ordenar clases a ojo.
3. Relee 01–08 y marca cada decisión: token, componente o CSS suelto.

Fin del manual Tailwind.

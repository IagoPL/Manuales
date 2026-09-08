# Introducción y configuración

Tailwind CSS es un **framework de utilities**: clases pequeñas (`flex`, `pt-4`, `text-center`) que se **componen** en el markup. No es una librería de botones o cards. El CSS que llega al navegador se **genera en build** a partir de las clases que aparecen en el código; no hay runtime que calcule estilos.

Documentación: [instalación](https://tailwindcss.com/docs/installation), [Vite](https://tailwindcss.com/docs/installation/using-vite), [CLI](https://tailwindcss.com/docs/installation/tailwind-cli), [detección de clases](https://tailwindcss.com/docs/detecting-classes-in-source-files).

## Utility-first, en una frase

En CSS clásico inventas `.ficha-titulo`. En Tailwind pones `text-lg font-semibold tracking-tight` donde se usa. El capítulo 2 desarrolla la filosofía; aquí basta el modelo: **tokens → utilities → HTML**.

## Cómo detecta clases

Tailwind trata los ficheros como **texto**. Busca tokens que parezcan nombres de clase y genera el CSS correspondiente. No ejecuta tu JS: si construyes el nombre a trozos, **no existe** la cadena completa y esa utility no sale en el CSS.

```js
// No: el scanner no ve bg-green-500 ni bg-red-500
const color = `bg-${variant}-500`

const variantes = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
}
```

Por defecto escanea el proyecto salvo `.gitignore`, `node_modules`, binarios y CSS. `@source` sirve cuando **sí** quieres escanear algo ignorado (p. ej. un paquete UI en `node_modules`):

```css
@import "tailwindcss";
@source "../node_modules/@acme/ui";
```

No lo uses “por si acaso” en un app Vite normal.

## Instalación actual (CSS-first)

El CSS de entrada es una línea. **No** empieces un proyecto nuevo con `@tailwind base; @tailwind components; @tailwind utilities;` ni con `npx tailwindcss init` (eso es el flujo v3).

```css
@import "tailwindcss";
```

### Vite (recomendado si ya usas Vite)

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

Importa el CSS en el entry (`import './style.css'`). El plugin sustituye el PostCSS + Autoprefixer del setup v3.

### CLI

Cuando no hay bundler (HTML estático, prototipo):

```bash
npm install tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

Enlaza `output.css` en el HTML. Misma hoja con `@import "tailwindcss";`.

Hay guías por framework (Next, Nuxt, SvelteKit, Laravel…): el patrón es el mismo import; el **plugin de build** cambia. Capítulo 8.

Un proyecto **v3** sigue con `tailwind.config.js` y `content: [...]`. Para código nuevo, este manual usa el modelo v4. Migración: [upgrade guide](https://tailwindcss.com/docs/upgrade-guide) y `@config` si aún arrastras JS.

## Errores habituales

- Concatenar `bg-${color}-500`.
- Copiar un `tailwind.config.js` de un tutorial de 2023 en un repo v4.
- Olvidar el viewport meta: `width=device-width` (capítulo 3).

## Buenas prácticas

- Un CSS global con `@import "tailwindcss"`; tokens en `@theme` (capítulo 7).
- Clases **completas** en el source.
- Tailwind no sustituye HTML semántico ni contraste.

## Ejercicio

1. Monta Vite + plugin y pinta `text-3xl font-bold`.
2. Reproduce el anti-patrón `bg-${x}-500` y comprueba que el fondo no existe en el CSS generado.
3. Lee *Detecting classes in source files*.

## Siguiente paso

Continúa con [Utility-first](02-utility-first.md).

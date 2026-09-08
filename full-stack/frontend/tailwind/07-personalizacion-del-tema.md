# Personalización del tema

En Tailwind actual el theme vive en **CSS**. Un **design token** es un valor con nombre (color de marca, radio, escala de espacio). `@theme` no es un `:root` con otro nombre: **crea utilities y variants**.

Documentación: [theme variables](https://tailwindcss.com/docs/theme), [@theme](https://tailwindcss.com/docs/functions-and-directives#theme), [upgrade / @config](https://tailwindcss.com/docs/upgrade-guide).

## `@theme` vs `:root`

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.55 0.19 264);
  --font-display: "Fraunces", ui-serif, serif;
  --breakpoint-3xl: 120rem;
  --radius-card: 1rem;
  --shadow-card: 0 8px 24px oklch(0 0 0 / 0.08);
}

:root {
  --header-height: 4rem;
}
```

- `--color-brand-500` → `bg-brand-500`, `text-brand-500`, `border-brand-500`, …
- `--font-display` → `font-display`
- `--breakpoint-3xl` → variant `3xl:`
- `--header-height` en `:root` **no** genera `h-header`; es una variable CSS normal (`h-(--header-height)` o `style` si hace falta).

`@theme` va al **top-level**, no anidado en un media query. Para valores que cambian en dark, suele usarse el mismo token y `dark:` en el HTML, o variables en `:root` / `.dark` que **no** pretenden generar una paleta nueva de utilities.

No personalices “todo el theme”. Añade marca, un breakpoint, un radio. El default cubre spacing y type.

## Namespaces útiles

| Namespace | Sale como |
| --- | --- |
| `--color-*` | `bg-*`, `text-*`, `border-*`, … |
| `--font-*` | `font-*` |
| `--text-*` | tamaños `text-*` |
| `--spacing` / escala | `p-*`, `gap-*`, … |
| `--breakpoint-*` | `md:`, `lg:`, … |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |

Nombres: `--color-mint-500` → `bg-mint-500`. Documentación de namespaces en la página de theme.

```html
<h1 class="font-display text-3xl text-brand-500">Marca</h1>
<div class="3xl:grid-cols-5 rounded-card shadow-card"></div>
```

(`rounded-card` y `shadow-card` existen porque `--radius-card` y `--shadow-card` están en los namespaces de radio y sombra.)

## Arbitrary vs token

`w-[37rem]` tres veces → variable en `:root` (`--width-panel: 37rem`) y `w-(--width-panel)`, o un componente con la clase fija. No hace falta un namespace de width si solo es un valor suelto.

## Proyectos v3 (migración)

```css
@import "tailwindcss";
@config "../../tailwind.config.js";
```

`theme.extend`, `content: [...]`, `darkMode: 'class'` en JS son el **archivo legado**. CSS-first es el camino nuevo; `@config` mezcla mientras migras. `npx @tailwindcss/upgrade` ayuda. Este capítulo no enseña un `tailwind.config.js` de 200 líneas como receta.

## Errores habituales

- Poner tokens de color en `:root` y extrañarse de que no existe `bg-brand`.
- Redefinir toda la paleta el día uno.
- Mezclar unidades de breakpoints (`px` vs `rem`) y romper el orden.

## Buenas prácticas

- `@theme` = lo que debe ser utility; `:root` = lo demás.
- Un color de marca y dos grises de texto suelen bastar al principio.
- `oklch` o el formato que ya use el equipo; seamos consistentes.

## Ejercicio

1. Añade `--color-brand-500` y úsalo en `bg-` y `text-`.
2. Deja `--header-height` en `:root` y aplícalo sin esperar `h-header`.
3. Si tienes un config v3, ábrelo y marca qué líneas pasarían a `@theme`.

## Siguiente paso

Continúa con [Integración con frameworks](08-integracion-con-frameworks.md).

# Estados, variantes y dark mode

Una utility puede activarse solo en un **estado** (`hover:`), un **ancestro** (`group-hover:`), ARIA/datos, o **esquema de color** (`dark:`). No hace falta memorizar cien variants: unas cuantas cubren el 90 % de la UI.

Documentación: [hover, focus and other states](https://tailwindcss.com/docs/hover-focus-and-other-states), [dark mode](https://tailwindcss.com/docs/dark-mode), [@custom-variant](https://tailwindcss.com/docs/functions-and-directives#custom-variant).

## Composición

```html
<button
  type="button"
  class="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  Guardar
</button>
```

- `hover:` — puntero; Tailwind lo envuelve en `@media (hover: hover)` en muchos casos.
- `focus-visible:` — foco de teclado, sin el anillo al click de ratón. Prefiérelo a `focus:` en botones.
- `disabled:` — acoplado a `disabled` HTML, no solo a una clase visual.

Otras que sí usan equipos reales:

| Variant | Idea |
| --- | --- |
| `group` + `group-hover:` | El padre se marca `group`; el hijo reacciona. |
| `peer` + `peer-checked:` / `peer-invalid:` | Hermano (checkbox, input). |
| `aria-expanded:` / `aria-current:` | Estado ya expuesto a AT. |
| `data-active:` | `data-active` en el nodo (menús). |
| `motion-reduce:` | Menos o nada de animación si el SO lo pide. |

```html
<a href="/cursos" class="group flex items-center gap-2 text-zinc-800">
  <span class="group-hover:underline">Ver catálogo</span>
</a>
```

No sustituyas un `<button>` por `<div onclick>`.

## Dark mode: default vs manual

**Por defecto**, `dark:` usa `prefers-color-scheme`. No hay `darkMode: 'class'` en un `tailwind.config.js`: eso es **v3**.

```html
<div class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
  <p class="text-zinc-600 dark:text-zinc-300">Cuerpo con contraste en ambos esquemas.</p>
</div>
```

### Selector manual (clase)

Si el usuario elige tema, **redefines** la variant:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

Entonces `dark:` aplica cuando `.dark` está en un ancestro (`<html class="dark">`), no por el media query del SO.

### `data-theme`

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark">
```

### Flash (FOUC)

Si la preferencia está en `localStorage`, aplica la clase **en el `<head>`** (script inline) **antes** de pintar. Si esperas a React/Vue hidratar, hay un frame claro/oscuro incorrecto. La [doc de dark mode](https://tailwindcss.com/docs/dark-mode) muestra el `classList.toggle` al cargar. No hace falta un theme manager: sí hace falta **orden**.

Con `@custom-variant` de clase, el media query del SO **deja de** gobernar `dark:` salvo que tu script lo lea y escriba `.dark`.

## Errores habituales

- Solo `hover:` y olvidar teclado (`focus-visible`).
- `dark:bg-zinc-900` con el mismo `text-zinc-900`.
- Receta v3 `darkMode: 'class'` en un proyecto v4.

## Buenas prácticas

- Pares light/dark de fondo **y** texto **y** borde.
- `motion-reduce:transition-none` (o duración 0) en animaciones.
- `disabled` real + variant.

## Ejercicio

1. Añade `focus-visible` al botón y recorre con Tab.
2. Activa dark de sistema y corrige un texto que desaparezca.
3. Cambia a `@custom-variant dark` con `.dark` y un script mínimo en el `head`.

## Siguiente paso

Continúa con [Personalización del tema](07-personalizacion-del-tema.md).

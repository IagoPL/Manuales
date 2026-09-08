# Componentes reutilizables

La crítica habitual: “¿quince clases en cada botón?”. La respuesta oficial no es `@apply` en masa: es **decidir el nivel de abstracción**.

Documentación: [managing duplication](https://tailwindcss.com/docs/styling-with-utility-classes#managing-duplication), [custom styles](https://tailwindcss.com/docs/adding-custom-styles), [@utility](https://tailwindcss.com/docs/functions-and-directives#utility), [@apply](https://tailwindcss.com/docs/functions-and-directives#apply).

## 1. Repetición aceptable

Una ficha que solo existe en esa vista: deja las utilities en el HTML. Un bucle (`map`) escribe el string **una vez**. Editar con multicursor en el mismo fichero también cuenta.

## 2. Componente o template (el camino habitual)

Si se repite markup **y** comportamiento (click, `disabled`, icono), extrae:

```jsx
export function Button({ variant = 'primary', children, ...props }) {
  const variantes = {
    primary:
      'bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700',
    secondary:
      'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400',
  }

  return (
    <button
      type="button"
      className={`rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${variantes[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

Las clases están **completas** (capítulo 1). Vue/Svelte/Blade: el mismo mapa de strings. Este es el mecanismo principal cuando ya tienes un framework.

## 3. Capa CSS (`@layer components` / `@utility`)

Cuando una clase semántica **aporta** (override de un widget de terceros, un objeto que no merece componente) y quieres que las utilities del HTML puedan **pisarla**:

```css
@import "tailwindcss";

@layer components {
  .ficha {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-md);
  }
}
```

```html
<div class="ficha rounded-none"><!-- esquinas a cero, el utility gana --></div>
```

`@utility` registra una utility **nueva** que acepta `hover:` / `md:` como las de fábrica:

```css
@utility content-auto {
  content-visibility: auto;
}
```

Úsala cuando Tailwind no trae esa propiedad, no para rebautizar `flex`.

## `@apply`: casos reales, no receta

`@apply` copia utilities dentro de CSS tuyo. Sirve para **parches** (Select2, un datepicker) y seguir hablando el idioma del theme:

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

No conviertas cada botón en:

```css
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}
```

Eso es volver a CSS tradicional **y** acoplarte al pipeline de Tailwind en cada `<style>` (capítulo 8: Vue/Svelte necesitan `@reference`). En React/Vue, el componente del apartado 2 es más barato de mantener.

## Errores habituales

- `@apply` como arquitectura de componentes.
- Extraer un componente por **una** clase repetida dos veces.
- Props que concatenan `bg-${color}` (el scanner no las ve).

## Buenas prácticas

- Duplicación en un fichero → markup; entre ficheros → componente; CSS custom → excepción documentada.
- `disabled` HTML real + `disabled:` visual.
- `focus-visible:` para teclado, no solo `hover:`.

## Ejercicio

1. Extrae un `Button` con dos variantes estáticas.
2. Escribe un `@layer components` para un widget que no controlas.
3. Intenta (y descarta) un `.btn { @apply … }` para el mismo botón de React.

## Siguiente paso

Continúa con [Estados, variantes y dark mode](06-estados-variantes-y-dark-mode.md).

# Tipografía, color y espaciado

Las utilities de texto, color y espacio son **API de tokens**. `text-lg` no es un número mágico: apunta a variables del theme (`--text-lg`, `--color-*`, `--spacing`). No memorices el catálogo; aprende el **prefijo**.

Documentación: [theme variables](https://tailwindcss.com/docs/theme), [font-size](https://tailwindcss.com/docs/font-size), [colors](https://tailwindcss.com/docs/colors), [padding](https://tailwindcss.com/docs/padding).

## Tipografía

| Prefijo | Rol |
| --- | --- |
| `text-sm` / `text-lg` / `text-xl` | Tamaño (y a menudo line-height por defecto). |
| `font-medium` / `font-semibold` / `font-bold` | Peso. |
| `font-sans` / `font-mono` | Familia (`--font-*`). |
| `leading-tight` / `leading-relaxed` | Interlineado. |
| `tracking-tight` / `tracking-wide` | Tracking. |

```html
<h1 class="text-2xl font-semibold tracking-tight text-zinc-900">Catálogo</h1>
<p class="mt-2 text-sm leading-relaxed text-zinc-600">Cursos actualizados este mes.</p>
```

Jerarquía: el `h1` semántico + tamaño. No uses `div` + `text-2xl` como único encabezado de página.

## Color

Mismo token, distinta propiedad: `text-zinc-900`, `bg-zinc-50`, `border-zinc-200`. El número (**50–950**) es el escalón del theme, no “accesibilidad garantizada”.

`text-gray-400` sobre `bg-white` **puede fallar** contraste WCAG. Comprueba (DevTools, axe, ratio). En dark, `dark:text-zinc-400` sobre `dark:bg-zinc-900` es otro par: hay que verificar **ambos**.

Prefiere escalas con contraste pensado (`zinc`/`neutral` y un color de marca en `@theme`) antes que `gray-400` por costumbre.

## Espaciado

Una escala: `p-4`, `m-6`, `gap-3`, `space-y-2` (margen entre hijos apilados). `p-4` es `padding: calc(var(--spacing) * 4)` en el modelo actual, no un pixel suelto.

```html
<section class="space-y-4 p-6">
  <h2 class="text-lg font-medium">Filtros</h2>
  <div class="flex flex-wrap gap-2">
    <button type="button" class="rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800">
      Nivel
    </button>
  </div>
</section>
```

`gap` en flex/grid; `space-y-*` cuando no hay flex/grid. No mezcles `mb-4` en cada hijo y `gap-4` en el padre a la vez sin querer.

## Descubrir, no memorizar

Documentación oficial + autocompletado del editor (extensión Tailwind). Si el valor se repite, token (capítulo 7), no `p-[18px]` en diez sitios.

## Errores habituales

- `text-gray-400` “porque es secundario” sin medir contraste.
- `text-xl` en un `span` que debería ser `h2`.
- Escala de espaciado + pixels sueltos mezclados sin criterio.

## Buenas prácticas

- Color de texto y fondo como par; prueba dark (capítulo 6).
- Una escala de type (p. ej. `sm` cuerpo, `lg`/`xl` títulos).
- `type="button"` en botones que no envían formularios.

## Ejercicio

1. Arma un bloque título + lead + meta con `text-*`, `font-*`, `mt-*`.
2. Mide el contraste de `text-zinc-400` vs `text-zinc-600` sobre blanco.
3. Sustituye tres `margin-bottom` sueltos por `space-y-*` o `gap-*`.

## Siguiente paso

Continúa con [Componentes reutilizables](05-componentes-reutilizables.md).

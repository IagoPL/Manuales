# Layout y responsive

Flex, grid y el **mobile-first** de los breakpoints. `md:` no significa “tablets”: significa **ancho mínimo de ese breakpoint y hacia arriba**.

Documentación: [responsive design](https://tailwindcss.com/docs/responsive-design), [flex](https://tailwindcss.com/docs/flex), [grid](https://tailwindcss.com/docs/grid-template-columns). Incluye `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`.

## Piezas de layout

| Familia | Para qué |
| --- | --- |
| `flex` / `flex-col` / `items-*` / `justify-*` | Ejes, alineación, barras, filas de acciones. |
| `grid` / `grid-cols-*` / `col-span-*` | Columnas alineadas, catálogos. |
| `gap-*` | Espacio **entre** ítems (mejor que `mr-` en cada hijo). |
| `w-*` / `max-w-*` / `min-w-0` | Anchos; `min-w-0` evita que un flex item no encoja. |
| `p-*` / `m-*` | Padding y margen del propio caja. |

Ancho de página habitual: `mx-auto max-w-5xl px-4`. Es más explícito que pelearse con la clase `container` de versiones antiguas (padding y centros configurados en JS).

```html
<main class="mx-auto max-w-5xl px-4 py-8">
  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <li class="rounded-lg border border-zinc-200 p-4">Producto</li>
  </ul>
</main>
```

Sin prefijo: una columna (móvil y todo lo demás). `md:`: dos columnas **desde** 48rem. `lg:`: tres desde 64rem. En un viewport `lg` aplican las tres capas: base + md + lg; gana la más específica en la cascada de media queries de Tailwind.

## Mobile-first

```text
sin prefijo  =  todos los anchos (diseña aquí el móvil)
md:          =  width >= breakpoint md
max-md:      =  width < md
```

```html
<p class="text-center md:text-left">En móvil centrado; desde md, a la izquierda.</p>
```

`sm:text-center` **no** es “solo móviles”: es “desde sm hacia arriba”. El error típico es dejar el móvil sin clase y poner `sm:` pensando que es el teléfono.

Breakpoints por defecto (mínimo): `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem. Son **anchos**, no iPhone/iPad.

Rango: `md:max-lg:flex` solo entre md y lg.

## Container queries

Cuando el componente debe reaccionar al **padre**, no al viewport:

```html
<div class="@container">
  <article class="flex flex-col gap-3 @md:flex-row">
    <img class="w-full @md:w-48" src="…" alt="Portada del curso" />
    <div>
      <h2 class="text-lg font-semibold">Curso de Tailwind</h2>
    </div>
  </article>
</div>
```

`@container` marca el contenedor; `@md:` (con `@`) es el tamaño del contenedor, distinto de `md:` de viewport. Misma idea mobile-first. No sustituye los breakpoints de página; sirve para cards reutilizables en sidebars estrechos.

## Errores habituales

- `md:` = “tablet” y olvidar que un desktop estrecho también es `< md`.
- Grid sin `gap` y márgenes en cada hijo.
- Flex item con texto largo que desborda: falta `min-w-0`.

## Buenas prácticas

- Layout móvil primero; overlays `md:` / `lg:`.
- `gap` en el contenedor.
- Viewport meta siempre.

## Ejercicio

1. Pasa el `ul` de 1 → 2 → 3 columnas y redimensiona el navegador; anota cuándo cambia.
2. Añade `@container` a una card y `@md:flex-row`; métela en un aside estrecho y en el main.
3. Reemplaza `sm:text-center` mal usado por el patrón `text-center md:text-left`.

## Siguiente paso

Continúa con [Tipografía, color y espaciado](04-tipografia-color-y-espaciado.md).

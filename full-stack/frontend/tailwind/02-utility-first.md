# Utility-first

Utility-first significa **componer** estilos con clases del theme en el propio elemento, en lugar de inventar un nombre CSS por cada pieza visual.

Documentación: [styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes), [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values).

## CSS con nombre vs composición

```css
.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}
```

```html
<h2 class="text-lg font-semibold tracking-tight">Ofertas de la semana</h2>
```

Ninguno es “el único CSS correcto”. Utility-first gana cuando el diseño es **único de esa pantalla** y quieres ver el cambio **junto al markup**. CSS semántico gana cuando el mismo objeto vive en muchos sitios *sin* un componente (o cuando el diseño es un sistema ajeno a Tailwind).

## Ventajas

- El cambio es local: no hay un `.card` de 200 líneas que alguien más reutiliza mal.
- Las utilities salen de **tokens** (`text-lg`, `gap-4`): menos “#3a7bd5 otra vez”.
- Variants (`hover:`, `md:`) se apilan en el mismo string (capítulos 3 y 6).
- Menos nombres que inventar y olvidar.

## Costes

- Strings largas: cuesta leer al principio.
- Si copias el mismo bloque en cinco ficheros, **no** has ganado: extrae un componente (capítulo 5).
- No sustituye layout mental: sigues decidiendo flex/grid.

Un botón usado una vez puede llevar doce clases. El mismo botón en header, modal y tabla es un `<Button />`, no un `.btn { @apply … }` por sistema.

## Arbitrary values

Cuando un valor **no** está en el theme y es puntual:

```html
<aside class="w-[37rem] grid grid-cols-[minmax(0,1fr)_12rem]">
  <!-- ... -->
</aside>
```

El scanner ve la clase completa y genera CSS. Es el equivalente a un inline style **con** variants (`lg:w-[37rem]`).

Si `37rem` o ese grid aparecen tres veces, **deja de ser arbitrary**: token en `@theme` (capítulo 7) o un componente. Arbitrary no es un theme paralelo en notación `[…]`.

Espacios en valores: `_` se convierte en espacio (`grid-cols-[1fr_12rem]`).

## Errores habituales

- Utility-first como religión: “prohibido CSS”.
- `@apply` de 20 utilities para “limpiar el HTML” (capítulo 5).
- Mezclar un design system de clases BEM *y* Tailwind sin criterio.

## Buenas prácticas

- Empieza en el markup; extrae cuando duela de verdad.
- Arbitrary para **excepciones**; tokens para **repetición**.
- El HTML sigue siendo `h2`, `button`, `nav`.

## Ejercicio

1. Reescribe un `.hero-title` de tres propiedades a utilities.
2. Añade `w-[37rem]` y luego muévelo a un token `--width-panel` (adelanta el cap. 7 si quieres).
3. Cuenta cuántas veces se repite el mismo string de clases en una vista: 1 vs 5 cambia la abstracción.

## Siguiente paso

Continúa con [Layout y responsive](03-layout-responsive.md).

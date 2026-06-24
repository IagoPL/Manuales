# Arquitectura CSS

La arquitectura CSS organiza estilos para que una aplicación sea mantenible, escalable y fácil de modificar.

## Conceptos clave

- **Base:** estilos globales y normalización.
- **Layout:** estructura de página.
- **Componentes:** piezas reutilizables.
- **Utilities:** clases pequeñas para casos concretos.
- **Tokens:** variables de diseño como colores, tamaños y espaciados.
- **Scope:** alcance de los estilos.

## Estructura recomendada

```txt
styles/
├── base/
├── layout/
├── components/
├── utilities/
└── tokens/
```

## Variables y tokens

```css
:root {
  --color-primary: #2563eb;
  --color-text: #111827;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius-sm: 4px;
}
```

## Componentes

```css
.card {
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-sm);
  padding: var(--space-4);
}

.card__title {
  margin: 0 0 var(--space-2);
}
```

## Utilities

```css
.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: var(--space-4);
}
```

## Buenas prácticas

- Define tokens antes de crear muchos componentes.
- Evita selectores excesivamente específicos.
- Separa layout de componentes.
- Usa nombres consistentes.
- Elimina CSS muerto periódicamente.
- Documenta patrones comunes.

## Errores comunes

- Repetir colores y espaciados sin variables.
- Usar `!important` como solución habitual.
- Crear selectores muy acoplados al HTML.
- Mezclar estilos globales con componentes sin criterio.
- No revisar estilos no utilizados.

## Chuleta rápida

```txt
tokens = decisiones de diseño
base = estilos globales
layout = estructura
components = piezas reutilizables
utilities = ayudas puntuales
```

## Recursos relacionados

- [Modelo de caja](02-modelo-de-caja.md)
- [Diseño responsivo](03-modelo-responsivo.md)
- [Tipografía](04-tipografia.md)
- [Colores y gradientes](05-colores-y-gradientes.md)

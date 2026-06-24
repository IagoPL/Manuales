# 4. Tipografía

La tipografía desempeña un papel crucial en el diseño web, ya que afecta la legibilidad y la apariencia visual de un sitio. Elegir fuentes web adecuadas y aplicar estilos tipográficos apropiados es esencial para una experiencia de usuario de alta calidad.

## 4.1. Fuentes Web (Web Fonts)

Las fuentes web permiten utilizar fuentes personalizadas en un sitio web, en lugar de depender de las fuentes predeterminadas en el sistema del usuario. Esto brinda una mayor flexibilidad en la elección de fuentes y estilos tipográficos. A continuación se muestra un ejemplo de cómo incorporar fuentes web en Markdown:

```css
/* Importar una fuente web de Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

/* Aplicar la fuente a un elemento específico */
body {
  font-family: 'Roboto', sans-serif;
}
```

En este ejemplo, se importa y aplica la fuente "Roboto" de Google Fonts a todo el documento.

## 4.2. Iconos y Símbolos

Los iconos y símbolos son componentes visuales clave en el diseño web. Se pueden incluir mediante fuentes de iconos, imágenes o sistemas de iconos personalizados. A continuación, se muestra un ejemplo de uso de iconos en Markdown:

```html
<!-- Uso de un icono de Font Awesome -->
<i class="fas fa-star"></i>

<!-- Uso de un emoji como símbolo -->
<span aria-label="Emoji de corazón" role="img">❤️</span>
```

En este ejemplo, se utilizan iconos de Font Awesome y un emoji como ejemplos de iconos y símbolos en un documento HTML.

## 4.3. Personalización de Fuentes

La personalización de fuentes implica ajustar diferentes aspectos de la tipografía, como el tamaño, el peso, la altura de línea y la letra capitular (drop cap). A continuación se muestra un ejemplo de personalización de fuentes en Markdown:

```css
/* Personalizar el tamaño y el peso de la fuente */
h1 {
  font-size: 36px;
  font-weight: bold;
}

/* Ajustar la altura de línea */
p {
  line-height: 1.5;
}

/* Crear una letra capitular */
.drop-cap {
  float: left;
  font-size: 2em;
  font-weight: bold;
  margin-right: 8px;
}
```

En este ejemplo, se personalizan diferentes aspectos tipográficos, incluyendo el tamaño, el peso y la altura de línea.

---

Este cuarto apartado sobre "Tipografía" te proporciona una comprensión sólida de cómo trabajar con fuentes web, iconos, símbolos y la personalización de fuentes en diseño web. La tipografía es un componente esencial para la estética y la legibilidad de un sitio web.
## 4.4. Escala tipográfica

Una escala tipográfica define tamaños coherentes para títulos, subtítulos, texto y elementos secundarios.

```css
:root {
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
}

body {
  font-size: var(--font-size-base);
}

h1 {
  font-size: var(--font-size-2xl);
}
```

## 4.5. Longitud de línea y legibilidad

Las líneas demasiado largas dificultan la lectura. Una referencia práctica es mantener el contenido de lectura entre 60 y 80 caracteres por línea.

```css
.article {
  max-width: 70ch;
  line-height: 1.7;
}
```

## 4.6. Jerarquía visual

La jerarquía tipográfica ayuda a escanear contenido.

Elementos habituales:

- Tamaño de fuente.
- Peso (`font-weight`).
- Espaciado vertical.
- Color secundario.
- Mayúsculas o estilos especiales con moderación.

```css
h1,
h2,
h3 {
  line-height: 1.2;
  margin-block: 0 0.75rem;
}

p {
  margin-block: 0 1rem;
}
```

## 4.7. Fuentes del sistema

Para interfaces técnicas o dashboards, una pila de fuentes del sistema suele ser rápida y legible.

```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

code,
pre {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
```

## 4.8. Buenas prácticas

- Usa pocas familias tipográficas.
- Define una escala y reutilízala.
- Ajusta `line-height` para lectura cómoda.
- Limita ancho de párrafos largos.
- Usa fuentes monoespaciadas para código.
- Comprueba acentos, símbolos y caracteres especiales.

## 4.9. Errores comunes

- Usar tamaños demasiado pequeños en móvil.
- Abusar de negritas y mayúsculas.
- Usar muchas fuentes en la misma página.
- No definir fallback de fuentes.
- Crear párrafos muy anchos.

## 4.10. Chuleta rápida

```css
font-family: system-ui, sans-serif;
font-size: 1rem;
font-weight: 600;
line-height: 1.6;
max-width: 70ch;
letter-spacing: 0;
```

## Recursos relacionados

- [Diseño responsivo](03-modelo-responsivo.md)
- [Colores y gradientes](05-colores-y-gradientes.md)
- [Accesibilidad](../ux/03-accesibilidad.md)

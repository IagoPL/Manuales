
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
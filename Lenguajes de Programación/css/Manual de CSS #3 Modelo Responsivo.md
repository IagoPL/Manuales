# 3. Diseño Responsivo

El diseño responsivo es una técnica crucial en el desarrollo web que permite que las páginas se adapten a diferentes tamaños de pantalla y dispositivos. Esto garantiza una experiencia óptima para los usuarios, ya sea que estén en una computadora de escritorio, una tableta o un teléfono móvil.

## 3.1. Media Queries

Las media queries son una parte esencial del diseño responsivo. Permiten aplicar estilos CSS específicos cuando se cumplen ciertas condiciones, como el ancho de la pantalla. A continuación se muestra un ejemplo de una media query en Markdown:

```css
/* Aplicar estilos para pantallas de ancho menor a 600px */
@media screen and (max-width: 600px) {
  body {
    font-size: 16px;
  }

  .header {
    padding: 10px;
  }

  /* Agregar estilos adicionales para dispositivos pequeños */
  .menu {
    display: none;
  }
}
```

En este ejemplo, los estilos se aplicarán solo cuando el ancho de la pantalla sea igual o menor a 600px.

## 3.2. Diseño Fluido

Un diseño fluido se adapta de manera continua a diferentes tamaños de pantalla. Se logra utilizando porcentajes en lugar de valores fijos para definir dimensiones, márgenes y relleno. A continuación se muestra un ejemplo de diseño fluido en Markdown:

```css
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.column {
  width: 33.33%; /* Utilizando porcentajes para columnas */
  float: left;
}
```

En este ejemplo, el diseño se adapta a diferentes tamaños de pantalla manteniendo un ancho relativo.

## 3.3. Flexbox

Flexbox es un modelo de diseño CSS que facilita la creación de diseños responsivos y flexibles. Permite alinear y distribuir elementos de manera eficiente en un contenedor, lo que es especialmente útil para diseños de una sola dimensión, como listas o barras de navegación. Ejemplo de uso de Flexbox en Markdown:

```css
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 1;
  margin: 10px;
}
```

En este ejemplo, los elementos dentro del contenedor se distribuyen automáticamente en filas y columnas, adaptándose al espacio disponible.

## 3.4. Grid

CSS Grid es un sistema de diseño bidimensional que permite crear diseños más complejos y estructurados. Es especialmente útil para la creación de páginas web con varias secciones y columnas. A continuación, un ejemplo de uso de CSS Grid en Markdown:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.item {
  background-color: #3498db;
  padding: 20px;
}
```

En este ejemplo, se crea un diseño de tres columnas con espacios entre ellas.

---

Este tercer apartado sobre "Diseño Responsivo" te proporciona una comprensión sólida de las técnicas y conceptos clave para crear páginas web que se adapten de manera efectiva a diferentes tamaños de pantalla. Media queries, diseño fluido, Flexbox y CSS Grid son herramientas esenciales en el arsenal del diseño web responsivo.
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
## 3.5. Enfoque mobile first

El enfoque **mobile first** consiste en diseñar primero para pantallas pequeñas y añadir mejoras para pantallas mayores mediante media queries.

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Ventajas:

- Prioriza contenido esencial.
- Reduce complejidad inicial.
- Mejora experiencia en móviles.
- Facilita añadir mejoras progresivas.

## 3.6. Unidades responsivas

Un diseño responsivo combina unidades relativas y límites razonables.

```css
.container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}

.title {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
}
```

Unidades útiles:

- `%`: relativo al contenedor.
- `rem`: relativo al tamaño base de fuente.
- `vw` y `vh`: relativo al viewport.
- `min()`, `max()`, `clamp()`: límites dinámicos.

## 3.7. Imágenes responsivas

Las imágenes deben adaptarse al contenedor sin deformarse.

```css
img {
  max-width: 100%;
  height: auto;
}
```

Para imágenes de fondo:

```css
.hero {
  background-image: url("hero.webp");
  background-size: cover;
  background-position: center;
}
```

## 3.8. Patrones comunes

### Sidebar responsiva

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: 280px 1fr;
  }
}
```

### Tarjetas fluidas

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
```

## 3.9. Buenas prácticas

- Diseña primero el contenido, luego el layout.
- Usa `max-width` para evitar líneas demasiado largas.
- Evita fijar alturas rígidas en tarjetas con contenido variable.
- Prueba en anchos intermedios, no solo móvil y escritorio.
- Usa `auto-fit` y `minmax()` para grids flexibles.
- Comprueba navegación, formularios y menús en móvil.

## 3.10. Errores comunes

- Crear breakpoints solo para dispositivos concretos.
- Usar demasiados valores fijos en píxeles.
- Ocultar contenido importante en móvil.
- No probar orientación horizontal.
- Diseñar componentes que se rompen con textos largos.

## 3.11. Chuleta rápida

```css
max-width: 100%;
height: auto;
width: min(100% - 2rem, 1200px);
font-size: clamp(1rem, 2vw, 2rem);
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
@media (min-width: 768px) { ... }
```

## Recursos relacionados

- [Modelo de caja](02-modelo-de-caja.md)
- [Tipografía](04-tipografia.md)
- [Colores y gradientes](05-colores-y-gradientes.md)

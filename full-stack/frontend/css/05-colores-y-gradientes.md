# 5. Colores y Gradientes

Los colores y los gradientes desempeñan un papel crucial en el diseño web. La elección de paletas de colores adecuadas y la aplicación de gradientes pueden mejorar la estética de un sitio web y transmitir la identidad de la marca.

## 5.1. Espacios de Color (RGB, HSL)

Los espacios de color, como RGB (Red, Green, Blue) y HSL (Hue, Saturation, Lightness), permiten especificar colores de manera precisa. A continuación se muestra un ejemplo de uso de colores en formato RGB y HSL en Markdown:

```css
/* Definir un color rojo en formato RGB */
.red-box {
  background-color: rgb(255, 0, 0);
}

/* Definir un color verde en formato HSL */
.green-box {
  background-color: hsl(120, 100%, 50%);
}
```

En este ejemplo, se utilizan formatos RGB y HSL para definir colores rojo y verde.

## 5.2. Degradados (Gradients)

Los gradientes permiten crear transiciones suaves entre colores, lo que agrega profundidad y estilo a elementos. A continuación se muestra un ejemplo de uso de gradientes en Markdown:

```css
/* Aplicar un fondo degradado lineal */
.gradient-box {
  background: linear-gradient(to right, #3498db, #c0392b);
}

/* Aplicar un fondo degradado radial */
.radial-gradient-box {
  background: radial-gradient(circle, #f39c12, #e74c3c);
}
```

En este ejemplo, se aplican gradientes lineales y radiales a elementos.

## 5.3. Transparencia (RGBA, HSLA)

La transparencia es una propiedad importante para superponer elementos y crear efectos visuales. Se puede lograr utilizando formatos como RGBA (Red, Green, Blue, Alpha) o HSLA (Hue, Saturation, Lightness, Alpha). A continuación se muestra un ejemplo de uso de transparencia en Markdown:

```css
/* Aplicar un fondo con transparencia */
.transparent-box {
  background-color: rgba(52, 152, 219, 0.5);
}

/* Aplicar un color de texto con transparencia */
.text-with-opacity {
  color: hsla(120, 100%, 25%, 0.7);
}
```

En este ejemplo, se utilizan formatos RGBA y HSLA para agregar transparencia a elementos y texto.

---

Este quinto apartado sobre "Colores y Gradientes" te proporciona una comprensión sólida de cómo trabajar con colores en diferentes espacios de color, gradientes y transparencia en diseño web. La elección de colores y el uso de gradientes son fundamentales para crear un diseño web atractivo y visualmente impactante.

## 5.4. Variables CSS para paletas

Las variables CSS permiten centralizar colores y reutilizarlos en toda la interfaz.

```css
:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1e40af;
  --color-surface: #ffffff;
  --color-text: #111827;
  --color-muted: #6b7280;
}

.button {
  background-color: var(--color-primary);
  color: var(--color-surface);
}

.button:hover {
  background-color: var(--color-primary-dark);
}
```

## 5.5. Estados de interfaz

Los colores también comunican estado. Conviene reservar colores semánticos para mensajes importantes.

```css
:root {
  --color-success: #15803d;
  --color-warning: #b45309;
  --color-error: #b91c1c;
  --color-info: #0369a1;
}

.alert-success {
  color: var(--color-success);
}

.alert-error {
  color: var(--color-error);
}
```

## 5.6. Accesibilidad y contraste

Un diseño visualmente atractivo debe seguir siendo legible. Antes de publicar una interfaz, revisa el contraste entre texto y fondo.

Buenas prácticas:

- Usa contraste alto para texto principal.
- No transmitas información solo mediante color.
- Añade iconos, texto o estados visibles junto al color.
- Evita texto fino sobre fondos con gradientes complejos.
- Prueba estados hover, focus, disabled y error.

## 5.7. Buenas prácticas

- Define una paleta base antes de crear componentes.
- Usa variables CSS para evitar colores repetidos.
- Reserva colores intensos para acciones o estados importantes.
- Mantén coherencia entre botones, enlaces, alertas y formularios.
- Evita abusar de gradientes si dificultan la lectura.

## 5.8. Errores comunes

- Usar demasiados colores sin jerarquía.
- Aplicar gradientes detrás de texto pequeño.
- No comprobar contraste.
- Repetir valores hexadecimales por todo el CSS.
- Usar colores semánticos de forma inconsistente.

## 5.9. Chuleta rápida

```css
color: #111827;
background-color: rgb(255, 255, 255);
background-color: hsl(220, 80%, 55%);
background-color: rgba(37, 99, 235, 0.2);
background: linear-gradient(90deg, #2563eb, #14b8a6);
color: var(--color-text);
```

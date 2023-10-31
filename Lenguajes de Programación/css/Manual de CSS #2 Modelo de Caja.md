# 2. Modelo de Caja

El "Modelo de Caja" en CSS es esencial para comprender cómo se representan y se muestran los elementos en una página web. Cada elemento HTML se representa como una caja rectangular y el modelo de caja controla su diseño y dimensiones.

## 2.1. Box-sizing

La propiedad `box-sizing` determina cómo se calculan las dimensiones totales de una caja, incluyendo su contenido, relleno (padding) y borde (border). Hay dos valores principales:

- `content-box` (valor predeterminado): El tamaño total de la caja se calcula considerando solo el contenido, excluyendo el relleno y el borde.
- `border-box`: El tamaño total de la caja se calcula incluyendo el contenido, el relleno y el borde.

Ejemplo de uso de `box-sizing` en Markdown:


```css
/* Aplicar box-sizing: border-box a todos los elementos */
* {
  box-sizing: border-box;
}

/* Configurar un elemento específico con content-box */
.header {
  box-sizing: content-box;
}

/* Configurar un elemento específico con border-box */
.article {
  box-sizing: border-box;
}
```

## 2.2. Margen Colapsado

El margen colapsado es un comportamiento importante a entender en el modelo de caja. Sucede cuando los márgenes verticales de dos elementos adyacentes se superponen en lugar de sumarse. Esto puede afectar el espaciado entre elementos.

Ejemplo de margen colapsado en Markdown:


```css
/* Margen superior del primer párrafo */
p:first-child {
  margin-top: 20px;
}

/* Margen superior del segundo párrafo */
p:nth-child(2) {
  margin-top: 10px;
}
```

En este ejemplo, los márgenes superiores del primer y segundo párrafos se colapsarán si están adyacentes.

## 2.3. Box-shadow y Border-radius

La propiedad `box-shadow` permite agregar sombras a una caja, lo que puede darle profundidad y estilo. La propiedad `border-radius` permite redondear las esquinas de una caja.

Ejemplo de uso de `box-shadow` y `border-radius` en Markdown:


```css
/* Agregar sombra y redondear esquinas a un cuadro */
.card {
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

/* Redondear solo las esquinas superiores */
.avatar {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
}
```

## 2.4. Overflow y text-overflow

La propiedad `overflow` controla qué sucede cuando el contenido de una caja es demasiado grande para ajustarse en su tamaño. Puedes usar valores como `visible`, `hidden`, `scroll`, o `auto`. La propiedad `text-overflow` se utiliza para controlar cómo se muestra el texto cuando se desborda el área de la caja.

Ejemplo de uso de `overflow` y `text-overflow` en Markdown:


```css
/* Mostrar barras de desplazamiento si el contenido se desborda */
.scrollable-box {
  overflow: auto;
}

/* Ocultar el contenido que se desborda y agregar puntos suspensivos */
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

Este segundo apartado sobre el "Modelo de Caja" te proporciona un entendimiento sólido de cómo funcionan las cajas en CSS y cómo controlar su diseño y dimensiones. Los conceptos de `box-sizing`, margen colapsado, `box-shadow`, `border-radius`, `overflow` y `text-overflow` son fundamentales para crear diseños web efectivos y atractivos.
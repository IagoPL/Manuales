# 1. Selectores Avanzados

Los selectores son una parte fundamental de CSS, y conocer los selectores avanzados te permitirá aplicar estilos de manera más específica y efectiva en tus documentos HTML. Estos selectores te brindan un mayor control sobre los elementos que deseas estilizar.

## 1.1. Pseudo-clases

Las pseudo-clases son selectores que se utilizan para aplicar estilos a elementos en estados específicos. Esto es útil para resaltar elementos cuando el usuario interactúa con la página.

- `:hover`: Aplica estilos cuando el cursor se coloca sobre el elemento.
- `:active`: Aplica estilos cuando el elemento está siendo activado (por ejemplo, al hacer clic en un enlace).
- `:focus`: Aplica estilos cuando el elemento recibe el enfoque (generalmente a través del teclado).

Ejemplo de uso de pseudo-clases en css:

```css
A:hover {
  text-decoration: underline;
}

button:active {
  background-color: #ff5733;
}

input:focus {
  border-color: #0077b6;
}
```

## 1.2. Pseudo-elementos

Los pseudo-elementos permiten seleccionar partes específicas de un elemento, como el primer párrafo de un div o el primer carácter de un elemento de texto.

- `::before`: Permite agregar contenido antes del contenido del elemento seleccionado.
- `::after`: Permite agregar contenido después del contenido del elemento seleccionado.
- `::first-line`: Aplica estilos solo a la primera línea de un elemento de texto.
- `::first-letter`: Aplica estilos solo al primer carácter de un elemento de texto.

Ejemplo de uso de pseudo-elementos en css:

```css
p::before {
  content: "🌟 ";
}

blockquote::after {
  content: " — Source";
}

p::first-line {
  font-weight: bold;
}

p::first-letter {
  font-size: 150%;
  color: #e63946;
}
```

## 1.3. Selectores de Atributos

Los selectores de atributos permiten seleccionar elementos basados en los valores de sus atributos. Esto es útil cuando deseas estilizar elementos que cumplen con ciertos criterios.

- `[attribute]`: Selecciona elementos que tienen el atributo especificado.
- `[attribute="value"]`: Selecciona elementos con el atributo igual al valor especificado.
- `[attribute^="value"]`: Selecciona elementos con el atributo que comienza con el valor especificado.
- `[attribute$="value"]`: Selecciona elementos con el atributo que termina con el valor especificado.
- `[attribute*="value"]`: Selecciona elementos con el atributo que contiene el valor especificado.

Ejemplo de uso de selectores de atributos en css:

```css
[role="button"] {
  background-color: #0074d9;
  color: #fff;
}

[data-category^="news"] {
  border: 1px solid #ff5733;
}

[title$="PDF"] {
  font-weight: bold;
}

[data-attribute*="search"] {
  color: #28a745;
}
```

### 1.3.1. Combinación de Selectores

Puedes combinar selectores para ser aún más específico. Por ejemplo, si deseas seleccionar un enlace que tenga la clase "external", puedes hacerlo de la siguiente manera:

```css
a.external {
  color: #d9534f;
  text-decoration: none;
}
```

Este selector se aplicará solo a los enlaces que tienen la clase "external".

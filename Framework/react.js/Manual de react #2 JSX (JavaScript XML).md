# JSX (JavaScript XML)

JSX (JavaScript XML) es una extensión de sintaxis que permite escribir código similar a HTML directamente dentro de JavaScript. Es uno de los pilares fundamentales de React, ya que simplifica la creación y estructuración de interfaces de usuario de forma declarativa.

## ¿Qué es JSX?

JSX combina la potencia de JavaScript con la familiaridad del HTML. Aunque parece HTML, en realidad es una sintaxis que React transpila a código JavaScript puro utilizando funciones como `React.createElement`.

### Ventajas de JSX

- **Legibilidad:** Hace que el código sea más legible y entendible al mezclar lógica y estructura.
- **Declarativo:** Permite describir claramente qué debería renderizarse en la interfaz.
- **Integración:** Facilita la manipulación de datos y la renderización condicional usando expresiones JavaScript.

---

## Sintaxis de JSX

### Elementos básicos

JSX permite usar etiquetas similares a HTML para crear elementos React. Cada etiqueta puede tener atributos, hijos y elementos anidados.

```jsx
import React from 'react';

function MyComponent() {
  return (
    <div>
      <h1>Hola, soy JSX</h1>
      <p>Es fácil de usar y entender.</p>
    </div>
  );
}
```

### Atributos en JSX

Los atributos en JSX utilizan camelCase en lugar de kebab-case. Además, algunos atributos de HTML tienen nombres diferentes en JSX.

- **HTML vs JSX:**
  - `class` se convierte en `className`.
  - `for` se convierte en `htmlFor`.

```jsx
<input type="text" className="mi-clase" htmlFor="nombre" />
```

### Expresiones en JSX

Puedes incluir código JavaScript dentro de JSX utilizando llaves `{}`. Esto permite combinar lógica y estructura.

```jsx
function Greeting({ name }) {
  return <h1>Hola, {name}</h1>;
}

<Greeting name="Juan" />;
```

También es posible realizar operaciones matemáticas, ejecutar funciones o evaluar condiciones directamente dentro de las llaves:

```jsx
const isLoggedIn = true;
<p>{isLoggedIn ? 'Bienvenido' : 'Por favor, inicia sesión'}</p>;
```

---

## Renderización de elementos React

En React, JSX se convierte en elementos React que se renderizan en el DOM utilizando `ReactDOM.render`.

### Ejemplo

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

const element = <h1>Hola, mundo</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

El método `ReactDOM.render` toma dos argumentos:

1. El elemento React a renderizar.
2. El contenedor en el DOM donde debe insertarse.

---

## Reglas importantes en JSX

### 1. Un elemento raíz

Todo componente o fragmento JSX debe estar envuelto en un solo elemento raíz.

```jsx
// Correcto
function App() {
  return (
    <div>
      <h1>Hola</h1>
      <p>Bienvenido</p>
    </div>
  );
}

// Incorrecto
function App() {
  return (
    <h1>Hola</h1>
    <p>Bienvenido</p>
  );
}
```

Para evitar contenedores adicionales innecesarios, puedes usar **fragmentos**:

```jsx
import React from 'react';

function App() {
  return (
    <>
      <h1>Hola</h1>
      <p>Bienvenido</p>
    </>
  );
}
```

### 2. Etiquetas cerradas

Todas las etiquetas deben cerrarse correctamente, incluso las etiquetas de elementos vacíos.

```jsx
// Correcto
<img src="imagen.jpg" alt="Descripción" />

// Incorrecto
<img src="imagen.jpg">
```

### 3. Uso de `className` en lugar de `class`

Como `class` es una palabra reservada en JavaScript, JSX utiliza `className` para definir clases CSS.

```jsx
<div className="mi-clase">Texto</div>
```

---

## Renderizado condicional

En JSX, puedes mostrar u ocultar elementos basándote en condiciones.

### Usando operadores ternarios

```jsx
const isLoggedIn = true;

function App() {
  return (
    <div>
      {isLoggedIn ? <p>Bienvenido</p> : <p>Por favor, inicia sesión</p>}
    </div>
  );
}
```

### Renderizado con funciones

```jsx
function renderGreeting(isLoggedIn) {
  if (isLoggedIn) {
    return <p>Bienvenido</p>;
  } else {
    return <p>Por favor, inicia sesión</p>;
  }
}

function App() {
  return <div>{renderGreeting(true)}</div>;
}
```

---

## Comentarios en JSX

Los comentarios deben colocarse dentro de llaves `{}`.

```jsx
function App() {
  return (
    <div>
      {/* Esto es un comentario en JSX */}
      <h1>Hola</h1>
    </div>
  );
}
```

---

## Conclusiones

JSX es una herramienta poderosa que facilita la creación de interfaces en React. Su capacidad para combinar lógica y estructura lo convierte en una pieza fundamental para el desarrollo moderno de aplicaciones. Dominar JSX es esencial para aprovechar todo el potencial de React.

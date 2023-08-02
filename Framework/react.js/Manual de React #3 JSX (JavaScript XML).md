## 3. JSX (JavaScript XML)

JSX (JavaScript XML) es una extensión de sintaxis utilizada en React para describir la estructura de la interfaz de usuario. JSX nos permite integrar HTML en JavaScript, lo que hace que la creación de componentes y elementos React sea más declarativa y fácil de leer. En esta sección, profundizaremos en la sintaxis y reglas de JSX, aprenderemos sobre expresiones y atributos en JSX, y veremos cómo renderizar elementos React en el DOM.

### 3.1. Sintaxis y reglas de JSX

#### Integración de HTML en JavaScript

Con JSX, podemos utilizar etiquetas HTML dentro de nuestro código JavaScript para describir la estructura de la interfaz de usuario. Esto hace que la creación de elementos React sea más similar a escribir código HTML estándar.

```jsx
import React from 'react';

function MyComponent() {
  return (
    <div>
      <h1>Hola, esto es un componente con JSX</h1>
      <p>Esto es un párrafo dentro del componente</p>
    </div>
  );
}
```

En el ejemplo anterior, hemos creado un componente funcional `MyComponent` que utiliza etiquetas HTML como `<div>`, `<h1>` y `<p>`.

#### Expresiones en JSX

Podemos utilizar expresiones de JavaScript dentro de JSX utilizando llaves `{}`. Esto nos permite incorporar lógica y variables dinámicas en nuestros elementos React.

```jsx
import React from 'react';

function MyComponent() {
  const name = 'John';
  const age = 30;

  return (
    <div>
      <h1>Hola, mi nombre es {name}</h1>
      <p>Tengo {age} años</p>
    </div>
  );
}
```

En el ejemplo anterior, hemos utilizado las variables `name` y `age` dentro de las llaves `{}` para incorporar sus valores en el componente.

#### Reglas de JSX

Al utilizar JSX, hay algunas reglas importantes a tener en cuenta:

1. **Elemento raíz**: Un componente de React debe devolver un solo elemento JSX como resultado. Si deseas devolver varios elementos, debes envolverlos en un elemento raíz, como un `<div>`.

```jsx
// Correcto
function MyComponent() {
  return (
    <div>
      <h1>Elemento 1</h1>
      <p>Elemento 2</p>
    </div>
  );
}

// Incorrecto
function MyComponent() {
  return <h1>Elemento 1</h1> <p>Elemento 2</p>;
}
```

2. **Atributos en formato camelCase**: Los nombres de los atributos en JSX deben estar escritos en formato camelCase, en lugar del formato con guiones utilizado en HTML.

```jsx
// Correcto
function MyComponent() {
  return <input type="text" />;
}

// Incorrecto: Debe ser "type" en lugar de "type-text"
function MyComponent() {
  return <input type-text" />;
}
```

### 3.2. Uso de expresiones y atributos en JSX

#### Expresiones en JSX

Como mencionamos anteriormente, las expresiones de JavaScript se utilizan dentro de llaves `{}` en JSX. Las expresiones pueden ser cualquier código JavaScript válido, como variables, operaciones matemáticas, funciones y más.

```jsx
import React from 'react';

function MyComponent() {
  const num1 = 10;
  const num2 = 5;

  return (
    <div>
      <p>La suma de {num1} y {num2} es {num1 + num2}</p>
      <p>El resultado de la función {getRandomNumber()} es {getRandomNumber()}</p>
    </div>
  );
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100);
}
```

En el ejemplo anterior, hemos utilizado expresiones para realizar operaciones matemáticas y llamar a la función `getRandomNumber()`.

#### Atributos en JSX

Los atributos en JSX se utilizan para configurar elementos y componentes. Los nombres de los atributos deben ser escritos en formato camelCase, y los valores de los atributos pueden ser cadenas de texto o expresiones de JavaScript.

```jsx
import React from 'react';

function MyComponent() {
  const name = 'John';
  const imgUrl = 'https://example.com/john.jpg';

  return (
    <div>
      <h1>{name}</h1>
      <img src={imgUrl} alt="John's Picture" />
    </div>
  );
}
```

En el ejemplo anterior, hemos utilizado el atributo `src` para proporcionar la URL de la imagen y el atributo `alt` para una descripción alternativa de la imagen.

### 3.3. Renderización de elementos React en el DOM

Una vez que hemos definido nuestros componentes y elementos React con JSX, debemos renderizarlos en el DOM para que sean visibles en el navegador.

Para renderizar elementos React en el DOM, utilizamos `ReactDOM.render()`. Este método to

ma dos argumentos: el elemento React que deseamos renderizar y el elemento del DOM donde queremos que aparezca.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

function MyComponent() {
  return <h1>Hola, esto es un componente React con JSX</h1>;
}

ReactDOM.render(<MyComponent />, document.getElementById('root'));
```

En el ejemplo anterior, hemos utilizado `ReactDOM.render()` para renderizar el componente `MyComponent` en el elemento con el ID `'root'` del DOM.

### 3.4. Fragmentos en JSX

Los fragmentos son una forma de devolver múltiples elementos JSX sin la necesidad de envolverlos en un elemento raíz adicional. Los fragmentos son útiles cuando deseamos devolver varios elementos sin agregar un contenedor adicional en el DOM.

```jsx
import React from 'react';

function MyComponent() {
  return (
    <>
      <h1>Elemento 1</h1>
      <p>Elemento 2</p>
    </>
  );
}
```

En el ejemplo anterior, hemos utilizado un fragmento (`<>...</>`) para devolver múltiples elementos JSX sin agregar un `<div>` adicional.

### 3.5. Comentarios en JSX

Los comentarios en JSX se manejan de manera similar a los comentarios en JavaScript, pero deben estar envueltos entre llaves `{}`.

```jsx
import React from 'react';

function MyComponent() {
  return (
    <div>
      {/* Este es un comentario en JSX */}
      <h1>Hola, esto es un componente con JSX</h1>
      {/* <p>Este párrafo no se mostrará en la interfaz</p> */}
    </div>
  );
}
```

En el ejemplo anterior, hemos utilizado comentarios en JSX para agregar notas o desactivar temporalmente ciertos elementos.

### 3.6. Conclusiones

JSX es una poderosa extensión de sintaxis que hace que la creación de componentes y elementos React sea más intuitiva y legible. Permite integrar HTML en JavaScript y nos ofrece la flexibilidad de utilizar expresiones y atributos para generar interfaces de usuario dinámicas.

En esta sección, hemos profundizado en la sintaxis y reglas de JSX, aprendido cómo utilizar expresiones y atributos en JSX, y visto cómo renderizar elementos React en el DOM utilizando `ReactDOM.render()`. También hemos explorado el uso de fragmentos para devolver múltiples elementos sin la necesidad de un elemento raíz y cómo agregar comentarios en JSX.

JSX es una parte esencial del desarrollo de aplicaciones React, y su dominio es fundamental para construir interfaces de usuario potentes y expresivas. Continuemos nuestro aprendizaje para convertirnos en desarrolladores de React completos y exploremos temas como la comunicación entre componentes, el manejo de eventos y el enrutamiento en aplicaciones React.
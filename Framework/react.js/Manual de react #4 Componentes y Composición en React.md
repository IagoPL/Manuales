## 4. Componentes y Composición en React

En React, la composición es una técnica fundamental que nos permite construir aplicaciones mediante la combinación de componentes más pequeños y reutilizables. En esta sección, aprenderemos sobre cómo crear componentes más complejos a partir de componentes más simples, utilizando la composición de React. También exploraremos técnicas para comunicar datos entre componentes y cómo aprovechar las props para hacer que nuestros componentes sean más configurables y flexibles.

### 4.1. Composición de componentes

La composición es una característica central en React que nos permite construir interfaces de usuario complejas dividiendo la interfaz en componentes más pequeños y reutilizables. Al utilizar la composición, creamos componentes con un propósito específico y los combinamos para formar la interfaz de usuario completa.

```jsx
import React from 'react';

// Componente funcional reutilizable
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

// Componente que utiliza la composición de componentes
function App() {
  return (
    <div>
      <h1>Composición en React</h1>
      <Button label="Haz clic aquí" onClick={() => alert('Botón clicado')} />
    </div>
  );
}
```

En el ejemplo anterior, hemos creado un componente funcional `Button` que representa un botón reutilizable. Luego, hemos utilizado la composición para incorporar ese componente `Button` dentro del componente `App`.

### 4.2. Comunicación entre componentes

La comunicación entre componentes es esencial para construir aplicaciones interactivas en React. Hay dos formas principales de comunicar datos entre componentes: a través de props y mediante el uso de callbacks.

#### Props

Las props (propiedades) son una forma de pasar datos desde un componente padre a un componente hijo. Los componentes hijos reciben las props como argumentos y pueden utilizar esos datos para renderizar su interfaz de usuario o ejecutar acciones.

```jsx
import React from 'react';

function Greeting(props) {
  return <h1>Hola, {props.name}</h1>;
}

function App() {
  return <Greeting name="John" />;
}
```

En el ejemplo anterior, hemos pasado la prop `name` al componente hijo `Greeting` desde el componente padre `App`.

#### Callbacks

Los callbacks son funciones que se pasan como props a un componente hijo y se utilizan para permitir que el componente hijo notifique eventos al componente padre. De esta manera, el componente padre puede reaccionar a acciones realizadas en el componente hijo.

```jsx
import React from 'react';

function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

function App() {
  const handleClick = () => {
    alert('Botón clicado');
  };

  return <Button label="Haz clic aquí" onClick={handleClick} />;
}
```

En el ejemplo anterior, hemos pasado la función `handleClick` como prop al componente `Button`. Cuando el botón se hace clic, se ejecuta la función `handleClick` que alerta un mensaje.

### 4.3. Children en React

En React, la prop especial `children` se utiliza para pasar contenido entre las etiquetas de apertura y cierre de un componente. Esto permite que el componente tenga contenido anidado, lo que es útil para crear componentes reutilizables y flexibles.

```jsx
import React from 'react';

function Card(props) {
  return (
    <div className="card">
      <div className="header">{props.title}</div>
      <div className="content">{props.children}</div>
    </div>
  );
}

function App() {
  return (
    <Card title="Mi tarjeta">
      <p>Contenido de la tarjeta.</p>
      <p>Más contenido de la tarjeta.</p>
    </Card>
  );
}
```

En el ejemplo anterior, el componente `Card` tiene contenido anidado `<p>` dentro del componente `App`, que se pasa como la prop `children`.

### 4.4. Reutilización de componentes

La composición y la comunicación entre componentes nos permiten crear componentes reutilizables que se pueden utilizar en diferentes partes de la aplicación.

```jsx
import React from 'react';

function Card(props) {
  return (
    <div className="card">
      <div className="header">{props.title}</div>
      <div className="content">{props.children}</div>
    </div>
  );
}

function App() {
  return (
    <>
      <Card title="Tarjeta 1">
        <p>Contenido de la tarjeta 1.</p>
      </Card>
      <Card title="Tarjeta 2">
        <p>Contenido de la tarjeta 2.</p>
      </Card>
    </>
  );
}
```

En el ejemplo anterior, hemos reutilizado el componente `Card` dos veces con diferentes títulos y contenido.

### 4.5. Componentes de orden superior (HOC)

Los Componentes de Orden Superior (HOC) son una técnica avanzada en React que nos permite reutilizar lógica y funcionalidad en varios componentes. Un HOC es una función que toma un componente y devuelve un nuevo componente mejorado con funcionalidad adicional.

```jsx
import React from 'react';

// HOC para agregar un estilo de borde a un componente
function withBorder(Component) {
  return function WithBorder(props) {
    return <div style={{ border: '2px solid black' }}><Component {...props} /></div>;
  };
}

function MyComponent(props) {
  return <p>{props.message}</p>;
}

const MyComponentWithBorder = withBorder(MyComponent);

function App() {
  return <MyComponentWithBorder message="Mensaje con borde" />;
}
```

En el ejemplo anterior, hemos creado un HOC `withBorder` que agrega un estilo de borde a un componente. Luego, hemos utilizado este HOC para mejorar el componente `MyComponent`.

### 4.6. Conclusiones

La composición y la comunicación entre componentes son fundamentales para el desarrollo de aplicaciones React. Con la composición, podemos construir interfaces de usuario complejas combinando componentes más pequeños y reutilizables. Las props y los callbacks permiten que los componentes se comuniquen entre sí y pasen datos y acciones.

Aprovechando la composición y la comunicación entre componentes, podemos crear aplicaciones React más flexibles, modulares y mantenibles. Además, con la técnica de Componentes de Orden Superior (HOC), podemos mejorar la reutilización de funcionalidades en nuestros componentes.

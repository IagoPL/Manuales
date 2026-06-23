# Componentes en React

En React, los componentes son la base del desarrollo de aplicaciones. Permiten dividir la interfaz de usuario en piezas independientes, reutilizables y organizadas. Cada componente se encarga de una parte específica de la UI, lo que facilita el mantenimiento y la ampliación de la aplicación.

## ¿Qué es un componente?

Un componente en React es una pieza de código que describe qué debe renderizarse en la pantalla. Es como una función que toma entradas (llamadas **props**) y devuelve elementos React que describen la apariencia de la UI.

### Ventajas de usar componentes

- **Reutilización:** Los componentes pueden ser utilizados múltiples veces en diferentes partes de la aplicación.
- **Organización:** Dividen la aplicación en piezas pequeñas y manejables.
- **Modularidad:** Facilitan la separación de responsabilidades y el trabajo en equipo.

---

## Tipos de componentes

React admite dos tipos principales de componentes: funcionales y de clase. En proyectos modernos, los **componentes funcionales** son la norma gracias a los hooks.

### Componentes funcionales

Son funciones de JavaScript que devuelven elementos React. Se utilizan para componentes simples y modernos.

#### Ejemplo:

```jsx
import React from 'react';

function Greeting(props) {
  return <h1>Hola, {props.name}</h1>;
}

export default Greeting;
```

#### Características:

- Son más sencillos y fáciles de leer.
- Utilizan **hooks** para manejar estado y efectos secundarios.

#### Uso:

```jsx
import Greeting from './Greeting';

function App() {
  return <Greeting name="Juan" />;
}
```

### Componentes de clase

Son clases de JavaScript que extienden `React.Component`. Se usaban antes de la introducción de los hooks para manejar el estado y el ciclo de vida del componente.

#### Ejemplo:

```jsx
import React, { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hola, {this.props.name}</h1>;
  }
}

export default Greeting;
```

#### Características:

- Pueden manejar estado utilizando `this.state`.
- Incluyen métodos para controlar el ciclo de vida.

#### Uso:

```jsx
import Greeting from './Greeting';

function App() {
  return <Greeting name="María" />;
}
```

---

## Props: Pasando datos entre componentes

**Props** (abreviación de "propiedades") son datos que se pasan desde un componente padre a un componente hijo. Son inmutables y se utilizan para personalizar el contenido y el comportamiento del componente.

### Ejemplo:

```jsx
function Welcome(props) {
  return <h1>Bienvenido, {props.username}</h1>;
}

function App() {
  return <Welcome username="Carlos" />;
}
```

### Props predeterminadas

Puedes establecer valores predeterminados para las props:

```jsx
function Welcome({ username = "Invitado" }) {
  return <h1>Bienvenido, {username}</h1>;
}
```

---

## State: Gestionando el estado interno

El **state** (estado) es una característica que permite que un componente mantenga y actualice su propio estado interno. Los componentes funcionales manejan el estado con hooks como `useState`.

### Ejemplo con `useState`:

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}

export default Counter;
```

---

## Ciclo de vida de los componentes de clase

Los componentes de clase tienen métodos para manejar el ciclo de vida. Estos métodos se ejecutan en diferentes etapas de la existencia del componente:

1. **Montaje:** Cuando el componente se agrega al DOM.

   - `constructor`
   - `componentDidMount`
2. **Actualización:** Cuando cambian las props o el estado.

   - `componentDidUpdate`
3. **Desmontaje:** Cuando el componente se elimina del DOM.

   - `componentWillUnmount`

#### Ejemplo:

```jsx
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState((state) => ({ seconds: state.seconds + 1 }));
  }

  render() {
    return <p>Segundos: {this.state.seconds}</p>;
  }
}

export default Timer;
```

---

## Comunicación entre componentes

### De padre a hijo

La comunicación se realiza pasando props:

```jsx
function Child({ message }) {
  return <p>{message}</p>;
}

function Parent() {
  return <Child message="Hola desde el padre" />;
}
```

### De hijo a padre

Se realiza utilizando callbacks.

```jsx
function Child({ onMessage }) {
  return <button onClick={() => onMessage("Hola, padre")}>Enviar mensaje</button>;
}

function Parent() {
  const handleMessage = (msg) => alert(msg);

  return <Child onMessage={handleMessage} />;
}
```

---

## Conclusiones

Los componentes son el corazón de React. Al combinarlos con props y state, puedes construir interfaces de usuario interactivas, modulares y reutilizables. Dominar los diferentes tipos de componentes y su comunicación es esencial para desarrollar aplicaciones React de calidad.

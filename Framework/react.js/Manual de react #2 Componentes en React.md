## 2. Componentes en React

En React, los componentes son la base del desarrollo de aplicaciones. Los componentes nos permiten dividir la interfaz de usuario en piezas más pequeñas y reutilizables, lo que facilita el mantenimiento y la organización del código. En esta sección, exploraremos en detalle los componentes en React, aprendiendo a crear componentes funcionales y de clase, comprendiendo su ciclo de vida y cómo comunicarse entre ellos utilizando `props` y `state`.

### 2.1. Creación y uso de componentes funcionales

Los componentes funcionales son funciones de JavaScript que retornan elementos React. Son la forma más sencilla de definir componentes en React y se utilizan principalmente para componentes sin estado (stateless), es decir, aquellos que no necesitan manejar su propio estado interno.

#### Creación de un componente funcional

Para crear un componente funcional en React, simplemente necesitamos definir una función de JavaScript que retorne un elemento React utilizando JSX.

```jsx
import React from 'react';

function MyFunctionalComponent() {
  return <h1>Soy un componente funcional</h1>;
}
```

#### Uso de un componente funcional

Una vez que hemos creado nuestro componente funcional, podemos utilizarlo dentro de otros componentes o en el punto de entrada de la aplicación.

```jsx
import React from 'react';
import MyFunctionalComponent from './MyFunctionalComponent';

function App() {
  return (
    <div>
      <h1>Aplicación con Componentes Funcionales</h1>
      <MyFunctionalComponent />
    </div>
  );
}
```

En el ejemplo anterior, hemos importado el componente funcional `MyFunctionalComponent` y lo hemos utilizado dentro del componente `App`.

### 2.2. Componentes de clase y su ciclo de vida

Los componentes de clase son clases de JavaScript que extienden la clase `React.Component`. Los componentes de clase son la forma tradicional de definir componentes en React y se utilizan para componentes con estado (stateful), es decir, aquellos que necesitan manejar su propio estado interno.

#### Creación de un componente de clase

Para crear un componente de clase en React, definimos una clase de JavaScript que extienda `React.Component` y definimos un método `render()` que retorne un elemento React utilizando JSX.

```jsx
import React, { Component } from 'react';

class MyClassComponent extends Component {
  render() {
    return <h1>Soy un componente de clase</h1>;
  }
}
```

#### Uso de un componente de clase

Al igual que con los componentes funcionales, podemos utilizar los componentes de clase dentro de otros componentes o en el punto de entrada de la aplicación.

```jsx
import React, { Component } from 'react';
import MyClassComponent from './MyClassComponent';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Aplicación con Componentes de Clase</h1>
        <MyClassComponent />
      </div>
    );
  }
}
```

En el ejemplo anterior, hemos importado el componente de clase `MyClassComponent` y lo hemos utilizado dentro del componente `App`.

### 2.3. Props y State

#### Props

Los `props` (abreviatura de "propiedades") son una forma de pasar datos de un componente padre a un componente hijo en React. Los `props` son inmutables, lo que significa que no pueden ser modificados por el componente que los recibe. Se utilizan para proporcionar información al componente hijo desde el componente padre.

#### Paso de `props` a un componente

Para pasar `props` a un componente, simplemente los incluimos como atributos en el componente al utilizarlo.

```jsx
// Componente padre
import React from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  return <ChildComponent name="John" age={30} />;
}

// Componente hijo
import React from 'react';

function ChildComponent(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <p>Edad: {props.age}</p>
    </div>
  );
}
```

En el ejemplo anterior, hemos pasado las `props` `name` y `age` al componente hijo `ChildComponent`.

#### State

El `state` (estado) es una característica de los componentes de clase que permite que un componente mantenga y actualice su propio estado interno. A diferencia de los `props`, el `state` es mutable y puede cambiar a lo largo del ciclo de vida del componente.

#### Inicialización y actualización del `state`

Para inicializar el `state`, definimos un objeto dentro del constructor del componente. Luego, utilizamos el método `setState()` para actualizar el `state`.

```jsx
import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  incrementCount() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h1>Contador: {this.state.count}</h1>
        <button onClick={() => this.incrementCount()}>Incrementar</button>
      </div>
    );
  }
}
```

En el ejemplo anterior, hemos creado un componente `Counter` con un `state` inicializado a 0. Al hacer clic en el botón "Incrementar", utilizamos `setState()` para actualizar el valor del `state` y reflejar el cambio en la interfaz de usuario.

### 2.4. Ciclo de vida de los componentes de clase

Los componentes de clase en React tienen un ciclo de vida que consiste en diferentes etapas desde su creación hasta su eliminación. Algunas de las etapas más comunes son:

- `constructor()`: Se llama cuando se crea el componente y se utiliza para inicializar el estado y enlazar métodos.

- `render()`: Se llama cada vez que el estado o los `props` del componente cambian y debe devolver un elemento React.

- `componentDidMount()`: Se llama una vez que el componente ha sido montado en el DOM y es el lugar adecuado para realizar solicitudes a APIs externas o configurar suscripciones.

- `componentDidUpdate(prevProps, prevState)`: Se llama después de que el componente se actualiza y recibe los `props` y el `state` previos como argumentos.

- `componentWillUnmount()`: Se llama justo antes de que el componente sea eliminado del DOM y se utiliza para limpiar recursos o suscripciones.

### 2.5. Comunicación entre componentes

En React, los componentes pueden comunicarse entre sí a través del paso de `props` desde el componente padre al componente hijo. Esta comunicación permite que los datos fluyan de arriba hacia abajo en la jerarquía de componentes.

Además, para facilitar la comunicación entre componentes que no comparten una relación de padre-h
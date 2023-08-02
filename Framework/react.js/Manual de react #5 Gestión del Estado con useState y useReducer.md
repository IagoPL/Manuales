## 5. Gestión del Estado con `useState` y `useReducer`

La gestión del estado es una parte fundamental en el desarrollo de aplicaciones React. En esta sección, aprenderemos sobre dos formas populares de gestionar el estado en componentes funcionales de React: `useState` y `useReducer`. Estas dos hooks proporcionados por React nos permiten agregar estado a nuestros componentes y actualizarlo de manera eficiente.

### 5.1. Introducción a `useState`

`useState` es un hook proporcionado por React que nos permite agregar estado a componentes funcionales. Nos permite declarar una variable de estado y una función para actualizarla.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

En el ejemplo anterior, hemos utilizado el hook `useState` para agregar el estado `count` a nuestro componente `Counter`. La función `setCount` nos permite actualizar el valor de `count` cuando el botón se hace clic.

### 5.2. Introducción a `useReducer`

`useReducer` es otro hook proporcionado por React que se utiliza para manejar estados complejos y actualizaciones basadas en acciones. Funciona similar a `useState`, pero es más adecuado para estados que tienen transiciones más complejas.

```jsx
import React, { useReducer } from 'react';

// Función reducer que especifica cómo se actualiza el estado en función de la acción
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Contador: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Incrementar</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrementar</button>
    </div>
  );
}
```

En el ejemplo anterior, hemos utilizado el hook `useReducer` para manejar el estado del contador. La función `reducer` especifica cómo se actualiza el estado en función de la acción proporcionada a `dispatch`.

### 5.3. `useState` vs `useReducer`

Tanto `useState` como `useReducer` se utilizan para gestionar el estado en componentes funcionales, pero hay diferencias clave entre ellos:

- `useState` es más simple y se utiliza para estados independientes y simples. Es ideal para estados que solo requieren actualizaciones directas.

- `useReducer` es más adecuado para estados más complejos con transiciones más elaboradas. Se utiliza cuando hay múltiples acciones que pueden afectar el estado.

### 5.4. Elevación del Estado

En React, a veces es necesario compartir estado entre componentes que no tienen una relación directa de padre a hijo. En estos casos, podemos utilizar la técnica de "elevación del estado". Consiste en mover el estado común a un componente superior y pasarlo como prop a los componentes que lo necesitan.

```jsx
import React, { useState } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Contador en el componente padre: {count}</p>
      <ChildComponent count={count} increment={increment} />
    </div>
  );
}

function ChildComponent({ count, increment }) {
  return (
    <div>
      <p>Contador en el componente hijo: {count}</p>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

En el ejemplo anterior, hemos elevado el estado `count` y la función `increment` al componente `ParentComponent`, y luego lo hemos pasado como prop al componente `ChildComponent`.

### 5.5. Conclusiones

La gestión del estado es esencial en React para crear componentes interactivos y dinámicos. Con `useState` y `useReducer`, podemos agregar y actualizar el estado de nuestros componentes funcionales de manera sencilla y eficiente.

`useState` es ideal para estados simples e independientes, mientras que `useReducer` es más adecuado para estados complejos con transiciones elaboradas. Además, podemos utilizar la técnica de "elevación del estado" para compartir el estado entre componentes no relacionados directamente.

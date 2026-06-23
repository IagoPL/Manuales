# Gestión del Estado en React con `useState` y `useReducer`

La gestión del estado es fundamental en React para crear aplicaciones interactivas y dinámicas. React proporciona herramientas como `useState` y `useReducer` que permiten a los desarrolladores controlar y actualizar el estado de sus componentes funcionales de manera eficiente.

---

## ¿Qué es el estado en React?

El estado en React es un objeto que representa los datos o valores que determinan cómo debería comportarse y mostrarse un componente en un momento dado. Cuando el estado cambia, React vuelve a renderizar el componente para reflejar la nueva información.

- **Props vs. State:**
  - Las **props** son datos que vienen de un componente padre y son inmutables.
  - El **estado** es manejado internamente por el componente y puede cambiar a lo largo del tiempo.

---

## `useState`: Estado simple

`useState` es un hook que permite añadir estado a los componentes funcionales. Es ideal para manejar estados simples e independientes.

### Sintaxis

```jsx
const [estado, setEstado] = useState(valorInicial);
```

- `estado`: Representa el valor actual del estado.
- `setEstado`: Es una función que actualiza el valor del estado.
- `valorInicial`: Es el valor con el que se inicializa el estado.

### Ejemplo básico

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}

export default Counter;
```

### Estado complejo

`useState` también puede manejar objetos o arreglos como estado:

```jsx
function Form() {
  const [user, setUser] = useState({ name: '', age: 0 });

  const updateName = (e) => setUser({ ...user, name: e.target.value });

  return (
    <div>
      <input type="text" value={user.name} onChange={updateName} />
      <p>Nombre: {user.name}</p>
    </div>
  );
}
```

---

## `useReducer`: Estado avanzado

`useReducer` es un hook más avanzado que se utiliza para manejar estados complejos o cuando las actualizaciones dependen de múltiples acciones. Funciona de manera similar a un patrón Redux reducido.

### Sintaxis

```jsx
const [estado, dispatch] = useReducer(reducer, estadoInicial);
```

- `reducer`: Es una función que define cómo se transforma el estado en función de una acción.
- `estadoInicial`: Es el valor inicial del estado.
- `dispatch`: Es una función que se utiliza para enviar acciones al reducer.

### Ejemplo básico

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Contador: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Incrementar</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrementar</button>
    </div>
  );
}

export default Counter;
```

### Cuándo usar `useReducer` vs `useState`

- Usa `useState` cuando el estado es simple y directo.
- Usa `useReducer` cuando el estado es complejo o cuando las actualizaciones dependen de acciones múltiples y definidas.

---

## Elevación del estado

Cuando múltiples componentes necesitan compartir el mismo estado, este puede ser "elevado" al componente padre común más cercano.

### Ejemplo:

```jsx
import React, { useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Child count={count} increment={() => setCount(count + 1)} />
    </div>
  );
}

function Child({ count, increment }) {
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

---

## Conclusiones

La gestión del estado en React con `useState` y `useReducer` es clave para crear aplicaciones dinámicas e interactivas. Mientras que `useState` es ideal para estados simples, `useReducer` ofrece una solución robusta para estados más complejos. Además, la elevación del estado asegura que los componentes puedan compartir información de manera eficiente.

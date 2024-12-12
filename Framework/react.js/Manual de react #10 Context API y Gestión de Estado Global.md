# Context API y Gestión de Estado Global en React

La **Context API** de React es una herramienta poderosa para gestionar estados globales. Permite compartir datos entre múltiples componentes sin necesidad de pasar props manualmente en cada nivel del árbol de componentes.

---

## ¿Qué es la Context API?

La Context API es una característica integrada en React que permite:

- **Evitar el "prop drilling":** No es necesario pasar props por múltiples niveles intermedios.
- **Simplificar la estructura del código:** Los datos se comparten directamente desde un proveedor (provider) a los consumidores (consumers).

Se utiliza para estados globales como temas de color, autenticación de usuarios o configuraciones compartidas.

---

## Estructura básica de Context API

La Context API sigue tres pasos principales:

1. **Crear un contexto:**

   ```jsx
   import { createContext } from 'react';

   const UserContext = createContext();
   export default UserContext;
   ```
2. **Proveer el contexto:**

   ```jsx
   import React from 'react';
   import UserContext from './UserContext';

   function App() {
     const user = { name: 'Juan', role: 'Admin' };

     return (
       <UserContext.Provider value={user}>
         <ChildComponent />
       </UserContext.Provider>
     );
   }
   ```
3. **Consumir el contexto:**

   ```jsx
   import React, { useContext } from 'react';
   import UserContext from './UserContext';

   function ChildComponent() {
     const user = useContext(UserContext);

     return <p>Bienvenido, {user.name} ({user.role})</p>;
   }
   ```

---

## `useContext` vs. Consumer

En versiones modernas de React, el hook `useContext` simplifica el acceso al contexto, eliminando la necesidad de un componente `<Consumer>`.

### Ejemplo con `Consumer` (forma antigua):

```jsx
import React from 'react';
import UserContext from './UserContext';

function ChildComponent() {
  return (
    <UserContext.Consumer>
      {(user) => <p>Bienvenido, {user.name}</p>}
    </UserContext.Consumer>
  );
}
```

### Ejemplo con `useContext` (forma moderna):

```jsx
import React, { useContext } from 'react';
import UserContext from './UserContext';

function ChildComponent() {
  const user = useContext(UserContext);
  return <p>Bienvenido, {user.name}</p>;
}
```

---

## Context API con `useReducer`

La Context API se puede combinar con `useReducer` para manejar estados complejos de manera centralizada.

### Ejemplo completo:

```jsx
import React, { createContext, useReducer, useContext } from 'react';

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

const CounterContext = createContext();

function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

function Counter() {
  const { state, dispatch } = useContext(CounterContext);

  return (
    <div>
      <p>Contador: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Incrementar</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrementar</button>
    </div>
  );
}

function App() {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
}

export default App;
```

---

## Cuándo usar Context API

Usa Context API cuando:

1. **Los datos se comparten entre muchos componentes.**
2. **El paso de props se vuelve complejo o repetitivo.**
3. **La aplicación necesita un estado global ligero.**

Evita usar Context API para cada dato local, ya que puede aumentar la complejidad y afectar el rendimiento.

---

## Alternativas a Context API

Para estados globales más complejos, considera usar bibliotecas como:

- **Redux:** Más estructurado y con herramientas avanzadas.
- **Zustand o Recoil:** Más ligeros y flexibles que Redux.

---

## Conclusiones

La Context API es una solución sencilla y eficaz para manejar estados globales en React. Combinada con hooks como `useReducer`, permite manejar lógica de estado más compleja sin necesidad de librerías externas. Dominar esta herramienta es esencial para construir aplicaciones escalables y mantenibles.

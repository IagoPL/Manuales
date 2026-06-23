# Hooks Avanzados en React

Los hooks son una de las características más poderosas de React. Además de los hooks básicos como `useState` y `useEffect`, React proporciona una variedad de hooks avanzados que permiten manejar aspectos más complejos del estado y la lógica de los componentes.

---

## `useEffect`: Controlando Efectos Secundarios

El hook `useEffect` se utiliza para manejar efectos secundarios como:

- Llamadas a APIs.
- Subscripciones a eventos.
- Actualizaciones del DOM.

### Ejemplo básico

```jsx
import React, { useEffect, useState } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  return <p>Tiempo: {count}s</p>;
}
```

- El array vacío `[]` asegura que el efecto solo se ejecute una vez al montar el componente.
- El retorno dentro de `useEffect` permite limpiar efectos secundarios al desmontar el componente.

---

## `useContext`: Compartiendo Estado Global

El hook `useContext` se utiliza para acceder al contexto en React sin necesidad de pasar props manualmente por cada nivel del árbol de componentes.

### Ejemplo básico

```jsx
import React, { useContext, createContext } from 'react';

const UserContext = createContext();

function DisplayUser() {
  const user = useContext(UserContext);
  return <p>Usuario: {user}</p>;
}

function App() {
  return (
    <UserContext.Provider value="Juan">
      <DisplayUser />
    </UserContext.Provider>
  );
}
```

- `createContext` define el contexto.
- `UserContext.Provider` permite pasar un valor a los componentes hijos.
- `useContext` accede al valor sin pasar props explícitas.

---

## `useMemo`: Optimización de Cálculos Costosos

El hook `useMemo` memoriza valores calculados para evitar cálculos repetitivos innecesarios en cada renderizado.

### Ejemplo básico

```jsx
import React, { useMemo, useState } from 'react';

function ExpensiveCalculation({ num }) {
  console.log('Calculando...');
  return num * 2;
}

function App() {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(5);

  const doubled = useMemo(() => ExpensiveCalculation({ num: number }), [number]);

  return (
    <div>
      <p>Resultado: {doubled}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}
```

- Solo recalcula el valor si la dependencia `number` cambia.
- Útil para optimizar cálculos costosos o listas filtradas.

---

## `useCallback`: Memorización de Funciones

`useCallback` se utiliza para memorizar funciones, evitando que se creen nuevas instancias en cada renderizado.

### Ejemplo básico

```jsx
import React, { useCallback, useState } from 'react';

function Button({ onClick }) {
  return <button onClick={onClick}>Haz clic</button>;
}

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicado');
  }, []);

  return (
    <div>
      <p>Contador: {count}</p>
      <Button onClick={handleClick} />
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}
```

- Previene la recreación de la función `handleClick` a menos que cambien sus dependencias.

---

## `useReducer`: Estados Complejos

`useReducer` es útil para manejar estados complejos y múltiples transiciones basadas en acciones.

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
```

---

## Consejos para trabajar con Hooks Avanzados

1. **Usa hooks cuando realmente los necesites:** Evita la sobreoptimización prematura.
2. **Mantén las dependencias actualizadas:** Siempre define correctamente las dependencias en `useEffect`, `useMemo` y `useCallback`.
3. **Divide la lógica en hooks personalizados:** Si un hook se vuelve muy complejo, considera dividirlo.

---

## Conclusiones

Los hooks avanzados como `useEffect`, `useContext`, `useMemo`, `useCallback` y `useReducer` proporcionan herramientas poderosas para manejar lógica compleja y optimizar el rendimiento en aplicaciones React. Dominar estos hooks mejorará significativamente tus habilidades como desarrollador.

# Componentes y Composición en React

La composición es una de las técnicas fundamentales en React que permite construir interfaces de usuario complejas a partir de componentes más pequeños y reutilizables. Gracias a esta característica, React fomenta la modularidad y el mantenimiento eficiente del código.

---

## ¿Qué es la composición de componentes?

La composición en React se refiere al proceso de combinar componentes para formar interfaces más complejas. En lugar de heredar comportamiento y estilo, React utiliza la composición para pasar datos y reutilizar lógica entre componentes.

### Ejemplo básico

```jsx
function Header() {
  return <header>Encabezado</header>;
}

function Footer() {
  return <footer>Pie de página</footer>;
}

function App() {
  return (
    <div>
      <Header />
      <main>Contenido principal</main>
      <Footer />
    </div>
  );
}
```

---

## Comunicación entre componentes

La comunicación entre componentes se realiza principalmente mediante **props**, que permiten pasar datos desde un componente padre hacia uno o más componentes hijos.

### De padre a hijo (vía props)

```jsx
function Greeting({ name }) {
  return <h1>Hola, {name}</h1>;
}

function App() {
  return <Greeting name="Juan" />;
}
```

### De hijo a padre (con callbacks)

En este caso, el componente hijo llama a una función pasada como prop desde el padre.

```jsx
function Button({ onClick }) {
  return <button onClick={() => onClick("Mensaje del hijo")}>Haz clic</button>;
}

function App() {
  const handleClick = (message) => alert(message);

  return <Button onClick={handleClick} />;
}
```

---

## Prop especial `children`

La prop `children` permite a los componentes envolver contenido arbitrario, lo que los hace más flexibles y reutilizables.

### Ejemplo

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function App() {
  return (
    <Card>
      <h1>Título de la tarjeta</h1>
      <p>Contenido de la tarjeta</p>
    </Card>
  );
}
```

---

## Patrón Render Props

El patrón Render Props consiste en pasar una función como prop que devuelve elementos React. Es útil para compartir lógica entre componentes.

### Ejemplo

```jsx
function DataFetcher({ render }) {
  const data = ["Elemento 1", "Elemento 2", "Elemento 3"];

  return <div>{render(data)}</div>;
}

function App() {
  return (
    <DataFetcher
      render={(data) => (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    />
  );
}
```

---

## Componentes de Orden Superior (HOC)

Un Componente de Orden Superior (HOC, por sus siglas en inglés) es una función que toma un componente como argumento y devuelve un nuevo componente. Los HOC permiten reutilizar lógica entre múltiples componentes.

### Ejemplo

```jsx
function withLogger(Component) {
  return function WrappedComponent(props) {
    console.log("Props: ", props);
    return <Component {...props} />;
  };
}

function Hello({ name }) {
  return <h1>Hola, {name}</h1>;
}

const HelloWithLogger = withLogger(Hello);

function App() {
  return <HelloWithLogger name="Juan" />;
}
```

---

## Composición vs. Herencia

React fomenta la composición en lugar de la herencia para compartir código y lógica. La composición es más flexible y se alinea mejor con el diseño basado en componentes de React.

### Ejemplo práctico

En lugar de usar herencia para personalizar un botón:

```jsx
function Button({ children, color }) {
  return <button style={{ backgroundColor: color }}>{children}</button>;
}

function App() {
  return <Button color="blue">Haz clic</Button>;
}
```

---

## Conclusiones

La composición es una de las características clave que hace que React sea tan poderoso. Al dividir la interfaz en componentes pequeños y combinarlos de manera eficiente, puedes crear aplicaciones modulares, mantenibles y escalables. Dominar la composición te permitirá aprovechar al máximo el potencial de React.

# Manejo de Eventos en React

El manejo de eventos en React es similar al manejo de eventos en JavaScript nativo, pero con diferencias importantes en la sintaxis y el enfoque. React utiliza un sistema de delegación de eventos que mejora el rendimiento y la compatibilidad entre navegadores.

---

## ¿Qué son los eventos en React?

Los eventos son acciones o interacciones del usuario con la interfaz de una aplicación, como hacer clic en un botón, mover el ratón o escribir en un campo de texto. React gestiona estos eventos mediante su propio sistema, que encapsula los eventos nativos del navegador.

---

## Sintaxis básica

En React, los eventos se manejan pasando funciones como valores de atributos en JSX. Los nombres de los eventos utilizan camelCase en lugar de kebab-case, y los manejadores de eventos son funciones en lugar de cadenas de texto.

### Ejemplo básico

```jsx
function App() {
  const handleClick = () => {
    alert('¡Botón clicado!');
  };

  return <button onClick={handleClick}>Haz clic</button>;
}
```

---

## Eventos comunes

React admite una amplia variedad de eventos que puedes manejar en tus componentes. Aquí tienes algunos de los más comunes:

### Eventos de mouse

- `onClick`: Se activa al hacer clic en un elemento.
- `onMouseEnter`: Se activa al mover el puntero sobre un elemento.
- `onMouseLeave`: Se activa al mover el puntero fuera de un elemento.

### Eventos de teclado

- `onKeyDown`: Se activa al presionar una tecla.
- `onKeyUp`: Se activa al soltar una tecla.
- `onKeyPress`: (Obsoleto) Similar a `onKeyDown`, pero menos preciso.

### Eventos de formulario

- `onChange`: Se activa al cambiar el valor de un campo.
- `onSubmit`: Se activa al enviar un formulario.

### Ejemplo

```jsx
function Form() {
  const handleChange = (event) => {
    console.log('Valor:', event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Formulario enviado');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## Propagación de eventos

En React, los eventos se propagan desde el elemento donde ocurrieron hacia sus ancestros (bubbling). Puedes controlar este comportamiento utilizando el método `stopPropagation`.

### Ejemplo

```jsx
function Parent() {
  const handleParentClick = () => {
    console.log('Clic en el padre');
  };

  const handleChildClick = (event) => {
    event.stopPropagation();
    console.log('Clic en el hijo');
  };

  return (
    <div onClick={handleParentClick} style={{ padding: '20px', background: '#f0f0f0' }}>
      <button onClick={handleChildClick}>Hijo</button>
    </div>
  );
}
```

En este ejemplo, el clic en el botón no activará el evento del contenedor debido al uso de `stopPropagation`.

---

## Binding de métodos

En componentes de clase, los métodos no están vinculados automáticamente al contexto del componente. Esto puede causar problemas al usar `this` en manejadores de eventos.

### Solución con binding manual

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('Clicado:', this);
  }

  render() {
    return <button onClick={this.handleClick}>Haz clic</button>;
  }
}
```

### Solución con funciones flecha

```jsx
class App extends React.Component {
  handleClick = () => {
    console.log('Clicado:', this);
  };

  render() {
    return <button onClick={this.handleClick}>Haz clic</button>;
  }
}
```

---

## Eventos personalizados

Puedes definir eventos personalizados pasando funciones desde un componente padre a un componente hijo como props.

### Ejemplo

```jsx
function Child({ onAction }) {
  return <button onClick={() => onAction('Evento personalizado')}>Haz clic</button>;
}

function Parent() {
  const handleAction = (message) => {
    alert(message);
  };

  return <Child onAction={handleAction} />;
}
```

---

## Conclusiones

El manejo de eventos en React es un proceso sencillo y poderoso que permite capturar y responder a interacciones del usuario. Dominar los eventos y su propagación es clave para crear interfaces interactivas y dinámicas.

# React Router: Navegación en Aplicaciones React

React Router es una biblioteca que permite implementar enrutamiento en aplicaciones React. Con React Router, puedes definir rutas que conectan diferentes componentes con URLs específicas, creando aplicaciones dinámicas de una sola página (SPA).

---

## ¿Por qué usar React Router?

En aplicaciones SPA, la navegación entre páginas ocurre sin recargar la página completa. React Router permite:

- **Rutas dinámicas:** Conectar componentes a diferentes URLs.
- **Enrutamiento condicional:** Mostrar contenido basado en la ubicación actual.
- **Parámetros en rutas:** Pasar datos dinámicos a través de la URL.
- **Historial de navegación:** Manejar navegación programática.

---

## Instalación

Para usar React Router, instálalo en tu proyecto:

```bash
npm install react-router-dom
```

---

## Configuración básica

React Router utiliza varios componentes clave para manejar el enrutamiento:

1. ``**:** Proporciona el contexto para las rutas.
2. ``**:** Envuelve todas las definiciones de rutas.
3. ``**:** Define una ruta específica y el componente que debe renderizar.
4. ``**:** Permite navegar entre rutas sin recargar la página.

### Ejemplo básico

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Inicio</h1>;
}

function About() {
  return <h1>Acerca de</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/about">Acerca de</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Resultado:

- `` muestra el componente `Home`.
- `` muestra el componente `About`.

---

## Parámetros en rutas

Puedes definir rutas dinámicas usando parámetros que comienzan con `:`.

### Ejemplo:

```jsx
function User({ params }) {
  return <h1>Usuario: {params.id}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Para acceder al parámetro `id`, usa el hook `useParams`:

```jsx
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();
  return <h1>Usuario: {id}</h1>;
}
```

Acceder a `http://localhost:3000/user/123` mostrará `Usuario: 123`.

---

## Navegación programática

React Router permite navegar programáticamente usando el hook `useNavigate`.

### Ejemplo:

```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Lógica de autenticación
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Iniciar sesión</button>;
}
```

---

## Rutas anidadas

Puedes definir rutas dentro de otras rutas para organizar mejor tu aplicación.

### Ejemplo:

```jsx
function Dashboard() {
  return (
    <div>
      <h1>Panel de control</h1>
      <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- `` muestra el componente `Profile`.
- `` muestra el componente `Settings`.

---

## Página 404 personalizada

Puedes manejar rutas no definidas utilizando un `Route` sin `path`:

```jsx
function NotFound() {
  return <h1>Página no encontrada</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Conclusiones

React Router es una herramienta poderosa para manejar la navegación en aplicaciones React. Su flexibilidad y características avanzadas como rutas dinámicas, anidadas y navegación programática lo convierten en una elección ideal para construir aplicaciones SPA complejas y escalables.

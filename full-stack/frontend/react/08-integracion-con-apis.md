# Integración con APIs en React

La integración con APIs es una parte esencial del desarrollo de aplicaciones modernas. React facilita este proceso, permitiéndote interactuar con APIs externas para obtener, enviar, o manipular datos en tiempo real.

---

## ¿Qué es una API?

Una **API** (Application Programming Interface) es un intermediario que permite la comunicación entre diferentes aplicaciones o servicios. En el contexto de React, las APIs se utilizan para:

- Obtener datos dinámicos de un servidor.
- Enviar información al backend.
- Integrar servicios externos como mapas, pagos o redes sociales.

---

## Métodos comunes para trabajar con APIs

En React, los métodos más comunes para interactuar con APIs son:

1. **`fetch`**: Una API nativa de JavaScript para realizar solicitudes HTTP.
2. **`axios`**: Una librería popular que simplifica las solicitudes HTTP.

---

## Uso de `fetch`

### Ejemplo básico: Obtener datos

```jsx
import React, { useEffect, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default Users;
```

### Manejo de errores

Es importante manejar los errores en caso de que la solicitud falle:

```jsx
fetch('https://jsonplaceholder.typicode.com/users')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return response.json();
  })
  .catch((error) => console.error('Error:', error));
```

---

## Uso de `axios`

### Instalación

Para usar `axios`, primero instálalo en tu proyecto:

```bash
npm install axios
```

### Ejemplo básico

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => setPosts(response.data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}

export default Posts;
```

---

## Enviar datos a la API

Puedes enviar datos utilizando métodos HTTP como `POST`, `PUT` o `DELETE`.

### Ejemplo con `fetch`

```jsx
function createUser(user) {
  fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => console.log('Usuario creado:', data))
    .catch((error) => console.error('Error:', error));
}
```

### Ejemplo con `axios`

```jsx
function createUser(user) {
  axios.post('https://jsonplaceholder.typicode.com/users', user)
    .then((response) => console.log('Usuario creado:', response.data))
    .catch((error) => console.error('Error:', error));
}
```

---

## Estado de carga

Es buena práctica informar al usuario sobre el estado de la solicitud (cargando, éxito o error).

### Ejemplo

```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Consejos para trabajar con APIs

1. **Manejar errores adecuadamente:** Siempre captura y maneja los errores para evitar fallos inesperados.
2. **Mostrar indicadores de carga:** Mejora la experiencia del usuario mostrando un estado de carga mientras esperas la respuesta.
3. **Evitar solicitudes innecesarias:** Usa hooks como `useEffect` para realizar solicitudes solo cuando sea necesario.
4. **Proteger datos sensibles:** No almacenes claves API en el código cliente; usa variables de entorno.

---

## Conclusiones

React facilita la integración con APIs utilizando herramientas nativas como `fetch` o librerías como `axios`. Estas capacidades son esenciales para construir aplicaciones dinámicas y ricas en funcionalidades. Dominar estas técnicas te permitirá interactuar con datos externos de manera eficiente y robusta.

# Asincronia fetch y promesas

JavaScript usa un modelo asincrono para operaciones como red, temporizadores y lectura de recursos.

## Promesas

```javascript
const promise = fetch("https://api.example.com/users");

promise
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

## async await

```javascript
async function loadUsers() {
  try {
    const response = await fetch("https://api.example.com/users");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("No se pudieron cargar usuarios", error);
    return [];
  }
}
```

## Ejecutar en paralelo

```javascript
const [users, products] = await Promise.all([
  fetch("/api/users").then((res) => res.json()),
  fetch("/api/products").then((res) => res.json()),
]);
```

## Timeouts con AbortController

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch("/api/data", { signal: controller.signal });
  console.log(await response.json());
} finally {
  clearTimeout(timeoutId);
}
```

## Buenas practicas

- Comprueba `response.ok`.
- Maneja errores de red y errores HTTP.
- Usa `Promise.all` para tareas independientes.
- Usa abort o timeout en peticiones importantes.
- No bloquees la UI esperando operaciones lentas.

## Errores comunes

- Olvidar `await`.
- Pensar que `fetch` lanza error en HTTP 404.
- Hacer peticiones secuenciales cuando pueden ir en paralelo.
- No controlar estados de carga y error en UI.

## Ejercicio

Crea una funcion que cargue usuarios desde una API, maneje error HTTP, timeout y devuelva una lista vacia si falla.

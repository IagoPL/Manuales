# Formularios en React

Los formularios permiten capturar datos del usuario, validarlos y enviarlos a una API o a la lógica interna de la aplicación.

## Conceptos clave

- **Input controlado:** campo cuyo valor vive en el estado de React.
- **Input no controlado:** campo gestionado por el DOM y leído mediante referencias.
- **Validación:** comprobación de reglas antes de enviar.
- **Submit:** evento de envío del formulario.
- **Estado de error:** mensajes asociados a campos inválidos.

## Formulario controlado

```jsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

## Validación básica

```jsx
function validarEmail(email) {
  return email.includes('@');
}
```

```jsx
if (!validarEmail(email)) {
  setError('Introduce un email válido');
  return;
}
```

## Manejo de varios campos

```jsx
const [form, setForm] = useState({
  nombre: '',
  email: '',
  mensaje: ''
});

function handleChange(event) {
  const { name, value } = event.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}
```

## Buenas prácticas

- Usa inputs controlados cuando necesites validar o transformar datos.
- Muestra errores cerca del campo correspondiente.
- Deshabilita el botón de envío si hay una petición en curso.
- Evita perder datos del formulario ante errores de API.
- Separa validación compleja en funciones reutilizables.

## Errores comunes

- No llamar a `event.preventDefault()`.
- Guardar todo el formulario en muchos estados inconexos sin necesidad.
- Mostrar errores solo al final sin indicar el campo afectado.
- No gestionar estados de carga.

## Chuleta rápida

```txt
value + onChange = input controlado
onSubmit = envío
preventDefault = evita recarga
error state = mensajes de validación
```

## Recursos relacionados

- [Gestión del estado](04-estado-usestate-usereducer.md)
- [Manejo de eventos](06-manejo-de-eventos.md)
- [Integración con APIs](08-integracion-con-apis.md)

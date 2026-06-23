# Pruebas en React

Las pruebas ayudan a comprobar que componentes, hooks y flujos principales funcionan correctamente antes de publicar cambios.

## Conceptos clave

- **Prueba unitaria:** valida una función o componente aislado.
- **Prueba de integración:** valida varios elementos trabajando juntos.
- **Render:** montaje del componente en entorno de prueba.
- **Mock:** sustituto controlado de una dependencia.
- **Assertion:** comprobación esperada.

## Qué probar

Prioriza pruebas sobre:

- Componentes con lógica condicional.
- Formularios.
- Hooks personalizados.
- Integración con APIs.
- Navegación y estados de error.

## Ejemplo de componente

```jsx
function Saludo({ nombre }) {
  return <h1>Hola, {nombre}</h1>;
}
```

## Ejemplo de prueba

```jsx
import { render, screen } from '@testing-library/react';
import { Saludo } from './Saludo';

test('muestra el nombre recibido', () => {
  render(<Saludo nombre="Ana" />);
  expect(screen.getByText('Hola, Ana')).toBeInTheDocument();
});
```

## Pruebas de interacción

```jsx
import userEvent from '@testing-library/user-event';

test('envía el formulario', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
  await user.click(screen.getByRole('button', { name: /entrar/i }));

  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
});
```

## Buenas prácticas

- Prueba comportamiento, no detalles internos.
- Usa queries parecidas a cómo interactúa el usuario.
- Evita snapshots enormes.
- Crea mocks solo cuando aporten claridad.
- Incluye casos de error y carga.

## Errores comunes

- Probar implementación en lugar de resultado visible.
- Depender de clases CSS para localizar elementos.
- No esperar operaciones asíncronas.
- Crear pruebas frágiles que fallan ante cambios visuales menores.

## Chuleta rápida

```txt
render = montar componente
screen = buscar elementos
userEvent = simular usuario
expect = comprobar resultado
mock = sustituir dependencia
```

## Recursos relacionados

- [Componentes](03-componentes.md)
- [Formularios](13-formularios.md)
- [Integración con APIs](08-integracion-con-apis.md)

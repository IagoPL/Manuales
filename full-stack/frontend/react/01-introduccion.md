# Introducción a React

React es una biblioteca de JavaScript para construir interfaces de usuario con componentes. No es un framework completo: no impone enrutado, fetching de datos ni cómo se despliega la aplicación. Eso es una ventaja para aprender el modelo mental (componentes, estado, JSX) y una decisión a tomar cuando montas un proyecto real.

Documentación oficial: [react.dev](https://react.dev/learn).

## Por qué se usa

- **Declarativo:** describes cómo debe verse la UI para un estado dado; React se encarga de actualizar el DOM.
- **Componentes:** la interfaz se parte en piezas reutilizables con datos de entrada (props) y, si hace falta, estado propio.
- **Unidireccional:** los datos bajan de padres a hijos; los eventos suben. Eso simplifica seguir el flujo.
- **Ecosistema:** hay soluciones maduras para rutas, datos, formularios y tests, pero son elecciones del proyecto, no de React.

Los componentes de clase siguen existiendo. En proyectos nuevos se usan **componentes funcionales y hooks**. El detalle de JSX y de `useState` está en los capítulos siguientes.

## Cómo crear un proyecto hoy

Create React App (`npx create-react-app`) está **deprecated**. No es la forma recomendada de empezar una aplicación nueva. React distingue tres caminos:

1. **Framework** (recomendado para una app de producto): routing, bundling y, si lo necesitas, renderizado en servidor. El más habitual es Next.js; en este repo está el [manual de Next.js](../nextjs/01-introduccion-y-entorno.md). También existen React Router (framework) y Expo para nativo.
2. **SPA desde cero con un build tool:** útil para aprender React o para un front que solo habla con una API. Vite es la opción más común.
3. **Añadir React a una página HTML existente:** para un widget o una migración gradual. Ver [Add React to an existing project](https://react.dev/learn/add-react-to-an-existing-project).

Este capítulo usa el camino 2 porque el resto del manual trabaja React como biblioteca, no como framework.

### Requisitos

Instala una versión actual de [Node.js](https://nodejs.org/) (LTS) y comprueba:

```bash
node -v
npm -v
```

### SPA con Vite

```bash
npm create vite@latest mi-app-react -- --template react
cd mi-app-react
npm install
npm run dev
```

El template `react-ts` añade TypeScript. Vite levanta un servidor de desarrollo con recarga rápida. La estructura típica:

```txt
mi-app-react/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    └── App.css
```

- `index.html` monta el nodo `#root`.
- `src/main.jsx` es el punto de entrada.
- `src/App.jsx` es el componente raíz de la interfaz.

### Framework (cuando toca)

Si la aplicación necesita rutas, SSR o un despliegue full-stack, empieza por el framework, no por Vite + React a mano:

```bash
npx create-next-app@latest mi-app
```

Eso no sustituye aprender componentes y JSX; solo evita reconstruir un framework propio. El detalle vive en el manual de Next.js.

## Primer componente

`src/App.jsx`:

```jsx
export default function App() {
  return (
    <div>
      <h1>Hola, React</h1>
      <p>La UI se describe con componentes.</p>
    </div>
  )
}
```

`src/main.jsx` (API actual: `createRoot`, no `ReactDOM.render`):

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

`StrictMode` activa comprobaciones extra en desarrollo. No cambia el resultado en producción.

Desde React 17 no hace falta `import React from 'react'` solo para usar JSX, salvo que el bundler esté configurado al modo clásico.

## Ideas que conviene fijar

- Un **componente** es una función que recibe props y devuelve UI (JSX).
- **JSX** parece HTML, pero es JavaScript. El siguiente capítulo lo detalla.
- El **estado** vive en el componente (o más arriba) y provoca un nuevo render cuando cambia. Ver [Estado: useState y useReducer](04-estado-usestate-usereducer.md).
- React compara el árbol nuevo con el anterior y actualiza el DOM real lo mínimo necesario (reconcilación / “Virtual DOM”).

## Errores habituales

- Arrancar proyectos nuevos con Create React App. Está fuera de mantenimiento; usa un framework o Vite.
- Copiar tutoriales con `ReactDOM.render(...)` y `react-dom` clásico. El punto de entrada es `createRoot` de `react-dom/client`.
- Tratar React como si ya trajera router, store global y backend. Eso se elige aparte (o se hereda del framework).
- Empezar por componentes de clase. Hoy el camino por defecto son funciones y hooks.

## Buenas prácticas

- Un componente, una responsabilidad visible (un botón, un formulario, una página).
- Nombra los archivos de componentes en PascalCase (`App.jsx`, `UserCard.jsx`).
- Fija versiones en `package.json`; no documentes comandos deprecados como receta principal.
- Cuando el proyecto deje de ser un playground, evalúa si un framework te ahorra trabajo de routing y despliegue.

## Ejercicio

1. Crea el proyecto con Vite y cambia el texto de `App` para que muestre tu nombre.
2. Extrae un componente `Saludo` que reciba `nombre` por props y úsalo desde `App`.
3. Abre `main.jsx` y comprueba que el montaje usa `createRoot`.

## Siguiente paso

Continúa con [JSX](02-jsx.md) para las reglas de la sintaxis que ya estás usando en estos ejemplos.

Fuentes: [Installation](https://react.dev/learn/installation), [Creating a React App](https://react.dev/learn/creating-a-react-app), [Build a React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch), [createRoot](https://react.dev/reference/react-dom/client/createRoot).

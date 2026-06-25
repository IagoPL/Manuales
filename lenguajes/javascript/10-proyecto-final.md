# Proyecto final

Construye una pequena aplicacion de tareas sin framework. El objetivo es practicar DOM, eventos, modulos, estado, localStorage y testing.

## Requisitos

- Crear tareas.
- Marcar tareas como completadas.
- Eliminar tareas.
- Filtrar todas, pendientes y completadas.
- Persistir en `localStorage`.
- Separar codigo en modulos.
- Probar la logica de estado.

## Estructura sugerida

```txt
todo-app/
  index.html
  src/
    main.js
    state.js
    storage.js
    render.js
  tests/
    state.test.js
  package.json
```

## Modelo de tarea

```javascript
{
  id: "task-1",
  title: "Estudiar JavaScript",
  completed: false,
  createdAt: "2026-06-25T10:00:00.000Z"
}
```

## Funciones de estado

```javascript
export function addTask(tasks, title) {
  return [
    ...tasks,
    {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}
```

## Checklist

- No hay logica de negocio mezclada con HTML inline.
- No se usa `innerHTML` con texto del usuario.
- Los botones tienen texto o `aria-label`.
- La app funciona tras recargar.
- Hay tests para crear, completar y eliminar tareas.

## Ampliaciones

- Edicion de tareas.
- Busqueda por texto.
- Contador de pendientes.
- Exportar e importar JSON.

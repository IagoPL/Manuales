# DOM y eventos

El DOM representa el documento HTML como objetos manipulables desde JavaScript.

## Seleccionar elementos

```javascript
const title = document.querySelector("h1");
const button = document.querySelector("#save-button");
const items = document.querySelectorAll(".item");
```

## Cambiar contenido

```javascript
title.textContent = "Nuevo titulo";
```

Evita `innerHTML` con contenido no confiable porque puede abrir puertas a XSS.

## Clases y atributos

```javascript
button.classList.add("is-active");
button.setAttribute("aria-expanded", "true");
```

## Crear elementos

```javascript
const li = document.createElement("li");
li.textContent = "Nuevo elemento";
document.querySelector("ul").append(li);
```

## Eventos

```javascript
button.addEventListener("click", () => {
  console.log("click");
});
```

Eventos de formulario:

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});
```

## Delegacion de eventos

```javascript
document.querySelector("ul").addEventListener("click", (event) => {
  if (event.target.matches("button[data-action='delete']")) {
    event.target.closest("li").remove();
  }
});
```

## Buenas practicas

- Usa `defer` al cargar scripts.
- Separa seleccion, estado y renderizado.
- Cuida accesibilidad al cambiar atributos.
- Valida formularios tambien en servidor.

## Errores comunes

- Ejecutar JS antes de que exista el DOM.
- Usar `innerHTML` con datos de usuario.
- Asociar cientos de listeners cuando basta delegacion.

## Ejercicio

Crea una lista de tareas con input, boton de añadir y boton de eliminar por tarea.

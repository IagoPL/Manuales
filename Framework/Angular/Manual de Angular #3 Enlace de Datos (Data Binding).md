# Enlace de Datos (Data Binding)

## Índice

1. Introducción al enlace de datos
2. Tipos de enlace de datos en Angular
   - Interpolación (Interpolation)
   - Enlace de propiedad (Property Binding)
   - Enlace de evento (Event Binding)
   - Enlace bidireccional (Two-Way Binding)
3. Ejemplos de enlace de datos en Angular
   - Ejemplo 1: Interpolación
   - Ejemplo 2: Enlace de propiedad
   - Ejemplo 3: Enlace de evento
   - Ejemplo 4: Enlace bidireccional
4. Conclusiones

## 1. Introducción al enlace de datos

El enlace de datos es una característica fundamental de Angular que permite establecer conexiones entre la vista y el componente, asegurando que los cambios realizados en uno de ellos se reflejen automáticamente en el otro. Esto facilita la sincronización de datos y la actualización dinámica de la interfaz de usuario.

El enlace de datos en Angular se basa en el uso de la sintaxis especial y las directivas proporcionadas por el framework. Permite interactuar con elementos del DOM, propiedades del componente y eventos del usuario de manera fácil y efectiva.

## 2. Tipos de enlace de datos en Angular

### Interpolación (Interpolation)

La interpolación es la forma más sencilla de enlace de datos en Angular. Permite mostrar valores de propiedades del componente directamente en la vista mediante la sintaxis de doble llave `{{ }}`. 

Ejemplo:

```html
<!-- Componente -->
@Component({
  template: `
    <h1>{{ titulo }}</h1>
  `
})
export class MiComponente {
  titulo = "¡Hola, Angular!";
}
```

En este ejemplo, la propiedad `titulo` del componente se muestra en la vista mediante interpolación.

### Enlace de propiedad (Property Binding)

El enlace de propiedad permite establecer valores de propiedades de elementos HTML utilizando la sintaxis de corchetes `[ ]`. Esto es útil para cambiar dinámicamente atributos, estilos, clases CSS, entre otros. 

Ejemplo:

```html
<!-- Componente -->
@Component({
  template: `
    <button [disabled]="esDesactivado">Haz clic</button>
  `
})
export class MiComponente {
  esDesactivado = true;
}
```

En este caso, la propiedad `disabled` del botón se enlaza a la propiedad `esDesactivado` del componente. Si `esDesactivado` es `true`, el botón estará desactivado.

### Enlace de evento (Event Binding)

El enlace de evento permite responder a eventos del usuario, como clics, pulsaciones de teclas, entre otros. Se utiliza la sintaxis de paréntesis `( )` para llamar a métodos del componente cuando ocurre un evento.

Ejemplo:

```html
<!-- Componente -->
@Component({
  template: `
    <button (click)="saludar()">Saludar</button>
  `
})
export class MiComponente {
  saludar() {
    console.log("¡Hola!");
  }
}
```

En este ejemplo, el método `saludar()` se invoca cuando el usuario hace clic en el botón.

### Enlace bidireccional (Two-Way Binding)

El enlace bidireccional permite actualizar tanto el componente como la vista al mismo tiempo. Utiliza la sintaxis `[(ng

Model)]` y se utiliza principalmente en formularios para mantener sincronizados los datos del componente y los campos de entrada del usuario.

Ejemplo:

```html
<!-- Componente -->
@Component({
  template: `
    <input [(ngModel)]="nombre" placeholder="Nombre">
    <p>Hola, {{ nombre }}</p>
  `
})
export class MiComponente {
  nombre = "";
}
```

En este ejemplo, el valor del campo de entrada (`input`) se enlaza a la propiedad `nombre` del componente. Cualquier cambio en el campo de entrada se reflejará automáticamente en el texto de saludo.

## 3. Ejemplos de enlace de datos en Angular

### Ejemplo 1: Interpolación

```html
<!-- Componente -->
@Component({
  template: `
    <h1>{{ titulo }}</h1>
  `
})
export class MiComponente {
  titulo = "¡Hola, Angular!";
}
```

En este ejemplo, el valor de la propiedad `titulo` se muestra en la vista como un encabezado (`h1`).

### Ejemplo 2: Enlace de propiedad

```html
<!-- Componente -->
@Component({
  template: `
    <button [disabled]="esDesactivado">Haz clic</button>
  `
})
export class MiComponente {
  esDesactivado = true;
}
```

En este caso, la propiedad `disabled` del botón se enlaza a la propiedad `esDesactivado` del componente. Si `esDesactivado` es `true`, el botón estará desactivado.

### Ejemplo 3: Enlace de evento

```html
<!-- Componente -->
@Component({
  template: `
    <button (click)="saludar()">Saludar</button>
  `
})
export class MiComponente {
  saludar() {
    console.log("¡Hola!");
  }
}
```

En este ejemplo, cuando el usuario hace clic en el botón, se invoca el método `saludar()`, que muestra un mensaje en la consola.

### Ejemplo 4: Enlace bidireccional

```html
<!-- Componente -->
@Component({
  template: `
    <input [(ngModel)]="nombre" placeholder="Nombre">
    <p>Hola, {{ nombre }}</p>
  `
})
export class MiComponente {
  nombre = "";
}
```

En este ejemplo, el campo de entrada (`input`) se enlaza a la propiedad `nombre` del componente utilizando el enlace bidireccional. Cualquier cambio en el campo de entrada se reflejará automáticamente en el texto de saludo.

## 4. Conclusiones

El enlace de datos es una característica poderosa de Angular que facilita la sincronización de datos entre el componente y la vista. Con los diferentes tipos de enlace de datos disponibles, puedes construir interfaces de usuario dinámicas y responder a las interacciones del usuario de manera eficiente. Domina estos conceptos y aprovecha al máximo el enlace de datos en tus aplicaciones Angular.

# **Enlace de Datos (Data Binding) en Angular**

## **Índice**

1. **Introducción al enlace de datos**
2. **Tipos de enlace de datos en Angular**
   - 2.1 Interpolación (Interpolation)
   - 2.2 Enlace de propiedad (Property Binding)
   - 2.3 Enlace de evento (Event Binding)
   - 2.4 Enlace bidireccional (Two-Way Binding)
3. **Ejemplos prácticos de enlace de datos**
4. **Conclusiones**

---

## **1. Introducción al Enlace de Datos**

El **enlace de datos** (Data Binding) es una de las características más potentes de Angular. Permite establecer una conexión fluida entre el modelo (los datos en el componente) y la vista (el HTML). Esto asegura que los cambios realizados en uno se reflejen automáticamente en el otro, facilitando la sincronización y actualizaciones dinámicas.

### **Ventajas del enlace de datos en Angular**:
- **Sincronización automática**: Cambios en el componente o en la vista se reflejan instantáneamente.
- **Menos código**: Simplifica la manipulación del DOM.
- **Interactividad mejorada**: Ideal para aplicaciones dinámicas y reactivas.

---

## **2. Tipos de Enlace de Datos en Angular**

### **2.1 Interpolación (Interpolation)**

La interpolación muestra valores del componente directamente en la vista mediante la sintaxis `{{ }}`.

**Ejemplo**:
```html
<h1>{{ titulo }}</h1>
```

```typescript
@Component({
  template: `<h1>{{ titulo }}</h1>`
})
export class MiComponente {
  titulo = "¡Hola, Angular!";
}
```

- La propiedad `titulo` del componente se muestra dinámicamente en la etiqueta `<h1>`.

---

### **2.2 Enlace de Propiedad (Property Binding)**

El enlace de propiedad establece valores para propiedades de elementos HTML o componentes utilizando la sintaxis `[ ]`.

**Ejemplo**:
```html
<button [disabled]="esDesactivado">Haz clic</button>
```

```typescript
@Component({
  template: `<button [disabled]="esDesactivado">Haz clic</button>`
})
export class MiComponente {
  esDesactivado = true;
}
```

- Si `esDesactivado` es `true`, el botón estará desactivado.

---

### **2.3 Enlace de Evento (Event Binding)**

El enlace de evento permite manejar interacciones del usuario (clics, teclas presionadas, etc.) con la sintaxis `( )`.

**Ejemplo**:
```html
<button (click)="saludar()">Saludar</button>
```

```typescript
@Component({
  template: `<button (click)="saludar()">Saludar</button>`
})
export class MiComponente {
  saludar() {
    console.log("¡Hola desde Angular!");
  }
}
```

- Cuando el usuario hace clic en el botón, se ejecuta el método `saludar()` del componente.

---

### **2.4 Enlace Bidireccional (Two-Way Binding)**

El enlace bidireccional sincroniza el componente y la vista al mismo tiempo utilizando `[(ngModel)]`.

**Ejemplo**:
```html
<input [(ngModel)]="nombre" placeholder="Nombre">
<p>Hola, {{ nombre }}</p>
```

```typescript
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

- Cualquier cambio en el campo de entrada se reflejará en `nombre`, y viceversa.

**Nota**: Para usar `ngModel`, debes importar el módulo `FormsModule` en el archivo del módulo correspondiente.

---

## **3. Ejemplos Prácticos de Enlace de Datos**

### **Ejemplo 1: Interpolación**
```html
<h1>{{ mensaje }}</h1>
```

```typescript
@Component({
  template: `<h1>{{ mensaje }}</h1>`
})
export class EjemploInterpolacion {
  mensaje = "Bienvenido a Angular";
}
```

- Muestra dinámicamente el valor de la propiedad `mensaje` en la vista.

---

### **Ejemplo 2: Enlace de Propiedad**
```html
<img [src]="urlImagen" alt="Imagen dinámica">
```

```typescript
@Component({
  template: `<img [src]="urlImagen" alt="Imagen dinámica">`
})
export class EjemploPropiedad {
  urlImagen = "https://angular.io/assets/images/logos/angular/angular.png";
}
```

- Enlaza dinámicamente la propiedad `src` de la etiqueta `<img>` al valor de `urlImagen`.

---

### **Ejemplo 3: Enlace de Evento**
```html
<button (click)="mostrarAlerta()">¡Alerta!</button>
```

```typescript
@Component({
  template: `<button (click)="mostrarAlerta()">¡Alerta!</button>`
})
export class EjemploEvento {
  mostrarAlerta() {
    alert("¡Has hecho clic!");
  }
}
```

- Llama al método `mostrarAlerta` cuando el usuario hace clic en el botón.

---

### **Ejemplo 4: Enlace Bidireccional**
```html
<input [(ngModel)]="texto" placeholder="Escribe algo">
<p>Escribiste: {{ texto }}</p>
```

```typescript
@Component({
  template: `
    <input [(ngModel)]="texto" placeholder="Escribe algo">
    <p>Escribiste: {{ texto }}</p>
  `
})
export class EjemploBidireccional {
  texto = "";
}
```

- Sincroniza el valor del campo de entrada con la propiedad `texto`.

---

## **4. Conclusiones**

El **enlace de datos** en Angular permite una comunicación fluida entre el componente y la vista, mejorando la interactividad de las aplicaciones. 

- Usa **Interpolación** para mostrar valores simples.
- Usa **Enlace de Propiedad** para manipular atributos HTML.
- Usa **Enlace de Evento** para responder a interacciones del usuario.
- Usa **Enlace Bidireccional** para sincronizar datos entre el componente y el DOM.

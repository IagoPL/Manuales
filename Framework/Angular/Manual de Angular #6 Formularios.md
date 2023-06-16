# Formularios

## Índice

1. Introducción a los Formularios en Angular
2. Formularios Reactivos
   - Creación de un Formulario Reactivo
   - Validación de Formularios Reactivos
   - Manipulación de Valores y Estados de los Campos
   - Presentación de Errores de Validación
   - Enviar y Restablecer el Formulario
3. Formularios Basados en Plantillas
   - Creación de un Formulario Basado en Plantillas
   - Validación de Formularios Basados en Plantillas
   - Acceso a los Controles del Formulario
   - Presentación de Errores de Validación
   - Enviar y Restablecer el Formulario
4. Formularios Avanzados
   - Formularios Anidados
   - Formularios Dinámicos
   - Validación Personalizada
   - Validación Asíncrona
   - Control de Cambios no Guardados

## 1. Introducción a los Formularios en Angular

Los formularios son una parte fundamental de muchas aplicaciones web, y Angular ofrece un conjunto de herramientas y técnicas para trabajar con ellos de manera eficiente. En este manual, exploraremos dos enfoques principales para la creación de formularios en Angular: los formularios reactivos y los formularios basados en plantillas.

Los formularios reactivos se basan en la creación y manipulación programática de instancias de formulario utilizando clases de Angular. Por otro lado, los formularios basados en plantillas utilizan directivas de Angular para enlazar elementos del formulario con instancias de formulario existentes en el componente.

## 2. Formularios Reactivos

### 2.1 Creación de un Formulario Reactivo

En Angular, la creación de un formulario reactivo implica seguir los siguientes pasos:

1. Importar los módulos necesarios desde `@angular/forms`.
2. Crear una instancia de `FormGroup` en el componente.
3. Definir los controles del formulario utilizando instancias de `FormControl`.
4. Agrupar los controles en el `FormGroup`.
5. Enlazar el formulario a la plantilla utilizando la directiva `formGroup`.

```typescript
import { FormGroup, FormControl } from '@angular/forms';

// En el componente
formularioReactivo: FormGroup;

constructor() {
  this.formularioReactivo = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
    // Agregar más controles según las necesidades del formulario
  });
}
```

### 2.2 Validación de Formularios Reactivos

La validación en formularios reactivos se puede realizar utilizando validadores predefinidos, validadores personalizados o una combinación de ambos. Al definir los controles, se pueden agregar validadores al FormControl correspondiente.

```typescript
import { Validators } from '@angular/forms';

// ...

this.formularioReactivo = new FormGroup({
  nombre: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  // Agregar más controles según las necesidades del formulario
});
```

### 2.3 Manipulación de Valores y Estados de los Campos

Es posible acceder y manipular los valores y estados de los campos del formulario reactivo. Algunos métodos útiles incluyen `setValue()`, `patchValue()` y `reset()`.

```typescript
// Obtener el valor

 de un campo
const nombre = this.formularioReactivo.get('nombre').value;

// Establecer el valor de un campo
this.formularioReactivo.get('email').setValue('ejemplo@correo.com');

// Restablecer los valores y estados de todos los campos
this.formularioReactivo.reset();
```

### 2.4 Presentación de Errores de Validación

Para mostrar los errores de validación en la plantilla, se pueden utilizar las propiedades `errors` y `touched` de los controles. Por ejemplo:

```html
<input type="text" formControlName="nombre" />
<div *ngIf="formularioReactivo.get('nombre').errors && formularioReactivo.get('nombre').touched">
  <div *ngIf="formularioReactivo.get('nombre').errors.required">El nombre es requerido.</div>
</div>
```

### 2.5 Enviar y Restablecer el Formulario

Para enviar el formulario, se puede utilizar el evento `ngSubmit` en la plantilla junto con un método en el componente. Para restablecer el formulario, se puede invocar el método `reset()` en la instancia de `FormGroup`.

```html
<form [formGroup]="formularioReactivo" (ngSubmit)="enviarFormulario()">
  <!-- Campos y botones del formulario -->
</form>
```

```typescript
enviarFormulario() {
  if (this.formularioReactivo.valid) {
    // Lógica para enviar los datos del formulario
  }
  
  this.formularioReactivo.reset();
}
```

## 3. Formularios Basados en Plantillas

### 3.1 Creación de un Formulario Basado en Plantillas

En los formularios basados en plantillas, se utiliza la directiva `ngForm` para agrupar y enlazar los campos del formulario en la plantilla. Además, se pueden utilizar directivas como `ngModel` para enlazar los valores de los campos a propiedades del componente.

```html
<form #formularioBasadoEnPlantillas="ngForm" (ngSubmit)="enviarFormulario()">
  <input type="text" name="nombre" [(ngModel)]="nombre" required>
  <input type="email" name="email" [(ngModel)]="email" required email>
  <!-- Otros campos del formulario -->
  <button type="submit">Enviar</button>
</form>
```

### 3.2 Validación de Formularios Basados en Plantillas

La validación en los formularios basados en plantillas se realiza mediante el uso de atributos HTML5, directivas y clases CSS predefinidas. Por ejemplo, se puede agregar el atributo `required` a un campo para indicar que es obligatorio.

```html
<input type="text" name="nombre" [(ngModel)]="nombre" required>
```

### 3.3 Acceso a los Controles del Formulario

Para acceder a los controles y sus propiedades en el componente, se puede utilizar la referencia `#formularioBasadoEnPlantillas` definida en la directiva `ngForm`. A través de esta referencia, se pueden obtener los valores y estados de los campos.

```typescript
// En el componente
import { NgForm } from '@angular/forms';

// ...

@ViewChild('formularioBasadoEnPlantillas') formularioBasadoEnPlantillas: NgForm;

enviarFormulario() {
  if (this.formularioBasadoEnPlantillas.valid) {
    // Lógica para enviar los datos del formulario
  }
  
  this.formularioBasadoEnPlantillas.resetForm();
}
```

### 3.4 Presentación de Errores de Validación

Para mostrar los errores de validación en la plantilla, se pueden utilizar las propiedades `errors` y `touched` de los controles. Por ejemplo:

```html
<input type="text" name="nombre" [(ngModel)]="nombre" required>
<div *ngIf="formularioBasadoEnPlantillas.controls.nombre.errors && formularioBasadoEnPlantillas.controls.nombre.touched">
  <div *ngIf="formularioBasadoEnPlantillas.controls.nombre.errors.required">El nombre es requerido.</div>
</div>
```

### 3.5 Enviar y Restablecer el Formulario

Al igual que en los formularios reactivos, se puede utilizar el evento `ngSubmit` para enviar el formulario y el método `resetForm()` para restablecerlo.

```html
<form #formularioBasadoEnPlantillas="ngForm" (ngSubmit)="enviarFormulario()">
  <!-- Campos y botones del formulario -->
</form>
```

```typescript
enviarFormulario() {
  if (this.formularioBasadoEnPlantillas.valid) {
    // Lógica para enviar los datos del formulario
  }
  
  this.formularioBasadoEnPlantillas.resetForm();
}
```

## 4. Formularios Avanzados

### 4.1 Formularios Anidados

En Angular, es posible crear formularios anidados, lo que significa que un formulario puede contener otros formularios. Esto es útil cuando

 se necesita dividir un formulario grande en componentes más pequeños y reutilizables.

### 4.2 Formularios Dinámicos

Los formularios dinámicos permiten agregar y eliminar campos de forma dinámica según las necesidades del usuario. Esto se puede lograr utilizando matrices (`FormArray`) en los formularios reactivos o utilizando directivas estructurales como `ngFor` en los formularios basados en plantillas.

### 4.3 Validación Personalizada

En ocasiones, la validación predefinida no es suficiente y se requiere una validación personalizada. En Angular, es posible crear validadores personalizados utilizando funciones o clases y agregarlos a los controles del formulario.

### 4.4 Validación Asíncrona

La validación asíncrona se utiliza cuando es necesario realizar una validación que depende de una llamada asíncrona, como una solicitud HTTP. Angular proporciona herramientas para manejar este tipo de validación utilizando el objeto `AsyncValidator`.

### 4.5 Control de Cambios no Guardados

Cuando se trabaja con formularios, es posible que se desee mostrar una advertencia al usuario si ha realizado cambios en el formulario pero no los ha guardado. Para lograr esto, se puede utilizar la interfaz `CanDeactivate` junto con el guardia de ruta para controlar los cambios no guardados.


# **Manual Completo de Angular: Formularios**

---

## **Índice**

1. **Introducción a los Formularios en Angular**  
2. **Formularios Reactivos**  
   - 2.1 Creación de un Formulario Reactivo  
   - 2.2 Validación de Formularios Reactivos  
   - 2.3 Manipulación de Valores y Estados de los Campos  
   - 2.4 Presentación de Errores de Validación  
   - 2.5 Enviar y Restablecer el Formulario  
3. **Formularios Basados en Plantillas**  
   - 3.1 Creación de un Formulario Basado en Plantillas  
   - 3.2 Validación de Formularios Basados en Plantillas  
   - 3.3 Acceso a los Controles del Formulario  
   - 3.4 Presentación de Errores de Validación  
   - 3.5 Enviar y Restablecer el Formulario  
4. **Formularios Avanzados**  
   - 4.1 Formularios Anidados  
   - 4.2 Formularios Dinámicos  
   - 4.3 Validación Personalizada  
   - 4.4 Validación Asíncrona  
   - 4.5 Control de Cambios no Guardados  
5. **Conclusiones**

---

## **1. Introducción a los Formularios en Angular**

Los formularios son esenciales para interactuar con los usuarios en una aplicación web. Angular proporciona dos enfoques principales para la creación y manejo de formularios:

- **Formularios Reactivos**: Utilizan instancias programáticas de clases para gestionar los datos y validaciones. Son ideales para formularios complejos.
- **Formularios Basados en Plantillas**: Enlazan los datos directamente en la plantilla HTML mediante directivas como `ngModel`.

Ambos enfoques ofrecen herramientas para gestionar validaciones, eventos y estados de los campos de forma eficiente.

---

## **2. Formularios Reactivos**

### **2.1 Creación de un Formulario Reactivo**

Para crear un formulario reactivo:

1. Importa los módulos necesarios desde `@angular/forms`:
   ```typescript
   import { ReactiveFormsModule } from '@angular/forms';
   ```

2. Configura el `FormGroup` y sus `FormControl` en el componente:

   ```typescript
   import { FormGroup, FormControl } from '@angular/forms';

   export class MiComponente {
     formularioReactivo: FormGroup;

     constructor() {
       this.formularioReactivo = new FormGroup({
         nombre: new FormControl(''),
         email: new FormControl(''),
       });
     }
   }
   ```

3. Enlaza el formulario en la plantilla:
   ```html
   <form [formGroup]="formularioReactivo" (ngSubmit)="enviarFormulario()">
     <input type="text" formControlName="nombre" placeholder="Nombre">
     <input type="email" formControlName="email" placeholder="Correo Electrónico">
     <button type="submit">Enviar</button>
   </form>
   ```

---

### **2.2 Validación de Formularios Reactivos**

Añade validadores predefinidos o personalizados al configurar los controles:

```typescript
import { Validators } from '@angular/forms';

this.formularioReactivo = new FormGroup({
  nombre: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

---

### **2.3 Manipulación de Valores y Estados**

- **Acceder a los valores**:
  ```typescript
  const nombre = this.formularioReactivo.get('nombre').value;
  ```

- **Actualizar valores**:
  ```typescript
  this.formularioReactivo.get('email').setValue('usuario@ejemplo.com');
  ```

- **Restablecer el formulario**:
  ```typescript
  this.formularioReactivo.reset();
  ```

---

### **2.4 Presentación de Errores de Validación**

Muestra los errores de validación dinámicamente en la plantilla:

```html
<input type="text" formControlName="nombre">
<div *ngIf="formularioReactivo.get('nombre').errors?.required && formularioReactivo.get('nombre').touched">
  El nombre es obligatorio.
</div>
```

---

### **2.5 Enviar y Restablecer el Formulario**

```html
<form [formGroup]="formularioReactivo" (ngSubmit)="enviarFormulario()">
  <button type="submit">Enviar</button>
</form>
```

```typescript
enviarFormulario() {
  if (this.formularioReactivo.valid) {
    console.log(this.formularioReactivo.value);
  }
  this.formularioReactivo.reset();
}
```

---

## **3. Formularios Basados en Plantillas**

### **3.1 Creación de un Formulario Basado en Plantillas**

1. Importa el módulo `FormsModule`:
   ```typescript
   import { FormsModule } from '@angular/forms';
   ```

2. Define el formulario en la plantilla:
   ```html
   <form #formulario="ngForm" (ngSubmit)="enviarFormulario()">
     <input type="text" name="nombre" [(ngModel)]="nombre" required>
     <input type="email" name="email" [(ngModel)]="email" required email>
     <button type="submit">Enviar</button>
   </form>
   ```

---

### **3.2 Validación**

Usa atributos HTML y directivas:
```html
<input type="text" name="nombre" [(ngModel)]="nombre" required>
<div *ngIf="formulario.controls.nombre?.errors?.required">
  El nombre es obligatorio.
</div>
```

---

### **3.3 Acceso a los Controles**

Accede a los controles a través de la referencia del formulario:

```typescript
@ViewChild('formulario') formulario: NgForm;

enviarFormulario() {
  if (this.formulario.valid) {
    console.log(this.formulario.value);
  }
}
```

---

## **4. Formularios Avanzados**

### **4.1 Formularios Anidados**

Los formularios pueden contener subformularios:
```typescript
const formularioPrincipal = new FormGroup({
  usuario: new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
  }),
});
```

---

### **4.2 Formularios Dinámicos**

Utiliza `FormArray` para manejar grupos dinámicos de campos:
```typescript
import { FormArray } from '@angular/forms';

this.formularioReactivo = new FormGroup({
  items: new FormArray([]),
});

agregarItem() {
  (this.formularioReactivo.get('items') as FormArray).push(new FormControl(''));
}
```

---

### **4.3 Validación Personalizada**

Crea validadores personalizados:
```typescript
function nombreValido(control: FormControl) {
  return control.value.includes('Angular') ? null : { nombreInvalido: true };
}
```

---

### **4.4 Validación Asíncrona**

Realiza validaciones que dependen de llamadas HTTP:
```typescript
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

function emailUnico(control: AbstractControl): Observable<any> {
  return of(control.value === 'existente@correo.com' ? { emailDuplicado: true } : null).pipe(delay(1000));
}
```

---

### **4.5 Control de Cambios no Guardados**

Usa la interfaz `CanDeactivate` para evitar la pérdida de cambios:
```typescript
import { CanDeactivate } from '@angular/router';

export class GuardarCambiosGuard implements CanDeactivate<any> {
  canDeactivate(component: any): boolean {
    return component.formulario.dirty ? confirm('¿Deseas salir sin guardar?') : true;
  }
}
```

---

## **5. Conclusiones**

Angular ofrece herramientas potentes para manejar formularios de cualquier nivel de complejidad. Elige entre **formularios reactivos** para una mayor flexibilidad y control, o **formularios basados en plantillas** para un desarrollo rápido y directo. 

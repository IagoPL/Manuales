# **Componentes y Directivas en Angular**

## **Introducción a Componentes y Directivas**

En Angular, los **componentes** y las **directivas** son los bloques de construcción fundamentales para crear aplicaciones dinámicas y reutilizables.

- **Componentes**: Representan partes específicas de la interfaz de usuario (UI) y están asociados a plantillas HTML y estilos CSS.
- **Directivas**: Son instrucciones para modificar el comportamiento de elementos HTML existentes o para crear elementos personalizados.

Ambos elementos trabajan juntos para definir cómo se ve y se comporta la aplicación.

---

## **Componentes: Creación y Estructura**

Los componentes en Angular son clases de TypeScript decoradas con el decorador **`@Component`**, que proporciona metadatos esenciales sobre el componente.

### **1. Creación de un nuevo componente**

Para crear un componente, Angular CLI ofrece un comando rápido:

```bash
ng generate component nombre-componente
```

Esto genera automáticamente la estructura del componente con los siguientes archivos:

- **`nombre-componente.component.ts`**: Lógica del componente.
- **`nombre-componente.component.html`**: Plantilla asociada.
- **`nombre-componente.component.css`**: Estilos específicos.
- **`nombre-componente.component.spec.ts`**: Archivo de pruebas.

Si prefieres hacerlo manualmente, crea un archivo `.ts` y define la clase con el decorador **`@Component`**:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css']
})
export class MiComponenteComponent {
  // Propiedades y lógica del componente
}
```

---

### **2. Elementos clave del decorador `@Component`**

1. **Selector**:
   - Es el identificador único del componente que se utiliza en las plantillas HTML para representarlo.
   - Ejemplo:
     ```typescript
     selector: 'app-mi-componente'
     ```
   - Uso en la plantilla:
     ```html
     <app-mi-componente></app-mi-componente>
     ```

2. **Plantilla (Template)**:
   - Define la estructura del componente.
   - Se puede definir en línea usando `template` o en un archivo separado con `templateUrl`.
     ```typescript
     template: '<p>Hola desde mi componente</p>'
     ```
     O:
     ```typescript
     templateUrl: './mi-componente.component.html'
     ```

3. **Estilos (Styles)**:
   - Define los estilos CSS específicos del componente.
   - Se puede declarar en línea con `styles` o en un archivo separado con `styleUrls`.
     ```typescript
     styles: ['p { color: blue; }']
     ```
     O:
     ```typescript
     styleUrls: ['./mi-componente.component.css']
     ```

---

### **3. Propiedades y lógica del componente**

Dentro de la clase del componente puedes definir:
- **Propiedades**: Para almacenar datos.
- **Métodos**: Para manejar eventos o ejecutar lógica.

Ejemplo:
```typescript
export class MiComponenteComponent {
  mensaje: string = "Hola, Angular!";
  
  mostrarMensaje(): void {
    console.log(this.mensaje);
  }
}
```
En la plantilla:
```html
<p>{{ mensaje }}</p>
<button (click)="mostrarMensaje()">Mostrar Mensaje</button>
```

---

## **Directivas: Tipos y Utilización**

Las **directivas** en Angular son instrucciones para modificar o crear elementos HTML. Existen tres tipos principales:

---

### **1. Directivas de Atributo**

Las directivas de atributo cambian el comportamiento o el estilo de elementos HTML existentes.

Ejemplo:
```html
<p [ngStyle]="{'color': 'blue'}">Texto en azul</p>
<p [class.destacado]="esDestacado">Texto destacado si esDestacado es verdadero</p>
```

Ejemplo práctico con **`*ngIf`**:
```html
<p *ngIf="mostrarMensaje">Este es un mensaje condicional.</p>
```
- Muestra el elemento solo si `mostrarMensaje` es verdadero.

---

### **2. Directivas Estructurales**

Estas directivas manipulan la estructura del DOM agregando, eliminando o reemplazando elementos.

Ejemplo con **`*ngFor`**:
```html
<ul>
  <li *ngFor="let item of listaItems">{{ item }}</li>
</ul>
```
- Repite el elemento `<li>` para cada ítem en `listaItems`.

Ejemplo con **`*ngIf`**:
```html
<div *ngIf="hayContenido; else sinContenido">
  <p>Contenido disponible</p>
</div>
<ng-template #sinContenido>
  <p>No hay contenido</p>
</ng-template>
```

---

### **3. Directivas de Componente**

Son directivas basadas en componentes que crean elementos personalizados. Se utilizan como si fueran etiquetas HTML.

Ejemplo:
```html
<app-mi-componente></app-mi-componente>
```
En este caso, la directiva **`app-mi-componente`** representa el componente creado anteriormente.

---

## **Conclusiones**

Los componentes y las directivas son fundamentales para el desarrollo con Angular:

1. **Componentes**:
   - Representan partes de la interfaz de usuario.
   - Tienen su propia lógica y estilos.

2. **Directivas**:
   - Modifican el comportamiento y la estructura del DOM.
   - Permiten la creación de elementos personalizados y reutilizables.

**Dominar los componentes y directivas te permitirá construir aplicaciones robustas y modulares.** 

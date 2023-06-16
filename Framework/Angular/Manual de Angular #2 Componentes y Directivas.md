# Componentes y Directivas

## Introducción a Componentes y Directivas

En Angular, los componentes y las directivas son los bloques de construcción fundamentales para crear aplicaciones. Los componentes representan elementos de la interfaz de usuario (UI) y las directivas son instrucciones que se aplican a elementos HTML existentes o se utilizan para crear nuevos elementos reutilizables.

## Componentes: Creación y Estructura

Los componentes en Angular son clases TypeScript decoradas con el decorador `@Component`. Cada componente tiene una plantilla asociada que define su estructura y apariencia visual. Para crear un nuevo componente en Angular, sigue estos pasos:

1. **Creación de un nuevo componente:**
   
   Para crear un componente, crea un nuevo archivo TypeScript, por ejemplo, `mi-componente.component.ts`, y define la clase del componente decorada con `@Component`.

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

2. **Definición del selector del componente:**

   El selector del componente se especifica en la propiedad `selector` del decorador `@Component`. El selector es un nombre que se utiliza para insertar el componente en una plantilla HTML.

3. **Plantilla asociada al componente:**

   Especifica la ruta de la plantilla HTML asociada al componente en la propiedad `templateUrl` del decorador `@Component`. También puedes definir la plantilla en línea utilizando la propiedad `template`.

4. **Estilos CSS del componente:**

   Opcionalmente, puedes proporcionar estilos CSS específicos para el componente en la propiedad `styleUrls` del decorador `@Component`. Al igual que con la plantilla, también puedes definir los estilos en línea utilizando la propiedad `styles`.

5. **Propiedades y lógica del componente:**

   Dentro de la clase del componente, puedes agregar propiedades y métodos para la lógica del componente. Estas propiedades y métodos estarán disponibles en la plantilla del componente para interactuar con la interfaz de usuario.

## Directivas: Tipos y Utilización

Las directivas en Angular son instrucciones que modifican el comportamiento de los elementos HTML existentes o crean nuevos elementos personalizados. Hay tres tipos de directivas en Angular: directivas de atributo, directivas estructurales y directivas de componente.

### Directivas de Atributo

Las directivas de atributo se aplican utilizando el prefijo `*ng`. Estas directivas modifican el comportamiento de un elemento HTML existente.

Ejemplo:

```html
<p *ngIf="mostrarMensaje">Este es un mensaje condicional.</p>
```

En este ejemplo, la directiva `*ngIf` se aplica al elemento `<p>` y muestra el elemento solo si la propiedad `mostrarMensaje` es verdadera.

### Directivas Estructurales

Las directivas estructurales también se aplican utilizando el prefijo `*ng`. Estas directivas manipulan la estructura del DOM agregando, eliminando o reemplazando elementos.

Ejemplo:

```html
<ul>
  <li *ngFor="let item of listaItems">{{ item }}</li>
</ul>
```

En este ejemplo, la direct

iva `*ngFor` crea múltiples elementos `<li>` basados en los elementos de la matriz `listaItems`.

### Directivas de Componente

Las directivas de componente crean nuevos elementos personalizados. Se utilizan como si fueran elementos HTML normales.

Ejemplo:

```html
<app-mi-componente></app-mi-componente>
```

En este ejemplo, la directiva `app-mi-componente` representa el componente `MiComponenteComponent` que hemos creado anteriormente.

## Conclusiones

Los componentes y las directivas son elementos fundamentales en Angular que permiten construir aplicaciones interactivas y reutilizables. Los componentes representan partes de la interfaz de usuario con su propia lógica y apariencia, mientras que las directivas modifican o crean elementos HTML existentes. Dominar estos conceptos te permitirá construir aplicaciones robustas y escalables utilizando Angular.


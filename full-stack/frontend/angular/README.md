# Manual de Angular

## Introducción a Angular

Angular es un framework de desarrollo de aplicaciones web desarrollado por Google. Utiliza el lenguaje de programación TypeScript y se basa en el patrón de diseño Modelo-Vista-Controlador (MVC). Este manual tiene como objetivo proporcionar una guía completa para comenzar con Angular desde cero y avanzar rápidamente hasta un nivel avanzado.

## Contenido

1. [Instalación](#instalación)
2. [Conceptos básicos](#conceptos-básicos)
    - Componentes
    - Directivas
    - Servicios
    - Módulos
3. [Configuración del entorno de desarrollo](#configuración-del-entorno-de-desarrollo)
4. [Creación de un proyecto en Angular](#creación-de-un-proyecto-en-angular)
5. [Desarrollo de componentes](#desarrollo-de-componentes)
    - Creación de componentes
    - Enlace de datos
    - Eventos y enrutamiento
6. [Directivas y pipes](#directivas-y-pipes)
7. [Servicios y dependencias](#servicios-y-dependencias)
8. [Módulos y lazy loading](#módulos-y-lazy-loading)
9. [Routing y navegación](#routing-y-navegación)
10. [Interacción con APIs](#interacción-con-apis)
11. [Formularios y validación](#formularios-y-validación)
12. [Pruebas unitarias](#pruebas-unitarias)
13. [Despliegue de la aplicación](#despliegue-de-la-aplicación)

## Instalación

Para comenzar a desarrollar con Angular, primero debes asegurarte de tener Node.js y npm (Node Package Manager) instalados en tu sistema. Sigue estos pasos para instalar Angular CLI (Command Line Interface) y crear un nuevo proyecto:

1. Abre tu terminal o línea de comandos.
2. Ejecuta el siguiente comando para instalar Angular CLI globalmente:

```shell
npm install -g @angular/cli
```

3. Una vez instalado, puedes verificar la versión de Angular CLI con el siguiente comando:

```shell
ng version
```

4. Ahora estás listo para crear un nuevo proyecto Angular. Ejecuta el siguiente comando:

```shell
ng new nombre-del-proyecto
```

5. Angular CLI te hará una serie de preguntas para configurar tu proyecto. Puedes elegir las opciones predeterminadas o personalizarlas según tus necesidades.

¡Felicidades! Has creado con éxito un nuevo proyecto en Angular.

## Conceptos básicos

### Componentes

Los componentes son la unidad básica de construcción en Angular. Representan elementos de la interfaz de usuario (UI) y están formados por una plantilla HTML y una clase TypeScript que define el comportamiento del componente. Los componentes se comunican entre sí mediante propiedades de entrada y salida.

Un ejemplo de un componente en Angular sería el siguiente:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  templateUrl: './ejemplo.component.html',
  styleUrls: ['./ejemplo.component.css']
})
export class EjemploComponent {
  nombre: string = 'John Doe';
  edad: number = 25;
}
```

La plantilla HTML asociada (`ejemplo.component.html`) puede utilizar la interpolación de datos para mostrar los valores del componente:

```html
<p>Hola, {{ nombre }}.

 Tienes {{ edad }} años.</p>
```

### Directivas

Las directivas son instrucciones que se aplican a elementos HTML en una plantilla para modificar su comportamiento o apariencia. Angular proporciona directivas integradas, como `ngIf` y `ngFor`, que te permiten controlar la visualización y repetición de elementos en tu aplicación.

Un ejemplo de uso de la directiva `ngIf` sería el siguiente:

```html
<p *ngIf="edad >= 18">Eres mayor de edad.</p>
```

Esta directiva muestra el elemento `<p>` solo si la propiedad `edad` es mayor o igual a 18.

### Servicios

Los servicios son clases que se utilizan para organizar y compartir la lógica de negocio, la lógica de acceso a datos y otras funcionalidades reutilizables en una aplicación Angular. Los servicios se pueden inyectar en componentes u otros servicios para su uso.

Un ejemplo de un servicio en Angular sería el siguiente:

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class EjemploService {
  obtenerDatos(): string {
    return 'Estos son los datos del servicio.';
  }
}
```

Este servicio se puede inyectar en un componente y utilizarlo:

```typescript
import { Component } from '@angular/core';
import { EjemploService } from './ejemplo.service';

@Component({
  selector: 'app-ejemplo',
  template: '<p>{{ datos }}</p>',
  providers: [EjemploService]
})
export class EjemploComponent {
  datos: string;

  constructor(private ejemploService: EjemploService) {}

  ngOnInit() {
    this.datos = this.ejemploService.obtenerDatos();
  }
}
```

### Módulos

Los módulos en Angular agrupan componentes, directivas, servicios y otros artefactos relacionados en unidades coherentes. Los módulos ayudan a organizar y estructurar una aplicación Angular, y proporcionan un contexto para la compilación y ejecución de los componentes.

Un ejemplo de un módulo en Angular sería el siguiente:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

En este ejemplo, el módulo `AppModule` declara el componente `AppComponent` y especifica que se debe arrancar este componente al iniciar la aplicación.

## Configuración del entorno de desarrollo

Antes de comenzar a desarrollar, es importante configurar un entorno de desarrollo adecuado para Angular. Sigue estos pasos para configurar tu entorno de desarrollo:

1. Instala un editor de código de tu elección, como Visual Studio Code, Sublime Text o Atom.
2. Configura las extensiones recomendadas para Angular en tu editor de código. Estas extensiones suelen incluir resaltado de sintaxis, autocompletado y otras características útiles para el desarrollo de Angular.
3. Considera la posibilidad de instalar Git en tu sistema para gestionar el control de versiones de tu proyecto.

## Creación de un proyecto en Angular

Una vez que hayas instalado Angular CLI, puedes crear un nuevo proyecto utilizando el siguiente comando:

```shell
ng new nombre-del-proyecto
```

Esto creará un nuevo directorio con el nombre del proyecto y generará la estructura básica del proyecto de Angular.

## Des

arrollo de componentes

### Creación de componentes

Los componentes en Angular se crean utilizando el siguiente comando:

```shell
ng generate component nombre-del-componente
```

Esto generará los archivos necesarios para el componente, incluyendo la plantilla HTML, la clase TypeScript y los estilos CSS.

### Enlace de datos

El enlace de datos en Angular permite enlazar datos de la clase del componente con la plantilla HTML. Puedes utilizar la sintaxis de interpolación `{{ variable }}` o la sintaxis de propiedad `[propiedad]` para enlazar datos.

```html
<p>Hola, {{ nombre }}.</p>
```

En este ejemplo, la propiedad `nombre` del componente se enlaza con el contenido del elemento `<p>`.

### Eventos y enrutamiento

Puedes utilizar la sintaxis de eventos `(evento)="manejadorDeEvento()"` en la plantilla HTML para capturar eventos y llamar a funciones en la clase del componente. Además, Angular ofrece un sistema de enrutamiento para navegar entre diferentes vistas de la aplicación.

```html
<button (click)="mostrarMensaje()">Mostrar mensaje</button>
```

En este ejemplo, el evento `click` del botón llama al método `mostrarMensaje()` en la clase del componente cuando se hace clic en el botón.

## Directivas y pipes

Angular proporciona una variedad de directivas y pipes integrados que puedes utilizar para modificar la apariencia y el comportamiento de los elementos en tu aplicación. Las directivas te permiten controlar la visualización dinámica de elementos, mientras que los pipes te permiten transformar datos antes de mostrarlos.

Un ejemplo de uso de la directiva `ngFor` y el pipe `uppercase` sería el siguiente:

```html
<ul>
  <li *ngFor="let item of lista">{{ item | uppercase }}</li>
</ul>
```

En este ejemplo, la directiva `ngFor` se utiliza para iterar sobre una lista y generar elementos `<li>` para cada elemento de la lista. El pipe `uppercase` se utiliza para convertir el texto a mayúsculas.

## Servicios y dependencias

Los servicios en Angular se utilizan para organizar y compartir la lógica de negocio y otras funcionalidades reutilizables en una aplicación. Los servicios se pueden inyectar en componentes u otros servicios utilizando la inyección de dependencias.

Un ejemplo de un servicio en Angular sería el siguiente:

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class EjemploService {
  obtenerDatos(): string {
    return 'Estos son los datos del servicio.';
  }
}
```

Este servicio se puede inyectar en un componente y utilizarlo:

```typescript
import { Component } from '@angular/core';
import { EjemploService } from './ejemplo.service';

@Component({
  selector: 'app-ejemplo',
  template: '<p>{{ datos }}</p>',
  providers: [EjemploService]
})
export class EjemploComponent {
  datos: string;

  constructor(private ejemploService: EjemploService) {}

  ngOnInit() {
    this.datos = this.ejemploService.obtenerDatos();
  }
}
```

En este ejemplo, el servicio `EjemploService` se inyecta en el componente `EjemploComponent` y se utiliza para obtener datos que se muestran en la plantilla.

## Módulos y lazy loading

Los módulos en Angular ayudan a organizar y estructurar una aplicación. Además, Angular permite cargar módulos de forma perezosa (

lazy loading) para mejorar el rendimiento de la aplicación. Lazy loading significa que los módulos se cargan bajo demanda, solo cuando se necesita acceder a ellos.

Para crear un módulo en Angular, puedes utilizar el siguiente comando:

```shell
ng generate module nombre-del-modulo
```

Para configurar el lazy loading en el enrutamiento, puedes utilizar la siguiente configuración:

```typescript
const routes: Routes = [
  { path: 'ruta', loadChildren: () => import('./ruta/ruta.module').then(m => m.RutaModule) }
];
```

En este ejemplo, el módulo `RutaModule` se cargará de forma perezosa cuando se navegue a la ruta especificada.

## Routing y navegación

El enrutamiento en Angular permite navegar entre diferentes vistas y componentes de una aplicación. Puedes configurar las rutas en tu aplicación utilizando el enrutador de Angular.

Para configurar el enrutamiento, debes importar el módulo `RouterModule` y definir las rutas en un arreglo. Luego, debes agregar el enrutador a la lista de importaciones del módulo principal de tu aplicación.

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

En este ejemplo, se definen dos rutas: una ruta vacía que se carga cuando no se especifica ninguna ruta y una ruta '/about' que se carga cuando se navega a '/about'.

## Interacción con APIs

En la mayoría de las aplicaciones, es común interactuar con APIs para obtener y enviar datos. Angular proporciona la clase `HttpClient` que puedes utilizar para realizar solicitudes HTTP a APIs.

Para utilizar `HttpClient`, primero debes importar el módulo `HttpClientModule` en tu módulo principal. Luego, puedes inyectar `HttpClient` en tu servicio o componente y utilizar sus métodos para realizar solicitudes HTTP.

```typescript
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EjemploService {
  constructor(private http: HttpClient) {}

  obtenerDatos(): Observable<any> {
    return this.http.get('https://api.example.com/data');
  }
}
```

En este ejemplo, el método `obtenerDatos()` utiliza `HttpClient` para realizar una solicitud GET a 'https://api.example.com/data'.

## Formularios y validación

Angular ofrece un conjunto de herramientas y directivas para trabajar con formularios en aplicaciones web. Puedes realizar validaciones tanto en el lado del cliente como en el lado del servidor.

Para crear un formulario en Angular, debes importar el módulo `FormsModule` en tu módulo principal. Luego, puedes utilizar las directivas `ngModel` y `ngForm` para enlazar y validar los campos del formulario.

```html
<form #myForm="ngForm" (ngSubmit)="guardarDatos()">
  <input type="text" name="nombre" [(ngModel)]="nombre" required>
  <button type="submit" [disabled]="myForm.invalid">Guardar</button>
</form>
```

En este ejemplo, el formulario utiliza `ngForm` para realizar la validación y el enlace de datos. El botón de guardar se desactiva si el formulario es inv

álido.

## Pruebas unitarias

Las pruebas unitarias son una parte importante del desarrollo de aplicaciones. Angular proporciona herramientas y frameworks, como Jasmine y Karma, para realizar pruebas unitarias en componentes, servicios y otras partes de tu aplicación.

Puedes utilizar el siguiente comando para generar archivos de prueba unitaria para tus componentes:

```shell
ng generate component nombre-del-componente --spec
```

Esto generará un archivo de prueba unitaria (`nombre-del-componente.component.spec.ts`) que puedes utilizar para escribir tus pruebas.

## Despliegue de la aplicación

Una vez que hayas terminado de desarrollar tu aplicación en Angular, puedes desplegarla en un servidor web. Puedes utilizar herramientas como Firebase Hosting, Netlify o GitHub Pages para alojar tu aplicación Angular de forma gratuita.

Para desplegar tu aplicación, debes compilarla primero utilizando el siguiente comando:

```shell
ng build --prod
```

Esto generará los archivos estáticos de tu aplicación en la carpeta `dist`. Luego, puedes cargar estos archivos en tu servidor web para que la aplicación esté disponible en línea.

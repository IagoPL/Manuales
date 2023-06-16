# Manual completo de Angular: Servicios e Inyección de Dependencias

## Índice

1. Introducción a los Servicios y la Inyección de Dependencias
2. Creación de Servicios en Angular
3. Utilización de Servicios en Componentes
4. Inyección de Dependencias en Angular
5. Inyectores y Proveedores
6. Jerarquía de Inyectores y Ámbito de los Servicios
7. Ejemplo Práctico: Creación y Uso de un Servicio en Angular
8. Conclusiones

## 1. Introducción a los Servicios y la Inyección de Dependencias

Los servicios son una parte fundamental de las aplicaciones desarrolladas en Angular. Permiten compartir datos, lógica y funcionalidades entre diferentes componentes de una manera eficiente y modular. La inyección de dependencias es el mecanismo que Angular utiliza para proporcionar instancias de servicios a los componentes que los necesitan.

En este manual, exploraremos en detalle cómo crear y utilizar servicios en Angular, así como los conceptos clave relacionados con la inyección de dependencias.

## 2. Creación de Servicios en Angular

Para crear un servicio en Angular, podemos utilizar el generador de servicios de la CLI (Command Line Interface). Ejecuta el siguiente comando en tu terminal:

```bash
ng generate service nombre-del-servicio
```

Esto generará un archivo `nombre-del-servicio.service.ts` con una clase que servirá como nuestro servicio. Dentro de esta clase, podemos agregar la lógica y los datos que deseamos compartir.

## 3. Utilización de Servicios en Componentes

Para utilizar un servicio en un componente, debemos inyectarlo mediante la inyección de dependencias. Esto se logra declarando el servicio en el constructor del componente.

```typescript
import { Component } from '@angular/core';
import { NombreDelServicioService } from './nombre-del-servicio.service';

@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css']
})
export class MiComponenteComponent {
  constructor(private servicio: NombreDelServicioService) { }
}
```

En el ejemplo anterior, hemos inyectado el servicio `NombreDelServicioService` en el componente `MiComponenteComponent`. Ahora podemos acceder a los métodos y propiedades del servicio utilizando `this.servicio`.

## 4. Inyección de Dependencias en Angular

La inyección de dependencias en Angular se basa en el principio de inversión de control (IoC). En lugar de que los componentes creen manualmente instancias de los servicios que necesitan, Angular se encarga de proporcionar estas instancias.

Para que Angular pueda inyectar un servicio, debemos registrarlo en el módulo o en el componente correspondiente. Esto se hace utilizando los decoradores `@Injectable()` y `@NgModule()` respectivamente.

## 5. Inyectores y Proveedores

Los inyectores son los encargados de crear y proporcionar las instancias de los servicios. Cada componente y módulo en Angular tiene un inyector asociado. El inyector utiliza los proveedores para saber cómo crear las instancias de los servicios.

Un proveedor puede ser:

- El propio servicio: En este caso, el inyector creará una nueva instancia del servicio cada vez que se solicite.
- Un valor constante: El inyector proporcionará siempre el mismo valor sin

 crear una nueva instancia.
- Una fábrica: Permite personalizar la lógica de creación de instancias de un servicio.

## 6. Jerarquía de Inyectores y Ámbito de los Servicios

En Angular, los inyectores forman una jerarquía basada en la estructura de los componentes y módulos. Esto afecta al ámbito de los servicios y a cómo se comparten entre diferentes partes de la aplicación.

- Si un servicio se declara en un módulo raíz (`AppModule`), estará disponible en toda la aplicación.
- Si un servicio se declara en un componente, solo estará disponible para ese componente y sus componentes hijos.
- Podemos limitar la disponibilidad de un servicio utilizando la opción `providedIn` en el decorador `@Injectable()`.

## 7. Ejemplo Práctico: Creación y Uso de un Servicio en Angular

A continuación, presentaremos un ejemplo práctico para ilustrar cómo crear y utilizar un servicio en Angular.

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EjemploServicioService {
  private datosCompartidos: string[] = [];

  agregarDato(dato: string) {
    this.datosCompartidos.push(dato);
  }

  obtenerDatos(): string[] {
    return this.datosCompartidos;
  }
}
```

En este ejemplo, hemos creado un servicio llamado `EjemploServicioService`. El servicio tiene una propiedad privada `datosCompartidos` y dos métodos: `agregarDato()` para agregar datos y `obtenerDatos()` para obtener los datos agregados.

Podemos utilizar este servicio en un componente de la siguiente manera:

```typescript
import { Component } from '@angular/core';
import { EjemploServicioService } from './ejemplo-servicio.service';

@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css']
})
export class MiComponenteComponent {
  constructor(private servicio: EjemploServicioService) { }

  agregarDato(dato: string) {
    this.servicio.agregarDato(dato);
  }

  obtenerDatos(): string[] {
    return this.servicio.obtenerDatos();
  }
}
```

En este componente, hemos inyectado el servicio `EjemploServicioService` en el constructor. Luego, podemos utilizar los métodos del servicio `agregarDato()` y `obtenerDatos()` para interactuar con los datos compartidos.

## 8. Conclusiones

En este manual hemos explorado los conceptos fundamentales relacionados con los servicios y la inyección de dependencias en Angular. Aprendimos cómo crear servicios, inyectarlos en componentes, y cómo se gestionan los inyectores y proveedores en la jerarquía de Angular.

Los servicios y la inyección de dependencias son herramientas poderosas que nos permiten desarrollar aplicaciones modulares, reutilizables y fáciles de mantener en Angular. Dominar estos conceptos te ayudará a convertirte en un profesional en el desarrollo de aplicaciones con Angular.

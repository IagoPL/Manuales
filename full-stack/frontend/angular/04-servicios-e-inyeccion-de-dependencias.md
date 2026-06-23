# Servicios e Inyección de Dependencias

## **Índice**

1. **Introducción a los Servicios y la Inyección de Dependencias**
2. **Creación de Servicios en Angular**
3. **Utilización de Servicios en Componentes**
4. **Inyección de Dependencias en Angular**
5. **Inyectores y Proveedores**
6. **Jerarquía de Inyectores y Ámbito de los Servicios**
7. **Ejemplo Práctico: Creación y Uso de un Servicio en Angular**
8. **Buenas Prácticas en el Uso de Servicios**
9. **Conclusiones**

---

## **1. Introducción a los Servicios y la Inyección de Dependencias**

### **¿Qué son los Servicios?**

En Angular, los servicios son clases especializadas que contienen lógica y funcionalidades que pueden ser reutilizadas a lo largo de la aplicación. Su propósito principal es:

- **Compartir datos** entre componentes.
- **Abstraer la lógica de negocio** del componente.
- **Centralizar funcionalidades** como manejo de datos, validaciones o autenticación.

### **¿Qué es la Inyección de Dependencias?**

La inyección de dependencias (Dependency Injection, DI) es un patrón de diseño que permite gestionar de manera automática las instancias de los servicios necesarios en una aplicación. Angular proporciona un sistema de DI integrado que facilita la creación y uso de servicios.

**Ventajas de la Inyección de Dependencias en Angular**:

- Promueve el código **modular y reutilizable**.
- Facilita el **testeo** y la **mantenibilidad**.
- Evita instanciar servicios manualmente.

---

## **2. Creación de Servicios en Angular**

### **Cómo crear un servicio**

Angular CLI simplifica la creación de servicios con el siguiente comando:

```bash
ng generate service nombre-del-servicio

```

Este comando genera:

1. Un archivo `.service.ts` que contiene la definición del servicio.
2. La anotación `@Injectable` que lo registra en el sistema de DI de Angular.

**Estructura básica de un servicio**:

```tsx
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // El servicio estará disponible globalmente
})
export class MiServicioService {
  // Lógica y métodos del servicio
}

```

**Nota**: El uso de `providedIn: 'root'` asegura que el servicio esté disponible en toda la aplicación.

---

## **3. Utilización de Servicios en Componentes**

Para utilizar un servicio, inyecta su instancia en el constructor del componente donde será usado:

```tsx
import { Component } from '@angular/core';
import { MiServicioService } from './mi-servicio.service';

@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css']
})
export class MiComponenteComponent {
  constructor(private miServicio: MiServicioService) { }

  usarServicio() {
    this.miServicio.metodoDelServicio();
  }
}

```

- **`private miServicio: MiServicioService`**: Declara el servicio como una dependencia del componente.
- Angular se encarga de proporcionar una instancia del servicio automáticamente.

---

## **4. Inyección de Dependencias en Angular**

### **Cómo funciona la DI**

1. **Registro del Servicio**: Angular necesita saber cómo crear una instancia del servicio. Esto se hace mediante el decorador `@Injectable` o los proveedores.
2. **Provisión del Servicio**: Angular utiliza el inyector para localizar o crear una instancia del servicio registrado.
3. **Inyección**: La instancia del servicio se pasa automáticamente al componente o clase que la necesita.

**Ejemplo básico de inyección de dependencias**:

```tsx
@Injectable({
  providedIn: 'root',
})
export class EjemploServicio { }

```

En este caso, el servicio está registrado en el inyector raíz de Angular.

---

## **5. Inyectores y Proveedores**

### **¿Qué es un inyector?**

Un inyector es responsable de crear y administrar las instancias de los servicios. Angular tiene una jerarquía de inyectores que se organiza en módulos y componentes.

### **Tipos de Proveedores**

1. **Clase** (por defecto):
    
    ```tsx
    { provide: MiServicio, useClass: MiServicio }
    
    ```
    
2. **Valor constante**:
    
    ```tsx
    { provide: MiServicio, useValue: 'Valor estático' }
    
    ```
    
3. **Fábrica**:
    
    ```tsx
    { provide: MiServicio, useFactory: () => new MiServicio() }
    
    ```
    

---

## **6. Jerarquía de Inyectores y Ámbito de los Servicios**

Angular organiza sus inyectores en una jerarquía basada en los módulos y componentes de la aplicación:

- **Inyector raíz**:
    - Proporciona servicios definidos con `providedIn: 'root'`.
    - Los servicios están disponibles en toda la aplicación.
- **Inyectores específicos de componentes**:
    - Proporcionan servicios definidos en el nivel de componentes.
    - Los servicios solo están disponibles para ese componente y sus hijos.

**Ejemplo práctico**:

```tsx
@Injectable({
  providedIn: 'root', // Servicio disponible globalmente
})
export class ServicioGlobal { }

@Injectable()
export class ServicioLocal { }

```

Para registrar `ServicioLocal` solo para un componente:

```tsx
@Component({
  selector: 'app-componente',
  providers: [ServicioLocal],
})
export class Componente { }

```

---

## **7. Ejemplo Práctico: Creación y Uso de un Servicio**

### **Creación del Servicio**

```tsx
@Injectable({
  providedIn: 'root',
})
export class DatosService {
  private datos: string[] = [];

  agregarDato(dato: string) {
    this.datos.push(dato);
  }

  obtenerDatos(): string[] {
    return this.datos;
  }
}

```

### **Uso en un Componente**

```tsx
@Component({
  selector: 'app-datos',
  template: `
    <input [(ngModel)]="nuevoDato" placeholder="Agregar dato">
    <button (click)="agregar()">Agregar</button>
    <ul>
      <li *ngFor="let dato of obtenerDatos()">{{ dato }}</li>
    </ul>
  `,
})
export class DatosComponent {
  nuevoDato: string = '';

  constructor(private datosService: DatosService) { }

  agregar() {
    if (this.nuevoDato) {
      this.datosService.agregarDato(this.nuevoDato);
      this.nuevoDato = '';
    }
  }

  obtenerDatos() {
    return this.datosService.obtenerDatos();
  }
}

```

---

## **8. Buenas Prácticas en el Uso de Servicios**

1. **Usar `providedIn: 'root'` siempre que sea posible** para simplificar la gestión de inyectores.
2. **Seguir el principio de responsabilidad única (SRP)**: Cada servicio debe encargarse de una sola funcionalidad.
3. **Evitar lógica pesada en los componentes** y delegarla a los servicios.
4. **Testear los servicios de forma aislada** para garantizar su comportamiento.
5. **Documentar los servicios** para facilitar su comprensión y uso.

---

## **9. Conclusiones**

Los servicios y la inyección de dependencias son pilares fundamentales en Angular para desarrollar aplicaciones **modulares**, **reutilizables** y **escalables**.

### **Puntos clave aprendidos**:

- Crear servicios con lógica reutilizable.
- Inyectar servicios en componentes usando el sistema DI.
- Comprender la jerarquía de inyectores y cómo afecta el ámbito de los servicios.

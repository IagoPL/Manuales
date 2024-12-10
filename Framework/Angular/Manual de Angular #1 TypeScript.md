# **Manual de Angular: TypeScript**

## **Índice**

1. **Introducción a TypeScript**
2. **Tipos básicos en TypeScript**
3. **Definición de variables y funciones**
4. **Interfaces**
5. **Clases**
6. **Decoradores**
7. **Módulos y namespaces**
8. **Compilación de TypeScript**
9. **Herramientas y Configuración Avanzada**

---

## **1. Introducción a TypeScript**

**TypeScript** es un superconjunto de JavaScript desarrollado por Microsoft que añade características de **tipado estático** y herramientas orientadas a objetos. Angular utiliza TypeScript como su lenguaje principal, ya que proporciona **tipos**, **decoradores**, y otras características que simplifican la creación de aplicaciones robustas.

**Ventajas de TypeScript en Angular**:
- **Detección temprana de errores**: Gracias al tipado estático, los errores se detectan antes de ejecutar el código.
- **Mayor productividad**: Los editores de código, como Visual Studio Code, ofrecen autocompletado, navegación y refactorización avanzados para TypeScript.
- **Mantenimiento del código**: Facilita trabajar en proyectos grandes con equipos distribuidos.

---

## **2. Tipos básicos en TypeScript**

### **Tipos Primitivos**
- **`number`**: Para números (enteros y de punto flotante).  
  ```typescript
  let edad: number = 25;
  ```
- **`string`**: Para cadenas de texto.  
  ```typescript
  let nombre: string = "Angular";
  ```
- **`boolean`**: Para valores verdaderos o falsos.  
  ```typescript
  let activo: boolean = true;
  ```

### **Tipos Avanzados**
- **`array`**: Arreglos de elementos de un tipo específico.  
  ```typescript
  let numeros: number[] = [1, 2, 3];
  ```
- **`tuple`**: Arreglos con una longitud y tipos predefinidos.  
  ```typescript
  let coordenadas: [number, number] = [10, 20];
  ```
- **`enum`**: Conjuntos de constantes con nombre.  
  ```typescript
  enum Colores {
    Rojo,
    Verde,
    Azul,
  }
  let colorFavorito: Colores = Colores.Verde;
  ```
- **`any`**: Permite cualquier tipo. Úsalo con cuidado.  
  ```typescript
  let datos: any = "texto o número";
  ```

---

## **3. Definición de variables y funciones**

### **Definición de Variables**
- Usa `let` o `const` en lugar de `var` para declarar variables.  
  ```typescript
  let mensaje: string = "Hola TypeScript";
  const PI: number = 3.14159;
  ```

### **Definición de Funciones**
- Puedes especificar los tipos de parámetros y el tipo de retorno.
  ```typescript
  function sumar(a: number, b: number): number {
    return a + b;
  }
  ```

### **Funciones con Valores Opcionales**
- Agrega un `?` para marcar parámetros opcionales.  
  ```typescript
  function saludar(nombre?: string): string {
    return nombre ? `Hola, ${nombre}` : "Hola";
  }
  ```

---

## **4. Interfaces**

Las **interfaces** definen la estructura de un objeto, promoviendo un diseño más claro y predecible.

### **Ejemplo Básico de Interface**
```typescript
interface Persona {
  nombre: string;
  edad: number;
  esActivo?: boolean; // Propiedad opcional
}

const usuario: Persona = {
  nombre: "Juan",
  edad: 30,
};
```

### **Ventajas de las Interfaces**
- Mejora la legibilidad y mantenibilidad.
- Ayuda a evitar errores al estructurar datos.

---

## **5. Clases**

Las **clases** en TypeScript permiten crear objetos con propiedades, métodos y constructores.

### **Ejemplo de Clase**
```typescript
class Vehiculo {
  marca: string;
  modelo: string;

  constructor(marca: string, modelo: string) {
    this.marca = marca;
    this.modelo = modelo;
  }

  mostrarDetalles(): string {
    return `${this.marca} ${this.modelo}`;
  }
}

const coche = new Vehiculo("Toyota", "Corolla");
console.log(coche.mostrarDetalles());
```

### **Modificadores de Acceso**
- **`public`**: Accesible desde cualquier parte.
- **`private`**: Solo accesible dentro de la clase.
- **`protected`**: Accesible en la clase y en clases heredadas.

---

## **6. Decoradores**

Los **decoradores** son funciones que proporcionan metadatos o alteran el comportamiento de clases, métodos, propiedades, o parámetros.

### **Ejemplo de Decorador**
```typescript
function Log(target: any, propertyName: string) {
  console.log(`Propiedad decorada: ${propertyName}`);
}

class Producto {
  @Log
  nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }
}
```

### **Decoradores Comunes en Angular**
- **`@Component`**: Define un componente.
- **`@NgModule`**: Define un módulo Angular.
- **`@Injectable`**: Indica que una clase puede ser inyectada como servicio.

---

## **7. Módulos y Namespaces**

TypeScript permite organizar el código en **módulos** para dividir el proyecto en archivos reutilizables.

### **Módulos**
- Exporta declaraciones usando `export` y usa `import` para utilizarlas.  
  ```typescript
  // archivo.ts
  export const PI = 3.14159;

  // otroArchivo.ts
  import { PI } from './archivo';
  console.log(PI);
  ```

### **Namespaces**
- Agrupa código dentro de un espacio de nombres para evitar conflictos.  
  ```typescript
  namespace Utilidades {
    export function saludar(): void {
      console.log("Hola");
    }
  }
  Utilidades.saludar();
  ```

---

## **8. Compilación de TypeScript**

El código TypeScript se transpila a JavaScript antes de ejecutarse en un navegador o Node.js.

### **Comandos Básicos**
- Compilar un archivo TypeScript:
  ```bash
  tsc archivo.ts
  ```
- Compilar múltiples archivos definidos en `tsconfig.json`:
  ```bash
  tsc
  ```

### **Configuración con Angular CLI**
Angular CLI incluye un sistema de compilación integrado que convierte automáticamente TypeScript a JavaScript.

---

## **9. Herramientas y Configuración Avanzada**

### **TSLint/ESLint**
- Analiza el código TypeScript para garantizar que cumpla con las buenas prácticas.

### **Configuración de `tsconfig.json`**
- Archivo de configuración que define cómo se compila el código TypeScript.
  ```json
  {
    "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "strict": true
    }
  }
  ```

### **Integración con IDEs**
- Usa **Visual Studio Code** para aprovechar herramientas como autocompletado, refactorización y depuración.

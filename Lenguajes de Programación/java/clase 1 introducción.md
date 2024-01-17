# Clase 1: Introducción a Java - Variables y Salida de Datos

## I. Variables Básicas en Java

### 1.1. `int` (Entero)
- Representa números enteros.
- Ejemplo:
  ```java
  int edad = 25;
  ```

### 1.2. `char` (Carácter)
- Almacena un solo carácter.
- Ejemplo:
  ```java
  char letra = 'A';
  ```

### 1.3. `String` (Cadena de Caracteres)
- Almacena una secuencia de caracteres.
- Ejemplo:
  ```java
  String nombre = "Juan";
  ```

### 1.4. `boolean` (Booleano)
- Representa valores de verdad: `true` o `false`.
- Ejemplo:
  ```java
  boolean esMayorDeEdad = true;
  ```

### 1.5. `double` (Punto Flotante)
- Representa números decimales.
- Ejemplo:
  ```java
  double precio = 49.99;
  ```

## II. Comentarios en Java

### 2.1. Comentarios de Línea
- Se utilizan para agregar explicaciones en una sola línea.
- Ejemplo:
  ```java
  // Esto es un comentario de línea
  int edad = 25; // También se puede añadir al final de una línea de código
  ```

### 2.2. Comentarios de Bloque
- Para comentarios extensos o múltiples líneas.
- Ejemplo:
  ```java
  /*
    Este es un comentario de bloque.
    Se extiende por varias líneas.
  */
  ```

## III. Impresión por Pantalla

### 3.1. `System.out.print`
- Utilizado para imprimir en la misma línea.
- Ejemplo:
  ```java
  System.out.print("Hola, ");
  System.out.print("Java");
  // Salida: Hola, Java
  ```

### 3.2. `System.out.println`
- Imprime en la siguiente línea.
- Ejemplo:
  ```java
  System.out.println("Hola, ");
  System.out.println("Java");
  // Salida:
  // Hola, 
  // Java
  ```

### 3.3. Combinación de Impresión
- Uso de `+` para combinar texto y variables.
- Ejemplo:
  ```java
  String nombre = "María";
  int edad = 30;
  System.out.println("Nombre: " + nombre + ", Edad: " + edad);
  // Salida: Nombre: María, Edad: 30
  ```

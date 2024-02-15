# Manual de Programación en Java: Métodos

## I. Introducción a los Métodos

Los métodos en Java son bloques de código que realizan una tarea específica. Son fundamentales en la programación porque permiten modularizar el código, hacerlo más legible, reutilizable y fácil de mantener.

## II. Declaración y Definición de Métodos

### 1. Declaración de Métodos

La declaración de un método consta de tres partes principales:
```java
tipoDeRetorno nombreDelMetodo (lista de parametros) {
    // Cuerpo del método
}
```
- **Tipo de Retorno:** Indica el tipo de dato que el método devolverá al finalizar su ejecución. Si el método no devuelve ningún valor, se utiliza `void`.
- **Nombre del Método:** Es el identificador único del método que se utilizará para llamarlo desde otras partes del programa.
- **Lista de Parámetros:** Es una lista de variables que el método espera recibir como entrada. Pueden ser de cualquier tipo de datos y número, o pueden ser omitidos si el método no espera recibir ningún parámetro.

### 2. Definición de Métodos

La definición de un método consiste en el cuerpo del método, donde se escribe el código que realiza la tarea deseada.

### Ejemplo:

```java
public void saludar() {
    System.out.println("¡Hola! Bienvenido al curso de Java.");
}
```

## III. Parámetros y Argumentos de Métodos

### 1. Parámetros de Métodos

Los parámetros de un método son variables utilizadas para recibir valores desde fuera del método. Estos valores se utilizan dentro del método para realizar alguna operación.

### 2. Argumentos de Métodos

Los argumentos de un método son los valores reales pasados cuando se llama al método.

### Ejemplo:

```java
public void sumar(int a, int b) {
    int resultado = a + b;
    System.out.println("La suma es: " + resultado);
}
```

## IV. Retorno de Valores

### 1. Instrucción `return`

La instrucción `return` se utiliza para devolver un valor desde un método al lugar donde fue llamado.

### Ejemplo:

```java
public int sumar(int a, int b) {
    return a + b;
}
```

## V. Sobrecarga de Métodos

La sobrecarga de métodos permite tener múltiples definiciones de un método con el mismo nombre pero diferentes parámetros.

### Ejemplo:

```java
public void imprimir(String mensaje) {
    System.out.println(mensaje);
}

public void imprimir(int numero) {
    System.out.println(numero);
}
```

## VI. Recursividad

La recursividad es un concepto donde un método se llama a sí mismo para resolver un problema más pequeño.

### Ejemplo:

```java
public int factorial(int n) {
    if (n == 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
```


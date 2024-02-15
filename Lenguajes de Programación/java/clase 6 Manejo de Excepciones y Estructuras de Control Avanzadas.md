
# Manual de Programación en Java: Manejo de Excepciones y Estructuras de Control Avanzadas

## I. Introducción al Manejo de Excepciones

### ¿Qué son las Excepciones?
Las excepciones en Java son eventos que ocurren durante la ejecución de un programa y pueden interrumpir su flujo normal. Pueden ser causadas por errores en el código, condiciones imprevistas o situaciones anómalas. Ejemplos comunes de excepciones incluyen `NullPointerException`, `ArrayIndexOutOfBoundsException`, `ArithmeticException`, entre otras.

### Tipos de Excepciones
En Java, las excepciones se dividen en dos categorías principales:

1. **Excepciones Verificadas (Checked Exceptions):** Son excepciones que deben ser manejadas explícitamente por el programador. Estas excepciones son subclases de `Exception`, pero no de `RuntimeException`. Ejemplos incluyen `IOException`, `SQLException`, etc.

2. **Excepciones No Verificadas (Unchecked Exceptions):** Son excepciones que no necesitan ser manejadas explícitamente por el programador. Estas excepciones son subclases de `RuntimeException`. Ejemplos incluyen `NullPointerException`, `ArrayIndexOutOfBoundsException`, `ArithmeticException`, etc.

## II. Bloques Try-Catch

### Estructura de Try-Catch
La estructura try-catch es utilizada para manejar excepciones en Java. Consiste en un bloque try seguido de uno o más bloques catch. El código que puede lanzar una excepción se coloca dentro del bloque try, y el código para manejar la excepción se coloca dentro de uno o más bloques catch.

```java
try {
    // Código que puede lanzar una excepción
} catch (TipoDeExcepción1 e1) {
    // Manejo de la excepción TipoDeExcepción1
} catch (TipoDeExcepción2 e2) {
    // Manejo de la excepción TipoDeExcepción2
} finally {
    // Código opcional que se ejecuta siempre, independientemente de si se lanzó una excepción o no
}
```

### Ejemplo de Try-Catch
```java
try {
    int resultado = 10 / 0; // División por cero
} catch (ArithmeticException e) {
    System.out.println("Error: División por cero");
}
```

## III. Bloque Finally y Sentencia Try-With-Resources

### Bloque Finally
El bloque finally se utiliza para ejecutar código de limpieza después de un bloque try-catch, independientemente de si se produce una excepción o no. Por ejemplo, se puede utilizar para liberar recursos que se estaban utilizando en el bloque try.

```java
try {
    // Código que puede lanzar una excepción
} catch (TipoDeExcepción e) {
    // Manejo de la excepción
} finally {
    // Código de limpieza que se ejecuta siempre
}
```

### Sentencia Try-With-Resources
La sentencia try-with-resources es una característica de Java introducida en Java 7 que simplifica el manejo de recursos como archivos o conexiones de red. Permite declarar y utilizar recursos dentro de un bloque try, y garantiza que estos recursos se cierren correctamente al salir del bloque try, incluso en caso de excepción.

```java
try (BufferedReader br = new BufferedReader(new FileReader("archivo.txt"))) {
    // Código que utiliza el recurso
} catch (IOException e) {
    // Manejo de la excepción
}
```

## IV. Sentencias de Control Avanzadas

### Switch-Case
La sentencia switch-case se utiliza para tomar decisiones basadas en el valor de una expresión. Permite evaluar una expresión y ejecutar diferentes bloques de código dependiendo del valor resultante.

```java
int opcion = 2;

switch (opcion) {
    case 1:
        System.out.println("Opción 1 seleccionada");
        break;
    case 2:
        System.out.println("Opción 2 seleccionada");
        break;
    default:
        System.out.println("Opción no válida");
}
```

### Do-While
La estructura do-while se utiliza para ejecutar un bloque de código al menos una vez y luego repetirlo mientras se cumpla una condición específica.

```java
int contador = 0;

do {
    System.out.println("Contador: " + contador);
    contador++;
} while (contador < 5);
```

### For-Each
La estructura for-each se utiliza para iterar sobre elementos de una colección, como arrays o listas. Simplifica el proceso de iteración y hace que el código sea más legible.

```java
int[] numeros = {1, 2, 3, 4, 5};

for (int numero : numeros) {
    System.out.println(numero);
}
```
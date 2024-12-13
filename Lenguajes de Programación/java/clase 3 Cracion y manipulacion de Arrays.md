# Creación y Manipulación de Arrays en Java

Los arrays son estructuras de datos fundamentales en Java que permiten almacenar múltiples elementos del mismo tipo. Son útiles para organizar y procesar colecciones de datos de manera eficiente.

---

## ¿Qué es un Array?

Un **array** es una estructura que contiene un número fijo de elementos del mismo tipo. Los elementos están organizados en posiciones, llamadas **índices**, que comienzan desde 0.

---

## Declaración e Inicialización

### Declaración

```java
int[] numeros; // Declaración de un array de enteros
```

### Inicialización

1. **Inicialización directa:**

```java
int[] numeros = {1, 2, 3, 4, 5};
```

2. **Inicialización con tamaño fijo:**

```java
int[] numeros = new int[5];
numeros[0] = 10; // Asignar valores manualmente
```

---

## Acceso a Elementos

Puedes acceder a los elementos de un array mediante su índice:

```java
int[] numeros = {1, 2, 3, 4, 5};
System.out.println(numeros[0]); // Salida: 1
```

Si intentas acceder a un índice fuera del rango, obtendrás una excepción `ArrayIndexOutOfBoundsException`.

---

## Recorrido de Arrays

### Usando un bucle `for`

```java
int[] numeros = {1, 2, 3, 4, 5};
for (int i = 0; i < numeros.length; i++) {
    System.out.println("Elemento en índice " + i + ": " + numeros[i]);
}
```

### Usando un bucle `for-each`

```java
for (int numero : numeros) {
    System.out.println(numero);
}
```

---

## Arrays Multidimensionales

Un array multidimensional es un array de arrays.

### Declaración e Inicialización

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
```

### Acceso a Elementos

```java
System.out.println(matriz[0][1]); // Salida: 2
```

### Recorrido

```java
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.println("Elemento en posición (" + i + ", " + j + "): " + matriz[i][j]);
    }
}
```

---

## Métodos Útiles para Arrays

### Clase `Arrays` (Java.util)

1. **Ordenar un array:**

```java
import java.util.Arrays;

int[] numeros = {5, 3, 8, 1};
Arrays.sort(numeros);
System.out.println(Arrays.toString(numeros)); // Salida: [1, 3, 5, 8]
```

2. **Buscar en un array:**

```java
int posicion = Arrays.binarySearch(numeros, 3);
System.out.println("Posición de 3: " + posicion); // Salida: 1
```

3. **Rellenar un array:**

```java
int[] valores = new int[5];
Arrays.fill(valores, 10);
System.out.println(Arrays.toString(valores)); // Salida: [10, 10, 10, 10, 10]
```

---

## Ejemplo Completo: Matriz de Multiplicación

```java
import java.util.Scanner;

public class MatrizMultiplicacion {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduce el tamaño de la matriz:");
        int n = scanner.nextInt();

        int[][] matriz = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                matriz[i][j] = (i + 1) * (j + 1);
            }
        }

        System.out.println("Matriz de multiplicación:");
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                System.out.print(matriz[i][j] + "\t");
            }
            System.out.println();
        }
    }
}
```

---

## Conclusión

Los arrays son fundamentales para almacenar y procesar datos en Java. Dominar sus conceptos y métodos asociados es esencial para manejar colecciones de datos de forma eficiente y estructurada.

# Manual de Programación en Java: Control de Flujo y Operadores

## I. Estructuras de Control

### 1. Instrucción `if`

La instrucción `if` es fundamental para la toma de decisiones en programas Java. Permite ejecutar bloques de código basados en condiciones booleanas. Su estructura básica es la siguiente:

```java
if (condicion) {
    // Código a ejecutar si la condición es verdadera
} else {
    // Código a ejecutar si la condición es falsa
}
```

Cuando la condición dentro del `if` es verdadera, se ejecuta el bloque de código dentro de las llaves `{}`. Si la condición es falsa, se ejecuta el bloque de código dentro del `else`. Puedes anidar múltiples `if` y `else` para tomar decisiones más complejas.

#### Ejemplo:

```java
int edad = 20;

if (edad >= 18) {
    System.out.println("Eres mayor de edad");
} else {
    System.out.println("Eres menor de edad");
}
```

### 2. Operadores Lógicos

Los operadores lógicos permiten combinar condiciones para realizar evaluaciones más complejas.

- **Operador `&&` (AND):** Devuelve `true` si ambas condiciones son verdaderas.

- **Operador `||` (OR):** Devuelve `true` si al menos una de las condiciones es verdadera.

- **Operador `!` (NOT):** Invierte el valor de la condición; si es `true`, se vuelve `false`, y viceversa.

#### Ejemplo:

```java
int edad = 20;
boolean esEstudiante = true;

if (edad >= 18 && esEstudiante) {
    System.out.println("Eres mayor de edad y estudiante");
} else {
    System.out.println("No cumples ambas condiciones");
}
```

### 3. Bucles (`for` y `while`)

Los bucles permiten repetir bloques de código de manera eficiente.

#### Bucle `for`:

La estructura básica de un bucle `for` es:

```java
for (inicialización; condición; incremento) {
    // Código a repetir
}
```

- **Inicialización:** Se ejecuta una vez al principio del bucle.
- **Condición:** Se verifica antes de cada iteración; si es `true`, el bucle continúa; si es `false`, termina.
- **Incremento:** Se ejecuta después de cada iteración.

#### Ejemplo:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Número: " + i);
}
```

Este bucle imprimirá los números del 1 al 5.

#### Bucle `while`:

La estructura básica de un bucle `while` es:

```java
while (condición) {
    // Código a repetir
}
```

El bloque de código se ejecuta siempre que la condición sea `true`.

#### Ejemplo:

```java
int contador = 0;

while (contador < 3) {
    System.out.println("Contador: " + contador);
    contador++;
}
```

Este bucle `while` imprimirá el valor del contador mientras la condición `contador < 3` sea verdadera.

#### Bucle `do-while`:

Similar al bucle `while`, pero garantiza que el bloque de código se ejecute al menos una vez antes de verificar la condición.

```java
do {
    // Código a repetir
} while (condición);
```

### 4. Switch-Case

La estructura `switch` permite manejar múltiples opciones.

```java
switch (expresion) {
    case valor1:
        // Código si expresion es igual a valor1
        break;
    case valor2:
        // Código si expresion es igual a valor2
        break;
    // Otros casos
    default:
        // Código si no coincide con ninguno de los casos
}
```

La expresión dentro del `switch` es evaluada, y el control se transfiere al `case` correspondiente. El `break` evita que la ejecución continúe hacia los siguientes `case`. Si ninguno de los `case` coincide, se ejecuta el bloque de código dentro de `default`.

#### Ejemplo:

```java
int diaSemana = 3;

switch (diaSemana) {
    case 1:
        System.out.println("Lunes");
        break;
    case 2:
        System.out.println("Martes");
        break;
    // Otros casos...
    default:
        System.out.println("Día no válido");
}
```

## II. Ejemplos Adicionales

### 1. Instrucción `if` Anidada

Es posible anidar instrucciones `if` para manejar situaciones más complejas.

```java
int numero = 10;

if (numero > 0) {
    if (numero % 2 == 0) {
        System.out.println("Número positivo y par");
    } else {
        System.out.println("Número positivo e impar");
    }
} else if (numero < 0) {
    System.out.println("Número negativo");
} else {
    System.out.println("Número es cero");
}
```

Este código determina si un número es positivo, negativo, par o impar.

### 2. Operadores Ternarios

El operador ternario (`? :`) permite realizar asignaciones condicionales de manera concisa.

```java
int edad = 22;
String mensaje = (edad >= 18) ? "Eres mayor de edad" : "Eres menor de edad";
System.out.println(mensaje);
```

Este ejemplo asigna el mensaje basado en la condición de si la edad es mayor o igual a 18.

### 3. Operadores de Incremento y Decremento

Java ofrece operadores de incremento (`++`) y decremento (`--`) para modificar el valor de una variable de manera más concisa.

```java
int x = 5;
x++; // Incrementa x en 1
System.out.println(x); // Imprime 6

int y = 10;
y--; // Decrementa y en 1
System.out.println(y); // Imprime 9
```

Estos operadores son útiles para simplificar operaciones como incrementar contadores.

---

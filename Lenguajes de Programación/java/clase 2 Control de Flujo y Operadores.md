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

## III. Entrada y Salida de Datos Avanzada

### 1. **La Clase `Scanner`**

La clase `Scanner` en Java permite leer datos desde la entrada estándar (teclado) de manera más avanzada que `System.out.print`. Para utilizarla, primero necesitas importarla:

```java
import java.util.Scanner;
```

Luego, puedes crear un objeto `Scanner` y utilizar sus métodos para leer diferentes tipos de datos:

```java
Scanner scanner = new Scanner(System.in);

System.out.print("Ingrese su nombre: ");
String nombre = scanner.nextLine();

System.out.print("Ingrese su edad: ");
int edad = scanner.nextInt();

System.out.println("Hola, " + nombre + ". Tienes " + edad + " años.");
```

Este código solicita al usuario su nombre y edad y luego imprime un saludo personalizado.

### 2. **Generación de Números Aleatorios con `Random`**

La clase `Random` en Java permite generar números aleatorios. Debes importarla antes de usarla:

```java
import java.util.Random;
```

Puedes crear un objeto `Random` y utilizar sus métodos para obtener números aleatorios:

```java
Random random = new Random();

int numeroAleatorio = random.nextInt(10); // Genera un número entre 0 y 9
System.out.println("Número Aleatorio: " + numeroAleatorio);
```

Este código generará un número aleatorio entre 0 y 9 y lo imprimirá.

### 3. **Aplicación Práctica con `Scanner` y `Random`**

Vamos a crear un programa que solicita al usuario adivinar un número aleatorio. Utilizaremos tanto `Scanner` para la entrada de datos como `Random` para generar el número secreto:

```java
import java.util.Scanner;
import java.util.Random;

public class JuegoAdivinanza {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        int numeroSecreto = random.nextInt(100) + 1; // Número entre 1 y 100
        int intentos = 0;
        int intentoUsuario;

        System.out.println("¡Bienvenido al Juego de Adivinanza!");
        System.out.println("Intenta adivinar un número entre 1 y 100.");

        do {
            System.out.print("Ingresa tu intento: ");
            intentoUsuario = scanner.nextInt();
            intentos++;

            if (intentoUsuario < numeroSecreto) {
                System.out.println("Intenta un número más grande.");
            } else if (intentoUsuario > numeroSecreto) {
                System.out.println("Intenta un número más pequeño.");
            } else {
                System.out.println("¡Felicidades! Has adivinado el número en " + intentos + " intentos.");
            }

        } while (intentoUsuario != numeroSecreto);

        scanner.close();
    }
}
```

Este programa genera un número aleatorio y pide al usuario que lo adivine. Proporciona pistas sobre si el número secreto es más grande o más pequeño y cuenta los intentos. El juego continúa hasta que el usuario adivina correctamente.

---

## IV. Bucles `do-while`

Los bucles `do-while` en Java son similares a los bucles `while`, pero con una diferencia crucial: el bloque de código dentro de un bucle `do-while` se ejecuta al menos una vez, incluso si la condición es falsa. Después de cada ejecución del bloque, se verifica la condición, y si es verdadera, el bucle se repite. La estructura básica es la siguiente:

```java
do {
    // Bloque de código a repetir
} while (condición);
```

### Ejemplo de Bucle `do-while`:

Supongamos que queremos sumar los números ingresados por el usuario hasta que ingrese un número negativo. Utilizaremos un bucle `do-while` para garantizar que el usuario tenga la oportunidad de ingresar al menos un número.

```java
import java.util.Scanner;

public class SumaNumeros {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int suma = 0;
        int numero;

        do {
            System.out.print("Ingrese un número (ingrese un número negativo para salir): ");
            numero = scanner.nextInt();

            if (numero >= 0) {
                suma += numero; // Suma el número si es positivo
            }

        } while (numero >= 0);

        System.out.println("La suma de los números ingresados es: " + suma);
        scanner.close();
    }
}
```

En este ejemplo, el bucle `do-while` se ejecuta al menos una vez para solicitar al usuario que ingrese un número. Luego, verifica si el número es positivo; si lo es, lo suma al total. El bucle continúa ejecutándose hasta que el usuario ingresa un número negativo, momento en el que termina el bucle y se imprime la suma total.

### Consideraciones:

- Los bucles `do-while` son útiles cuando se desea que el bloque de código se ejecute al menos una vez, incluso si la condición es falsa desde el principio.
- Es importante tener en cuenta que, al igual que con cualquier bucle, se debe evitar la posibilidad de entrar en un bucle infinito asegurándose de que la condición eventualmente se vuelva falsa.

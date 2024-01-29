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

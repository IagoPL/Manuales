# Manejo de Excepciones en Java

El manejo de excepciones en Java es una técnica fundamental para manejar errores de manera controlada y mantener la estabilidad de las aplicaciones. Las excepciones son eventos anormales que ocurren durante la ejecución de un programa, como errores de entrada o problemas al acceder a recursos.

---

## ¿Qué es una Excepción?

Una excepción es un objeto que representa un error o un evento inesperado que interrumpe el flujo normal de ejecución de un programa.

### Jerarquía de Excepciones

- **`Throwable`:** Clase base de todas las excepciones y errores.
  - **`Exception`:** Excepciones que se pueden manejar.
    - **Checked Exceptions:** Deben manejarse explícitamente (e.g., `IOException`, `SQLException`).
    - **Unchecked Exceptions:** No requieren manejo explícito (e.g., `NullPointerException`, `ArithmeticException`).
  - **`Error`:** Problemas graves relacionados con el entorno (e.g., `OutOfMemoryError`).

---

## Estructura Básica de Manejo de Excepciones

Java proporciona las palabras clave `try`, `catch`, `finally`, y `throw` para manejar excepciones.

### `try` y `catch`

```java
try {
    // Código que puede lanzar una excepción
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    // Manejo de la excepción
    System.out.println("Error: División por cero.");
}
```

### `finally`

El bloque `finally` siempre se ejecuta, independientemente de si ocurre una excepción.

```java
try {
    int[] numeros = {1, 2, 3};
    System.out.println(numeros[5]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Error: Índice fuera de rango.");
} finally {
    System.out.println("Bloque finally ejecutado.");
}
```

### `throw`

Se utiliza para lanzar una excepción manualmente.

```java
public void verificarEdad(int edad) {
    if (edad < 18) {
        throw new IllegalArgumentException("Edad no válida");
    }
    System.out.println("Edad válida.");
}
```

### `throws`

Declara excepciones que un método puede lanzar.

```java
public void leerArchivo(String ruta) throws IOException {
    BufferedReader br = new BufferedReader(new FileReader(ruta));
    System.out.println(br.readLine());
    br.close();
}
```

---

## Tipos Comunes de Excepciones

### Checked Exceptions

Estas excepciones deben ser manejadas explícitamente en tiempo de compilación.

- **`IOException`:** Problemas al trabajar con archivos o entrada/salida.
- **`SQLException`:** Errores relacionados con bases de datos.

### Unchecked Exceptions

Estas excepciones ocurren en tiempo de ejecución y no requieren manejo explícito.

- **`NullPointerException`:** Acceso a un objeto nulo.
- **`ArithmeticException`:** Errores matemáticos, como división por cero.
- **`ArrayIndexOutOfBoundsException`:** Índice fuera del rango válido de un array.

---

## Creación de Excepciones Personalizadas

Puedes definir tus propias excepciones para manejar errores específicos de tu aplicación.

```java
public class MiExcepcion extends Exception {
    public MiExcepcion(String mensaje) {
        super(mensaje);
    }
}

public class Main {
    public static void main(String[] args) {
        try {
            lanzarExcepcion();
        } catch (MiExcepcion e) {
            System.out.println("Excepción personalizada: " + e.getMessage());
        }
    }

    public static void lanzarExcepcion() throws MiExcepcion {
        throw new MiExcepcion("Error personalizado");
    }
}
```

---

## Ejemplo Completo: Manejo de Excepciones al Leer un Archivo

```java
import java.io.*;

public class LeerArchivo {
    public static void main(String[] args) {
        try {
            BufferedReader br = new BufferedReader(new FileReader("archivo.txt"));
            String linea;
            while ((linea = br.readLine()) != null) {
                System.out.println(linea);
            }
            br.close();
        } catch (FileNotFoundException e) {
            System.out.println("Error: Archivo no encontrado.");
        } catch (IOException e) {
            System.out.println("Error: Problema al leer el archivo.");
        } finally {
            System.out.println("Operación finalizada.");
        }
    }
}
```

---

## Buenas Prácticas para el Manejo de Excepciones

1. **Especificidad:** Captura excepciones específicas en lugar de usar `Exception` genérico.
2. **Mensajes claros:** Proporciona mensajes descriptivos al lanzar excepciones.
3. **No ocultes errores:** Registra las excepciones para depuración futura.
4. **Limpieza de recursos:** Usa bloques `finally` o `try-with-resources` para liberar recursos.

---

## Conclusión

El manejo adecuado de excepciones en Java garantiza que las aplicaciones sean más robustas, predecibles y fáciles de mantener. Aplicar las buenas prácticas y utilizar excepciones personalizadas es clave para un código profesional.

```

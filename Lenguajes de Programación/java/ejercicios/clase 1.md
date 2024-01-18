## 1. Operaciones Matemáticas:
   - Declara dos números y realiza las operaciones de sumar, restar, multiplicar y dividir. Imprime los resultados.

## 2. Tu Inicial y Nombre:
   - Elige tu inicial y tu nombre. Imprime un mensaje saludándote usando estas dos piezas de información.

## 3. Eres Estudiante:
   - ¿Eres estudiante? Utiliza una variable para representar esta condición y imprime un mensaje basado en ello.

## 4. Precio de un Producto:
   - Elige el precio de un producto y realiza operaciones de aumento y disminución. Imprime el resultado.

## 5. Comentarios Explicativos:
   - Agrega comentarios a tu código para explicar qué hace cada línea. Por ejemplo, ¿qué representa una variable o por qué realizas una operación específica?

## 6. Área de un Rectángulo:
   - Declara variables para la longitud y el ancho de un rectángulo. Calcula el área e imprímela.

## 7. Tu Nombre Completo:
   - Combina tu nombre, apellido paterno y apellido materno en una sola cadena. Imprime el resultado.

## 8. ¿Eres Mayor de Edad?:
   - Utiliza una variable para representar tu edad. Imprime un mensaje diciendo si eres mayor de edad o no.

## 9. ¿Trabajas y Tienes Hijos?:
   - Utiliza variables para representar si trabajas y si tienes hijos. Imprime mensajes diferentes según estas condiciones.

## 10. Temperatura Actual:
  - Declara la temperatura actual como un número decimal. Imprime un mensaje diciendo "La temperatura es de X grados" con solo dos decimales.

---



## 1. Operaciones Matemáticas:

```java
public class OperacionesMatematicas {
    public static void main(String[] args) {
        // Declara dos números
        int num1 = 10;
        int num2 = 5;

        // Realiza operaciones matemáticas
        int suma = num1 + num2;
        int resta = num1 - num2;
        int multiplicacion = num1 * num2;
        int division = num1 / num2;

        // Imprime los resultados
        System.out.println("Suma: " + suma);
        System.out.println("Resta: " + resta);
        System.out.println("Multiplicación: " + multiplicacion);
        System.out.println("División: " + division);
    }
}
```

## 2. Tu Inicial y Nombre:

```java
public class Saludo {
    public static void main(String[] args) {
        // Elige tu inicial y tu nombre
        char inicial = 'J';
        String nombre = "Juan";

        // Imprime un mensaje saludándote
        System.out.println("Hola, " + inicial + ". " + nombre + "!");
    }
}
```

## 3. Eres Estudiante:

```java
public class EresEstudiante {
    public static void main(String[] args) {
        // Utiliza una variable para representar si eres estudiante
        boolean eresEstudiante = true;

        // Imprime un mensaje basado en la condición
        if (eresEstudiante) {
            System.out.println("¡Eres estudiante!");
        } else {
            System.out.println("No eres estudiante.");
        }
    }
}
```

## 4. Precio de un Producto:

```java
public class PrecioProducto {
    public static void main(String[] args) {
        // Elige el precio de un producto
        double precioInicial = 50.0;

        // Realiza operaciones de aumento y disminución
        double aumento = precioInicial * 0.1; // Aumento del 10%
        double disminucion = precioInicial * 0.05; // Disminución del 5%

        // Imprime el resultado
        System.out.println("Precio con aumento: " + (precioInicial + aumento));
        System.out.println("Precio con disminución: " + (precioInicial - disminucion));
    }
}
```

## 5. Comentarios Explicativos:

```java
public class ComentariosExplicativos {
    public static void main(String[] args) {
        // Agrega comentarios para explicar cada línea

        // Declara una variable para representar la cantidad de productos
        int cantidadProductos = 20;

        // Calcula el precio total multiplicando la cantidad por el precio unitario
        double precioUnitario = 15.5;
        double precioTotal = cantidadProductos * precioUnitario;

        // Imprime el resultado
        System.out.println("El precio total es: $" + precioTotal);
    }
}
```

## 6. Área de un Rectángulo:

```java
public class AreaRectangulo {
    public static void main(String[] args) {
        // Declara variables para la longitud y el ancho de un rectángulo
        double longitud = 5.0;
        double ancho = 3.0;

        // Calcula el área del rectángulo
        double area = longitud * ancho;

        // Imprime el resultado
        System.out.println("El área del rectángulo es: " + area);
    }
}
```

## 7. Tu Nombre Completo:

```java
public class NombreCompleto {
    public static void main(String[] args) {
        // Combina tu nombre, apellido paterno y apellido materno en una sola cadena
        String nombre = "Juan";
        String apellidoPaterno = "Gómez";
        String apellidoMaterno = "Pérez";

        String nombreCompleto = nombre + " " + apellidoPaterno + " " + apellidoMaterno;

        // Imprime el resultado
        System.out.println("Nombre completo: " + nombreCompleto);
    }
}
```

## 8. ¿Eres Mayor de Edad?:

```java
public class MayorDeEdad {
    public static void main(String[] args) {
        // Utiliza una variable para representar tu edad
        int edad = 25;

        // Imprime un mensaje diciendo si eres mayor de edad o no
        if (edad >= 18) {
            System.out.println("Eres mayor de edad.");
        } else {
            System.out.println("Eres menor de edad.");
        }
    }
}
```

## 9. ¿Trabajas y Tienes Hijos?:

```java
public class TrabajoYHijos {
    public static void main(String[] args) {
        // Utiliza variables para representar si trabajas y si tienes hijos
        boolean trabaja = true;
        boolean tieneHijos = false;

        // Imprime mensajes diferentes según estas condiciones
        if (trabaja) {
            System.out.println("Tienes un trabajo.");
        }

        if (tieneHijos) {
            System.out.println("Tienes hijos.");
        } else {
            System.out.println("No tienes hijos.");
        }
    }
}
```

## 10. Temperatura Actual:

```java
public class TemperaturaActual {
    public static void main(String[] args) {
        // Declara la temperatura actual como un número decimal
        double temperaturaActual = 28.75;

        // Imprime un mensaje diciendo "La temperatura es de X grados" con solo dos decimales
        System.out.printf("La temperatura es de %.2f grados\n", temperaturaActual);
    }
}
```


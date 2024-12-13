# Introducción a Java

Java es un lenguaje de programación robusto, orientado a objetos y ampliamente utilizado para desarrollar aplicaciones en diversas plataformas, desde sistemas empresariales hasta dispositivos móviles.

---

## Historia de Java

Java fue desarrollado por Sun Microsystems en 1995. Su objetivo inicial era crear un lenguaje independiente de la plataforma que pudiera ejecutarse en cualquier dispositivo gracias a la Máquina Virtual de Java (JVM). Actualmente, es mantenido por Oracle Corporation y continúa siendo uno de los lenguajes más populares en el mundo del desarrollo.

---

## Características Clave de Java

1. **Portabilidad:**

   - "Escribe una vez, ejecuta en cualquier lugar" gracias a la JVM.
2. **Orientado a Objetos:**

   - Permite modelar problemas del mundo real mediante clases y objetos.
3. **Seguro:**

   - Control estricto de tipos y manejo de memoria automático.
4. **Multihilo:**

   - Facilita la programación concurrente.
5. **Bibliotecas Ricas:**

   - Amplia variedad de APIs y librerías estándar para tareas comunes.

---

## Primer Programa en Java

El primer paso en Java es aprender a escribir y ejecutar un programa básico. A continuación, se muestra un ejemplo clásico de "Hola Mundo".

### Código: Hola Mundo

```java
// Clase principal
public class HolaMundo {
    public static void main(String[] args) {
        // Imprimir un mensaje en la consola
        System.out.println("¡Hola, Mundo!");
    }
}
```

### Pasos para Ejecutar:

1. Guarda el archivo como `HolaMundo.java`.
2. Compila el archivo con el comando:
   ```bash
   javac HolaMundo.java
   ```
3. Ejecuta el programa con:
   ```bash
   java HolaMundo
   ```

---

## Variables y Tipos de Datos

En Java, las variables son espacios en memoria que almacenan datos. Cada variable tiene un tipo de dato asociado que determina qué tipo de información puede almacenar.

### Tipos de Datos Primitivos


| Tipo      | Tamaño (bits) | Rango                                                  |
| --------- | -------------- | ------------------------------------------------------ |
| `byte`    | 8              | -128 a 127                                             |
| `short`   | 16             | -32,768 a 32,767                                       |
| `int`     | 32             | -2,147,483,648 a 2,147,483,647                         |
| `long`    | 64             | -9,223,372,036,854,775,808 a 9,223,372,036,854,775,807 |
| `float`   | 32             | Precisión simple                                      |
| `double`  | 64             | Precisión doble                                       |
| `char`    | 16             | Un carácter Unicode                                   |
| `boolean` | 1              | `true` o `false`                                       |

### Declaración y Asignación

```java
int numero = 10;
float precio = 19.99f;
boolean esActivo = true;
char inicial = 'J';
```

---

## Operaciones Básicas

Java soporta diversas operaciones matemáticas y lógicas.

### Operadores Matemáticos


| Operador | Operación      | Ejemplo |
| -------- | --------------- | ------- |
| `+`      | Suma            | `a + b` |
| `-`      | Resta           | `a - b` |
| `*`      | Multiplicación | `a * b` |
| `/`      | División       | `a / b` |
| `%`      | Módulo         | `a % b` |

### Operadores de Comparación


| Operador | Descripción      | Ejemplo  |
| -------- | ----------------- | -------- |
| `==`     | Igual a           | `a == b` |
| `!=`     | No igual a        | `a != b` |
| `>`      | Mayor que         | `a > b`  |
| `<`      | Menor que         | `a < b`  |
| `>=`     | Mayor o igual que | `a >= b` |
| `<=`     | Menor o igual que | `a <= b` |

### Operadores Lógicos


| Operador | Operación  | Ejemplo  |
| -------- | ----------- | -------- |
| `&&`     | AND lógico | `a && b` |
| `        |             | `        |
| `!`      | NOT lógico | `!a`     |

---

## Comentarios

Java soporta varios tipos de comentarios para documentar el código:

1. **Comentarios de una línea:**

   ```java
   // Este es un comentario de una línea
   ```
2. **Comentarios de múltiples líneas:**

   ```java
   /*
    Este es un comentario
    de múltiples líneas
   */
   ```
3. **Comentarios de documentación:**

   ```java
   /**
    * Método principal del programa
    */
   public static void main(String[] args) {
       // Código aquí
   }
   ```

---

## Conclusión

Esta introducción ofrece una visión general de los conceptos básicos de Java. Comprender estas nociones iniciales es fundamental para construir aplicaciones más avanzadas.

# Sintaxis y Características del Lenguaje

Scala es un lenguaje de programación moderno diseñado para expresar patrones comunes de programación de manera concisa, elegante y segura. Combina paradigmas de programación funcional y orientada a objetos, y es interoperable con Java.

---

## Características Clave de Scala

1. **Concisión y expresividad:** Scala permite escribir menos código para lograr más funcionalidad.
2. **Interoperabilidad con Java:** Scala se ejecuta en la JVM y puede usar bibliotecas de Java.
3. **Programación funcional:** Incluye características como funciones de orden superior, inmutabilidad y expresiones lambda.
4. **Orientado a objetos:** Todo en Scala es un objeto, incluso las funciones.
5. **Tipado estático:** Proporciona seguridad en tiempo de compilación con un sistema de tipos avanzado.

---

## Estructura Básica de un Programa en Scala

Scala utiliza archivos `.scala` que contienen una o más clases, objetos o funciones.

### Ejemplo de "Hola Mundo"

```scala
object HolaMundo {
  def main(args: Array[String]): Unit = {
    println("¡Hola, Mundo!")
  }
}
```

- **`object`:** Define un singleton, una clase con una única instancia.
- **`def`:** Declara un método.
- **`println`:** Imprime texto en la consola.

---

## Variables y Tipos de Datos

### Declaración de Variables

Scala tiene dos tipos principales de variables:

1. **`val`:** Inmutable (constante).

   ```scala
   val nombre: String = "Scala"
   nombre = "Otro" // Error: las variables val no pueden cambiar su valor
   ```
2. **`var`:** Mutable.

   ```scala
   var edad: Int = 25
   edad = 26 // Permitido
   ```

### Inferencia de Tipos

Scala puede inferir el tipo de una variable en muchos casos:

```scala
val mensaje = "Hola" // Scala infiere que mensaje es de tipo String
```

### Tipos de Datos Comunes


| Tipo      | Descripción                 | Ejemplo         |
| --------- | ---------------------------- | --------------- |
| `Int`     | Enteros                      | `42`            |
| `Double`  | Números de punto flotante   | `3.14`          |
| `Boolean` | Verdadero o falso            | `true`, `false` |
| `Char`    | Un carácter                 | `'a'`           |
| `String`  | Secuencia de caracteres      | "Hola Scala"    |
| `Unit`    | Equivalente a`void` en Java  | -               |
| `Any`     | Supertipo de todos los tipos | -               |

---

## Operadores

Scala soporta operadores aritméticos, de comparación y lógicos.

### Aritméticos


| Operador | Operación      | Ejemplo |
| -------- | --------------- | ------- |
| `+`      | Suma            | `a + b` |
| `-`      | Resta           | `a - b` |
| `*`      | Multiplicación | `a * b` |
| `/`      | División       | `a / b` |
| `%`      | Módulo         | `a % b` |

### Comparación


| Operador | Operación    | Ejemplo  |
| -------- | ------------- | -------- |
| `==`     | Igual a       | `a == b` |
| `!=`     | No igual a    | `a != b` |
| `>`      | Mayor que     | `a > b`  |
| `<`      | Menor que     | `a < b`  |
| `>=`     | Mayor o igual | `a >= b` |
| `<=`     | Menor o igual | `a <= b` |

---

## Estructuras de Control

### Condicionales

```scala
val edad = 20
if (edad >= 18) {
  println("Eres mayor de edad.")
} else {
  println("Eres menor de edad.")
}
```

### Bucles

1. **`while`:**

   ```scala
   var i = 0
   while (i < 5) {
     println(i)
     i += 1
   }
   ```
2. **`for`:**

   ```scala
   for (i <- 1 to 5) {
     println(i)
   }
   ```

---

## Funciones

### Declaración de Funciones

```scala
def sumar(a: Int, b: Int): Int = {
  a + b
}

println(sumar(3, 5)) // Salida: 8
```

- **`def`:** Declara una función.
- **Tipo de retorno:** Se especifica después de `:`.

### Funciones Lambda

```scala
val multiplicar = (a: Int, b: Int) => a * b
println(multiplicar(2, 3)) // Salida: 6
```

---

## Clases y Objetos

### Clase Simple

```scala
class Persona(val nombre: String, val edad: Int) {
  def saludar(): Unit = {
    println(s"Hola, soy $nombre y tengo $edad años.")
  }
}

val persona = new Persona("Juan", 30)
persona.saludar() // Salida: Hola, soy Juan y tengo 30 años.
```

### Objetos Singleton

```scala
object Utilidades {
  def saludar(): Unit = {
    println("Hola desde el objeto Utilidades.")
  }
}

Utilidades.saludar()
```

---

## Interoperabilidad con Java

Scala puede utilizar bibliotecas de Java directamente.

### Ejemplo:

```scala
import java.util.Date

val fecha = new Date()
println(fecha)
```

---

## Conclusión

Scala combina características funcionales y orientadas a objetos, permitiendo a los desarrolladores escribir código más conciso y expresivo. Con un sólido sistema de tipos y su interoperabilidad con Java, es una opción poderosa para aplicaciones modernas.

# Manual Completo de Scala: Programación Funcional

¡Bienvenido al Manual Completo de Scala! En este manual, te introduciremos en los conceptos fundamentales de la programación funcional utilizando Scala. A lo largo del texto, encontrarás ejemplos y ejercicios para ayudarte a comprender mejor los conceptos. ¡Comencemos!

## Tabla de Contenidos
1. Introducción a la Programación Funcional
2. Funciones y Lambda Expressions
3. Inmutabilidad y Efectos Secundarios
4. Colecciones y Operaciones Funcionales
5. Recursión y Tail Recursion
6. Patrones de Coincidencia (Pattern Matching)
7. Composición de Funciones
8. Currying y Partial Application
9. Manejo de Errores con Option y Try
10. Programación Asíncrona con Futures
11. Actores y Sistemas de Actores con Akka
12. Pruebas Unitarias y Property-based Testing



## 1. Introducción a la Programación Funcional
La programación funcional es un paradigma de programación que se centra en el uso de funciones y evita los cambios de estado y los efectos secundarios. En Scala, puedes combinar la programación funcional con la orientación a objetos, lo que te permite aprovechar las ventajas de ambos enfoques. Al adoptar la programación funcional, tu código será más legible, modular y fácil de razonar.

## 2. Funciones y Lambda Expressions
En Scala, las funciones son tratadas como ciudadanos de primera clase. Puedes asignar funciones a variables, pasar funciones como argumentos y devolver funciones como resultados de otras funciones. Las expresiones lambda (también conocidas como funciones anónimas) son una forma concisa de definir funciones. Puedes utilizar la sintaxis `=>` para crear expresiones lambda. Aquí hay un ejemplo:

```scala
val suma: (Int, Int) => Int = (a, b) => a + b
val resultado = suma(3, 5) // resultado = 8
```

## 3. Inmutabilidad y Efectos Secundarios
La inmutabilidad es un concepto fundamental en la programación funcional. En Scala, se fomenta el uso de objetos inmutables siempre que sea posible. Los objetos inmutables no se pueden modificar una vez creados, lo que evita problemas de estado compartido y simplifica el razonamiento sobre el código. Además, se busca minimizar los efectos secundarios, es decir, las modificaciones de estado que ocurren fuera de una función. Al reducir los efectos secundarios, tu código será más predecible y fácil de probar.

## 4. Colecciones y Operaciones Funcionales
Scala ofrece una amplia gama de colecciones inmutables, como listas, conjuntos, mapas y secuencias. Estas colecciones proporcionan una variedad de operaciones funcionales que te permiten transformar y operar en los elementos de manera eficiente. Algunas de las operaciones comunes incluyen:

- `map`: Aplica una función a cada elemento de la colección y devuelve una nueva colección con los resultados.
- `filter`: Filtra los elementos de la colección según un predicado y devuelve una nueva colección con los elementos que cumplen la condición.
- `fold` (o `reduce`): Combina los elementos de la colección utilizando una función específica y devuelve un resultado acumulado.

Aquí tienes un ejemplo:

```scala
val numeros = List(1, 2, 3, 4, 5)
val duplicados = numeros.map(_ * 2) // duplicados = List(2, 4, 6, 8, 10)
val pares = numeros.filter(_ % 2 == 0) // pares = List(2, 4)
val sumaTotal = numeros.fold(0)(_ + _) // sumaTotal = 15
```

Estas operaciones funcionales te permiten escribir código más conciso y expresivo, eliminando la necesidad de bucles explícitos.

## 5. Recursión y Tail Recursion
La recursión es una técnica común en la programación funcional. En lugar de utilizar bucles, puedes definir funciones que se ll

amen a sí mismas hasta alcanzar una condición de salida. Scala admite la optimización de la cola de recursión (tail recursion), lo que permite realizar llamadas recursivas sin generar un desbordamiento de pila. La optimización de la cola de recursión se logra utilizando la anotación `@annotation.tailrec` en la función recursiva. Aquí tienes un ejemplo de una función factorial utilizando tail recursion:

```scala
def factorial(n: Int): Int = {
  @annotation.tailrec
  def loop(x: Int, acc: Int): Int =
    if (x <= 0) acc
    else loop(x - 1, x * acc)

  loop(n, 1)
}

val resultado = factorial(5) // resultado = 120
```

La tail recursion es especialmente útil cuando necesitas realizar cálculos repetitivos o procesar estructuras de datos recursivamente.

## 6. Patrones de Coincidencia (Pattern Matching)
El patrón de coincidencia es una característica poderosa de Scala que te permite descomponer y comparar estructuras de datos de manera concisa. Puedes utilizar el patrón de coincidencia para escribir código más expresivo y manejar diferentes casos de forma elegante. Puedes hacer coincidir valores literales, tipos de datos, estructuras anidadas y más. Aquí hay un ejemplo:

```scala
def evaluar(expresion: Any): String = expresion match {
  case numero: Int if numero < 0 => "Negativo"
  case numero: Int if numero > 0 => "Positivo"
  case "cero" => "Cero"
  case _ => "Desconocido"
}

val resultado = evaluar(5) // resultado = "Positivo"
```

El patrón de coincidencia es una herramienta versátil que te permite escribir código más conciso y manejar de manera efectiva diferentes casos.

## 7. Composición de Funciones
En Scala, puedes componer funciones utilizando el operador `andThen` o el operador `compose`. La composición de funciones te permite construir funciones más complejas combinando funciones más simples. El operador `andThen` aplica una función después de otra, mientras que el operador `compose` aplica una función antes de otra. Esto te permite construir cadenas de funciones para lograr el resultado deseado. Aquí tienes un ejemplo:

```scala
val duplicarYSumar: Int => Int = (x) => x * 2
val restarUno: Int => Int = (x) => x - 1

val operacionCompuesta: Int => Int = duplicarYSumar.andThen(restarUno)
val resultado = operacionCompuesta(5) // resultado = 9
```

La composición de funciones te permite modularizar tu código y reutilizar funciones existentes de manera efectiva.

## 8. Currying y Partial Application
Currying es una técnica que consiste en convertir una función con múltiples parámetros en una secuencia de funciones de un solo parámetro. Esto permite una aplicación parcial de los argumentos, lo que significa proporcionar menos argumentos de los requeridos y obtener una función parcialmente aplicada como resultado. La partial application te permite crear nuevas funciones a partir de funciones existentes y capturar valores en ellas. Aquí tienes un ejemplo:

```scala
def suma(a: Int)(b: Int): Int = a + b

val sumaCinco: Int => Int

 = suma(5)
val resultado = sumaCinco(3) // resultado = 8
```

La currying y la partial application te permiten crear funciones más flexibles y reutilizables al capturar y parcialmente aplicar valores.

## 9. Manejo de Errores con Option y Try
Scala proporciona mecanismos para el manejo de errores de manera segura y expresiva. Puedes utilizar `Option` para representar valores que pueden estar presentes o ausentes. Un `Option` puede ser `Some(valor)` si el valor está presente, o `None` si el valor está ausente. Esto evita el manejo explícito de `null` y reduce los errores relacionados con valores nulos. Por otro lado, `Try` se utiliza para encapsular cálculos que pueden generar una excepción. Un `Try` puede ser `Success(resultado)` si la operación se realiza correctamente, o `Failure(excepcion)` si se produce una excepción. Aquí hay un ejemplo:

```scala
val resultado: Option[Int] = Option(5)
val valor: Int = resultado.getOrElse(0) // valor = 5

val division: Try[Double] = Try(10 / 0)
val resultadoDivision: Double = division.getOrElse(0.0) // resultadoDivision = 0.0
```

El uso de `Option` y `Try` te ayuda a manejar de manera segura los posibles errores y excepciones en tu código.

## 10. Programación Asíncrona con Futures
Scala ofrece la clase `Future` para trabajar con programación asíncrona y concurrencia. Puedes utilizar `Future` para ejecutar tareas en segundo plano y manejar el resultado de forma asíncrona. Un `Future` representa un valor que puede estar disponible en algún momento en el futuro. Puedes encadenar operaciones sobre `Futures` utilizando combinadores funcionales como `map`, `flatMap` y `onComplete`. Aquí hay un ejemplo:

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

def tareaLarga(): Future[String] = Future {
  Thread.sleep(2000)
  "¡Tarea completada!"
}

val futuroResultado: Future[String] = tareaLarga()

futuroResultado.onComplete {
  case Success(resultado) => println(resultado)
  case Failure(excepcion) => println(s"Error: ${excepcion.getMessage}")
}
```

La programación asíncrona con `Futures` te permite realizar operaciones concurrentes de manera eficiente y manejar los resultados de forma asíncrona.

## 11. Actores y Sistemas de Actores con Akka
Akka es un framework para construir sistemas concurrentes y distribuidos en Scala. Utiliza el modelo de actores para proporcionar un enfoque de programación escalable y resiliente. Los actores son entidades independientes que se comunican entre sí a través del intercambio de mensajes. Akka maneja la concurrencia, la escalabilidad y la tolerancia a fallos de manera transparente. Puedes crear actores, enviarles mensajes y manejar sus respuestas. Aquí hay un ejemplo básico de uso de actores con Akka:

```scala
import akka.actor.{Actor, ActorSystem, Props}

case class Saludo(mensaje: String)

class MiActor extends Actor {
  def receive: Receive = {
    case Saludo(mensaje) => println(s"¡Hola! $mensaje")
  }
}

val sistemaActores = ActorSystem("S

istemaActores")
val miActor = sistemaActores.actorOf(Props[MiActor], "MiActor")

miActor ! Saludo("¡Mundo!")
```

## 12. Pruebas Unitarias y Property-based Testing
Scala proporciona frameworks de pruebas unitarias, como ScalaTest o Specs2, que te permiten escribir y ejecutar pruebas para garantizar la corrección de tu código. También puedes utilizar pruebas basadas en propiedades (property-based testing) para generar casos de prueba automáticamente. Las pruebas basadas en propiedades permiten especificar propiedades que deben cumplirse en lugar de casos de prueba individuales. Aquí hay un ejemplo utilizando ScalaTest:

```scala
import org.scalatest._

class MiClaseSpec extends FlatSpec with Matchers {
  "MiClase" should "retornar la longitud de una cadena" in {
    val miClase = new MiClase()
    val resultado = miClase.obtenerLongitud("Hola")
    resultado should be (4)
  }
}
```

Las pruebas unitarias y las pruebas basadas en propiedades te ayudan a garantizar la calidad y la corrección de tu código.

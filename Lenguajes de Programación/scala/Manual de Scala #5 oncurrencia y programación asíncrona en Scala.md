# Manual de escala: concurrencia y programación asíncrona en Scala

La concurrencia y la programación asíncrona son conceptos fundamentales en el desarrollo de aplicaciones escalables y eficientes en Scala. En este manual, exploraremos en detalle cómo trabajar con concurrencia y programación asíncrona en Scala, incluyendo ejemplos prácticos y explicaciones detalladas.

## Tabla de contenidos
1. Introducción a la concurrencia
2. Threads y ejecución concurrente
3. Sincronización y compartición de datos
4. Problemas comunes en concurrencia
5. Introducción a la programación asíncrona
6. Futures y Promises
7. Composición y transformación de Futures
8. Trabajando con múltiples Futures
9. Manejo de errores en Futures
10. Programación reactiva con Akka

## 1. Introducción a la concurrencia

La concurrencia implica la ejecución simultánea de múltiples tareas en un programa. En Scala, se puede lograr concurrencia utilizando threads, que son unidades de ejecución independientes que pueden ejecutarse en paralelo. Esto permite que partes del programa se ejecuten de manera concurrente, mejorando la capacidad de respuesta y la eficiencia del sistema.

## 2. Threads y ejecución concurrente

Scala proporciona soporte nativo para trabajar con threads y ejecución concurrente. Puedes crear un thread utilizando la clase `Thread` y ejecutar código en paralelo. A continuación, se muestra un ejemplo básico:

```scala
import scala.concurrent.ExecutionContext.Implicits.global

val thread = new Thread(new Runnable {
  def run(): Unit = {
    // Código a ejecutar en el thread
    println("Hola desde el thread")
  }
})

thread.start()
```

En este ejemplo, creamos un nuevo thread y definimos el código a ejecutar dentro del método `run()`. Al llamar al método `start()`, el thread se inicia y el código se ejecuta en paralelo con el hilo principal.

## 3. Sincronización y compartición de datos

Cuando trabajamos con concurrencia, es importante garantizar la sincronización adecuada y evitar problemas de compartición de datos. En Scala, puedes utilizar constructores como `synchronized` y `volatile` para garantizar la sincronización y la visibilidad correcta de los datos compartidos entre threads.

```scala
var counter = 0

// Utilizando synchronized para sincronizar el acceso a counter
synchronized {
  counter += 1
}
```

En el ejemplo anterior, utilizamos el bloque `synchronized` para asegurarnos de que el acceso al contador `counter` sea sincronizado entre múltiples threads. Esto evita problemas como condiciones de carrera y asegura que la operación de incremento se realice de manera segura y sin interferencias.

## 4. Problemas comunes en concurrencia

Al trabajar con concurrencia, pueden surgir problemas como condiciones de carrera (race conditions) y deadlock. Una condición de carrera ocurre cuando el resultado de una operación depende del orden en que se ejecutan los threads. El deadlock, por otro lado, ocurre cuando dos o más threads quedan bloqueados esperando que el otro libere un recurso.

Para evitar estos problemas, Scala proporciona mecanismos como

 los `Locks` y `Conditions` para controlar la sincronización y prevenir condiciones de carrera. Estos mecanismos permiten coordinar la ejecución de múltiples threads y asegurar la integridad de los datos compartidos.

## 5. Introducción a la programación asíncrona

La programación asíncrona es una técnica que permite ejecutar tareas de forma no bloqueante, lo que evita bloquear el hilo principal y mejora la capacidad de respuesta de la aplicación. En Scala, la programación asíncrona se logra utilizando el concepto de Futures y Promises.

En lugar de esperar a que una tarea se complete de manera sincrónica, un Future representa el resultado potencial de una operación asíncrona. Puedes crear un Future utilizando la clase `Future` y asignarle una función para que se ejecute en segundo plano.

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val future: Future[String] = Future {
  // Código a ejecutar en segundo plano
  "Resultado de la operación asíncrona"
}
```

En este ejemplo, creamos un Future que realiza una operación en segundo plano y devuelve un resultado de tipo `String`. El Future se ejecutará de manera asíncrona y se completará cuando la operación haya finalizado.

## 6. Futures y Promises

Un Future representa el resultado potencial de una operación asíncrona, pero ¿cómo podemos completar un Future manualmente con un valor o una excepción? Aquí es donde entran en juego los Promises.

Un Promise es un objeto que se utiliza para completar un Future manualmente. Puedes crear un Promise utilizando la clase `Promise` y obtener el Future correspondiente utilizando el método `future` del Promise.

```scala
import scala.concurrent.{Future, Promise}
import scala.concurrent.ExecutionContext.Implicits.global

val promise: Promise[Int] = Promise[Int]
val future: Future[Int] = promise.future

// Completa el Promise con un valor
promise.success(42)
```

En este ejemplo, creamos un Promise que se utilizará para completar un Future de tipo `Int`. Obtenemos el Future correspondiente utilizando el método `future` del Promise. Luego, podemos completar el Promise utilizando los métodos `success`, `failure` o `complete` según sea necesario.

## 7. Composición y transformación de Futures

Una de las ventajas de trabajar con Futures es la capacidad de componer y transformar los resultados de manera sencilla. Scala proporciona una variedad de operadores y funciones de alto nivel para trabajar con Futures de manera eficiente.

Algunos ejemplos incluyen `map`, `flatMap` y `onComplete`. El método `map` permite aplicar una función al resultado de un Future y obtener un nuevo Future con el resultado transformado. El método `flatMap` se utiliza para encadenar múltiples Futures en secuencia, donde el resultado de uno se utiliza como entrada para el siguiente. El método `onComplete` se utiliza para manejar el resultado de un Future, ya sea un valor exitoso o una excepción.

```scala
val future: Future[Int] = Future(42)

val transformedFuture: Future[String] = future.map { result =>
  // Transformar el resultado del Future
  result.toString
}
```

En este ejemplo, creamos un Future con el valor `42` y luego aplicamos una transformación utilizando el método `map`. La función proporcionada toma el resultado del Future (

en este caso, un entero) y lo convierte en una cadena de texto utilizando el método `toString`. El resultado es un nuevo Future con el valor transformado.

## 8. Trabajando con múltiples Futures

En muchas situaciones, es necesario trabajar con múltiples Futures y combinar sus resultados. Scala proporciona funciones como `sequence`, `traverse` y `zip` para trabajar con múltiples Futures de manera eficiente.

La función `sequence` se utiliza para convertir una colección de Futures en un Future de una colección. La función `traverse` se utiliza para aplicar una función a cada elemento de una colección y obtener un Future de la colección de resultados. La función `zip` se utiliza para combinar dos Futures en un solo Future que contiene una tupla con ambos resultados.

```scala
val future1: Future[Int] = Future(1)
val future2: Future[Int] = Future(2)

val combinedFuture: Future[(Int, Int)] = for {
  result1 <- future1
  result2 <- future2
} yield (result1, result2)
```

En este ejemplo, creamos dos Futures que representan valores enteros y luego utilizamos la sintaxis de comprensión de Futures para combinarlos en un solo Future. El resultado es un Future que contiene una tupla con ambos valores.

## 9. Manejo de errores en Futures

Es esencial manejar los errores de manera adecuada al trabajar con Futures. Puedes utilizar el método `recover` para recuperar un Future fallido y proporcionar un valor alternativo en caso de error. También puedes utilizar el método `recoverWith` para recuperar un Future fallido y ejecutar otro Future en su lugar.

```scala
val future: Future[Int] = Future {
  // Alguna operación que puede fallar
  throw new Exception("Algo salió mal")
}

val recoveredFuture: Future[Int] = future.recover {
  case ex: Exception => 0 // Valor alternativo en caso de error
}
```

En este ejemplo, creamos un Future que realiza una operación que puede generar una excepción. Utilizamos el método `recover` para capturar la excepción y proporcionar un valor alternativo en caso de error. En este caso, si ocurre una excepción, el Future se recuperará y producirá un valor de `0` en lugar de propagar la excepción.

## 10. Programación reactiva con Akka

Akka es un framework de programación reactiva que proporciona un modelo de actores para construir sistemas concurrentes y distribuidos en Scala. Utilizando Akka, puedes crear sistemas escalables y resistentes a fallos, donde los actores se comunican a través del intercambio de mensajes.

La programación con actores en Akka te permite escribir código concurrente y distribuido de manera segura y eficiente. Los actores son unidades de procesamiento independientes que se comunican enviándose mensajes. Cada actor tiene su propio estado y su propia lógica de procesamiento, lo que permite una alta concurrencia y una gestión eficiente de recursos.

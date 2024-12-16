# Concurrencia y Programación Asíncrona

La concurrencia y la programación asíncrona son fundamentales para crear aplicaciones eficientes y escalables en un entorno moderno. Scala ofrece herramientas avanzadas, como `Futures`, `Promises`, y el modelo de actores, para manejar estas necesidades de manera elegante y segura.

---

## Concurrencia con `Future`

Un `Future` representa un cálculo que puede completarse en algún momento en el futuro, ya sea con un resultado exitoso o con un error.

### Creación de un `Future`

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val futuro = Future {
  Thread.sleep(1000) // Simula una operación costosa
  42
}

futuro.foreach(resultado => println(s"Resultado: $resultado"))
```

- **`ExecutionContext`:** Proporciona el contexto donde se ejecutan los `Future`. Usualmente es un pool de hilos.
- **`foreach`:** Maneja el valor completado de un `Future`.

---

## Combinación de `Futures`

Puedes combinar múltiples `Future` para manejar dependencias entre operaciones concurrentes.

### Usando `flatMap` y `map`

```scala
val futuro1 = Future { 10 }
val futuro2 = Future { 20 }

val suma = for {
  x <- futuro1
  y <- futuro2
} yield x + y

suma.foreach(resultado => println(s"Suma: $resultado"))
```

### Manejo de Errores

Usa `recover` o `recoverWith` para manejar fallos en un `Future`.

```scala
val fallo = Future {
  throw new RuntimeException("Error")
}

fallo.recover {
  case e: RuntimeException => println(s"Recuperado de: ${e.getMessage}")
}
```

---

## `Promise`

Un `Promise` es un contenedor que permite completar manualmente un `Future` asociado.

### Ejemplo de `Promise`

```scala
import scala.concurrent.Promise

val promesa = Promise[Int]()
val futuro = promesa.future

futuro.foreach(valor => println(s"Promesa cumplida con: $valor"))

promesa.success(42) // Completa el Future asociado
```

---

## Modelo de Actores con Akka

Akka es una biblioteca que implementa el modelo de actores, una forma de gestionar la concurrencia mediante el envío de mensajes entre entidades aisladas.

### Configuración Básica

```scala
import akka.actor.{Actor, ActorSystem, Props}

class Saludador extends Actor {
  def receive: Receive = {
    case "hola" => println("¡Hola!")
    case _      => println("No entiendo el mensaje.")
  }
}

val sistema = ActorSystem("SistemaEjemplo")
val saludador = sistema.actorOf(Props[Saludador], "saludador")

saludador ! "hola"
saludador ! "adiós"
```

- **`ActorSystem`:** Administra y supervisa actores.
- **`Props`:** Define cómo se crean los actores.
- **`!`:** Envía un mensaje asincrónico a un actor.

---

## Programación Asíncrona con `Await`

Puedes usar `Await` para bloquear un hilo hasta que un `Future` se complete (aunque esto no es recomendado para programación asíncrona real).

### Ejemplo:

```scala
import scala.concurrent.Await
import scala.concurrent.duration._

val futuro = Future { 42 }
val resultado = Await.result(futuro, 2.seconds)
println(s"Resultado: $resultado")
```

---

## Ejemplo Completo: Descarga Concurrente de Datos

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val urls = List("url1", "url2", "url3")

val descargas = urls.map(url => Future {
  println(s"Descargando $url")
  Thread.sleep(1000) // Simula tiempo de descarga
  s"Datos de $url"
})

val todasLasDescargas = Future.sequence(descargas)

todasLasDescargas.foreach(datos => datos.foreach(println))
```

---

## Buenas Prácticas

1. **Evita bloqueos:** Usa `map`, `flatMap`, y callbacks en lugar de `Await` para evitar bloqueos innecesarios.
2. **Gestiona errores:** Siempre maneja errores en `Future` y actores.
3. **Escalabilidad:** Usa `Akka` para aplicaciones complejas con alta concurrencia.
4. **Contexto de ejecución:** Define un `ExecutionContext` apropiado para la carga esperada.
5. **Composición:** Usa combinadores como `Future.sequence` y `Future.traverse` para manejar múltiples tareas.

---

## Conclusión

Scala proporciona herramientas potentes y flexibles para manejar concurrencia y programación asíncrona. El uso adecuado de `Futures`, `Promises`, y el modelo de actores permite escribir aplicaciones eficientes y escalables, maximizando el rendimiento en entornos concurrentes.

# Tratamiento de Errores

El tratamiento de errores es una parte esencial del desarrollo de software, ya que permite manejar situaciones inesperadas de manera controlada y predecible. Scala proporciona herramientas como `Try`, `Option`, y `Either` para trabajar con errores de manera funcional, evitando el uso excesivo de excepciones.

---

## Excepciones en Scala

Las excepciones en Scala son similares a las de Java, ya que ambos lenguajes comparten la JVM.

### Lanzar y Capturar Excepciones

```scala
try {
  val resultado = 10 / 0
  println(resultado)
} catch {
  case e: ArithmeticException => println("Error: División por cero.")
  case e: Exception           => println(s"Error general: ${e.getMessage}")
} finally {
  println("Operación finalizada.")
}
```

- **`try-catch-finally`:** Maneja excepciones de forma controlada.
- **`case`:** Captura tipos específicos de excepciones.

---

## Manejo Funcional de Errores

Scala fomenta un enfoque funcional para manejar errores mediante `Try`, `Option`, y `Either`.

### 1. `Try`

El tipo `Try` representa una operación que puede fallar. Tiene dos posibles estados:

- **`Success`:** La operación fue exitosa.
- **`Failure`:** La operación falló con una excepción.

#### Ejemplo:

```scala
import scala.util.{Try, Success, Failure}

val resultado = Try(10 / 0)

resultado match {
  case Success(valor) => println(s"Resultado: $valor")
  case Failure(e)     => println(s"Error: ${e.getMessage}")
}
```

#### Métodos Útiles de `Try`

```scala
val seguro = Try(10 / 2).getOrElse(0) // Devuelve 0 si ocurre un error
println(seguro) // Salida: 5

val mensaje = Try(10 / 0).fold(
  e => s"Falló con error: ${e.getMessage}",
  v => s"Éxito: $v"
)
println(mensaje) // Salida: Falló con error: / by zero
```

---

### 2. `Option`

El tipo `Option` representa un valor que puede estar presente (`Some`) o ausente (`None`).

#### Ejemplo:

```scala
val mapa = Map("a" -> 1, "b" -> 2)
val valor = mapa.get("a")

valor match {
  case Some(v) => println(s"Valor encontrado: $v")
  case None    => println("No se encontró el valor.")
}
```

#### Métodos Útiles de `Option`

```scala
val resultado = mapa.getOrElse("c", 0) // Devuelve 0 si no se encuentra la clave
println(resultado) // Salida: 0

val suma = mapa.get("a").map(_ + 10)
println(suma) // Salida: Some(11)
```

---

### 3. `Either`

El tipo `Either` representa un valor que puede ser uno de dos tipos: `Left` para errores y `Right` para éxitos.

#### Ejemplo:

```scala
def dividir(a: Int, b: Int): Either[String, Int] = {
  if (b == 0) Left("No se puede dividir por cero.")
  else Right(a / b)
}

dividir(10, 2) match {
  case Right(valor) => println(s"Resultado: $valor")
  case Left(error)  => println(s"Error: $error")
}
```

#### Métodos Útiles de `Either`

```scala
val resultado = dividir(10, 0).getOrElse("Operación fallida")
println(resultado) // Salida: Operación fallida

val mapResult = dividir(10, 2).map(_ * 2)
println(mapResult) // Salida: Right(10)
```

---

## Buenas Prácticas para el Tratamiento de Errores

1. **Usa `Try`, `Option` o `Either`:** Prefiere estas herramientas sobre excepciones para manejar errores predecibles.
2. **Evita `null`:** Usa `Option` en su lugar para evitar errores por referencias nulas.
3. **Maneja todas las excepciones posibles:** Captura los tipos específicos en un bloque `try-catch`.
4. **Proporciona mensajes descriptivos:** Asegúrate de que los errores sean claros y útiles.
5. **Evita silencios de errores:** Siempre registra o maneja los errores capturados.

---

## Ejemplo Completo: Cálculo Seguro

```scala
import scala.util.Try

def calcularSeguro(a: Int, b: Int): Try[Int] = Try(a / b)

val operaciones = List((10, 2), (5, 0), (8, 4))

operaciones.foreach {
  case (a, b) =>
    calcularSeguro(a, b).fold(
      e => println(s"Falló con error: ${e.getMessage}"),
      v => println(s"Resultado: $v")
    )
}
```

---

## Conclusión

Scala proporciona herramientas funcionales y declarativas para manejar errores de manera limpia y segura. Adoptar enfoques como `Try`, `Option` y `Either` permite crear código más robusto, legible y menos propenso a fallos.

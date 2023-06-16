

# Tratamiento de Errores

El tratamiento de errores es una parte esencial en el desarrollo de aplicaciones robustas. En Scala, existen varios mecanismos y patrones que te permiten manejar y controlar los errores de manera efectiva. En este manual, exploraremos en detalle el tratamiento de errores en Scala, incluyendo conceptos, técnicas y ejemplos prácticos.

## Contenido

1. Opciones (Option)
2. Manejo de Excepciones (Try, Success, Failure)
3. Patrón Either
4. Tratamiento de Errores Personalizados
5. Composición de Manejadores de Errores
6. Ejemplos Prácticos

## 1. Opciones (Option)

En Scala, la opción (Option) es un mecanismo que nos permite representar valores que pueden estar presentes o ausentes. Esto nos ayuda a evitar excepciones de valor nulo (null) y promueve un estilo de programación más seguro. A continuación, se muestra un ejemplo detallado de cómo utilizar opciones:

```scala
val nombre: Option[String] = Some("Juan")
val apellido: Option[String] = None

val nombreCompleto = nombre.getOrElse("") + " " + apellido.getOrElse("")
println(nombreCompleto) // Imprime "Juan "
```

En este ejemplo, `nombre` contiene un valor Some("Juan"), lo cual indica que el nombre está presente, mientras que `apellido` no contiene ningún valor (None), lo cual indica que el apellido está ausente. Utilizamos el método `getOrElse` para obtener los valores o un valor predeterminado (en este caso, una cadena vacía) en caso de que estén ausentes.

## 2. Manejo de Excepciones (Try, Success, Failure)

Scala proporciona la clase Try para manejar excepciones de manera más funcional. Un Try representa una operación que puede tener éxito (Success) o fallar (Failure). A continuación, se muestra un ejemplo detallado de su uso:

```scala
import scala.util.Try

def dividir(a: Int, b: Int): Try[Int] = Try(a / b)

val resultado = dividir(10, 2)
resultado match {
  case Success(valor) => println(s"Resultado: $valor")
  case Failure(excepcion) => println(s"Error: ${excepcion.getMessage}")
}
```

En este ejemplo, la función `dividir` intenta realizar la división de dos números. Si la división tiene éxito, se crea una instancia de Success con el resultado. Si ocurre una excepción, se crea una instancia de Failure con la excepción correspondiente. Luego, utilizamos el patrón `match` para manejar cada caso de manera adecuada.

## 3. Patrón Either

El patrón Either es una alternativa al uso de opciones y Try cuando necesitamos un resultado que puede ser correcto (Right) o contener un error (Left). A continuación, se muestra un ejemplo detallado:

```scala
def dividir(a: Int, b: Int): Either[String, Int] = {
  if (b != 0) Right(a / b)
  else Left("No se puede dividir por cero")
}

val resultado = dividir(10, 2)
resultado match {
  case Right(valor) => println(s"Resultado: $valor")
  case Left(error) => println(s"Error: $error")
}
```

En este ejemplo, la función `dividir` devuelve Right con el resultado si es posible realizar la división, o Left con un mensaje de error si no es posible. Utilizamos el patrón `match` para manejar cada caso de manera adecuada.

## 4. Tratamiento de Errores Personalizados

En ocasiones, es útil definir nuestros propios tipos de error personalizados para capturar información específica sobre los errores que pueden ocurrir. Podemos crear nuestras propias clases o casos de error y utilizarlos en nuestra lógica. A continuación, se muestra un ejemplo detallado:

```scala
sealed trait MiError
case object Error1 extends MiError
case class Error2(mensaje: String) extends MiError

def funcionRiesgosa(): Either[MiError, Int] = {
  // Lógica de una función que puede generar errores
}

val resultado = funcionRiesgosa()
resultado match {
  case Right(valor) => println(s"Resultado: $valor")
  case Left(Error1) => println("Error 1")
  case Left(Error2(mensaje)) => println(s"Error 2: $mensaje")
}
```

En este ejemplo, definimos el tipo sellado MiError y dos casos de error: Error1 y Error2. Luego, la función `funcionRiesgosa` devuelve Either con el resultado o uno de los errores definidos. Finalmente, utilizamos el patrón `match` para manejar cada caso según corresponda.

## 5. Composición de Manejadores de Errores

Scala nos permite componer manejadores de errores utilizando combinadores funcionales. Podemos encadenar múltiples transformaciones y manejo de errores utilizando funciones como `map`, `flatMap` y `recover`. A continuación, se muestra un ejemplo detallado:

```scala
def dividir(a: Int, b: Int): Either[String, Int] = {
  if (b != 0) Right(a / b)
  else Left("No se puede dividir por cero")
}

val resultado = for {
  x <- dividir(10, 2)
  y <- dividir(x, 0)
  z <- dividir(y, 5)
} yield z

resultado match {
  case Right(valor) => println(s"Resultado: $valor")
  case Left(error) => println(s"Error: $error")
}
```

En este ejemplo, utilizamos un enfoque de composición de manejo de errores utilizando el operador `for`. Dividimos 10 por 2, luego dividimos el resultado por 0 (generando un error) y finalmente dividimos el resultado por 5. Si ocurre algún error en cualquiera de las divisiones, se propagará a través del `for` y el resultado final será un Left con el mensaje de error correspondiente.

## 6. Ejemplos Prácticos

Aquí tienes algunos ejemplos prácticos donde puedes aplicar los conceptos de tratamiento de errores en Scala:

- Validación de formularios: Utiliza opciones, Try o Either para validar los campos de un formulario y mostrar mensajes de error si los datos ingresados son incorrectos.
- Acceso a servicios externos: Maneja errores de conexión, errores de autenticación o respuestas incorrectas al interactuar con servicios externos, como bases de datos o APIs.
- Cálculos financieros: Utiliza opciones, Try o Either para manejar situaciones como división por cero, números negativos o condiciones inválidas en cálculos financieros.

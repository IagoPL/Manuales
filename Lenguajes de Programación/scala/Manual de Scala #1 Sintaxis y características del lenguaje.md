# Manual de Scala: Sintaxis y características del lenguaje

## Introducción a Scala
Scala es un lenguaje de programación moderno que combina la programación orientada a objetos y la programación funcional. En este manual, te guiaremos a través de los conceptos fundamentales de la sintaxis y las características del lenguaje Scala, desde los conceptos básicos hasta los más avanzados. Aprenderás a escribir código Scala conciso y expresivo, y se proporcionarán ejemplos para ayudarte a comprender y practicar cada concepto.

## Tabla de contenido
1. Variables y tipos de datos
2. Funciones
3. Clases y objetos
4. Herencia y polimorfismo
5. Patrones de coincidencia (Pattern matching)
6. Colecciones y operaciones
7. Expresiones lambda
8. Inferencia de tipos
9. Control de flujo
10. Excepciones

## 1. Variables y tipos de datos
En Scala, las variables se definen utilizando la palabra clave `var` para variables mutables y `val` para variables inmutables. Además, Scala es un lenguaje con inferencia de tipos, lo que significa que no siempre es necesario declarar explícitamente el tipo de una variable. Veamos algunos ejemplos:

```scala
// Variables mutables
var edad: Int = 25
edad = 30

// Variables inmutables
val nombre: String = "Juan"
val pi: Double = 3.1416
```

En el ejemplo anterior, `edad` es una variable mutable que puede ser modificada después de su declaración, mientras que `nombre` y `pi` son variables inmutables que no pueden cambiar su valor después de la asignación inicial.

## 2. Funciones
Las funciones en Scala se definen utilizando la palabra clave `def`. Puedes especificar el tipo de retorno de la función, así como los tipos de los parámetros, aunque en muchos casos Scala puede inferirlos automáticamente. Aquí tienes un ejemplo:

```scala
def suma(a: Int, b: Int): Int = {
  return a + b
}

val resultado = suma(5, 3) // resultado = 8
```

En este ejemplo, definimos una función llamada `suma` que toma dos parámetros enteros (`a` y `b`) y devuelve su suma. La función se utiliza luego para sumar los valores 5 y 3, almacenando el resultado en la variable `resultado`.

## 3. Clases y objetos
Scala es un lenguaje orientado a objetos, por lo que puedes definir clases y objetos. Las clases son plantillas para crear objetos, mientras que los objetos son instancias únicas de una clase. Aquí tienes un ejemplo:

```scala
class Persona(nombre: String, edad: Int) {
  def saludar(): Unit = {
    println(s"Hola, mi nombre es $nombre y tengo $edad años.")
  }
}

val persona = new Persona("Ana", 35)
persona.saludar() // Imprime: "Hola, mi nombre es Ana y tengo 35 años."
```

En este ejemplo, definimos una clase `Persona` con dos parámetros: `nombre` y `edad`. La clase tiene un método `saludar` que imprime un

 saludo con el nombre y la edad de la persona. Luego, creamos una instancia de la clase `Persona` llamada `persona` con los valores "Ana" y 35, y llamamos al método `saludar()` en esa instancia.

## 4. Herencia y polimorfismo
Scala admite la herencia de clases utilizando la palabra clave `extends` y el polimorfismo mediante la sobrescritura de métodos. Aquí tienes un ejemplo:

```scala
class Animal {
  def hacerSonido(): Unit = {
    println("Haciendo sonido...")
  }
}

class Perro extends Animal {
  override def hacerSonido(): Unit = {
    println("Guau guau!")
  }
}

val perro = new Perro()
perro.hacerSonido() // Imprime: "Guau guau!"
```

En este ejemplo, tenemos una clase base `Animal` con un método `hacerSonido()`. Luego, creamos una clase `Perro` que extiende la clase `Animal` y sobrescribe el método `hacerSonido()`. Al crear una instancia de la clase `Perro` y llamar al método `hacerSonido()`, se imprimirá "Guau guau!" en la consola.

## 5. Patrones de coincidencia (Pattern matching)
Los patrones de coincidencia en Scala permiten hacer coincidir el valor de una variable con diferentes casos y ejecutar diferentes acciones según el caso. Aquí tienes un ejemplo:

```scala
val dia = 3

dia match {
  case 1 => println("Lunes")
  case 2 => println("Martes")
  case 3 => println("Miércoles")
  case _ => println("Día no válido")
}
```

En este ejemplo, utilizamos el patrón de coincidencia para comparar el valor de la variable `dia` con diferentes casos. Si `dia` es igual a 1, se imprimirá "Lunes"; si es igual a 2, se imprimirá "Martes"; si es igual a 3, se imprimirá "Miércoles"; y en cualquier otro caso, se imprimirá "Día no válido".

## 6. Colecciones y operaciones
Scala ofrece una variedad de colecciones inmutables, como listas, conjuntos y mapas. Puedes realizar diferentes operaciones en estas colecciones utilizando métodos como `map`, `filter` y `fold`. Aquí tienes un ejemplo:

```scala
val numeros = List(1, 2, 3, 4, 5)

val duplicados = numeros.map(_ * 2) // [2, 4, 6, 8, 10]

val pares = numeros.filter(_ % 2 == 0) // [2, 4]

val sumaTotal = numeros.fold(0)(_ + _) // 15
```

En este ejemplo, tenemos una lista de números y utilizamos diferentes métodos de colección para realizar operaciones en ella. `map` se utiliza para duplicar cada número, `filter` para filtrar solo los números pares y `fold` para obtener la suma total de los números.

### 7. Expresiones lambda
Las expresiones lambda en Scala te permiten definir funciones anónimas de forma concisa. Puedes utilizar las expresiones lambda en combinación con métodos de orden superior, como `map` y `filter`. Aquí tienes un ejemplo:

```scala
val numeros = List(1, 2, 3, 4, 5)

val

 duplicados = numeros.map(numero => numero * 2) // [2, 4, 6, 8, 10]

val pares = numeros.filter(numero => numero % 2 == 0) // [2, 4]
```

En este ejemplo, utilizamos expresiones lambda para definir funciones anónimas en los métodos `map` y `filter`. La expresión lambda `numero => numero * 2` duplica cada número en la lista, y la expresión lambda `numero => numero % 2 == 0` filtra los números pares.

## 8. Inferencia de tipos
Scala cuenta con inferencia de tipos, lo que significa que el compilador puede deducir el tipo de una variable según el contexto. No siempre es necesario especificar explícitamente el tipo de una variable. Aquí tienes un ejemplo:

```scala
val edad = 25 // El tipo de edad se infiere como Int automáticamente
```

En este ejemplo, declaramos una variable `edad` sin especificar explícitamente su tipo. El compilador infiere que `edad` es de tipo `Int` basándose en el valor asignado (25).

## 9. Control de flujo
En Scala, puedes utilizar las estructuras de control de flujo comunes, como `if-else` y `for`, para controlar el flujo de ejecución de tu programa. Aquí tienes un ejemplo:

```scala
val edad = 20

if (edad >= 18) {
  println("Eres mayor de edad")
} else {
  println("Eres menor de edad")
}

for (i <- 1 to 5) {
  println(i)
}
```

En este ejemplo, utilizamos una declaración `if-else` para imprimir un mensaje dependiendo de la edad. Si la edad es mayor o igual a 18, se imprime "Eres mayor de edad"; de lo contrario, se imprime "Eres menor de edad". También utilizamos un bucle `for` para imprimir los números del 1 al 5.

## 10. Excepciones
En Scala, puedes manejar excepciones utilizando bloques `try-catch` y `finally`. También puedes definir tus propias excepciones extendiendo la clase `Exception`. Aquí tienes un ejemplo:

```scala
try {
  val resultado = 10 / 0
} catch {
  case e: ArithmeticException => println("Error aritmético: " + e.getMessage)
} finally {
  println("Finalizando programa")
}
```

En este ejemplo, realizamos una operación de división por cero dentro de un bloque `try`. Si se produce una excepción `ArithmeticException`, el bloque `catch` capturará la excepción y se imprimirá un mensaje de error. El bloque `finally` se ejecutará siempre, independientemente de si se produce una excepción o no.

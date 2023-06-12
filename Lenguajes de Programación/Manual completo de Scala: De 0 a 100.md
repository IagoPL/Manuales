# Manual completo de Scala: De 0 a 100

## Índice

1. Introducción a Scala
2. Fundamentos de programación en Scala
3. Estructuras de control
4. Funciones en Scala
5. Colecciones en Scala
6. Programación orientada a objetos en Scala
7. Patrones de diseño en Scala
8. Concurrencia y paralelismo en Scala
9. Programación funcional en Scala
10. Interoperabilidad con Java
11. Desarrollo web con Scala
12. Aplicaciones de Scala en Big Data

---

## 1. Introducción a Scala

### 1.1. ¿Qué es Scala?
Scala es un lenguaje de programación moderno, orientado a objetos y funcional que se ejecuta en la máquina virtual de Java (JVM). Combina elementos de la programación orientada a objetos con características de programación funcional, lo que lo hace flexible y potente.

### 1.2. Instalación de Scala
Aquí se detallan los pasos para instalar Scala en diferentes sistemas operativos. Se proporcionan ejemplos para Windows, macOS y Linux.

#### 1.2.1. Instalación en Windows
Pasos para instalar Scala en Windows:

1. Descarga el instalador de Scala desde el sitio oficial.
2. Ejecuta el instalador y sigue las instrucciones del asistente.
3. Configura las variables de entorno necesarias.
4. Verifica la instalación ejecutando `scala -version` en la línea de comandos.

#### 1.2.2. Instalación en macOS
Pasos para instalar Scala en macOS:

1. Abre una terminal.
2. Instala Homebrew si aún no lo tienes instalado: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Instala Scala usando Homebrew: `brew install scala`
4. Verifica la instalación ejecutando `scala -version` en la terminal.

#### 1.2.3. Instalación en Linux
Pasos para instalar Scala en Linux (Ubuntu):

1. Abre una terminal.
2. Actualiza los paquetes del sistema: `sudo apt update`
3. Instala Scala: `sudo apt install scala`
4. Verifica la instalación ejecutando `scala -version` en la terminal.

### 1.3. Entorno de desarrollo integrado (IDE)
Scala se puede programar utilizando diferentes IDEs. A continuación, se presentan algunos IDEs populares y cómo configurarlos para trabajar con Scala.

#### 1.3.1. IntelliJ IDEA
IntelliJ IDEA es uno de los IDEs más populares para desarrollar en Scala. Sigue estos pasos para configurar IntelliJ IDEA para trabajar con Scala:

1. Descarga e instala IntelliJ IDEA desde el sitio oficial.
2. Abre IntelliJ IDEA y crea un nuevo proyecto.
3. Selecciona "Scala" como tipo de proyecto.
4. Configura las dependencias y bibliotecas necesarias.
5. Comienza a programar en Scala en IntelliJ IDEA.

#### 1.3.2. Eclipse
Eclipse también es un IDE comúnmente utilizado para programar en Scala. Sigue estos pasos para configurar Eclipse para trabajar con Scala:

1. Descarga e instala Eclipse desde el sitio oficial.
2. Abre Eclipse y crea un nuevo proyecto.
3. Configura las dependencias y bibliotecas necesarias para Scala.
4

. Comienza a programar en Scala en Eclipse.

---

## 2. Fundamentos de programación en Scala

### 2.1. Sintaxis básica
Scala tiene una sintaxis concisa y expresiva. Aquí se introducen los elementos fundamentales de la sintaxis de Scala, como variables, tipos de datos, operadores y estructuras básicas.

Ejemplo de declaración de una variable en Scala:

```scala
val nombre: String = "Juan"
```

### 2.2. Tipos de datos
Scala es un lenguaje de programación con un sistema de tipos estático. Aquí se describen los tipos de datos básicos en Scala y cómo trabajar con ellos.

Ejemplo de declaración de un entero y una cadena en Scala:

```scala
val edad: Int = 25
val nombre: String = "Juan"
```

### 2.3. Operadores
Scala proporciona una variedad de operadores para realizar operaciones aritméticas, lógicas y de comparación. Aquí se detallan los operadores más comunes y su uso en Scala.

Ejemplo de uso de operadores en Scala:

```scala
val suma: Int = 5 + 3
val esMayor: Boolean = 10 > 5
val concatenacion: String = "Hola" + " Mundo"
```

### 2.4. Estructuras de control
Scala ofrece estructuras de control como condicionales y bucles para controlar el flujo de ejecución de un programa. Aquí se explican las estructuras de control más utilizadas en Scala y se proporcionan ejemplos de uso.

Ejemplo de uso de un condicional `if` en Scala:

```scala
val edad: Int = 20

if (edad >= 18) {
  println("Eres mayor de edad")
} else {
  println("Eres menor de edad")
}
```

---

### 2.5. Bucles
Scala proporciona varias opciones para realizar bucles, como `while`, `do-while` y `for`. A continuación, se muestra un ejemplo de uso de un bucle `for` en Scala:

```scala
for (i <- 1 to 5) {
  println(s"El valor de i es: $i")
}
```

### 2.6. Funciones
Las funciones son bloques de código reutilizables que realizan una tarea específica. En Scala, se pueden definir funciones utilizando la palabra clave `def`. Aquí se muestra un ejemplo de una función que suma dos números en Scala:

```scala
def sumar(a: Int, b: Int): Int = {
  a + b
}

val resultado: Int = sumar(3, 4)
println(s"El resultado de la suma es: $resultado")
```

### 2.7. Manejo de excepciones
En Scala, se puede manejar el manejo de excepciones utilizando bloques `try-catch`. Aquí se muestra un ejemplo de cómo manejar una excepción en Scala:

```scala
try {
  val resultado = 10 / 0
} catch {
  case e: ArithmeticException => println("Error: división por cero")
}
```

---

## 3. Estructuras de control

### 3.1. Condicionales
Scala ofrece condicionales como `if-else`, `match` y `when` para controlar el flujo de ejecución en función de condiciones. A continuación, se muestra un ejemplo de uso de la estructura `match` en Scala:

```scala
val x: Int = 5

val resultado = x match {
  case 1 => "Uno"
  case 2 => "Dos"
  case _ => "Otro número"
}

println(resultado)
```

### 3.2. Bucles
Además de los bucles `while` y `do-while`, Scala también ofrece la estructura `for` para iterar sobre elementos. Aquí se muestra un ejemplo de uso de un bucle `for` en Scala:

```scala
val lista = List(1, 2, 3, 4, 5)

for (elemento <- lista) {
  println(elemento)
}
```

### 3.3. Control de flujo avanzado
Scala proporciona características avanzadas de control de flujo, como las expresiones `yield`, `break` y `continue`. A continuación, se muestra un ejemplo de uso de la expresión `yield` en Scala:

```scala
val lista = List(1, 2, 3, 4, 5)

val resultado = for (elemento <- lista) yield {
  elemento * 2
}

println(resultado)
```

---

## 4. Funciones en Scala

### 4.1. Definición de funciones
En Scala, se pueden definir funciones utilizando la palabra clave `def`. Las funciones pueden tener parámetros de entrada y un tipo de retorno opcional. Aquí se muestra un ejemplo de cómo definir una función en Scala:

```scala
def suma(a: Int, b: Int): Int = {
  a + b
}

val resultado = suma(3, 4)
println(resultado)
```

### 4.2. Funciones de orden superior
Scala admite funciones de orden superior, que son funciones que pueden recibir otras funciones como parámetros o devolver funciones como resultado. Aquí se muestra un ejemplo de una función de orden superior en Scala:

```scala
def aplic

arOperacion(a: Int, b: Int, operacion: (Int, Int) => Int): Int = {
  operacion(a, b)
}

val resultado = aplicarOperacion(3, 4, (a, b) => a + b)
println(resultado)
```

### 4.3. Funciones anónimas
Scala permite definir funciones anónimas utilizando la sintaxis `=>`. Estas funciones no tienen un nombre explícito y se pueden pasar como argumentos a otras funciones. A continuación, se muestra un ejemplo de una función anónima en Scala:

```scala
val multiplicarPorDos = (x: Int) => x * 2

val resultado = multiplicarPorDos(5)
println(resultado)
```

---

## 5. Colecciones en Scala

### 5.1. Listas
Las listas son colecciones inmutables en Scala que almacenan elementos ordenados. Aquí se muestra un ejemplo de cómo trabajar con listas en Scala:

```scala
val lista = List(1, 2, 3, 4, 5)

// Acceder a elementos
val primerElemento = lista.head
val ultimoElemento = lista.last

// Agregar elementos
val nuevaLista = lista :+ 6

// Recorrer la lista
for (elemento <- lista) {
  println(elemento)
}
```

### 5.2. Conjuntos
Los conjuntos en Scala son colecciones que no permiten elementos duplicados y no tienen un orden específico. Aquí se muestra un ejemplo de cómo trabajar con conjuntos en Scala:

```scala
val conjunto = Set(1, 2, 3, 4, 5)

// Verificar pertenencia
val contieneTres = conjunto.contains(3)

// Agregar elementos
val nuevoConjunto = conjunto + 6

// Recorrer el conjunto
for (elemento <- conjunto) {
  println(elemento)
}
```

### 5.3. Mapas
Los mapas en Scala son colecciones que almacenan pares clave-valor. Cada clave en un mapa es única y se utiliza para acceder al valor correspondiente. Aquí se muestra un ejemplo de cómo trabajar con mapas en Scala:

```scala
val mapa = Map("clave1" -> "valor1", "clave2" -> "valor2")

// Acceder a valores
val valor1 = mapa("clave1")

// Agregar pares clave-valor
val nuevoMapa = mapa + ("clave3" -> "valor3")

// Recorrer el mapa
for ((clave, valor) <- mapa) {
  println(s"Clave: $clave, Valor: $valor")
}
```

---

## 6. Programación orientada a objetos en Scala

### 6.1. Clases y objetos
En Scala, se pueden definir clases utilizando la palabra clave `class`. Los objetos se crean a partir de estas clases utilizando la palabra clave `new`. Aquí se muestra un ejemplo de cómo definir una clase y crear objetos en Scala:

```scala
class Persona(nombre: String, edad: Int) {
  def saludar(): Unit = {
    println(s"Hola, mi nombre es $nombre y tengo $edad años.")
  }
}

val persona1 = new Persona("Juan", 30)
persona1.saludar()
```

### 6.2. Herencia
Scala permite la herencia entre clases utilizando la palabra clave `extends`. Una clase puede heredar atributos y métodos de una clase base. Aquí se muestra un ejemplo de cómo utilizar la herencia en Scala:

```scala
class Animal(nombre: String) {
  def comer(): Unit = {
    println(s"$nombre está comiendo.")
  }
}

class Perro(nombre: String) extends Animal(nombre) {
  def ladrar(): Unit = {
    println("¡Guau, guau!")
  }
}

val perro = new Perro("Fido")
perro.comer()
perro.ladrar()
```

### 6.3. Traits
Los traits en Scala son unidades de código reutilizables que pueden mezclarse en una clase utilizando la palabra clave `with`. Los traits pueden contener métodos y atributos que pueden ser utilizados por las clases que los mezclan. Aquí se muestra un ejemplo de cómo utilizar traits en Scala:

```scala
trait Volador {
  def volar(): Unit = {
    println("Estoy volando.")
  }
}

class Ave(nombre: String) extends Animal(nombre) with Volador {
  // Clase Ave hereda de Animal y mezcla el trait Volador
}

val ave = new Ave("Gaviota")
ave.comer()
ave.volar()
```

---

## 7. Patrones de diseño en Scala

### 7.1. Patrón de diseño Singleton
El patrón Singleton se utiliza para garantizar que una clase solo tenga una instancia y proporcionar un punto de acceso global a dicha instancia. En Scala, se puede implementar utilizando el objeto companion de una clase. Aquí se muestra un ejemplo de cómo implementar el patrón Singleton en Scala:

```scala
object MiSingleton {
  def metodoSingleton(): Unit = {
    println("Este es un método del Singleton.")
  }
}

MiSingleton.metodoSingleton()
```

### 7.2. Patrón de diseño Builder
El patrón Builder se utiliza para construir objetos complejos paso a paso. En Scala, se puede implementar utilizando una combinación de clases y objetos compañeros. Aquí se muestra un ejemplo de cómo implementar el patrón Builder en Scala:

```scala
class Producto(val atributo1: String, val atributo2: Int, val atributo3: Boolean)

class ProductoBuilder {
  private var atributo1: String = ""
  private var atributo2: Int = 0
  private var atributo3: Boolean = false

  def withAtributo1(value: String): ProductoBuilder = {
    atributo1 = value
    this
  }

  def withAtributo2(value: Int): ProductoBuilder = {
    atributo2 = value
    this
  }

  def withAtributo3(value: Boolean): ProductoBuilder = {
    atributo3 = value
    this
  }

  def build(): Producto = {
    new Producto(atributo1, atributo2, atributo3)
  }
}

val producto = new ProductoBuilder()
  .withAtributo1("valor1")
  .withAtributo2(2)
  .withAtributo3(true)
  .build()
```

### 7.3. Patrón de diseño Decorator
El patrón Decorator se utiliza para añadir funcionalidad adicional a un objeto de forma dinámica. En Scala, se puede implementar utilizando composición y herencia de traits. Aquí se muestra un ejemplo de cómo implementar el patrón Decorator en Scala:

```scala
trait Componente {
  def operacion(): Unit
}

class ComponenteConcreto extends Componente {
  def operacion(): Unit = {
    println("Operación en el componente concreto.")
  }
}

class Decorador(componente: Componente) extends Componente {
  def operacion(): Unit = {
    println("Operación en el decorador antes de llamar al componente.")
    componente.operacion()
    println("Operación en el decorador después de llamar al componente.")
  }
}

val componente = new ComponenteConcreto()
val decorador = new Decorador(componente)
decorador.operacion()
```

---
## 8. Concurrencia y paralelismo en Scala

### 8.1. Hilos y concurrencia básica
Scala proporciona soporte para la programación concurrente utilizando hilos y concurrencia básica. Aquí se muestra un ejemplo de cómo crear y ejecutar hilos en Scala:

```scala
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

val future: Future[Unit] = Future {
  // Código a ejecutar de forma asíncrona
  println("Ejecución en un hilo separado")
}

// Esperar a que el futuro se complete
future.onComplete {
  case _ => println("El futuro se ha completado")
}
```

### 8.2. Programación asíncrona con Futures
Scala ofrece la clase `Future` para facilitar la programación asíncrona y el manejo de resultados futuros. Aquí se muestra un ejemplo de cómo utilizar `Future` para realizar una operación asíncrona:

```scala
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

def operacionAsincrona(): Future[String] = Future {
  // Simular una operación que lleva tiempo
  Thread.sleep(2000)
  "Resultado de la operación asíncrona"
}

val futuro: Future[String] = operacionAsincrona()

futuro.onComplete {
  case Success(resultado) => println(s"Resultado: $resultado")
  case Failure(excepcion) => println(s"Error: ${excepcion.getMessage}")
}
```

### 8.3. Paralelismo con Futures y paralel collections
Scala permite realizar operaciones en paralelo utilizando `Futures` y `paralel collections`. Aquí se muestra un ejemplo de cómo utilizar `paralel collections` para procesar una lista de elementos en paralelo:

```scala
import scala.collection.parallel.CollectionConverters._

val lista = (1 to 10).toList

val resultadoParalelo = lista.par.map { elemento =>
  // Operación a realizar en paralelo
  elemento * 2
}

println(resultadoParalelo)
```

---

## 9. Programación funcional en Scala

### 9.1. Funciones de orden superior
Scala admite funciones de orden superior, que son funciones que pueden recibir otras funciones como parámetros o devolver funciones como resultado. Aquí se muestra un ejemplo de una función de orden superior en Scala:

```scala
def aplicarOperacion(a: Int, b: Int, operacion: (Int, Int) => Int): Int = {
  operacion(a, b)
}

val suma = (a: Int, b: Int) => a + b
val resta = (a: Int, b: Int) => a - b

val resultadoSuma = aplicarOperacion(3, 4, suma)
val resultadoResta = aplicarOperacion(3, 4, resta)

println(resultadoSuma) // Output: 7
println(resultadoResta) // Output: -1
```

### 9.2. Inmutabilidad y estructuras de datos inmutables
En Scala, se fomenta el uso de la inmutabilidad y las estructuras de datos inmutables para evitar efectos secundarios y crear programas más seguros y concisos. Aquí se muestra un ejemplo de cómo trabajar con estructuras de datos inmutables en Scala:

```scala
val lista = List(1, 2, 3, 4, 5)

val nuevaLista = lista :+ 6

println(lista) // Output: List(1, 2, 3, 4, 5)
println(nuevaLista) // Output: List(1, 2, 3, 4, 5, 6)
```

### 9.3. Funciones recursivas
Scala permite la creación de funciones recursivas, donde una función se llama a sí misma dentro de su propia definición. Aquí se muestra un ejemplo de una función recursiva para calcular el factorial de un número en Scala:

```scala
def factorial(n: Int): Int = {
  if (n <= 0)
    1
  else
    n * factorial(n - 1)
}

val resultado = factorial(5)
println(resultado) // Output: 120
```

---

## 11. Desarrollo web con Scala

### 11.1. Frameworks de desarrollo web en Scala
Scala cuenta con varios frameworks de desarrollo web que facilitan la creación de aplicaciones web robustas y escalables. Algunos de los frameworks más populares son:

- Play Framework: Un framework web completo y escalable que sigue el modelo de arquitectura MVC (Modelo-Vista-Controlador).
- Akka HTTP: Un framework basado en el modelo de actores de Akka que proporciona una alta escalabilidad y rendimiento para aplicaciones web.
- Scalatra: Un framework ligero y minimalista que permite crear aplicaciones web de forma sencilla y rápida.

### 11.2. Creación de rutas y controladores
En los frameworks de desarrollo web en Scala, las rutas se definen para mapear las URL a los controladores correspondientes. Aquí se muestra un ejemplo de cómo definir rutas y controladores en Play Framework:

```scala
// Archivo routes.conf
GET     /home       controllers.HomeController.index()
POST    /login      controllers.AuthController.login()
```

```scala
// HomeController.scala
package controllers

import play.api.mvc._

class HomeController extends Controller {
  def index(): Action[AnyContent] = Action {
    Ok("Página de inicio")
  }
}
```

### 11.3. Plantillas y vistas
En los frameworks de desarrollo web en Scala, se utilizan plantillas y vistas para generar contenido HTML dinámico. Aquí se muestra un ejemplo de cómo utilizar plantillas en Play Framework utilizando el motor de plantillas Twirl:

```scala
// Archivo index.scala.html
@(nombre: String)

<!DOCTYPE html>
<html>
<head>
  <title>Página de inicio</title>
</head>
<body>
  <h1>Bienvenido, @nombre!</h1>
</body>
</html>
```

```scala
// HomeController.scala
package controllers

import play.api.mvc._
import views.html

class HomeController extends Controller {
  def index(): Action[AnyContent] = Action {
    val nombre = "Juan"
    Ok(views.html.index(nombre))
  }
}
```

---
## 12. Aplicaciones en Big Data con Scala

### 12.1. Procesamiento de datos con Apache Spark
Scala es un lenguaje ampliamente utilizado en el ecosistema de Apache Spark para el procesamiento de datos a gran escala. Puedes utilizar Scala para escribir consultas y transformaciones en Spark. Aquí se muestra un ejemplo de cómo contar las palabras en un archivo utilizando Spark en Scala:

```scala
import org.apache.spark.{SparkConf, SparkContext}

val conf = new SparkConf().setAppName("Contador de palabras").setMaster("local[*]")
val sc = new SparkContext(conf)

val archivo = sc.textFile("ruta/al/archivo.txt")
val palabras = archivo.flatMap(_.split(" "))
val conteo = palabras.countByValue()

conteo.foreach(println)

sc.stop()
```

### 12.2. Procesamiento de datos con Apache Kafka
Scala también se utiliza en conjunto con Apache Kafka para el procesamiento de datos en tiempo real y la construcción de pipelines de streaming. Puedes utilizar Scala para consumir y procesar eventos de un topic en Kafka. Aquí se muestra un ejemplo de cómo consumir eventos de Kafka en Scala:

```scala
import java.util.Properties
import org.apache.kafka.clients.consumer.KafkaConsumer

val props = new Properties()
props.put("bootstrap.servers", "localhost:9092")
props.put("group.id", "mi-grupo")
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")

val consumer = new KafkaConsumer[String, String](props)
consumer.subscribe(java.util.Collections.singletonList("mi-topic"))

while (true) {
  val records = consumer.poll(java.time.Duration.ofMillis(100))
  for (record <- records.asScala) {
    println(s"Offset: ${record.offset}, Key: ${record.key}, Value: ${record.value}")
  }
}

consumer.close()
```

### 12.3. Procesamiento de datos con Apache Hadoop
Scala es compatible con Apache Hadoop, un framework utilizado para el procesamiento distribuido de grandes volúmenes de datos. Puedes utilizar Scala para escribir código de MapReduce y ejecutar tareas en un clúster de Hadoop. Aquí se muestra un ejemplo de cómo implementar un programa MapReduce en Scala:

```scala
import org.apache.hadoop.fs.Path
import org.apache.hadoop.io._
import org.apache.hadoop.mapreduce._
import org.apache.hadoop.mapreduce.lib.input._
import org.apache.hadoop.mapreduce.lib.output._

class MiMapper extends Mapper[LongWritable, Text, Text, IntWritable] {
  override def map(key: LongWritable, value: Text, context: Mapper[LongWritable, Text, Text, IntWritable]#Context): Unit = {
    val words = value.toString.split(" ")
    for (word <- words) {
      context.write(new Text(word), new IntWritable(1))
    }
  }
}

class MiReducer extends Reducer[Text, IntWritable, Text, IntWritable] {
  override def reduce(key: Text, values: java.lang.Iterable[IntWritable], context: Reducer[Text, IntWritable, Text, IntWritable]#Context): Unit = {
    val sum = values.asScala.map(_.get()).sum
    context.write(key, new IntWritable(sum))
  }
}

val conf = new Configuration()
val job = Job.getInstance(conf, "Contador de palabras")
job.setJarByClass(getClass)
job.setMapperClass(classOf[MiMapper])
job.setCombinerClass(classOf[MiReducer])
job.setReducerClass(classOf[MiReducer])
job.setOutputKey

Class(classOf[Text])
job.setOutputValueClass(classOf[IntWritable])
FileInputFormat.addInputPath(job, new Path("ruta/de/entrada"))
FileOutputFormat.setOutputPath(job, new Path("ruta/de/salida"))
job.waitForCompletion(true)
```

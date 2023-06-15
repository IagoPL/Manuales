# Manual de Scala: Programación Orientada a Objetos

Bienvenido al Manual de Scala para la Programación Orientada a Objetos. En este manual, aprenderás los conceptos fundamentales de la programación orientada a objetos utilizando el lenguaje Scala. Comenzaremos desde cero y avanzaremos hacia conceptos más avanzados, proporcionando ejemplos detallados a lo largo del camino. ¡Empecemos!

## Índice

1. Introducción a la Programación Orientada a Objetos
2. Clases y Objetos
3. Herencia
4. Polimorfismo
5. Abstracción
6. Encapsulación
7. Interfaces y Mixins
8. Métodos y Propiedades
9. Constructores
10. Sobrecarga y Anulación de Métodos
11. Clases Abstractas
12. Companion Objects
13. Patrones de Diseño Orientados a Objetos

## 1. Introducción a la Programación Orientada a Objetos

La Programación Orientada a Objetos (POO) es un paradigma de programación que se basa en el concepto de objetos, los cuales representan entidades del mundo real con características (propiedades) y comportamientos (métodos). Scala es un lenguaje que combina características de la POO con la programación funcional.

## 2. Clases y Objetos

En Scala, las clases son la piedra angular de la POO. Una clase es una plantilla que define las propiedades y comportamientos de un objeto. Por ejemplo, considera una clase `Persona` que tiene propiedades como `nombre` y `edad`, y métodos como `saludar()`. Aquí tienes un ejemplo:

```scala
class Persona(nombre: String, edad: Int) {
  def saludar(): Unit = {
    println(s"Hola, mi nombre es $nombre y tengo $edad años.")
  }
}
```

Puedes crear objetos a partir de una clase utilizando la palabra clave `new`. Por ejemplo:

```scala
val persona = new Persona("Juan", 25)
persona.saludar() // Imprime: "Hola, mi nombre es Juan y tengo 25 años."
```

## 3. Herencia

La herencia es un mecanismo fundamental en la POO que permite crear jerarquías de clases. Una clase hereda propiedades y comportamientos de una clase padre, también conocida como superclase o clase base. En Scala, se utiliza la palabra clave `extends` para establecer una relación de herencia. Por ejemplo:

```scala
class Empleado(nombre: String, edad: Int, salario: Double) extends Persona(nombre, edad) {
  def calcularSueldo(): Double = {
    salario * 0.85 // Aplica una deducción del 15% al salario
  }
}
```

En este ejemplo, la clase `Empleado` hereda de la clase `Persona` y agrega una nueva propiedad `salario` y un nuevo método `calcularSueldo()`.

## 4. Polimorfismo

El polimorfismo es otro concepto importante en la POO. Permite tratar objetos de diferentes clases de manera uniforme. En Scala, el polimorfismo se logra a través de la anulación de métodos. Puedes anular (sobrescribir) un método definido en una clase padre en una clase hija utilizando la palabra clave `override`. Por ejemplo:

```scala
class Estudiante(nombre: String, edad: Int

, curso: String) extends Persona(nombre, edad) {
  override def saludar(): Unit = {
    println(s"Hola, soy estudiante y mi nombre es $nombre.")
  }
}
```

En este caso, la clase `Estudiante` anula el método `saludar()` de la clase `Persona` para proporcionar una implementación específica para los estudiantes.

## 5. Abstracción

La abstracción es un principio importante en la POO que permite representar conceptos complejos del mundo real mediante la creación de clases abstractas e interfaces. En Scala, puedes definir una clase abstracta utilizando la palabra clave `abstract`. Por ejemplo:

```scala
abstract class Figura {
  def calcularArea(): Double // Método abstracto sin implementación
}
```

Una clase abstracta puede contener métodos sin implementación, que deben ser implementados en las clases hijas.

## 6. Encapsulación

La encapsulación es un concepto clave en la POO que permite ocultar los detalles internos de una clase y proporcionar una interfaz pública para interactuar con ella. En Scala, puedes controlar el acceso a las propiedades y métodos utilizando modificadores de acceso como `private`, `protected` y `public`. Por defecto, las propiedades y métodos son públicos. Por ejemplo:

```scala
class CuentaBancaria(private var saldo: Double) {
  def depositar(monto: Double): Unit = {
    saldo += monto
  }
  
  def obtenerSaldo(): Double = {
    saldo
  }
}
```

En este ejemplo, la propiedad `saldo` es privada y solo se puede acceder a ella a través de los métodos públicos `depositar()` y `obtenerSaldo()`.

## 7. Interfaces y Mixins

En Scala, puedes definir interfaces utilizando la palabra clave `trait`. Un trait define una interfaz que puede ser implementada por varias clases. Por ejemplo:

```scala
trait Volador {
  def volar(): Unit
}

class Pajaro extends Volador {
  def volar(): Unit = {
    println("El pájaro está volando.")
  }
}
```

En este ejemplo, el trait `Volador` define un método `volar()`. La clase `Pajaro` implementa este trait y proporciona una implementación para el método `volar()`.

Además, en Scala puedes utilizar mixins para extender las funcionalidades de una clase sin herencia tradicional. Un mixin es una clase que se mezcla con otra clase para proporcionar características adicionales. Por ejemplo:

```scala
trait Nadador {
  def nadar(): Unit = {
    println("El objeto está nadando.")
  }
}

class Pez extends Nadador {
  // ...
}

val pez = new Pez()
pez.nadar() // Imprime: "El objeto está nadando."
```

En este caso, el trait `Nadador` se mezcla con la clase `Pez`, lo que le permite heredar el método `nadar()`.

### 8. Métodos y Propiedades

En Scala, los métodos y las propiedades se definen dentro de una clase. Los métodos son bloques de código que realizan ciertas acciones, mientras que las propiedades son variables asociadas a una clase. Puedes definir métodos y propiedades utilizando las palabras clave `def` y `val` o `var`, respectivamente. Por ejemplo:

```scala
class Circulo(val radio: Double) {
  def calcularArea(): Double = {
    Math.PI * radio * radio


  }
}
```

En este ejemplo, la clase `Circulo` tiene una propiedad `radio` y un método `calcularArea()` que utiliza esta propiedad para calcular el área del círculo.

## 9. Constructores

En Scala, puedes definir constructores para inicializar las propiedades de una clase. Un constructor se define dentro de la declaración de la clase. Puedes tener un constructor primario y constructores secundarios adicionales. Por ejemplo:

```scala
class Persona(nombre: String, edad: Int) {
  def this(nombre: String) {
    this(nombre, 0) // Llama al constructor primario con valores predeterminados
  }
}
```

En este ejemplo, la clase `Persona` tiene un constructor primario que recibe `nombre` y `edad`, y un constructor secundario que recibe solo `nombre` y llama al constructor primario con una edad predeterminada de 0.

## 10. Sobrecarga y Anulación de Métodos

En Scala, puedes sobrecargar métodos al definir múltiples versiones de un método con diferentes parámetros. Esto permite que un método tenga comportamientos diferentes según los argumentos utilizados al llamarlo. Por ejemplo:

```scala
class Calculadora {
  def sumar(a: Int, b: Int): Int = {
    a + b
  }
  
  def sumar(a: Double, b: Double): Double = {
    a + b
  }
}
```

En este caso, la clase `Calculadora` tiene dos versiones del método `sumar()` que aceptan diferentes tipos de parámetros.

Además, como mencionamos anteriormente, puedes anular (sobrescribir) métodos de una clase padre en una clase hija utilizando la palabra clave `override`.

## 11. Clases Abstractas

En Scala, una clase abstracta es una clase que no se puede instanciar y puede contener métodos abstractos sin implementación. Puedes definir una clase abstracta utilizando la palabra clave `abstract`. Por ejemplo:

```scala
abstract class Animal {
  def emitirSonido(): Unit // Método abstracto sin implementación
}

class Perro extends Animal {
  def emitirSonido(): Unit = {
    println("El perro hace 'guau guau'.")
  }
}
```

En este ejemplo, la clase `Animal` es una clase abstracta que contiene un método abstracto `emitirSonido()`. La clase `Perro` hereda de la clase `Animal` y proporciona una implementación para el método `emitirSonido()`.

## 12. Companion Objects

En Scala, puedes utilizar los companion objects para agrupar métodos y propiedades estáticas que pertenecen a una clase. Un companion object es un objeto con el mismo nombre que una clase y se define en el mismo archivo. Puedes acceder a los miembros del companion object sin necesidad de crear una instancia de la clase. Por ejemplo:

```scala
class MiClase(nombre: String) {
  // ...
}

object MiClase {
  def crearInstancia(nombre: String): MiClase = {
    new MiClase(nombre)
  }
}
```

En este caso, el companion object `MiClase` define un método `crearInstancia()` que permite crear instancias de la clase `MiClase` sin llamar explícitamente al constructor.

## 13. Patrones de Diseño Orientados a Objetos

Scala también se puede utilizar con patrones de diseño orientados a objetos comunes, como

 Singleton, Builder, Factory, entre otros. Estos patrones ayudan a estructurar y organizar el código de manera efectiva. Aprender y aplicar patrones de diseño puede mejorar la calidad y la reutilización del código. Aunque estos patrones no son exclusivos de Scala, son ampliamente utilizados en la POO y pueden aplicarse en Scala de manera similar a otros lenguajes.


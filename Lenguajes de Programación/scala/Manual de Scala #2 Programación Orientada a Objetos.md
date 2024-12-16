# Programación Orientada a Objetos (POO) 

Scala combina características avanzadas de programación funcional y orientada a objetos. La POO en Scala permite estructurar el código usando clases, objetos, herencia, traits, y otros principios fundamentales de este paradigma, lo que hace que sea un lenguaje robusto y flexible tanto para aplicaciones pequeñas como grandes.

---

## Clases en Scala

### Declaración de una Clase

```scala
class Persona(val nombre: String, val edad: Int) {
  def saludar(): Unit = {
    println(s"Hola, soy $nombre y tengo $edad años.")
  }
}

val persona = new Persona("Juan", 30)
persona.saludar() // Salida: Hola, soy Juan y tengo 30 años.
```

- **`val` y `var`:** Los parámetros del constructor son automáticamente atributos de la clase si se declaran como `val` o `var`.
- **Métodos:** Se definen dentro de la clase usando `def`.

### Clases con Constructor Secundario

Scala permite la definición de constructores secundarios para inicializar objetos de maneras alternativas, proporcionando flexibilidad en la creación de instancias.

```scala
class Persona(val nombre: String, val edad: Int) {
  def this(nombre: String) = this(nombre, 0) // Constructor secundario
}

val persona = new Persona("Ana")
println(s"Nombre: ${persona.nombre}, Edad: ${persona.edad}") // Salida: Nombre: Ana, Edad: 0
```

---

## Objetos Singleton

Un objeto en Scala es una clase que tiene exactamente una instancia. Se utiliza comúnmente para definir puntos de entrada, métodos utilitarios o valores constantes que no dependen de instancias.

### Ejemplo de Objeto Singleton

```scala
object Utilidades {
  def saludar(): Unit = {
    println("Hola desde Utilidades.")
  }
}

Utilidades.saludar() // Salida: Hola desde Utilidades.
```

Los objetos singleton también pueden contener funciones relacionadas con operaciones estáticas o utilidades comunes, evitando la necesidad de crear instancias para su uso.

---

## Herencia

Scala soporta herencia simple, donde una clase puede extender otra clase. Esto permite reutilizar comportamientos y extender funcionalidades sin duplicar código.

### Ejemplo de Herencia

```scala
class Animal {
  def hablar(): Unit = {
    println("Sonido genérico.")
  }
}

class Perro extends Animal {
  override def hablar(): Unit = {
    println("Guau, guau.")
  }
}

val perro = new Perro()
perro.hablar() // Salida: Guau, guau.
```

- **`extends`:** Se utiliza para heredar de una clase base.
- **`override`:** Indica que un método está sobrescribiendo uno de la clase base.

La herencia también permite construir jerarquías lógicas y centralizar comportamientos comunes en clases base.

---

## Traits

Los traits son similares a las interfaces en otros lenguajes, pero pueden contener implementaciones predeterminadas. En Scala, una clase puede implementar múltiples traits, lo que proporciona una forma flexible de compartir comportamiento entre clases.

### Ejemplo de Trait

```scala
trait Volador {
  def volar(): Unit = {
    println("Estoy volando.")
  }
}

trait Nadador {
  def nadar(): Unit = {
    println("Estoy nadando.")
  }
}

class Pato extends Volador with Nadador

val pato = new Pato()
pato.volar() // Salida: Estoy volando.
pato.nadar() // Salida: Estoy nadando.
```

Traits son ideales para representar capacidades o características que pueden ser compartidas entre diferentes clases sin necesidad de herencia múltiple.

---

## Clases Abstractas

Las clases abstractas proporcionan una base para otras clases y pueden contener métodos abstractos y no abstractos. Son útiles cuando se necesita definir una jerarquía de clases donde algunas funcionalidades deben implementarse en las clases derivadas.

### Ejemplo de Clase Abstracta

```scala
abstract class Vehiculo {
  def moverse(): Unit // Método abstracto

  def detenerse(): Unit = {
    println("El vehículo se detuvo.")
  }
}

class Coche extends Vehiculo {
  override def moverse(): Unit = {
    println("El coche se está moviendo.")
  }
}

val coche = new Coche()
coche.moverse() // Salida: El coche se está moviendo.
coche.detenerse() // Salida: El vehículo se detuvo.
```

Las clases abstractas son ideales para casos donde algunas funcionalidades pueden compartirse, pero otras deben ser definidas específicamente por cada subclase.

---

## Case Classes

Las case classes son clases especiales en Scala que se utilizan principalmente para trabajar con datos inmutables. Simplifican la manipulación de datos y son muy útiles en programación funcional y sistemas distribuidos.

### Características:

1. Generan automáticamente métodos como `toString`, `equals`, y `hashCode`.
2. Soportan desestructuración (pattern matching).
3. Son inmutables por defecto.

### Ejemplo de Case Class

```scala
case class Persona(nombre: String, edad: Int)

val persona = Persona("Carlos", 25)
println(persona) // Salida: Persona(Carlos,25)

val Persona(nombre, edad) = persona
println(s"Nombre: $nombre, Edad: $edad") // Salida: Nombre: Carlos, Edad: 25
```

El pattern matching es una de las características más poderosas de las case classes, ya que permite analizar estructuras de datos complejas de manera elegante y concisa.

---

## Objetos Companion

Los objetos companion comparten el mismo nombre que una clase y permiten definir métodos y valores estáticos. Facilitan la organización del código relacionado con una clase específica.

### Ejemplo:

```scala
class Circulo(val radio: Double) {
  def area: Double = Circulo.PI * radio * radio
}

object Circulo {
  val PI = 3.1416
}

val circulo = new Circulo(5)
println(s"Área: ${circulo.area}") // Salida: Área: 78.54
```

Los objetos companion son útiles para centralizar lógica estática o proporcionar métodos de fábrica para instanciar objetos.

---

## Polimorfismo

El polimorfismo permite tratar objetos de diferentes clases de manera uniforme a través de una clase base o un trait. Es fundamental para escribir código extensible y reutilizable.

### Ejemplo:

```scala
abstract class Animal {
  def hacerSonido(): Unit
}

class Gato extends Animal {
  override def hacerSonido(): Unit = {
    println("Miau")
  }
}

class Perro extends Animal {
  override def hacerSonido(): Unit = {
    println("Guau")
  }
}

val animales: List[Animal] = List(new Gato(), new Perro())
animales.foreach(_.hacerSonido())
// Salida:
// Miau
// Guau
```

El polimorfismo también es esencial para diseñar APIs y bibliotecas que permitan a los desarrolladores extender funcionalidades fácilmente.

---

## Buenas Prácticas

1. **Uso de Traits:** Prefiere traits para definir comportamientos comunes entre clases, evitando las limitaciones de la herencia múltiple.
2. **Case Classes:** Úsalas para representar datos inmutables y aprovechar sus métodos generados automáticamente.
3. **Companion Objects:** Centraliza métodos y valores estáticos en el objeto companion para mantener el código organizado.
4. **Modularidad:** Divide la funcionalidad en clases pequeñas y reutilizables, siguiendo principios como SOLID.
5. **Pattern Matching:** Aprovecha el pattern matching para simplificar el análisis de estructuras de datos.

---

## Conclusión

La Programación Orientada a Objetos en Scala combina conceptos avanzados como traits, case classes y objetos singleton con paradigmas funcionales, lo que permite crear aplicaciones modulares, reutilizables y expresivas. El entendimiento profundo de estas características amplía las posibilidades para desarrollar soluciones efectivas y mantenibles.

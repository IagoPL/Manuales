# Programación Funcional

Scala es un lenguaje diseñado para soportar completamente la programación funcional, ofreciendo características como funciones de orden superior, inmutabilidad, expresiones lambda y estructuras que facilitan trabajar de manera declarativa.

---

## Principios de la Programación Funcional

1. **Inmutabilidad:** Los datos no cambian después de su creación, lo que evita efectos secundarios.
2. **Funciones puras:** Una función siempre devuelve el mismo resultado para los mismos argumentos, sin modificar el estado global.
3. **Funciones como ciudadanos de primera clase:** Las funciones pueden asignarse a variables, pasarse como argumentos y devolverse como valores.
4. **Composición de funciones:** Permite combinar funciones pequeñas para crear soluciones más complejas.
5. **Expresiones en lugar de instrucciones:** En lugar de cambiar estados, se evalúan expresiones para producir nuevos valores.

---

## Funciones en Scala

### Declaración de Funciones

```scala
def sumar(a: Int, b: Int): Int = {
  a + b
}

println(sumar(3, 5)) // Salida: 8
```

### Funciones Lambda (Funciones Anónimas)

Las funciones lambda son definiciones de funciones compactas.

```scala
val multiplicar = (a: Int, b: Int) => a * b
println(multiplicar(2, 3)) // Salida: 6
```

### Funciones de Orden Superior

Una función de orden superior es una función que acepta otra función como argumento o devuelve una función.

#### Ejemplo: Aplicar una función a una lista

```scala
val numeros = List(1, 2, 3)
val cuadrados = numeros.map(x => x * x)
println(cuadrados) // Salida: List(1, 4, 9)
```

#### Ejemplo: Devuelve una función

```scala
def multiplicador(factor: Int): Int => Int = {
  (x: Int) => x * factor
}

val porDos = multiplicador(2)
println(porDos(5)) // Salida: 10
```

---

## Currificación

La currificación convierte una función que toma múltiples argumentos en una secuencia de funciones que toman un único argumento cada una.

```scala
def sumar(a: Int)(b: Int): Int = a + b

val sumaParcial = sumar(10)_
println(sumaParcial(5)) // Salida: 15
```

---

## Inmutabilidad

La inmutabilidad garantiza que los datos no cambien después de su creación. Esto se logra mediante el uso de `val` y estructuras de datos inmutables.

```scala
val lista = List(1, 2, 3)
val nuevaLista = lista :+ 4 // Agrega un elemento sin modificar la original
println(nuevaLista) // Salida: List(1, 2, 3, 4)
```

---

## Pattern Matching

El pattern matching es una característica poderosa de Scala que permite analizar estructuras de datos de forma concisa y expresiva.

```scala
def clasificarNumero(numero: Int): String = numero match {
  case 1 => "Uno"
  case 2 => "Dos"
  case _ => "Otro número"
}

println(clasificarNumero(2)) // Salida: Dos
```

---

## Composición de Funciones

La composición de funciones permite combinar funciones más pequeñas en otras más grandes y complejas.

```scala
val sumarUno = (x: Int) => x + 1
val duplicar = (x: Int) => x * 2

val sumarYDuplicar = sumarUno.andThen(duplicar)
println(sumarYDuplicar(3)) // Salida: 8
```

---

## Operaciones Funcionales en Colecciones

### `map`

Transforma cada elemento de una colección aplicando una función.

```scala
val numeros = List(1, 2, 3)
val dobles = numeros.map(_ * 2)
println(dobles) // Salida: List(2, 4, 6)
```

### `filter`

Filtra elementos que cumplen una condición.

```scala
val pares = numeros.filter(_ % 2 == 0)
println(pares) // Salida: List(2)
```

### `reduce`

Combina todos los elementos de una colección utilizando una operación binaria.

```scala
val suma = numeros.reduce(_ + _)
println(suma) // Salida: 6
```

### `flatMap`

Aplica una función a cada elemento de una colección y aplana el resultado.

```scala
val palabras = List("Hola", "Scala")
val letras = palabras.flatMap(_.toLowerCase)
println(letras) // Salida: List(h, o, l, a, s, c, a, l, a)
```

---

## Recursividad

La recursividad es un concepto clave en la programación funcional. Scala soporta recursividad de cola, lo que permite optimizaciones en tiempo de ejecución.

```scala
def factorial(n: Int): Int = {
  if (n == 0) 1
  else n * factorial(n - 1)
}

println(factorial(5)) // Salida: 120
```

---

## Buenas Prácticas

1. **Prefiere funciones puras:** Reduce efectos secundarios para facilitar el razonamiento sobre el código.
2. **Usa inmutabilidad:** Evita modificar estructuras de datos existentes.
3. **Divide y vencerás:** Divide funciones grandes en pequeñas y reutilizables.
4. **Evita bucles imperativos:** Usa métodos funcionales como `map`, `filter` o `fold`.
5. **Aprovecha el pattern matching:** Simplifica el análisis de datos complejos.

---

## Conclusión

La programación funcional en Scala fomenta un enfoque declarativo, seguro y modular para resolver problemas. Sus herramientas y conceptos, como funciones de orden superior, inmutabilidad y composición, permiten crear soluciones elegantes y escalables.

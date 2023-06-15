# Manual de Colecciones y Colecciones Inmutables en Scala

## Introducción

Scala proporciona una amplia variedad de colecciones inmutables que son fundamentales para la programación funcional. Estas colecciones son altamente eficientes y seguras para trabajar con datos en Scala. En este manual, exploraremos los diferentes tipos de colecciones inmutables y aprenderemos a utilizar sus operaciones clave.

## Índice

1. Listas
2. Conjuntos
3. Mapas
4. Secuencias
5. Operaciones comunes en las colecciones
6. Transformaciones y filtrado
7. Reducción y plegado
8. Combinación de colecciones
9. Iteración y recorrido
10. Compatibilidad con Java

## 1. Listas

Una lista en Scala es una secuencia ordenada e inmutable de elementos del mismo tipo. Se puede definir una lista utilizando la notación de paréntesis y elementos separados por comas:

```scala
val lista = List(1, 2, 3, 4, 5)
```

Algunas operaciones comunes en las listas son:

- `head`: devuelve el primer elemento de la lista.
- `tail`: devuelve una lista con todos los elementos excepto el primero.
- `isEmpty`: verifica si la lista está vacía.
- `length`: devuelve la longitud de la lista.
- `reverse`: invierte el orden de los elementos en la lista.

```scala
val primero = lista.head
val resto = lista.tail
val estaVacia = lista.isEmpty
val longitud = lista.length
val invertida = lista.reverse
```

## 2. Conjuntos

Un conjunto en Scala es una colección inmutable de elementos únicos y desordenados. Los conjuntos no permiten duplicados y no conservan un orden específico. Puedes definir un conjunto utilizando la notación de llaves:

```scala
val conjunto = Set(1, 2, 3, 4, 5)
```

Algunas operaciones comunes en los conjuntos son:

- `contains`: verifica si un elemento está presente en el conjunto.
- `union`: combina dos conjuntos en uno nuevo.
- `intersect`: devuelve la intersección de dos conjuntos.
- `diff`: devuelve los elementos que están en el conjunto original pero no en el segundo conjunto.

```scala
val contieneTres = conjunto.contains(3)
val unionConjuntos = conjunto.union(Set(6, 7, 8))
val interseccion = conjunto.intersect(Set(3, 4, 5, 6))
val diferencia = conjunto.diff(Set(2, 4, 6))
```

## 3. Mapas

Un mapa en Scala es una colección inmutable de pares clave-valor. Cada elemento del mapa consiste en una clave única y su correspondiente valor asociado. Puedes definir un mapa utilizando la notación de paréntesis y pares clave-valor separados por comas:

```scala
val mapa = Map("a" -> 1, "b" -> 2, "c" -> 3)
```

Algunas operaciones comunes en los mapas son:

- `get`: obtiene el valor asociado a una clave.
- `getOrElse`: obtiene el valor asociado a una clave o un valor predeterminado

 si la clave no está presente.
- `contains`: verifica si una clave está presente en el mapa.
- `keys`: devuelve todas las claves del mapa.
- `values`: devuelve todos los valores del mapa.

```scala
val valorA = mapa.get("a")
val valorB = mapa.getOrElse("b", 0)
val contieneC = mapa.contains("c")
val todasLasClaves = mapa.keys
val todosLosValores = mapa.values
```

## 4. Secuencias

Una secuencia en Scala es una colección inmutable ordenada de elementos del mismo tipo. A diferencia de las listas, las secuencias pueden ser implementadas por diferentes estructuras de datos, como vectores, listas enlazadas y matrices. Puedes definir una secuencia utilizando la notación de paréntesis y elementos separados por comas:

```scala
val secuencia = Seq(1, 2, 3, 4, 5)
```

Algunas operaciones comunes en las secuencias son similares a las de las listas, como `head`, `tail`, `isEmpty` y `length`. También puedes realizar operaciones de acceso aleatorio utilizando el índice:

```scala
val primerElemento = secuencia(0)
val ultimoElemento = secuencia(secuencia.length - 1)
```

## 5. Operaciones comunes en las colecciones

Además de las operaciones mencionadas anteriormente, las colecciones inmutables en Scala proporcionan una variedad de operaciones comunes que se pueden aplicar a cualquier tipo de colección. Algunas de estas operaciones son:

- `isEmpty`: verifica si la colección está vacía.
- `length`: devuelve la longitud de la colección.
- `foreach`: itera sobre cada elemento de la colección y aplica una función.
- `filter`: devuelve una nueva colección con los elementos que cumplen cierta condición.
- `map`: aplica una función a cada elemento de la colección y devuelve una nueva colección con los resultados.
- `foldLeft` y `foldRight`: realiza una reducción en la colección aplicando una función binaria a los elementos.

```scala
val estaVacia = lista.isEmpty
val longitud = conjunto.size
lista.foreach(elemento => println(elemento))
val filtrados = lista.filter(_ > 3)
val duplicados = lista.map(_ * 2)
val suma = lista.foldLeft(0)(_ + _)
```

## 6. Transformaciones y filtrado

Una característica poderosa de las colecciones en Scala es la capacidad de realizar transformaciones y filtrado de manera concisa y expresiva. Puedes utilizar funciones de orden superior como `map`, `filter`, `flatMap` y `collect` para aplicar transformaciones y realizar filtrados complejos en una colección.

```scala
val duplicados = lista.map(_ * 2)
val filtrados = lista.filter(_ > 3)
val pares = lista.flatMap(x => if (x % 2 == 0) Some(x) else None)
val positivos = lista.collect { case x if x > 0 => x }
```

## 7. Reducción y plegado

La reducción y el plegado son operaciones comunes en las colecciones que permiten combinar los elementos en un único resultado. Puedes utilizar las funciones `reduce`, `fold` y `scan` para realizar estas operaciones.

```scala
val suma = lista.reduce(_ + _)
val producto = lista.fold(1)(_ * _)
val sumasParciales

 = lista.scan(0)(_ + _)
```

## 8. Combinación de colecciones

Scala ofrece métodos para combinar colecciones de manera eficiente. Puedes utilizar `++` para concatenar dos colecciones del mismo tipo, `++:` para concatenar una colección al principio de otra y `zip` para combinar dos colecciones en pares.

```scala
val combinacion = lista ++ otroLista
val combinacionAlInicio = otroLista ++: lista
val pares = lista.zip(otroLista)
```

## 9. Iteración y recorrido

Puedes utilizar estructuras de control como `for` y `foreach` para iterar sobre los elementos de una colección y realizar acciones en cada elemento.

```scala
for (elemento <- lista) {
  println(elemento)
}

lista.foreach(elemento => println(elemento))
```

## 10. Compatibilidad con Java

Las colecciones inmutables en Scala son completamente compatibles con las colecciones de Java. Puedes convertir entre colecciones de Scala y Java utilizando los métodos `toSeq`, `toList`, `toSet`, `toMap` y viceversa.

```scala
val listaScala = List(1, 2, 3)
val listaJava = listaScala.asJava

val mapaJava = new java.util.HashMap[String, Int]()
val mapaScala = mapaJava.asScala
```

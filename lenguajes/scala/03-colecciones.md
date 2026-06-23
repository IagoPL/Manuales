# Colecciones y Colecciones Inmutables

El sistema de colecciones de Scala es una parte integral del lenguaje, diseñado para ser versátil, eficiente y fácil de usar. Incluye una amplia variedad de colecciones mutables e inmutables, adecuadas tanto para la programación funcional como orientada a objetos.

---

## Tipos de Colecciones

Scala proporciona dos tipos principales de colecciones:

1. **Colecciones Mutables:** Permiten cambiar su contenido después de su creación.

   - Ejemplo: `ArrayBuffer`, `ListBuffer`, `HashMap`.
2. **Colecciones Inmutables:** Su contenido no puede modificarse después de su creación. Se prefieren en la programación funcional.

   - Ejemplo: `List`, `Vector`, `Map`.

Por defecto, las colecciones de Scala son inmutables. Puedes importar las versiones mutables si lo necesitas:

```scala
import scala.collection.mutable
```

---

## Listas

### Listas Inmutables

Las listas inmutables (`List`) son las más comunes en Scala y representan una secuencia enlazada de elementos.

#### Ejemplo:

```scala
val numeros = List(1, 2, 3, 4, 5)
println(numeros.head) // Primer elemento: 1
println(numeros.tail) // Resto de la lista: List(2, 3, 4, 5)
```

Las listas soportan operaciones funcionales como `map`, `filter` y `reduce`:

```scala
val cuadrados = numeros.map(x => x * x)
println(cuadrados) // Salida: List(1, 4, 9, 16, 25)
```

### Listas Mutables

Puedes usar `ListBuffer` para trabajar con listas mutables:

```scala
import scala.collection.mutable.ListBuffer

val buffer = ListBuffer(1, 2, 3)
buffer += 4
println(buffer) // Salida: ListBuffer(1, 2, 3, 4)
```

---

## Conjuntos (Set)

Los conjuntos son colecciones que no permiten elementos duplicados.

### Conjuntos Inmutables

```scala
val conjunto = Set(1, 2, 3, 3)
println(conjunto) // Salida: Set(1, 2, 3)
```

### Conjuntos Mutables

```scala
import scala.collection.mutable

val conjuntoMutable = mutable.Set(1, 2, 3)
conjuntoMutable += 4
println(conjuntoMutable) // Salida: Set(1, 2, 3, 4)
```

---

## Mapas (Map)

Los mapas almacenan pares clave-valor y pueden ser mutables o inmutables.

### Mapas Inmutables

```scala
val mapa = Map("a" -> 1, "b" -> 2, "c" -> 3)
println(mapa("a")) // Salida: 1
```

### Mapas Mutables

```scala
import scala.collection.mutable

val mapaMutable = mutable.Map("a" -> 1, "b" -> 2)
mapaMutable("c") = 3
println(mapaMutable) // Salida: Map(a -> 1, b -> 2, c -> 3)
```

---

## Arrays

Los arrays son colecciones mutables de tamaño fijo.

```scala
val array = Array(1, 2, 3, 4, 5)
array(0) = 10
println(array.mkString(", ")) // Salida: 10, 2, 3, 4, 5
```

---

## Operaciones Comunes con Colecciones

### Mapear y Transformar

```scala
val numeros = List(1, 2, 3)
val dobles = numeros.map(_ * 2)
println(dobles) // Salida: List(2, 4, 6)
```

### Filtrar

```scala
val pares = numeros.filter(_ % 2 == 0)
println(pares) // Salida: List(2)
```

### Reducción

```scala
val suma = numeros.reduce(_ + _)
println(suma) // Salida: 6
```

### Agrupar

```scala
val agrupados = numeros.groupBy(_ % 2 == 0)
println(agrupados) // Salida: Map(false -> List(1, 3), true -> List(2))
```

---

## Ventajas de las Colecciones Inmutables

1. **Seguridad en concurrencia:** No se modifican en tiempo de ejecución, evitando errores por acceso concurrente.
2. **Predictibilidad:** El estado no cambia, lo que facilita el razonamiento sobre el código.
3. **Optimización:** Scala utiliza estructuras de datos compartidas para minimizar la sobrecarga de crear nuevas colecciones.

---

## Buenas Prácticas

1. **Prefiere inmutabilidad:** Usa colecciones inmutables a menos que sea absolutamente necesario modificar el contenido.
2. **Evita copiar datos grandes:** Aprovecha las características compartidas de las colecciones inmutables.
3. **Usa operaciones funcionales:** Métodos como `map`, `filter` y `reduce` mejoran la claridad y expresividad del código.

---

## Conclusión

El sistema de colecciones de Scala ofrece herramientas poderosas para manejar datos de manera eficiente y funcional. Entender la diferencia entre colecciones mutables e inmutables, y aprovechar las operaciones funcionales, es clave para escribir código escalable y mantenible.

```

```

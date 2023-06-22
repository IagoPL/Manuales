# Manual de Transformaciones y Acciones en Apache Spark

## Índice

1. [Introducción](#introducción)
2. [Transformaciones](#transformaciones)
3. [Acciones](#acciones)
4. [Ejemplos de Uso](#ejemplos-de-uso)

## Introducción<a id="introducción"></a>

En Apache Spark, las transformaciones y acciones son operaciones fundamentales para manipular y procesar datos de manera distribuida. Las transformaciones permiten crear un nuevo conjunto de datos a partir de uno existente, mientras que las acciones desencadenan la ejecución de las transformaciones y devuelven resultados concretos. En este manual, exploraremos en detalle las transformaciones y acciones disponibles en Spark y cómo utilizarlas eficientemente.

## Transformaciones<a id="transformaciones"></a>

Las transformaciones en Spark son operaciones que generan un nuevo conjunto de datos a partir de uno existente. Estas transformaciones son inmutables, lo que significa que no modifican el conjunto de datos original, sino que crean uno nuevo. Algunas de las transformaciones más comunes son:

- **map**: Aplica una función a cada elemento del conjunto de datos y devuelve un nuevo conjunto de datos con los resultados.
- **filter**: Filtra los elementos del conjunto de datos según una condición especificada y devuelve un nuevo conjunto de datos con los elementos que la cumplen.
- **flatMap**: Similar a la transformación "map", pero cada elemento de entrada puede generar cero o más elementos de salida.
- **groupBy**: Agrupa los elementos del conjunto de datos según una clave especificada y devuelve un nuevo conjunto de datos con grupos de elementos.
- **reduceByKey**: Combina los valores de cada clave en el conjunto de datos mediante una función de reducción y devuelve un nuevo conjunto de datos con los resultados.

## Acciones<a id="acciones"></a>

Las acciones en Spark son operaciones que desencadenan la ejecución de las transformaciones y devuelven resultados concretos. Estas acciones son el punto de partida para obtener resultados a partir de los conjuntos de datos. Algunas de las acciones más comunes son:

- **collect**: Devuelve todos los elementos del conjunto de datos como una matriz en el programa de control.
- **count**: Devuelve el número total de elementos en el conjunto de datos.
- **first**: Devuelve el primer elemento del conjunto de datos.
- **take**: Devuelve los primeros n elementos del conjunto de datos como una matriz.
- **reduce**: Combina los elementos del conjunto de datos utilizando una función de reducción y devuelve el resultado final.

## Ejemplos de Uso<a id="ejemplos-de-uso"></a>

A continuación, presentamos algunos ejemplos de uso de transformaciones y acciones en Spark:

1. Ejemplo de transformación "map":

```scala
val data = sc.parallelize(List(1, 2, 3, 4, 5))
val multipliedData = data.map(x => x * 2)

multipliedData.collect()
```

Resultado:
```
Array(2, 4, 6, 8, 10)
```

2. Ejemplo de transformación "filter":

```scala
val data = sc.parallelize(List(1, 2, 3, 4, 5))
val filteredData = data.filter( _ % 2 == 0)

filteredData.collect()
```

Resultado:
```
Array(2, 4)
```

3. Ejemplo de acción "count

":

```scala
val data = sc.parallelize(List(1, 2, 3, 4, 5))
val count = data.count()
```

Resultado:
```
5
```

4. Ejemplo de acción "reduce":

```scala
val data = sc.parallelize(List(1, 2, 3, 4, 5))
val sum = data.reduce((x, y) => x + y)
```

Resultado:
```
15
```
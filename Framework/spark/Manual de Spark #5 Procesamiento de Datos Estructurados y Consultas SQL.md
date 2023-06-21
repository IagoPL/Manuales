# Manual de Procesamiento de Datos Estructurados y Consultas SQL en Spark

En este manual, exploraremos el procesamiento de datos estructurados y la realización de consultas SQL en Apache Spark utilizando el lenguaje Scala. Aprenderemos a trabajar con DataFrames y a ejecutar consultas SQL para manipular y analizar datos estructurados en Spark.

## 1. Introducción a DataFrames

Los DataFrames son la estructura de datos principal utilizada en Spark para el procesamiento de datos estructurados. Representan una colección de datos distribuidos organizados en columnas con un esquema definido. A continuación, se muestra cómo crear un DataFrame a partir de una lista de tuplas en Scala:

```scala
import org.apache.spark.sql.{SparkSession, DataFrame}

val spark = SparkSession.builder().appName("Procesamiento de Datos").getOrCreate()

// Definir el esquema del DataFrame
val schema = List("nombre", "edad", "ciudad")

// Crear una lista de tuplas
val data = List(("Juan", 25, "Madrid"), ("María", 30, "Barcelona"), ("Pedro", 35, "Valencia"))

// Crear el DataFrame a partir de la lista de tuplas y el esquema
val df: DataFrame = spark.createDataFrame(data).toDF(schema: _*)

// Mostrar el contenido del DataFrame
df.show()
```

## 2. Consultas SQL con Spark SQL

Spark SQL proporciona una interfaz SQL para ejecutar consultas y manipulaciones de datos estructurados en Spark. A continuación, se muestra cómo ejecutar una consulta SQL en un DataFrame:

```scala
import org.apache.spark.sql.functions._

// Registrar el DataFrame como una vista temporal
df.createOrReplaceTempView("personas")

// Ejecutar una consulta SQL en el DataFrame
val resultado = spark.sql("SELECT nombre, edad FROM personas WHERE ciudad = 'Barcelona'")

// Mostrar el resultado de la consulta
resultado.show()
```

## 3. Manipulación de Datos con DataFrames

Spark proporciona una amplia gama de funciones para manipular y transformar DataFrames. A continuación, se muestran algunos ejemplos de operaciones comunes:

### Filtrado de datos

```scala
// Filtrar los registros donde la edad es mayor que 30
val resultadoFiltro = df.filter(col("edad") > 30)
resultadoFiltro.show()
```

### Operaciones de agregación

```scala
// Calcular la edad promedio
val resultadoPromedio = df.agg(avg("edad"))
resultadoPromedio.show()
```

### Ordenación de datos

```scala
// Ordenar el DataFrame por edad en orden descendente
val resultadoOrdenado = df.orderBy(col("edad").desc)
resultadoOrdenado.show()
```

### Operaciones de unión

```scala
// Crear un segundo DataFrame
val otroDF = spark.createDataFrame(Seq(("Ana", 28, "Sevilla"))).toDF(schema: _*)

// Unir los dos DataFrames
val resultadoUnion = df.union(otroDF)
resultadoUnion.show()
```

## 4. Lectura y escritura de datos

Spark permite leer y escribir datos desde y hacia diversas fuentes. A continuación, se muestran ejemplos de lectura y escritura de datos en formato CSV:

### Lectura de datos desde un archivo CSV

```scala
val datosCSV = spark.read.format("csv").option("header", "true").load("datos.csv")
datosCSV.show()
```

### Escritura de datos en un archivo CSV

```scala
datosCSV.write.format("csv").mode("overwrite").save("datos_salida.csv")
```

## 5. Optimización de consultas SQL

Spark SQL cuenta con optimizaciones de consultas que pueden mejorar el rendimiento de las operaciones. A continuación, se muestra un ejemplo de cómo utilizar la caché de DataFrame para acelerar las consultas:

```scala
// Cachear el DataFrame en memoria
df.cache()

// Ejecutar una consulta SQL en el DataFrame caché
val resultadoCaché = spark.sql("SELECT nombre, edad FROM personas WHERE ciudad = 'Barcelona'")

// Mostrar el resultado de la consulta
resultadoCaché.show()
```


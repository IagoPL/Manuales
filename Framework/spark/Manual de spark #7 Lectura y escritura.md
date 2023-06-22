# Manual de Lectura y escritura de datos en Spark

## 1. Introducción
La lectura y escritura de datos es una parte fundamental en el procesamiento de datos con Spark. En este manual, aprenderás cómo leer y escribir datos desde y hacia diferentes fuentes utilizando Spark, así como las opciones y configuraciones disponibles.

## 2. Lectura de datos
La lectura de datos en Spark te permite cargar datos desde diversas fuentes y formatos. A continuación, se presentan algunas opciones comunes para leer datos en Spark:

### 2.1 Lectura desde un archivo CSV
Puedes utilizar la función `spark.read.csv()` para leer datos desde un archivo CSV. A continuación se muestra un ejemplo:

```scala
val df = spark.read.csv("ruta/al/archivo.csv")
```

### 2.2 Lectura desde un archivo JSON
La función `spark.read.json()` se utiliza para leer datos desde un archivo JSON. Aquí tienes un ejemplo:

```scala
val df = spark.read.json("ruta/al/archivo.json")
```

### 2.3 Lectura desde una base de datos SQL
Para leer datos desde una base de datos SQL, puedes utilizar la función `spark.read.jdbc()`. A continuación, se muestra un ejemplo:

```scala
val df = spark.read.jdbc(url, tabla, properties)
```

## 3. Escritura de datos
La escritura de datos te permite guardar los resultados del procesamiento en diferentes formatos y ubicaciones. A continuación, se presentan algunas opciones comunes para escribir datos en Spark:

### 3.1 Escritura en un archivo Parquet
Puedes guardar un DataFrame en formato Parquet utilizando la función `df.write.parquet()`. Aquí tienes un ejemplo:

```scala
df.write.parquet("ruta/de/salida.parquet")
```

### 3.2 Escritura en un archivo CSV
Para escribir un DataFrame en un archivo CSV, puedes utilizar la función `df.write.csv()`. A continuación, se muestra un ejemplo:

```scala
df.write.csv("ruta/de/salida.csv")
```

### 3.3 Escritura en una tabla de base de datos SQL
Si deseas escribir datos en una tabla de una base de datos SQL, puedes utilizar la función `df.write.jdbc()`. Aquí tienes un ejemplo:

```scala
df.write.jdbc(url, tabla, properties)
```

## 4. Opciones y configuraciones adicionales
Spark proporciona opciones y configuraciones adicionales para personalizar la lectura y escritura de datos. A continuación, se muestran algunos ejemplos:

### 4.1 Especificar esquema
Puedes especificar el esquema de los datos al leer un archivo CSV utilizando la opción `schema`:

```scala
val customSchema = new StructType().add("columna1", StringType).add("columna2", IntegerType)
val df = spark.read.schema(customSchema).csv("ruta/al/archivo.csv")
```

### 4.2 Opciones de escritura
Al escribir datos, puedes especificar diferentes opciones, como el delimitador en un archivo CSV:

```scala
df.write.option("delimiter", "|").csv("ruta/de/salida.csv")
```

### 4.3 Particiones
Si deseas controlar el número de particiones al escribir datos, puedes utilizar la opción `numPartitions`:

```scala
df.write.option("numPartitions", 10).parquet("ruta/de/salida.parquet")
```

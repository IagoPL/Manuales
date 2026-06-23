# Lectura y Escritura de Datos en Apache Spark

Apache Spark ofrece soporte integrado para leer y escribir datos en una amplia variedad de formatos y fuentes, lo que facilita la integración con diversos sistemas y herramientas.

---

## Principales Fuentes y Formatos de Datos

1. **Archivos locales y distribuidos:**

   - CSV, JSON, Parquet, Avro, ORC.
   - Sistemas de archivos distribuidos como HDFS, S3, o Azure Blob Storage.
2. **Bases de datos relacionales:**

   - MySQL, PostgreSQL, SQL Server mediante conectores JDBC.
3. **Bases de datos NoSQL:**

   - Cassandra, MongoDB, HBase.

---

## Lectura de Datos

### Lectura de archivos CSV

```python
# Leer un archivo CSV
df_csv = spark.read.format("csv").option("header", "true").option("inferSchema", "true").load("/ruta/archivo.csv")
df_csv.show()
```

### Lectura de archivos JSON

```python
# Leer un archivo JSON
df_json = spark.read.format("json").load("/ruta/archivo.json")
df_json.printSchema()
df_json.show()
```

### Lectura de archivos Parquet

```python
# Leer un archivo Parquet
df_parquet = spark.read.format("parquet").load("/ruta/archivo.parquet")
df_parquet.show()
```

### Lectura desde bases de datos relacionales

```python
# Leer desde MySQL
jdbc_url = "jdbc:mysql://host:puerto/base_de_datos"
propiedades = {"user": "usuario", "password": "contraseña"}

df_mysql = spark.read.jdbc(url=jdbc_url, table="tabla", properties=propiedades)
df_mysql.show()
```

---

## Escritura de Datos

### Escritura en formato CSV

```python
# Guardar un DataFrame en formato CSV
df_csv.write.format("csv").option("header", "true").save("/ruta/salida.csv")
```

### Escritura en formato Parquet

```python
# Guardar un DataFrame en formato Parquet
df_parquet.write.format("parquet").save("/ruta/salida.parquet")
```

### Escritura en bases de datos relacionales

```python
# Guardar en MySQL
df_mysql.write.jdbc(url=jdbc_url, table="nueva_tabla", mode="overwrite", properties=propiedades)
```

---

## Opciones Avanzadas para Lectura y Escritura

### Configuración de particiones

```python
# Escribir datos con particiones personalizadas
df_csv.write.format("csv").partitionBy("columna").save("/ruta/particionado")
```

### Compresión

```python
# Escribir datos comprimidos
df_parquet.write.format("parquet").option("compression", "snappy").save("/ruta/comprimido")
```

### Esquemas personalizados

```python
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# Definir un esquema personalizado
schema = StructType([
    StructField("nombre", StringType(), True),
    StructField("edad", IntegerType(), True),
    StructField("ciudad", StringType(), True)
])

df_custom = spark.read.format("csv").schema(schema).load("/ruta/datos.csv")
df_custom.show()
```

---

## Caso Práctico: Consolidación de Datos

### Escenario

Tienes múltiples archivos CSV distribuidos en varias carpetas. Necesitas consolidar los datos, procesarlos y almacenarlos en formato Parquet con particiones basadas en una columna específica.

### Solución

```python
# Leer múltiples archivos CSV
df = spark.read.format("csv").option("header", "true").option("inferSchema", "true").load("/ruta/csv/*")

# Realizar operaciones de limpieza
df_limpio = df.dropDuplicates().filter(df["columna"] != "valor_no_deseado")

# Guardar los datos procesados en formato Parquet con particiones
df_limpio.write.format("parquet").partitionBy("columna_particion").save("/ruta/salida_parquet")
```

---

## Consejos para Optimizar Lectura y Escritura

1. **Usa formatos binarios como Parquet o ORC:** Estos son más eficientes que CSV y JSON.
2. **Configura particiones:** Mejoran el rendimiento al trabajar con subconjuntos de datos.
3. **Esquemas explícitos:** Ayudan a evitar inferencias incorrectas en datos complejos.
4. **Compresión:** Reduce el tamaño del almacenamiento sin afectar la lectura.

---

## Conclusión

Spark facilita la lectura y escritura de datos en múltiples formatos y fuentes, permitiendo flexibilidad y escalabilidad. Dominar estas capacidades es fundamental para integrar Spark en flujos de trabajo de Big Data y maximizar su eficiencia.

```

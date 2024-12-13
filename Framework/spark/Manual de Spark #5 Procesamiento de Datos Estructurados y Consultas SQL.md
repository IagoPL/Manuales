# Procesamiento de Datos Estructurados y Consultas SQL en Spark

Apache Spark proporciona potentes herramientas para trabajar con datos estructurados mediante DataFrames y Spark SQL. Estos permiten realizar transformaciones complejas y ejecutar consultas SQL de manera eficiente en entornos distribuidos.

---

## Introducción a DataFrames

Un **DataFrame** es una colección de datos organizados en columnas con nombres. Se asemeja a una tabla en una base de datos o a un DataFrame de pandas en Python. Los DataFrames son la API principal para trabajar con datos estructurados en Spark.

### Características principales:

- Representa datos distribuidos de manera estructurada.
- Ofrece optimizaciones internas gracias al motor de ejecución Catalyst.
- Compatible con varias fuentes de datos como JSON, CSV, Parquet, JDBC, entre otras.

### Crear un DataFrame

```python
from pyspark.sql import SparkSession

# Crear una sesión de Spark
spark = SparkSession.builder.appName("EjemploDataFrame").getOrCreate()

# Crear un DataFrame desde un archivo CSV
df = spark.read.format("csv").option("header", "true").load("/ruta/archivo.csv")

# Mostrar los primeros registros
df.show()
```

---

## Consultas SQL con Spark SQL

Spark SQL permite ejecutar sentencias SQL directamente sobre DataFrames o tablas temporales. Esto facilita a los usuarios con experiencia en SQL realizar consultas complejas.

### Registrar una tabla temporal

```python
df.createOrReplaceTempView("mi_tabla")

# Ejecutar una consulta SQL
resultado = spark.sql("SELECT columna1, COUNT(*) FROM mi_tabla GROUP BY columna1")
resultado.show()
```

### Consultas comunes

1. **Filtrar datos:**

   ```sql
   SELECT * FROM mi_tabla WHERE columna1 = 'valor';
   ```
2. **Agrupar y resumir:**

   ```sql
   SELECT columna2, AVG(columna3) FROM mi_tabla GROUP BY columna2;
   ```
3. **Uniones:**

   ```sql
   SELECT a.*, b.columna4
   FROM tabla_a a
   INNER JOIN tabla_b b ON a.id = b.id;
   ```

---

## Transformaciones Avanzadas con DataFrames

### Selección de columnas

```python
# Seleccionar columnas específicas
df_seleccionado = df.select("columna1", "columna2")
```

### Filtrado

```python
# Filtrar registros
filtrado = df.filter(df["columna1"] == "valor")
```

### Agregaciones

```python
# Contar registros por grupo
conteo = df.groupBy("columna2").count()
```

### Joins

```python
# Unir dos DataFrames
union = df1.join(df2, df1["id"] == df2["id"], "inner")
```

---

## Ejemplo Práctico: Análisis de Ventas

### Escenario

Queremos analizar un conjunto de datos de ventas para identificar las categorías más vendidas y calcular las ventas promedio por región.

### Solución

```python
# Leer datos de ventas
df_ventas = spark.read.format("csv").option("header", "true").load("/ruta/ventas.csv")

# Registrar como tabla temporal
df_ventas.createOrReplaceTempView("ventas")

# Ejecutar consulta SQL
resultado = spark.sql(
    """
    SELECT categoria, region, AVG(monto) AS promedio_ventas
    FROM ventas
    GROUP BY categoria, region
    ORDER BY promedio_ventas DESC
    """
)

resultado.show()
```

---

## Consejos para Optimizar el Procesamiento

1. **Usa Parquet o formatos binarios:** Estos son más rápidos y eficientes que CSV.
2. **Cacheo:** Si utilizas los mismos datos repetidamente, usa `cache()` para almacenarlos en memoria.
   ```python
   df.cache()
   ```
3. **Particiones:** Divide los datos en particiones adecuadas para mejorar el rendimiento.
4. **Columnas específicas:** Selecciona solo las columnas necesarias para reducir el uso de memoria.

---

## Conclusión

Spark SQL y DataFrames ofrecen una manera eficiente y flexible de trabajar con datos estructurados. Su combinación de funcionalidades SQL tradicionales con las optimizaciones de Spark los hace ideales para analizar grandes volúmenes de datos de manera escalable y eficiente. Dominar estas herramientas es esencial para cualquier profesional de Big Data.

```

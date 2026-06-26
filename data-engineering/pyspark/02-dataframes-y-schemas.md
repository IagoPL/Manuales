# DataFrames y schemas

El DataFrame es la abstraccion principal de PySpark. Representa datos tabulares distribuidos con columnas, tipos y operaciones declarativas.

## Crear DataFrame

```python
rows = [(1, "Ana", 29), (2, "Luis", 34)]
df = spark.createDataFrame(rows, ["id", "name", "age"])
```

## Schema explicito

```python
from pyspark.sql import types as T

schema = T.StructType([
    T.StructField("id", T.LongType(), False),
    T.StructField("name", T.StringType(), False),
    T.StructField("age", T.IntegerType(), True),
])

df = spark.createDataFrame(rows, schema)
```

En produccion, evita depender de inferencia para datos importantes.

## Inspeccion

```python
df.printSchema()
df.show(20, truncate=False)
df.describe().show()
```

## Seleccion

```python
from pyspark.sql import functions as F

result = df.select(
    "id",
    F.col("name").alias("customer_name"),
    (F.col("age") + 1).alias("age_next_year"),
)
```

## Tipos complejos

Spark soporta arrays, structs y maps.

```python
schema = T.StructType([
    T.StructField("order_id", T.StringType()),
    T.StructField("items", T.ArrayType(T.StringType())),
])
```

## Buenas practicas

- Define schemas explicitos.
- Usa nombres de columnas consistentes.
- Evita espacios y caracteres raros en columnas.
- Usa tipos correctos para fechas, importes y IDs.
- Valida schema al inicio del pipeline.

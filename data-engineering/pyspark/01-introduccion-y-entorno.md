# Manual de PySpark

PySpark es la API de Python para Apache Spark. Permite procesar datos distribuidos usando DataFrames, SQL, streaming y librerias del ecosistema Spark sin escribir Scala o Java directamente.

Conviene usar PySpark cuando los datos no caben comodamente en memoria, cuando el procesamiento debe distribuirse en un cluster o cuando el pipeline forma parte de una plataforma como Databricks, EMR, Glue, Synapse o Kubernetes.

## Capitulos previstos

1. [Introduccion y entorno](01-introduccion-y-entorno.md)
2. [DataFrames y schemas](02-dataframes-y-schemas.md)
3. [Transformaciones y acciones](03-transformaciones-y-acciones.md)
4. [Spark SQL](04-spark-sql.md)
5. [Lectura y escritura](05-lectura-y-escritura.md)
6. [Joins agregaciones y ventanas](06-joins-agregaciones-y-ventanas.md)
7. [Streaming](07-streaming.md)
8. [Optimizacion](08-optimizacion.md)
9. [Testing y buenas practicas](09-testing-y-buenas-practicas.md)
10. [Arquitectura interna de Spark](10-arquitectura-interna-de-spark.md)
11. [Particionado, shuffle y skew](11-particionado-shuffle-y-skew.md)
12. [Pipelines con Parquet y Delta](12-pipelines-con-parquet-y-delta.md)
13. [PySpark en produccion](13-pyspark-en-produccion.md)
14. [Observabilidad y troubleshooting](14-observabilidad-y-troubleshooting.md)
15. [Patrones de data engineering](15-patrones-de-data-engineering.md)
16. [Proyecto final](16-proyecto-final.md)

## Instalacion local

Para aprendizaje local:

```bash
pip install pyspark
```

Crear una sesion:

```python
from pyspark.sql import SparkSession

spark = (
    SparkSession.builder
    .appName("learning-pyspark")
    .master("local[*]")
    .getOrCreate()
)
```

## Primer DataFrame

```python
rows = [
    ("ES", "order_created", 120.5),
    ("PT", "order_created", 80.0),
    ("ES", "order_cancelled", 15.0),
]

df = spark.createDataFrame(rows, ["country", "event_type", "amount"])

df.show()
df.printSchema()
```

Agregacion:

```python
from pyspark.sql import functions as F

summary = (
    df
    .groupBy("country")
    .agg(
        F.count("*").alias("events"),
        F.sum("amount").alias("total_amount"),
    )
)

summary.show()
```

## Modelo mental

Spark evalua de forma perezosa. Muchas operaciones solo construyen un plan; la ejecucion real ocurre cuando llamas a una accion:

- Transformaciones: `select`, `filter`, `withColumn`, `groupBy`, `join`.
- Acciones: `show`, `count`, `collect`, `write`.

Esto permite optimizar el plan antes de ejecutar, pero tambien puede sorprender al empezar: un error puede aparecer tarde, cuando llega la accion.

## Buenas practicas

- Define schemas explicitamente al leer datos importantes.
- Evita `collect()` salvo en resultados pequenos.
- Usa funciones de `pyspark.sql.functions` en vez de UDFs cuando sea posible.
- Escribe en formatos columnares como Parquet o Delta.
- Revisa planes con `explain()` cuando una consulta sea lenta.

## Errores comunes

- Pensar en Spark como Pandas distribuido sin cambiar el modelo mental.
- Traer datos al driver con `collect()` sin controlar tamano.
- Usar UDFs para operaciones que Spark ya sabe optimizar.
- Leer CSV sin schema y confiar en inferencia en produccion.
- Hacer demasiados `count()` solo para depurar.

## Ejercicio

1. Crea un DataFrame de eventos con pais, tipo y cantidad.
2. Filtra solo eventos de compra.
3. Agrupa por pais.
4. Calcula numero de eventos e importe total.
5. Escribe el resultado en Parquet.

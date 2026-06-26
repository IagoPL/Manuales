# Lectura y escritura

La entrada y salida suele dominar el coste de un pipeline Spark. Formato, particionado y modo de escritura importan mucho.

## Leer CSV

```python
df = (
    spark.read
    .option("header", True)
    .schema(schema)
    .csv("/data/orders.csv")
)
```

## Leer Parquet

```python
df = spark.read.parquet("/data/orders")
```

Parquet es columnar, comprimido y eficiente para analitica.

## JSON

```python
df = spark.read.schema(schema).json("/data/events")
```

Para JSON complejo, define schema explicitamente.

## Escribir

```python
df.write.mode("overwrite").parquet("/data/marts/orders")
```

Modos:

- `append`
- `overwrite`
- `ignore`
- `error`

## Particionado de salida

```python
df.write.partitionBy("event_date").mode("overwrite").parquet(path)
```

Particiona por columnas usadas en filtros, no por columnas con cardinalidad enorme.

## Buenas practicas

- Prefiere Parquet o Delta para pipelines.
- Define schemas al leer.
- Controla modo de escritura.
- Evita muchos archivos pequeños.
- Particiona por fecha o dominio consultado.
- Valida conteos despues de escribir.

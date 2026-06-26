# Joins, agregaciones y ventanas

Joins y agregaciones suelen provocar shuffle. Son potentes, pero hay que diseñarlos con cuidado.

## Join

```python
orders.join(customers, on="customer_id", how="inner")
```

Tipos comunes:

- `inner`
- `left`
- `right`
- `full`
- `left_semi`
- `left_anti`

## Broadcast join

Para tabla pequeña:

```python
from pyspark.sql.functions import broadcast

orders.join(broadcast(countries), "country_code")
```

Evita shuffle grande si una dimension cabe en memoria.

## Agregacion

```python
summary = (
    orders
    .groupBy("country")
    .agg(
        F.count("*").alias("orders"),
        F.sum("amount").alias("total_amount"),
    )
)
```

## Ventanas

```python
from pyspark.sql.window import Window

w = Window.partitionBy("customer_id").orderBy(F.col("created_at").desc())

ranked = orders.withColumn("rn", F.row_number().over(w))
```

## Skew

Skew ocurre cuando unas claves concentran demasiados datos.

Sintomas:

- Una task tarda mucho mas.
- Shuffle enorme.
- Jobs aparentemente atascados al final.

## Buenas practicas

- Broadcast para dimensiones pequeñas.
- Revisa cardinalidad de claves.
- Evita joins sin condicion.
- Filtra antes de join si puedes.
- Usa ventanas con particiones razonables.
- Mide shuffle en Spark UI.

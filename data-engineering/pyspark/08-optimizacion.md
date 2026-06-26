# Optimizacion

Optimizar PySpark empieza entendiendo el plan, el shuffle, el particionado y el tamaño de archivos.

## Explain

```python
df.explain(True)
```

Revisa:

- Scans.
- Filters.
- Joins.
- Exchanges.
- Sorts.

## Shuffle

Shuffle mueve datos entre executors. Es caro.

Lo generan:

- `groupBy`
- `join`
- `distinct`
- `orderBy`
- ventanas.

## Repartition y coalesce

```python
df.repartition(200)
df.coalesce(20)
```

`repartition` hace shuffle. `coalesce` reduce particiones con menos coste.

## Cache

```python
df.cache()
df.count()
```

Cachea solo si reutilizas el DataFrame y cabe razonablemente.

## UDFs

Evita UDFs Python si existe funcion nativa de Spark.

Las UDFs pueden romper optimizaciones y ser mas lentas.

## Buenas practicas

- Mide antes de tocar configuracion.
- Evita shuffle innecesario.
- Usa broadcast joins.
- Controla archivos pequeños.
- Evita `collect()`.
- Usa Spark UI para diagnosticar.

# Particionado, shuffle y skew

El particionado determina como se reparte el trabajo. El shuffle redistribuye datos. El skew rompe el paralelismo.

## Particiones

```python
df.rdd.getNumPartitions()
```

Mas particiones no siempre es mejor. Demasiadas generan overhead; pocas reducen paralelismo.

## Shuffle partitions

```python
spark.conf.set("spark.sql.shuffle.partitions", "200")
```

Ajusta segun tamaño de datos y cluster.

## Skew

Detecta claves dominantes:

```python
df.groupBy("customer_id").count().orderBy(F.desc("count")).show()
```

## Tecnicas contra skew

- Broadcast join si una tabla es pequeña.
- Salting de claves.
- Filtrar datos antes del join.
- Separar claves gigantes y tratarlas aparte.

## Buenas practicas

- Mide distribución de claves.
- Observa tasks lentas.
- Ajusta shuffle partitions.
- Evita particionar por columnas de baja cardinalidad sin analizar.
- Controla tamaño de archivos de salida.


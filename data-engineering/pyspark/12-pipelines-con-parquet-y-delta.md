# Pipelines con Parquet y Delta

PySpark se usa mucho para construir pipelines sobre data lakes. Parquet y Delta Lake son formatos clave.

## Parquet

```python
df.write.mode("overwrite").partitionBy("date").parquet(path)
```

Ventajas:

- Columnar.
- Compresion.
- Predicate pushdown.
- Lectura eficiente.

## Delta Lake

```python
df.write.format("delta").mode("append").save(path)
```

Delta añade:

- ACID.
- Transaction log.
- Time travel.
- MERGE.

## MERGE

```sql
MERGE INTO target t
USING updates s
ON t.id = s.id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *
```

## Capas

```txt
bronze -> silver -> gold
```

## Buenas practicas

- Bronze conserva datos crudos.
- Silver limpia y normaliza.
- Gold sirve negocio.
- Particiona por fecha si se consulta por fecha.
- Controla archivos pequeños.
- Documenta contratos de tablas.


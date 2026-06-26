# Spark SQL

Spark permite trabajar con DataFrames o SQL. Ambos suelen compilar al mismo motor de ejecucion.

## Crear vista temporal

```python
df.createOrReplaceTempView("orders")
```

Consulta:

```python
result = spark.sql("""
SELECT country, count(*) AS orders, sum(amount) AS total
FROM orders
GROUP BY country
""")
```

## SQL vs DataFrame API

Usa SQL cuando:

- El equipo domina SQL.
- La transformacion es declarativa.
- Quieres reutilizar consultas.

Usa DataFrame API cuando:

- Necesitas composicion programatica.
- Hay logica parametrizada.
- Quieres integrar con funciones Python.

## Funciones

```sql
SELECT
  date_trunc('day', created_at) AS day,
  count(*) AS events
FROM events
GROUP BY date_trunc('day', created_at)
```

## Catalogos y tablas

Segun entorno, Spark puede usar Hive Metastore, Unity Catalog u otros catalogos.

```sql
SHOW DATABASES;
SHOW TABLES;
```

## Buenas practicas

- Evita SQL dinamico sin validar.
- Usa vistas temporales para pasos claros.
- Mantén consultas largas en archivos SQL versionados.
- Revisa planes con `EXPLAIN`.
- Documenta tablas y columnas de salida.

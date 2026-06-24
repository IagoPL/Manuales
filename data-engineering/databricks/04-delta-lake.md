# Delta Lake en Databricks

Delta Lake es una capa de almacenamiento que añade transacciones, control de versiones y operaciones fiables sobre datos en formato Parquet.

## Conceptos clave

- **Tabla Delta:** tabla con log transaccional.
- **ACID:** garantías de atomicidad, consistencia, aislamiento y durabilidad.
- **Time Travel:** consulta de versiones anteriores.
- **Merge:** operación para insertar o actualizar datos.
- **Schema enforcement:** validación de estructura.
- **Schema evolution:** evolución controlada de columnas.

## Crear una tabla Delta

```python
df.write.format("delta").mode("overwrite").save("/mnt/delta/ventas")
```

Leer tabla:

```python
ventas = spark.read.format("delta").load("/mnt/delta/ventas")
```

## Guardar como tabla gestionada

```sql
CREATE TABLE ventas_delta
USING DELTA
AS SELECT * FROM ventas_raw;
```

## Upsert con MERGE

```sql
MERGE INTO ventas_delta AS target
USING ventas_updates AS source
ON target.id = source.id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
```

## Time Travel

Consultar una versión anterior:

```sql
SELECT *
FROM ventas_delta VERSION AS OF 3;
```

## Buenas prácticas

- Usa Delta para tablas analíticas importantes.
- Define claves de negocio para operaciones `MERGE`.
- Evita sobrescrituras completas si puedes hacer cargas incrementales.
- Optimiza tablas grandes cuando sea necesario.
- Documenta estrategia de particionado.
- Controla evolución de schema.

## Errores comunes

- Tratar Delta como simples archivos Parquet.
- Hacer `overwrite` sin entender el impacto.
- No revisar duplicados antes de un `MERGE`.
- Particionar por columnas de alta cardinalidad.
- No limpiar datos obsoletos según política de retención.

## Chuleta rápida

```python
df.write.format("delta").save(path)
spark.read.format("delta").load(path)
```

```sql
MERGE INTO tabla USING updates ON condicion ...
SELECT * FROM tabla VERSION AS OF 1;
```

## Recursos relacionados

- [Databricks: introducción](01-databricks.md)
- [Apache Spark SQL](../spark/05-datos-estructurados-y-sql.md)
- [Pipelines de datos](../pipelines/README.md)

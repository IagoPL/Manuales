# Tablas Delta

Una tabla Delta se crea **escribiendo** en formato `delta` o con DDL `USING delta`. A partir de ahí se lee el snapshot actual (o uno histórico, capítulo 5). Este capítulo usa paths (`/data/events`, `/data/customers`); el catálogo es opcional.

Documentación: [lecturas y escrituras batch](https://docs.delta.io/latest/delta-batch.html), [APIs Python](https://docs.delta.io/latest/api/python/spark/index.html).

## SparkSession

Para DataSource V2 y SQL Delta en Spark, la sesión típica activa la extensión y el catálogo Delta:

```python
from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession

builder = (
    SparkSession.builder.appName("events-lake")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config(
        "spark.sql.catalog.spark_catalog",
        "org.apache.spark.sql.delta.catalog.DeltaCatalog",
    )
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
```

`configure_spark_with_delta_pip` encaja cuando instalas el paquete Python `delta-spark`. En un cluster, equivale a `--packages io.delta:delta-spark_<scala>:<version>` alineado con **tu** Spark (mira la matriz de la release; no copies `4.0.0` de un quickstart viejo).

## Crear y leer por path

```python
eventos = spark.createDataFrame(
    [
        (1, "signup", "web"),
        (2, "purchase", "app"),
    ],
    "event_id LONG, event_type STRING, channel STRING",
)

eventos.write.format("delta").mode("overwrite").save("/data/events")
tabla_eventos = spark.read.format("delta").load("/data/events")
```

`overwrite` sustituye el **contenido** de la tabla (nuevo snapshot). No borra el historial de commits: las versiones anteriores siguen existiendo hasta que retención y `VACUUM` lo permitan.

```sql
SELECT event_type, count(*) AS n
FROM delta.`/data/events`
GROUP BY event_type;
```

## Registrar en un catálogo (opcional)

El path ya es una tabla. Si quieres un nombre en el metastore Spark/Hive **sin** exigir Unity Catalog ni Databricks:

```sql
CREATE TABLE events
USING delta
LOCATION '/data/events';
```

Sin `LOCATION`, Spark crea una tabla *managed* en el warehouse del catálogo: `DROP TABLE` puede borrar los ficheros. Con `LOCATION`, la tabla es *unmanaged*: el `DROP` quita la entrada, no el directorio.

Si el path **ya** tiene una tabla Delta y solo pones nombre + `LOCATION`, el catálogo hereda esquema, particionado y propiedades. Si declaras esquema o `PARTITIONED BY`, deben coincidir exactamente.

`saveAsTable` / `table()` usan ese catálogo:

```python
eventos.write.format("delta").mode("errorifexists").saveAsTable("events")
spark.read.table("events")
```

## Append y overwrite

```python
nuevos = spark.createDataFrame(
    [(3, "page_view", "web")],
    "event_id LONG, event_type STRING, channel STRING",
)
nuevos.write.format("delta").mode("append").save("/data/events")
```

- **append**: añade ficheros; el snapshot incluye los anteriores + los nuevos. Las columnas extra o tipos incompatibles **fallan** (enforcement).
- **overwrite**: el snapshot nuevo deja de referenciar los data files anteriores. Úsalo cuando quieres reemplazar el dataset, no como “update de unas filas” (eso es capítulo 4).
- `errorifexists` / `ignore`: no pisan una tabla ya creada.

`partitionBy` en un append debe coincidir con el particionado existente; si omites `partitionBy`, Delta sigue el de la tabla.

## Particionado (introducción)

Particionar crea subdirectorios Hive-style (`event_date=2026-09-08/…`). Tiene sentido cuando **casi todas** las consultas filtran esa columna y cada partición es grande (cientos de MB o más), no cuando la cardinalidad explota (`user_id`, `event_id`).

```sql
CREATE TABLE events_by_day (
  event_id BIGINT,
  event_type STRING,
  event_time TIMESTAMP,
  event_date DATE
)
USING delta
PARTITIONED BY (event_date)
LOCATION '/data/events-by-day';
```

El diseño fino (cardinalidad, small files, data skipping) es el [capítulo 6](06-particionado-y-optimizacion.md). No particiones “por todas las columnas que se consultan”.

## Schema enforcement frente a evolution

**Enforcement** (por defecto): el DataFrame escrito debe ser compatible.

- columnas del DataFrame que no existen en la tabla → error;
- tipos incompatibles → error;
- columnas de la tabla ausentes en el DataFrame → `NULL`;
- no se permiten dos columnas que solo se distinguen por mayúsculas (`Foo` / `foo`).

Eso evita que un job de ingestión ensucie `events` con un schema improvisado.

**Evolution** es otra decisión: *permitir* que un write añada columnas (o, en versiones recientes, ensanche tipos). No es el default operativo.

A partir de Delta Lake 4.3 puedes acotarlo a **una** sentencia:

```sql
INSERT INTO events WITH SCHEMA EVOLUTION
SELECT event_id, event_type, channel, campaign
FROM staging_events;
```

```python
staging_events = spark.table("staging_events")
(
    staging_events.write.format("delta")
    .mode("append")
    .withSchemaEvolution()
    .save("/data/events")
)
```

En versiones anteriores (y aún válido) el write suelto usa `.option("mergeSchema", "true")`. Existe también `spark.databricks.delta.schema.autoMerge.enabled` a nivel de sesión: el prefijo `databricks` aparece en la config OSS; **no** actives evolution global “por si acaso”. Un pipeline de producción suele preferir `ALTER TABLE … ADD COLUMNS` explícito:

```sql
ALTER TABLE events ADD COLUMNS (campaign STRING);
```

`overwriteSchema` en un `overwrite` **reescribe** el esquema (renombrar, cambiar tipo, quitar columna). Es una migración, no un append cotidiano.

## API `DeltaTable`

```python
from delta.tables import DeltaTable

if not DeltaTable.isDeltaTable(spark, "/data/events"):
    raise RuntimeError("no hay tabla Delta en /data/events")

delta_events = DeltaTable.forPath(spark, "/data/events")
delta_events.toDF().select("event_type").distinct().show()
```

`DeltaTable.forName(spark, "events")` si está registrada. Las mutaciones (`update`, `delete`, `merge`) están en el [capítulo 4](04-merge-updates-y-deletes.md).

Siguiente: [ACID y transaction log](03-acid-y-transaction-log.md).

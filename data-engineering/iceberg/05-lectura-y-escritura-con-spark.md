# Lectura y escritura con Spark

Spark es el motor más cubierto en la documentación oficial de Iceberg; no es un requisito del formato. Necesitas un **runtime Iceberg compatible con tu Spark/Scala**, un **catálogo** configurado y, para varias operaciones SQL, las **Iceberg Spark extensions**.

Documentación: [getting started](https://iceberg.apache.org/docs/latest/spark-getting-started/), [configuración](https://iceberg.apache.org/docs/latest/spark-configuration/), [writes](https://iceberg.apache.org/docs/latest/spark-writes/), [queries](https://iceberg.apache.org/docs/latest/spark-queries/), [releases](https://iceberg.apache.org/releases/).

## Runtime (elige el de tu Spark)

La línea estable comprobada al escribir esto es Iceberg **1.11.0** (mayo 2026). La página de releases publica runtimes distintos, no un JAR único:

- Spark 4.1 + Scala 2.13
- Spark 4.0 + Scala 2.13
- Spark 3.5 + Scala 2.12 o 2.13

Spark 3.4 está **deprecado** en 1.11.0. No copies una coordenada de un tutorial viejo (3.2/3.3) como receta actual. El artefacto tiene la forma `org.apache.iceberg:iceberg-spark-runtime-<spark>_<scala>:<iceberg>`.

## Catálogo mínimo

`spark.sql.catalog.<nombre>` registra un catálogo Spark. Iceberg aporta `SparkCatalog` (Hive/Hadoop/REST/JDBC/…) y `SparkSessionCatalog` (envuelve el catálogo de sesión para mezclar tablas Iceberg y no Iceberg).

```text
spark.sql.extensions = org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions
spark.sql.catalog.local = org.apache.iceberg.spark.SparkCatalog
spark.sql.catalog.local.type = hadoop
spark.sql.catalog.local.warehouse = /warehouse
```

`local` es solo el nombre. `type=hadoop` es un warehouse de directorios (útil en laboratorio). Producción multi-motor suele ir a **REST** u otro catálogo coordinado (capítulo 6). Las extensions habilitan `CALL`, `MERGE`/`UPDATE`/`DELETE` en Spark 3.x y DDL extra. En Spark 4.0 los procedures `CALL` pueden ir nativos (son *case-sensitive*).

## Crear y leer

```sql
CREATE TABLE local.analytics.events (
  id BIGINT,
  event_time TIMESTAMP,
  type STRING
)
USING iceberg
PARTITIONED BY (days(event_time));

INSERT INTO local.analytics.events VALUES
  (1, TIMESTAMP '2026-09-08 10:15:00', 'signup'),
  (2, TIMESTAMP '2026-09-08 10:16:00', 'purchase');

SELECT type, count(*) FROM local.analytics.events GROUP BY type;
```

```python
eventos = spark.table("local.analytics.events")
```

## DataFrameWriterV2

Para tablas de **catálogo**, la API recomendada es `writeTo`, no `df.write.format("iceberg")` (eso abre una referencia aislada que no refresca con el catálogo).

```python
lote = spark.createDataFrame(
    [(3, "2026-09-08 11:00:00", "page_view")],
    "id LONG, event_time STRING, type STRING",
).selectExpr("id", "CAST(event_time AS TIMESTAMP) AS event_time", "type")

lote.writeTo("local.analytics.events").append()
```

Equivalencias: `append()` → `INSERT INTO`; `overwritePartitions()` → overwrite **dinámico**; `create()` / `replace()` → CTAS / RTAS.

## INSERT e INSERT OVERWRITE

`INSERT INTO` añade un snapshot `append`. `INSERT OVERWRITE` es atómico pero el **alcance** depende del modo de Spark:

- **static** (default de Spark): sin `PARTITION`, reemplaza **toda** la tabla;
- **dynamic** (`spark.sql.sources.partitionOverwriteMode=dynamic`): reemplaza solo las particiones que el `SELECT` produce.

Iceberg recomienda overwrite dinámico o, mejor, `MERGE` cuando quieres tocar ficheros concretos. No uses overwrite como “update”.

## MERGE / UPDATE / DELETE

Soporte oficial (DSv2):

| Operación | Notas |
| --- | --- |
| SQL `INSERT INTO` / `INSERT OVERWRITE` | ANSI store assignment |
| SQL `MERGE` / `UPDATE` / `DELETE` | Requieren **Iceberg Spark extensions** (Spark 3.x). Row-level delete no es “Spark vanilla”. |
| DataFrame `append` / overwrite | Sí |
| DataFrame `mergeInto` | **Spark 4.0+** (DSv2). No lo enseñes como universal. |

SQL es el camino pedagógico más portable *dentro* de Spark 3.5–4.x cuando las extensions están puestas.

```sql
MERGE INTO local.analytics.events t
USING local.analytics.event_fixes s
ON t.id = s.id
WHEN MATCHED AND s.op = 'delete' THEN DELETE
WHEN MATCHED THEN UPDATE SET t.type = s.type
WHEN NOT MATCHED AND s.op <> 'delete' THEN INSERT (id, event_time, type)
  VALUES (s.id, s.event_time, s.type);
```

Iceberg implementa `MERGE` **reescribiendo los data files afectados** en un commit `overwrite`. No es coste constante. Un source con dos filas para el mismo `id` errorrea. No copies la semántica de otro formato de tabla.

`DELETE`/`UPDATE` con filtro de partición completa pueden ser metadata-only; si tocan filas, reescriben o escriben delete files (capítulo 2).

## Time travel

```sql
SELECT *
FROM local.analytics.events
VERSION AS OF 10963874102873;

SELECT *
FROM local.analytics.events
TIMESTAMP AS OF '2026-09-08 12:00:00';

SELECT *
FROM local.analytics.events
VERSION AS OF 'audit';
```

`VERSION AS OF` acepta snapshot ID, branch o tag. También existen `FOR SYSTEM_VERSION AS OF` / `FOR SYSTEM_TIME AS OF`. En DataFrames: `.option("snapshot-id", …)` / `"as-of-timestamp"`.

Time travel **no** es backup. `expire_snapshots` se lleva versiones (capítulo 7).

Siguiente: [Catálogos](06-catalogos.md).

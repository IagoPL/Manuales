# Streaming

Delta está integrado con Spark Structured Streaming: una tabla es **sink** y **source**. El transaction log da commits atómicos; el **checkpoint del stream** es otro directorio, con otro trabajo.

Documentación: [streaming reads and writes](https://docs.delta.io/latest/delta-streaming.html), [CDF](https://docs.delta.io/latest/delta-change-data-feed.html).

## Sink: `writeStream`

```python
from pyspark.sql.types import LongType, StringType, StructField, StructType

eventos_schema = StructType(
    [
        StructField("event_id", LongType(), False),
        StructField("event_type", StringType(), False),
        StructField("channel", StringType(), True),
    ]
)
crudos = spark.readStream.format("json").schema(eventos_schema).load("/data/events-landing")
query = (
    crudos.writeStream
    .format("delta")
    .option("checkpointLocation", "/checkpoints/events-ingest")
    .outputMode("append")
    .start("/data/events")
)
```

`outputMode("append")` añade filas. `complete` reemplaza el snapshot en cada micro-batch (agregados). `toTable("events")` escribe a una tabla registrada.

`checkpointLocation` es **obligatorio** para recuperación. Vive **fuera** (o en un hijo `_checkpoints`, nunca ficheros sueltos que `VACUUM` pueda barrer como basura). No es `_delta_log`.

## Exactly-once, con matices

La documentación oficial describe procesamiento **exactly-once** del sink Delta gracias al log, incluso con otros streams o batch concurrentes sobre la misma tabla. Eso cubre **la escritura en Delta** coordinada con el checkpoint de Spark.

No convierte el pipeline entero en exactly-once:

- un `foreachBatch` que pega a una API HTTP o a Postgres puede duplicar side effects;
- un sink no transaccional no hereda el log;
- tu UDF no idempotente no se vuelve mágica.

Si reprocesas un batch, Delta puede ignorar el write duplicado **solo** si usas las opciones de idempotencia (`txnAppId` + `txnVersion`). Si no, un retry mal diseñado inserta dos veces.

## Source: `readStream`

```python
cambios = (
    spark.readStream.format("delta")
    .option("startingVersion", "80")
    .option("maxFilesPerTrigger", "50")
    .load("/data/events")
)
```

Por defecto el source procesa el snapshot actual y, después, los ficheros **nuevos**. Opciones útiles (no hace falta memorizarlas todas):

- `startingVersion` / `startingTimestamp` — solo en la **primera** arrancada (sin checkpoint). `latest` = solo lo que llegue a partir de ahora.
- `maxFilesPerTrigger` (default 1000) y `maxBytesPerTrigger` — ritmo del micro-batch.
- No combines las dos “starting*” a la vez.

## Updates y deletes en el source

Structured Streaming, en modo append sobre Delta, **no** interpreta un `UPDATE`/`DELETE`/`MERGE` del source como “cambia la fila que ya emití”. Si la tabla fuente deja de ser solo-append, el stream **lanza excepción**.

Estrategias vigentes (docs OSS):

1. **`skipChangeCommits` (recomendado):** ignora commits con operaciones que cambian datos (`UPDATE`, `MERGE`, `DELETE`, `OVERWRITE`). Downstream **no** ve esas filas. El stream no se cae; tampoco se entera del cambio.
2. **`ignoreDeletes` (legado):** solo toleraba deletes en fronteras de partición.
3. **`ignoreChanges` (deprecated):** reprocesa ficheros reescritos; puede **reeemitir** filas que no cambiaron. Downstream debe aguantar duplicados. Los deletes no se propagan.

Ninguna de esas opciones convierte el source append en CDC. Si necesitas **cambios a nivel de fila**, habilita CDF en la fuente y lee con `readChangeFeed`:

```python
feed = (
    spark.readStream.format("delta")
    .option("readChangeFeed", "true")
    .option("startingVersion", 80)
    .load("/data/customers")
)
```

CDF no está on por defecto (capítulo 4). Sin él, no asumas que el reader “aplica updates”.

## `foreachBatch` + MERGE

Patrón real de upsert streaming → tabla Delta:

```python
from delta.tables import DeltaTable

APP = "customers-cdc-stream"


def upsert_clientes(batch_df, batch_id):
    if batch_df.isEmpty():
        return
    dest = DeltaTable.forPath(spark, "/data/customers")
    dest.alias("t").merge(
        batch_df.alias("s"),
        "t.customer_id = s.customer_id",
    ).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()


consulta = (
    feed.writeStream
    .foreachBatch(upsert_clientes)
    .option("checkpointLocation", "/checkpoints/customers-upsert")
    .outputMode("update")
    .start()
)
```

`foreachBatch` **no** hace idempotente el MERGE por sí solo. Un micro-batch reintentado puede volver a mergear (en un upsert por clave suele ser aceptable) o, si el batch pica a **dos** paths con `append`, duplicar. Para writes Delta idempotentes:

```python
(
    batch_df.write.format("delta")
    .mode("append")
    .option("txnAppId", APP)
    .option("txnVersion", batch_id)
    .save("/data/events-silver")
)
```

No uses `foreachBatch` como permiso para side effects sin control (emails, cobros, deletes en un OLTP).

## Checkpoint ≠ `_delta_log`

| | Checkpoint del stream | `_delta_log` |
| --- | --- | --- |
| Quién | Spark Structured Streaming | Protocolo Delta |
| Qué guarda | offsets, estado de aggregations, metadata del query | snapshots de la **tabla** |
| Borrar | el stream **reprocesa** desde `starting*` o desde cero | corrompe o rebobina la tabla |

No borres el checkpoint “para arreglar el stream” sin aceptar reproceso, duplicados y, si hay estado, resultados distintos. Dos queries **nunca** comparten el mismo `checkpointLocation`.

Siguiente: [Buenas prácticas](08-buenas-practicas.md).

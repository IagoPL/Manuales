# Buenas prácticas

Cierra el recorrido: `/data/events` como lago versionado, `/data/customers` actualizado con MERGE, streams con checkpoint propio. Las decisiones de abajo son operativas; no son un checklist de producto Databricks.

Documentación: [docs.delta.io](https://docs.delta.io/), [optimizaciones](https://docs.delta.io/latest/optimizations-oss.html), [utilidades](https://docs.delta.io/latest/delta-utility.html), [Delta Kernel](https://docs.delta.io/latest/delta-kernel.html).

## Diseño

- Esquema **explícito** en ingestión (sobre todo streaming). Enforcement por defecto; evolución con `ALTER TABLE` o `WITH SCHEMA EVOLUTION` / `withSchemaEvolution()` **cuando** el contrato lo permite. No dejes `mergeSchema=true` en todos los writes.
- Particiona solo si el predicado estable y el volumen por partición lo justifican. Evita high-cardinality (`user_id`, ids de evento).
- Delta Lake **no** es Medallion. Si usas bronze/silver/gold, es un patrón de *pipelines*, no una obligación del formato.
- Spark es el motor de este manual. Flink, Trino, Presto, Hive, Athena o un conector **Kernel** pueden leer/escribir Delta; el soporte de OPTIMIZE, CDF, deletion vectors o clustering **no** es idéntico. Comprueba el conector.

## Escrituras

- Evita tiny files: no hagas un append de 40 filas cada segundo sin compactar después. Agrupa micro-batches o programa `OPTIMIZE` en particiones calientes.
- `overwrite` es un snapshot nuevo, no un update. El historial queda; el actual no.
- `MERGE` con predicados que acoten ficheros (y particiones). Deduplica el source. No prometas que el merge es barato.
- Varios writers: entiende conflictos (capítulo 3). No lances dos streams con el mismo checkpoint.

## Operación

- Compaction OSS: `OPTIMIZE` / `executeCompaction()`. Z-Order solo en columnas de filtro real, con stats.
- `VACUUM` con retención **segura** (default 7 días de data files). `DRY RUN` antes en tablas grandes. No uses `RETAIN 0 HOURS` fuera de un lab marcado como destructivo.
- Observa `DESCRIBE DETAIL` (ficheros, tamaño, protocol) e `HISTORY` (qué operaciones hinchan el log).
- Storage: S3, ADLS, GCS, HDFS. Configura el filesystem/Hadoop según la guía **actual** de Delta; no copies LogStore de 2019 sin verificar si tu release aún lo necesita.

## Evolución

- Añadir columnas es barato y explícito. Renombrar/quitar/cambiar tipo suele exigir `overwriteSchema` o table features (column mapping) que **suben** el protocolo.
- CDF, deletion vectors, clustering, identity columns: actívalos porque un lector/writer los necesita, no por moda. Un reader antiguo dejará de abrir la tabla.
- Distingue **Delta Lake OSS** de Databricks Runtime, Unity Catalog (producto), Predictive Optimization y Auto Optimize gestionado.

## Streaming

- `checkpointLocation` persistente, no un `/tmp` del driver. Distinto de `_delta_log`.
- Exactly-once del **sink Delta** ≠ exactly-once de todo el sistema.
- Source append-only: `skipChangeCommits` si la fuente recibe DML y no te importan esos commits; CDF si sí te importan los cambios de fila.
- `foreachBatch` + MERGE: idempotencia (`txnAppId`/`txnVersion` o merge por clave estable). Sin side effects sueltos.

## Recovery

- Time travel y `RESTORE` ayudan a **inspeccionar y revertir** dentro de la retención. No sustituyen backups (otro bucket, replicación, export).
- Si el log o los Parquet desaparecen del prefix, no hay snapshot que consultar.
- No edites `_delta_log` para “recuperar”. Restaura una copia o un `RESTORE` a una versión que aún tenga ficheros.

## Recorrido del manual

```text
Parquet + _delta_log
  → tabla events
  → commits / snapshots
  → MERGE customers
  → VERSION AS OF / VACUUM
  → OPTIMIZE / particiones
  → readStream / writeStream
  → operación
```

Iceberg se documenta aparte: mismo tipo de problema (tabla lakehouse), otro protocolo. No mezcles recetas.

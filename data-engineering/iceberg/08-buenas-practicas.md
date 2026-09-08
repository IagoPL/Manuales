# Buenas prácticas

Cierra el recorrido sobre `local.analytics.events`: diseño, writes, catálogo, mantenimiento y compatibilidad. Iceberg es el formato; el motor y el catálogo son *tuyos*.

Documentación: [docs](https://iceberg.apache.org/docs/latest/), [spec](https://iceberg.apache.org/spec/), [procedures](https://iceberg.apache.org/docs/latest/spark-procedures/), [multi-engine](https://iceberg.apache.org/docs/latest/).

## Diseño

- Esquema con **IDs**: evolve con `ALTER` (`ADD`/`RENAME`/`DROP`/`TYPE`). No reutilices IDs ni simules un rename con drop+add.
- Partition **transforms** (`days(event_time)`, `identity`, `bucket`) alineados al filtro real. No sobreparticiones por ids únicos.
- Evolucionar el spec no reescribe el histórico. Compáctalo aparte si el layout viejo duele.
- `format-version` mínima que cubra tus deletes/motores. **v1–v3 adoptadas; v4 no.** No actives v3 “por las features del blog” si Trino/Flink aún no las leen.

## Escrituras

- Controla el tamaño de fichero (`write.target-file-size-bytes`, distribución `hash`/`range`, no un append de 40 filas cada segundo sin compactar).
- `writeTo(...).append()` para tablas de catálogo. Reserva `format("iceberg")` para casos path aislados.
- `INSERT OVERWRITE` con alcance consciente (dynamic vs static). `MERGE` reescribe ficheros afectados: predica bien y deduplica el source.
- SQL `MERGE`/`UPDATE`/`DELETE` necesitan extensions en Spark 3.x. DataFrame `mergeInto` es Spark 4.0+.

## Catálogo

- Elige según **cuántos motores y writers**: Hadoop para un solo proceso de laboratorio; REST (u Hive/JDBC bien operados) cuando hay que commitear en serio.
- Catálogo ≠ S3. Alta disponibilidad y backups del **metastore/REST**, no solo del warehouse.
- Cloud catalogs (Glue, etc.) son implementaciones, no el estándar Iceberg.

## Mantenimiento

- `rewrite_data_files` (binpack; sort/z-order solo medidos).
- `rewrite_manifests` si el planning se ahoga en manifests chicos.
- `expire_snapshots` con retención que cubra time travel **y** jobs largos; respeta branches/tags.
- `remove_orphan_files` con `dry_run` y `older_than` holgado. Nunca en medio de un write.
- Observa `.snapshots`, `.files`, `.manifests`: recuento de snapshots, ficheros por partición, manifests.

## Compatibilidad

- Antes de subir format-version o table features, verifica **cada** motor que lee/escribe.
- “Funciona en Spark” ≠ mismo `MERGE`, mismos deletes, mismos types en Flink/Trino.
- No documentes spec v4 como estable.

## Observabilidad

- Crecimiento de `metadata/` y de manifests.
- Small files tras streaming.
- Fallos de commit / retries (conflicto OCC).
- Time travel que de repente falla: alguien expiró el snapshot.

## Recovery

- Snapshot + tag ayudan a **inspeccionar y revertir** (`rollback_to_snapshot`) dentro de la retención.
- No sustituyen copiar el warehouse y el catálogo a otro sitio.
- No parchees metadata JSON a mano.

## Recorrido

```text
tabla events
  → snapshots / manifests
  → days(event_time)
  → IDs y ALTER
  → Spark writeTo / SQL
  → catálogo (puntero)
  → rewrite / expire / orphans
  → operación
```

Spark enseñó las APIs; Iceberg sigue siendo el formato.

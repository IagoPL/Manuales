# Tablas, snapshots y manifests

Este capítulo es el núcleo del formato. Una tabla Iceberg es un **árbol de metadatos** que apunta a ficheros de datos y, si aplica, a ficheros de delete. Nada de eso se adivina listando el directorio.

Documentación: [spec](https://iceberg.apache.org/spec/), [consultas y metadata tables](https://iceberg.apache.org/docs/latest/spark-queries/), [DDL Spark](https://iceberg.apache.org/docs/latest/spark-ddl/).

## Cinco niveles

### Metadata file (`metadata.json`)

Un JSON (versionado en el prefix `metadata/`) con la configuración global: location, esquema, partition specs, sort orders, propiedades, **refs** (branches/tags) y el snapshot *current*. El catálogo apunta a *uno* de esos JSON. Es el contrato de la tabla, no las filas.

### Snapshot

Una **versión** de la tabla: `snapshot-id`, `parent-id`, `timestamp-ms`, `operation`, y la ruta de su **manifest list**. No es una copia física de todos los Parquet. Dos snapshots suelen compartir la mayoría de data files; el nuevo solo añade/quita referencias.

```text
snapshot A  (append inicial)
    ↓
snapshot B  (otro append)
    ↓
snapshot C  (delete / overwrite parcial)
```

Un lector en B no ve el commit C. Time travel es elegir A, B o C **mientras existan**.

### Manifest list

Fichero (Avro) que enumera los **manifests** de ese snapshot, con métricas para saltar manifests enteros (particiones, recuentos).

### Manifest

Metadatos de un **grupo** de data files o delete files: path, partición, tamaños, min/max por columna. El planner decide qué ficheros abrir.

### Data files / delete files

Los datos reales (Parquet/Avro/ORC) y, en tablas v2+, los ficheros que marcan filas borradas. El snapshot *current* es la unión de data files vivos **menos** los deletes aplicables.

## No edites el árbol

Puedes **inspeccionar** metadata y manifests. No los edites, no los renombres “para arreglar” la tabla y no borres JSON a mano. Usa APIs y `CALL … system.*` (capítulo 7).

## Lectura consistente

El motor lee el metadata que el catálogo declara current (o el snapshot pedido), carga la manifest list y planifica. Mientras tanto otro writer puede commitear: tu job sigue en el snapshot que abrió.

## Metadata tables (Spark)

Con un catálogo Iceberg, el nombre de la tabla es un namespace de inspección:

```sql
SELECT committed_at, snapshot_id, parent_id, operation
FROM local.analytics.events.snapshots;

SELECT made_current_at, snapshot_id, is_current_ancestor
FROM local.analytics.events.history;

SELECT file_path, record_count, partition
FROM local.analytics.events.files
LIMIT 20;

SELECT path, added_data_files_count, existing_data_files_count
FROM local.analytics.events.manifests;

SELECT *
FROM local.analytics.events.partitions;
```

`.snapshots` = versiones. `.history` = qué snapshot fue *current* y cuándo (incluye rollbacks). `.files` / `.manifests` / `.partitions` = layout del snapshot actual. Hay más tablas (`data_files`, `delete_files`, `refs`); no hace falta memorizarlas.

## Branches y tags

Iceberg guarda **referencias** a snapshots: un **branch** (línea que puede recibir writes; `main` es la por defecto) y un **tag** (puntero fijo, típico para auditoría). No es Git: no hay working tree ni merge de ficheros.

Usos reales: retener un snapshot de validación, un flujo write-audit-publish (escribir a `audit` y publicar a `main`), o impedir que `expire_snapshots` se lleve una versión etiquetada. Las refs tienen retención propia; `main` no expira.

```sql
ALTER TABLE local.analytics.events CREATE BRANCH `audit`;
ALTER TABLE local.analytics.events CREATE TAG `load-2026-09-01` AS OF VERSION 881122334455;
```

## Format version

| Versión | Estado | Idea |
| --- | --- | --- |
| 1 | Adoptada | Tabla append-oriented; deletes suelen reescribir ficheros. |
| 2 | Adoptada | Row-level deletes (position / equality delete files). |
| 3 | Adoptada | Extiende v2 (p. ej. deletion vectors para position deletes, tipos nuevos). |
| 4 | **En desarrollo** | No adoptada. No la pongas en producción. |

Subir `format-version` es irreversible hacia lectores viejos. Quédate en la mínima que tus motores entiendan.

## Row-level deletes (alto nivel)

`DELETE` **no** reescribe siempre la tabla entera.

- Si el predicado cubre **particiones enteras**, Iceberg puede hacer un delete solo de metadatos (quita ficheros del snapshot).
- Si toca **filas**, el motor reescribe los data files afectados **o** escribe delete files / deletion vectors (v2/v3), según versión, propiedades y motor.
- Un reader compatible aplica esos deletes al leer.

Equality deletes y deletion vectors son detalles de implementación: no los actives “por moda” si un motor del lago no los lee.

Siguiente: [Particionado oculto](03-particionado-oculto.md).

# Catálogos

La pregunta que responde un catálogo Iceberg:

```text
¿qué metadata.json es la versión actual de local.analytics.events?
```

Sin esa respuesta no hay tabla, solo un montón de ficheros.

Documentación: [Spark catalogs](https://iceberg.apache.org/docs/latest/spark-configuration/), [REST Catalog](https://iceberg.apache.org/rest-catalog-spec/), [docs](https://iceberg.apache.org/docs/latest/).

## Catálogo ≠ warehouse

| | Catálogo | Object storage / warehouse |
| --- | --- | --- |
| Qué guarda | Nombres, namespaces, **puntero** al metadata actual | Data files, delete files, metadata JSON, manifests |
| Quién coordina commits | El catálogo (CAS / transacción / API) | El FileIO lee y escribe bytes |
| Ejemplo | REST, Hive metastore, JDBC | S3, ADLS, GCS, HDFS, local |

`DROP TABLE` *managed* puede borrar el warehouse; una tabla con `location` explícita suele ser *unmanaged*. El catálogo no es Glue, Snowflake, Databricks ni BigQuery: esos pueden **implementar** o integrar un catálogo compatible. Iceberg OSS no los exige.

## Opciones OSS vigentes

En `spark.sql.catalog.<name>.type`:

| `type` | Papel |
| --- | --- |
| `hadoop` | Warehouse de directorios. Simple; débil para muchos writers / varios clusters. |
| `hive` | Hive Metastore guarda la entrada y el metadata location. |
| `rest` | Cliente habla **REST Catalog API**; detrás hay una implementación. |
| `jdbc` | Metastore en una base SQL. |

También aparecen `glue` y `nessie` como implementaciones. No son el núcleo pedagógico.

`SparkCatalog` carga solo Iceberg. `SparkSessionCatalog` delega lo no-Iceberg al catálogo built-in de Spark (mismo metastore Hive, por ejemplo).

## REST Catalog

```text
motor (Spark, Trino, Flink, …)
        ↓  HTTP JSON (REST Catalog API)
servidor de catálogo
        ↓
implementación (JDBC, Hive, custom, cloud…)
        ↓
puntero al metadata.json
```

REST **no** sirve los Parquet por HTTP. Estandariza *cómo* un motor crea tablas, lista namespaces y commitea el puntero. Varios motores contra el mismo REST es el patrón multi-engine actual.

```text
spark.sql.catalog.lake = org.apache.iceberg.spark.SparkCatalog
spark.sql.catalog.lake.type = rest
spark.sql.catalog.lake.uri = http://catalog:8181
```

## Commits atómicos

El writer:

1. escribe data/delete files y el **nuevo** metadata JSON;
2. pide al catálogo sustituir el puntero `v12 → v13`.

Ese paso 2 es atómico **en el catálogo**. No afirmes que Iceberg “siempre commitea con rename de archivos” en S3/HDFS: Hadoop catalog, Hive, JDBC y REST implementan la atomicidad de formas distintas. Si el catálogo no puede hacer el swap de forma segura, dos writers se pisan.

## Optimistic concurrency

Dos jobs pueden producir ficheros a la vez. Solo uno gana el puntero. El perdedor **refresca**, comprueba si su cambio sigue siendo válido (¿alguien tocó los mismos ficheros / el mismo snapshot base?) y **reintenta** si el motor lo contempla.

Un conflicto **no** se reintenta siempre en silencio. Un `MERGE` que leyó un snapshot ya inválido puede fallar: hay que relanzar la transacción. Dos streams o dos notebooks escribiendo la misma tabla sin coordinación van a chocar.

Elige el catálogo según **cuántos motores y procesos** commitean, no según el tutorial de `type=hadoop`.

Siguiente: [Optimización](07-optimizacion.md).

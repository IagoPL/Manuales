# Introducción y arquitectura

Delta Lake es un **formato y protocolo de tabla** de código abierto: archivos de datos (casi siempre [Parquet](https://parquet.apache.org/)) más un **transaction log** que define el estado versionado de la tabla. Encima de un data lake (S3, ADLS, GCS, HDFS u otro almacenamiento de objetos/ficheros) añade transacciones ACID, snapshots, enforcement de esquema y un mismo dataset para batch y streaming.

Documentación: [docs.delta.io](https://docs.delta.io/), [repositorio delta-io/delta](https://github.com/delta-io/delta), [guía rápida](https://docs.delta.io/latest/quick-start.html).

## El problema del data lake “solo ficheros”

Un lago clásico deja directorios de Parquet (o JSON/CSV) y delega la consistencia al job:

- un escritor que pisa ficheros a medias deja lecturas a medio camino;
- dos jobs que escriben el mismo path no tienen un commit atómico compartido;
- no hay un “estado de tabla” único: el lector lista lo que hay en el directorio;
- `UPDATE`/`DELETE`/`MERGE` no existen como operación de tabla: reescribes particiones a mano.

Delta no sustituye el lago. Añade un **protocolo** sobre esos ficheros para que varios lectores y escritores hablen de la misma tabla.

## Qué no es Delta Lake

| No es | Por qué |
| --- | --- |
| Una base de datos separada | No hay un servidor de filas propio. Los datos viven en el storage; el motor (Spark, Flink, Trino, …) interpreta el protocolo. |
| Un formato que reemplaza Parquet en disco | Los data files siguen siendo Parquet (u otro formato que el protocolo permita). El log es lo que convierte el directorio en tabla. |
| Un motor de consultas | No ejecuta SQL por sí mismo. Spark SQL, Trino u otro motor leen el snapshot. |
| Databricks | Databricks **usa** Delta y añade producto (Runtime, SQL warehouse, Unity Catalog, Predictive Optimization). Este manual cubre **Delta Lake OSS**. |

Apache Iceberg es otro formato/protocolo de tabla lakehouse, con su propio manifiesto y catálogo. Comparten el problema (tablas ACID sobre un lago); no son el mismo diseño. Iceberg se trata en su manual.

**Bronze / Silver / Gold** es un patrón de capas (muy usado en lakehouses). No es un requisito del formato Delta.

## Arquitectura: Parquet + `_delta_log`

Una tabla path-based es un directorio:

```text
/data/events/
├── part-00000-….parquet
├── part-00001-….parquet
└── _delta_log/
    ├── 00000000000000000000.json
    ├── 00000000000000000001.json
    ├── …
    └── 00000000000000000010.checkpoint.parquet
```

- Los `part-*.parquet` son **data files**. Un commit puede añadir ficheros, marcar otros como eliminados del snapshot, o ambas cosas. Los ficheros antiguos no se borran del storage hasta un `VACUUM`.
- `_delta_log/` es el **transaction log**: commits JSON numerados (versión 0, 1, 2, …) y, periódicamente, **checkpoints** (Parquet) que compactan el historial para no releer miles de JSON.

El snapshot *N* es el estado de la tabla **después** del commit `N`: qué ficheros están activos, esquema, propiedades y particionado. Un lector elige un snapshot y no ve escrituras posteriores a mitad de su job.

`_delta_log` es protocolo interno. Puedes **listarlo** para entender el modelo. No edites JSON, no borres commits y no “arregles” la tabla tocando ficheros a mano.

## Garantías que introduce el log

- **ACID** entre lecturas y escrituras que respetan el protocolo (capítulo 3).
- **Snapshots / time travel**: cada commit es una versión (capítulo 5).
- **Schema enforcement**: un append incompatible falla en lugar de mezclar columnas a ciegas (capítulo 2).
- **DML**: `UPDATE`, `DELETE`, `MERGE` reescriben ficheros afectados y commitean un snapshot nuevo (capítulo 4).
- **Batch y streaming** sobre la misma tabla (capítulo 7).

## Lakehouse, a alto nivel

```text
object store (S3 / ADLS / GCS / HDFS)
        ↑
   Delta table = data files + _delta_log
        ↑
 motor (Spark, Flink, Trino, Kernel, …)
        ↑
  batch · streaming · SQL
```

El storage guarda bytes. Delta define **qué conjunto de ficheros es la tabla ahora**. El motor planifica lecturas y writes. Un **catálogo** (Hive metastore, Unity Catalog OSS, otro) es opcional: puedes trabajar solo con la ruta `/data/events`. El catálogo no es Databricks.

**Delta Kernel** es una librería para construir conectores que lean y escriban Delta sin reimplementar el protocolo a mano. Spark sigue siendo el motor pedagógico de este manual; no todas las features tienen el mismo soporte en todos los motores.

## OSS frente a Databricks

En los capítulos siguientes, lo que aparece como API de [docs.delta.io](https://docs.delta.io/) es **Delta Lake OSS** (Spark, SQL, `delta.tables`). No se presentan como universales:

- Databricks Runtime / Databricks SQL
- Unity Catalog (producto Databricks; existe un Unity Catalog OSS aparte)
- Predictive Optimization, Auto Optimize como producto
- Liquid Clustering automático gestionado por la plataforma

Si una capacidad existe en OSS **y** en Databricks con semántica distinta, se etiqueta. Si solo está en producto Databricks, no se enseña como receta del formato.

## Versiones

La guía rápida de docs.delta.io a veces muestra un artefacto concreto (por ejemplo 4.0.0). Eso **no** es necesariamente la release estable actual. Comprueba [releases de delta-io/delta](https://github.com/delta-io/delta/releases) y la matriz Spark/Scala de esa nota. En Spark 4.x los artefactos van versionados por línea de Spark (`delta-spark_4.2_2.13`, etc.). Este manual no fija una versión en cada ejemplo.

Siguiente: [Tablas Delta](02-tablas-delta.md).

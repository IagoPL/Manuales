# Introducción y arquitectura

Apache Iceberg es un **formato de tabla abierto**: un protocolo de metadatos y commits que trata una colección de ficheros (Parquet, Avro u ORC) como una **tabla lógica**. No es Spark, ni un motor SQL, ni un catálogo, ni un servicio cloud, ni “Parquet con un candado”.

Documentación: [iceberg.apache.org](https://iceberg.apache.org/), [especificación](https://iceberg.apache.org/spec/), [docs latest](https://iceberg.apache.org/docs/latest/), [releases](https://iceberg.apache.org/releases/).

## El problema de las carpetas de Parquet

Un lago “solo directorios” deja que cada job liste `s3://…/events/dt=2026-09-08/` y decida qué es la tabla:

- un writer a medias deja lecturas inconsistentes;
- no hay un **estado de tabla** único: el listing *es* la verdad;
- cambiar el esquema o el particionado suele exigir una tabla nueva o reescribir todo;
- varios motores no se ponen de acuerdo sobre qué ficheros están vivos.

Iceberg no sustituye el object store. Añade un **árbol de metadatos** y un **commit** que publica, de forma atómica, *qué* ficheros pertenecen al snapshot actual. La tabla **no** se descubre listando el warehouse.

## Jerarquía (no la confundas)

```text
local.analytics.events
        │
        ▼
     catálogo          ← ¿cuál es el metadata.json actual?
        │
        ▼
   metadata.json       ← esquema, specs, refs, snapshot current
        │
        ▼
     snapshot          ← una versión de la tabla
        │
        ▼
  manifest list
        │
        ▼
    manifests
        │
        ▼
 data files / delete files   (Parquet, Avro, ORC, …)
```

Cada nivel tiene un trabajo distinto. El capítulo 2 baja al detalle; aquí basta con el modelo.

## Catálogo y commit

El **catálogo** no guarda las filas. Localiza y **cambia el puntero** al metadata vigente:

```text
metadata v12
      ↓
writer crea metadata v13 (ficheros nuevos + metadatos)
      ↓
commit atómico en el catálogo:
puntero v12 → v13
```

Si otro writer commitea antes:

```text
conflicto
→ refresh (leer el metadata actual)
→ validar si el cambio sigue siendo aplicable
→ retry cuando sea seguro
```

Eso es **optimistic concurrency**. No hay un lock universal de fila ni un mecanismo único de “rename de ficheros” en todos los storages: la atomicidad del puntero depende del **catálogo** (capítulo 6).

## Snapshots, no copias físicas

Cada commit produce normalmente un **snapshot** nuevo: un ID, un padre, un timestamp y una operación (`append`, `overwrite`, `delete`, …). Un lector fija un snapshot y ve un conjunto coherente de ficheros. Time travel es leer otro snapshot, no clonar el bucket.

Los snapshots se **expiran**. No son un backup.

## Lo que Iceberg habilita (recorrido)

| Capacidad | Dónde se desarrolla |
| --- | --- |
| Árbol metadata / manifests | [capítulo 2](02-tablas-snapshots-y-manifests.md) |
| Hidden partitioning y evolución de specs | [capítulo 3](03-particionado-oculto.md) |
| Evolución de esquema por **column IDs** | [capítulo 4](04-evolucion-de-esquema.md) |
| Lectura/escritura con Spark | [capítulo 5](05-lectura-y-escritura-con-spark.md) |
| Hadoop / Hive / REST / JDBC | [capítulo 6](06-catalogos.md) |
| Compaction, manifests, expire, orphans | [capítulo 7](07-optimizacion.md) |

## Multi-engine

Spark es el motor **pedagógico** de este manual: la documentación oficial lo trata como el más completo hoy. Iceberg también tiene conectores para Flink, Trino, Presto, Hive y otros. **No** hay paridad de features: un `MERGE` que funciona en Spark no implica el mismo soporte en Trino o Flink. Lo que sí comparte un motor compatible es la spec, el catálogo y las *features* que la tabla ya activó.

Delta Lake resuelve un problema parecido (tabla lakehouse sobre un lago) con **otro** árbol de metadatos y otro ecosistema. Este manual no es una comparativa.

## Spec

La spec **v1, v2 y v3** están adoptadas. La **v4 está en desarrollo** y no está formalmente adoptada: no la uses como formato de producción. Subir `format-version` puede añadir capacidades que un lector antiguo no entiende. Más nuevo no es automáticamente mejor.

Siguiente: [Tablas, snapshots y manifests](02-tablas-snapshots-y-manifests.md).

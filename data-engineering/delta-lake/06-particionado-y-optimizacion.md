# Particionado y optimización

El snapshot puede ser correcto y las lecturas, caras. Los tres problemas habituales: **demasiados ficheros pequeños**, **leer ficheros que el predicado no necesita**, y **particiones mal elegidas** (demasiadas o ninguna cuando el filtro es estable).

Documentación: [optimizaciones OSS](https://docs.delta.io/latest/optimizations-oss.html), [DeltaTable.optimize](https://docs.delta.io/latest/api/python/spark/index.html).

## Primero el layout, luego la herramienta

Un stream que hace append cada pocos segundos deja miles de Parquet de 2 MB. `SELECT` sobre `/data/events` abre todos. Un `WHERE event_date = DATE '2026-09-08'` sin particionar ni estadísticas útiles lee de más. Un `PARTITIONED BY (user_id)` crea millones de directorios de un fichero.

Mide: número de ficheros (`DESCRIBE DETAIL`), tamaño medio, predicados reales de las queries. No “optimices” una tabla de laboratorio de 20 MB.

## Particionar

Particionar **corta** el árbol de directorios. Spark puede hacer **partition pruning**: si el plan ve `event_date = …`, no lista el resto de particiones.

Tiene sentido cuando:

- el filtro es casi siempre la misma columna de **baja o media** cardinalidad (`event_date`, `country`, `pipeline_date`);
- cada partición acumula volumen (orientativamente cientos de MB o más, no 12 KB);
- el DML (`DELETE`/`MERGE` del día) se acota a esas particiones.

No particiones por `event_id`, email o timestamp a segundo. No copies “particionar por todas las columnas del WHERE”. Una columna de cardinalidad altísima destruye el listing y empeora el small-file problem.

El particionado se fija al crear (capítulo 2). Cambiarlo implica reescribir la tabla.

## Data skipping ≠ partition pruning

Al escribir, Delta guarda **estadísticas por fichero** (mínimo, máximo, nulls) de las primeras columnas del esquema (`delta.dataSkippingNumIndexedCols`; las columnas anidadas cuentan). En el plan, un `WHERE event_type = 'purchase'` puede **saltar ficheros** cuyo min/max no cubre ese valor, **aunque la tabla no esté particionada**.

| | Qué descarta | Dónde vive |
| --- | --- | --- |
| **Partition pruning** | Directorios enteros | Layout Hive-style |
| **Data skipping** | Ficheros dentro (o sin) particiones | Stats del log / footer |

No son lo mismo. Skipping funciona mejor si los valores de la columna filtrada **no** están mezclados en todos los ficheros (de ahí Z-Order). Strings/binarios largos son caros de estadificar: reordena columnas o baja `dataSkippingNumIndexedCols`.

No configuras skipping “on/off” por query: se aplica cuando las stats existen y el predicado es usable.

## Compaction: `OPTIMIZE`

El *small-file problem* se ataca compactando: menos ficheros, mismo snapshot lógico.

En **Delta Lake OSS** existe `OPTIMIZE` (bin-packing). Los lectores no se rompen: isolation de snapshot; `OPTIMIZE` no cambia filas (`dataChange = false` en la compactación).

```sql
OPTIMIZE delta.`/data/events`;
OPTIMIZE delta.`/data/events` WHERE event_date >= '2026-09-01';
```

```python
from delta.tables import DeltaTable

(
    DeltaTable.forPath(spark, "/data/events")
    .optimize()
    .where("event_date >= '2026-09-01'")
    .executeCompaction()
)
```

Compactar **todo** cada hora en una tabla de terabytes es un coste, no una virtud. Acota particiones calientes. Un stream que usa la tabla como source **no** se invalida porque `OPTIMIZE` reescriba ficheros.

En la página OSS aparecen también *auto compaction* y *optimized write*, con keys `spark.databricks.delta.autoCompact.*` / `optimizeWrite` y propiedades `delta.autoOptimize.*`. Son opciones del runtime Spark/Delta, no el producto Databricks “Auto Optimize” / Predictive Optimization. Si las usas, trátalas como **tuning**, no como sustituto de un `OPTIMIZE` consciente.

## Z-Ordering

`ZORDER BY` reorganiza filas **dentro** de los ficheros para colocalizar valores de una o pocas columnas muy filtradas (alta cardinalidad que **no** quieres como partición: `event_type` + `customer_id` en consultas puntuales). El data skipping aprovecha min/max más selectivos.

```sql
OPTIMIZE events ZORDER BY (event_type);
```

```python
from delta.tables import DeltaTable

DeltaTable.forPath(spark, "/data/events").optimize().executeZOrderBy("event_type")
```

No “Z-Order siempre mejora todo”. Cada columna extra diluye la localidad. Z-Order sobre una columna **sin** estadísticas es tirar CPU. No sustituye un esquema y un particionado razonables. Es un rewrite: cóstalo.

## Clustering moderno (alcance)

La table feature **clustering** (liquid clustering en la jerga) existe en Delta Lake reciente y **sube el protocolo**. Automatic Liquid Clustering / Predictive Optimization son **Databricks** (Unity Catalog managed). Este manual no lo toma como estándar OSS cotidiano: si lo activas en OSS, comprueba que **todos** los readers/writers entienden la feature. Aquí el camino base es partición bien elegida + `OPTIMIZE` + Z-Order puntual.

Siguiente: [Streaming](07-streaming.md).

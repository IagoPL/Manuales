# Time travel

Cada commit deja un snapshot. Time travel es **leer ese snapshot**, no clonar el storage a un backup.

Documentación: [consultar un snapshot anterior](https://docs.delta.io/latest/delta-batch.html), [utilidades: HISTORY, VACUUM, RESTORE](https://docs.delta.io/latest/delta-utility.html).

## VERSION / TIMESTAMP AS OF

```sql
SELECT *
FROM delta.`/data/events`
VERSION AS OF 12;

SELECT *
FROM delta.`/data/events`
TIMESTAMP AS OF '2026-09-01T00:00:00.000Z';
```

```python
ayer = spark.read.format("delta").option("versionAsOf", 12).load("/data/events")
por_hora = (
    spark.read.format("delta")
    .option("timestampAsOf", "2026-09-01T00:00:00.000Z")
    .load("/data/events")
)
```

Usos reales: reproducir un entrenamiento, comparar “qué había cuando falló el job”, deshacer un overwrite en lectura (el snapshot 0 sigue ahí aunque el actual sea el 1), fijar un DataFrame para que **no** cambie entre invocaciones mientras el stream sigue escribiendo.

El timestamp se resuelve al último commit **no posterior** a ese instante. Si pides una versión o un tiempo fuera de lo retenido, falla.

## Historial de commits ≠ leer el snapshot

```sql
DESCRIBE HISTORY delta.`/data/events`;
DESCRIBE HISTORY delta.`/data/events` LIMIT 20;
```

```python
from delta.tables import DeltaTable

DeltaTable.forPath(spark, "/data/events").history(20).show(truncate=False)
```

`HISTORY` lista metadatos: `version`, `timestamp`, `operation` (`WRITE`, `MERGE`, `DELETE`, `OPTIMIZE`, …), predicados, métricas. Por defecto el historial de log se conserva **30 días** (`delta.logRetentionDuration`). Eso te dice *qué pasó*.

`VERSION AS OF` te da *las filas de ese momento*. Puedes tener historia de commits y **no** poder leer el snapshot si los data files ya se vacuumearon.

`DESCRIBE DETAIL` enseña location, número de ficheros del snapshot actual, `minReaderVersion` / `minWriterVersion`. No es time travel.

## Time travel no es un backup

```text
time travel  ≠  backup independiente
```

La historia depende de tres cosas a la vez:

1. **transaction log** (commits + checkpoints);
2. **data files** que esos snapshots aún referencian;
3. **políticas de retención** y de si alguien ejecutó `VACUUM`.

Si pierdes el bucket, un ransomware cifra el prefix, o un humano borra `/data/events`, no hay máquina del tiempo. Copia snapshots a otro bucket/cuenta, usa el versionado del object store o un job de backup. Time travel es **conveniencia sobre el mismo storage**.

`RESTORE` crea un **commit nuevo** que vuelve a apuntar a ficheros de una versión anterior. Es útil para revertir un MERGE malo. Un stream que lee la tabla puede **reprocesar** ficheros que ya vio: no es un undo invisible.

```sql
RESTORE TABLE delta.`/data/customers` TO VERSION AS OF 40;
```

## VACUUM y retención

`VACUUM` **no** corre solo. Borra del storage los data files (y el CDF asociado) que **ningún snapshot dentro de la retención** necesita. No borra el log: los JSON viejos se limpian al escribir checkpoints, según `delta.logRetentionDuration`.

Defaults documentados (OSS):

| Propiedad | Default | Efecto |
| --- | --- | --- |
| `delta.deletedFileRetentionDuration` | 7 días (`interval 1 week`) | Antigüedad mínima de un fichero ya “borrado” del snapshot para que `VACUUM` pueda eliminarlo. |
| `delta.logRetentionDuration` | 30 días | Tras un checkpoint, se pueden retirar entradas de log más viejas. |

```sql
VACUUM delta.`/data/events`;              -- retención por defecto (7 días)
VACUUM delta.`/data/events` DRY RUN;      -- lista, no borra
VACUUM delta.`/data/events` RETAIN 168 HOURS;
```

```python
from delta.tables import DeltaTable

DeltaTable.forPath(spark, "/data/events").vacuum()  # 7 días
```

La documentación recomienda **no bajar de 7 días** en producción: readers y writers lentos, y streams que van atrasados, pueden seguir necesitando ficheros “viejos”. Si `VACUUM` borra un fichero aún en uso, el job falla o, peor, la tabla se corrompe.

`VACUUM … RETAIN 0 HOURS` (o equivalente) **no** es una práctica normal. En un laboratorio, solo con la comprobación de retención desactivada y asumiendo que **nadie** lee snapshots antiguos ni hay writers concurrentes. En cuanto lo haces, el time travel a esas versiones desaparece.

`VACUUM LITE` (Delta 3.3+) usa el log en vez de listar todo el directorio; si el log ya se podó, puede no poder completarse.

Para alinear time travel de **datos** con 30 días de historia aunque vacuumées, sube `delta.deletedFileRetentionDuration` a 30 días: pagas storage.

Siguiente: [Particionado y optimización](06-particionado-y-optimizacion.md).

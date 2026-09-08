# Particionado oculto

Iceberg **sí** particiona. Lo que cambia respecto a Hive-style es que el usuario no mantiene una columna `event_date` ni la escribe en cada `WHERE`. El **partition spec** vive en los metadatos; el motor traduce filtros sobre columnas lógicas.

Documentación: [partitioning](https://iceberg.apache.org/docs/latest/partitioning/), [evolución](https://iceberg.apache.org/docs/latest/evolution/), [spec](https://iceberg.apache.org/spec/).

## De `timestamp` a `day(timestamp)`

La tabla `local.analytics.events` se declara así:

```sql
CREATE TABLE local.analytics.events (
  id BIGINT,
  event_time TIMESTAMP,
  type STRING
)
USING iceberg
PARTITIONED BY (days(event_time));
```

(`day(event_time)` es la forma corta; `days(...)` sigue aceptada.)

El writer **no** inserta `event_date`. Iceberg calcula la partición. La consulta:

```sql
SELECT type, count(*) AS n
FROM local.analytics.events
WHERE event_time >= TIMESTAMP '2026-09-08 00:00:00'
  AND event_time <  TIMESTAMP '2026-09-09 00:00:00';
```

no necesita `AND event_date = DATE '2026-09-08'`. El planner deriva el predicado de partición y salta ficheros de otros días.

**Hidden ≠ “no hay particiones”.** Hay un layout físico. Lo oculto es el contrato con el analista: las queries no están atadas a ese layout.

## Partition spec

Un spec es metadata: lista de campos `(source column → transform → partition field)`. Cada campo tiene un **partition field id**. Varios specs pueden coexistir en la misma tabla (evolución).

## Transforms habituales

| Transform | Uso típico |
| --- | --- |
| `identity` | La columna *es* la partición (`type`, `country`). |
| `bucket(N, col)` | Reparto en N cubos (evitar cardinalidad explosiva de un id). |
| `truncate(W, col)` | Prefijo / truncado (strings, decimales). |
| `year` / `month` / `day` / `hour` | Granularidad temporal sobre un timestamp. |

```sql
-- identidad + día (Spark)
PARTITIONED BY (type, days(event_time))

-- buckets (no uses bucket(1_000_000, user_id) “por si acaso”)
PARTITIONED BY (bucket(16, user_id))
```

No memorices todas las combinaciones. Elige la que coincide con **el filtro real** y con un volumen decente por partición.

## Partition evolution

Hive obliga a una tabla nueva para pasar de diario a horario. Iceberg cambia el spec **sin** reescribir los ficheros viejos:

```text
spec 0:  days(event_time)
spec 1:  hours(event_time)
```

Los Parquet de 2024 siguen en spec 0. Los writes nuevos usan spec 1. El planner hace *split planning*: un filtro por cada spec.

```sql
ALTER TABLE local.analytics.events ADD PARTITION FIELD hours(event_time);
-- o reemplazar el campo diario:
ALTER TABLE local.analytics.events REPLACE PARTITION FIELD event_time_day WITH hours(event_time);
```

Es una operación de **metadatos**. No “reoptimiza” el histórico: esos ficheros no se reagrupan solos. Si quieres layout horario en datos viejos, hay que **reescribirlos** (capítulo 7).

## Cardinalidad: Iceberg no perdona un spec malo

Hidden partitioning no autoriza particionar por `event_id` o por timestamp al milisegundo.

- **Cardinalidad** altísima → miles de directorios/ficheros minúsculos.
- **Distribución** sesgada → una partición gigante y mil vacías.
- **Pruning** solo ayuda si el `WHERE` se alinea con el transform.
- **Tamaño de fichero** por partición: cientos de MB suelen ser más sanos que 80 ficheros de 2 MB.

`bucket` existe precisamente para *no* materializar un id único como partición. Úsalo con N pequeño y medido.

Siguiente: [Evolución de esquema](04-evolucion-de-esquema.md).

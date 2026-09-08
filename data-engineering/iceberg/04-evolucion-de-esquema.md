# Evolución de esquema

Iceberg identifica cada campo por un **column ID** (y IDs anidados), no por el nombre ni por la posición en el fichero. Por eso un rename no es “borrar y crear”, y un reorder no cambia el significado de las columnas.

Documentación: [evolución](https://iceberg.apache.org/docs/latest/evolution/), [ALTER TABLE](https://iceberg.apache.org/docs/latest/spark-ddl/), [tipos y promociones en la spec](https://iceberg.apache.org/spec/).

## Por qué importan los IDs

Formatos que rastrean por **nombre** pueden “resucitar” datos de una columna droppeada si reutilizas el nombre. Formatos que rastrean por **posición** no pueden droppear sin desplazar el resto.

Iceberg asigna un ID nuevo a cada campo añadido. Los data files antiguos no tienen ese ID: las filas viejas leen `NULL` (o el default declarado). Nadie reescribe Parquet para un `ADD COLUMN`.

**No reutilices ni edites IDs a mano.** Son parte del esquema en el metadata. Manipularlos es corromper la tabla.

## Operaciones (metadata, no rewrite)

Iceberg documenta:

- **add** — columna o campo de struct;
- **drop** — deja de proyectarse; los ficheros no se reescriben;
- **rename** — mismo ID, otro nombre;
- **reorder** — cambia el orden lógico; los valores siguen al ID;
- **update / type widening** — promociones compatibles (p. ej. `int` → `long`, `float` → `double`; v3 admite más). Comprueba la tabla de la spec de *tu* format-version.

Garantías: añadir, quitar, renombrar o reordenar **no** mezcla valores entre columnas.

## Rename seguro

```sql
ALTER TABLE local.analytics.events RENAME COLUMN type TO event_type;
```

`type` → `event_type` **no** es drop + add. El ID sigue siendo el mismo: los Parquet escritos con el nombre viejo se leen como `event_type`. Un drop + add de `event_type` **sí** crearía un ID nuevo y perdería la asociación con los valores antiguos.

```sql
-- evolución típica (IDs nuevos solo en ADD)
ALTER TABLE local.analytics.events ADD COLUMNS (channel STRING);
ALTER TABLE local.analytics.events ALTER COLUMN channel AFTER event_type;
ALTER TABLE local.analytics.events DROP COLUMN channel;  -- ya no se lee; no reescribe
```

## Nested: struct, list, map

Los IDs también viven *dentro* del anidado. Un ejemplo pequeño:

```sql
ALTER TABLE local.analytics.events
ADD COLUMN props STRUCT<browser: STRING, os: STRING>;

ALTER TABLE local.analytics.events
ADD COLUMN props.device STRING;

ALTER TABLE local.analytics.events
RENAME COLUMN props.os TO platform;

-- lista de structs / map: se evoluciona el elemento o el value
ALTER TABLE local.analytics.events
ADD COLUMN tags ARRAY<STRUCT<key: STRING, value: STRING>>;

ALTER TABLE local.analytics.events
ADD COLUMN tags.element.source STRING;
```

Las claves de un `MAP` no admiten add/drop de campos de struct que cambiarían la igualdad. No conviertas esto en la spec completa: si el anidado es profundo, diseña el struct *antes* de llenar terabytes.

## Widening

```sql
ALTER TABLE local.analytics.events ADD COLUMNS (score INT);
-- promoción int → long (válida en v1–v3)
ALTER TABLE local.analytics.events ALTER COLUMN score TYPE BIGINT;
```

Un cambio incompatible (p. ej. `string` → `int`) **no** es evolución in-place. Ahí hay que reescribir o crear columna nueva. No asumas que “Iceberg acepta cualquier ALTER”.

## Escritura y schema merge

Por defecto, un write con columnas de más **falla** (o las ignora, según API). Spark puede evolucionar en el write si la tabla y el writer lo piden (`write.spark.accept-any-schema` + `mergeSchema`). Eso es una **decisión**, no el default operativo. Prefiere `ALTER TABLE` explícito en producción.

Siguiente: [Lectura y escritura con Spark](05-lectura-y-escritura-con-spark.md).

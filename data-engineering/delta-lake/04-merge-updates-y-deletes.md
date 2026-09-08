# MERGE, UPDATE y DELETE

Parquet suelto no tiene DML de tabla. Delta reescribe los data files que contienen las filas afectadas y commitea un snapshot nuevo. `UPDATE`, `DELETE` y `MERGE` son operaciones **caras si el predicado toca muchos ficheros**; no son un `UPDATE` de fila en un B-tree.

Documentación: [deletes, updates y merges](https://docs.delta.io/latest/delta-update.html), [Change Data Feed](https://docs.delta.io/latest/delta-change-data-feed.html).

## DELETE y UPDATE

Clientes actuales en `/data/customers`:

```sql
DELETE FROM delta.`/data/customers`
WHERE status = 'closed' AND country = 'ES';

UPDATE delta.`/data/customers`
SET plan = 'pro'
WHERE customer_id = 9001;
```

```python
from delta.tables import DeltaTable
from pyspark.sql.functions import col, lit

clientes = DeltaTable.forPath(spark, "/data/customers")
clientes.delete("status = 'closed' AND country = 'ES'")
clientes.update(
    condition=col("customer_id") == 9001,
    set={"plan": lit("pro")},
)
```

Sin predicado, `DELETE` vacía la tabla (nuevo snapshot vacío; el historial sigue). Un `WHERE` que no acota particiones obliga a escanear —y potencialmente reescribir— muchos ficheros.

## MERGE: target, source, matching

`MERGE` compara un **target** (tabla Delta) con un **source** (tabla, vista o DataFrame) mediante una condición. Luego:

- `WHEN MATCHED` — la fila existe en ambos: `UPDATE` o `DELETE`;
- `WHEN NOT MATCHED` — solo en el source: `INSERT`;
- `WHEN NOT MATCHED BY SOURCE` — solo en el target: `UPDATE` o `DELETE` (cláusula extendida; úsala con predicado extra o reescribes el target entero).

Upsert de cambios de clientes:

```sql
MERGE INTO delta.`/data/customers` AS target
USING customer_changes AS source
ON target.customer_id = source.customer_id
WHEN MATCHED AND source.op = 'delete' THEN DELETE
WHEN MATCHED THEN UPDATE SET
  email = source.email,
  plan = source.plan,
  status = source.status,
  updated_at = source.updated_at
WHEN NOT MATCHED AND source.op <> 'delete' THEN INSERT (
  customer_id, email, plan, status, updated_at
) VALUES (
  source.customer_id, source.email, source.plan, source.status, source.updated_at
);
```

```python
from delta.tables import DeltaTable

cambios = spark.table("customer_changes")
dest = DeltaTable.forPath(spark, "/data/customers")
dest.alias("target").merge(
    cambios.alias("source"),
    "target.customer_id = source.customer_id",
).whenMatchedDelete(
    condition="source.op = 'delete'"
).whenMatchedUpdate(
    set={
        "email": "source.email",
        "plan": "source.plan",
        "status": "source.status",
        "updated_at": "source.updated_at",
    }
).whenNotMatchedInsert(
    condition="source.op <> 'delete'",
    values={
        "customer_id": "source.customer_id",
        "email": "source.email",
        "plan": "source.plan",
        "status": "source.status",
        "updated_at": "source.updated_at",
    },
).execute()
```

`updateAll()` / `insertAll()` / `UPDATE SET *` exigen que el source tenga las columnas del target. Las columnas extra del source se ignoran salvo que actives evolución de esquema en ese merge.

## MERGE no es magia

- **Coste.** Delta localiza ficheros candidatos, reescribe los que contienen matches y commitea Add+Remove. Un merge diario sobre toda la dimensión es un full rewrite encubierto.
- **La condición importa.** Si el target está particionado por `country`, incluye `target.country = source.country` **y**, si el job es por país, `target.country = 'ES'`. Así reduces el espacio de búsqueda y los conflictos con otros writers (capítulo 3).
- **Clave.** `customer_id` (o la clave de negocio) debe identificar **una** fila target. Si el source trae **dos** filas para el mismo `customer_id`, el merge falla o el resultado es ambiguo: deduplica el source antes.
- **No es “siempre rápido”.** Ni sustituye un índice OLTP. Mídelo; acota particiones; no merges contra la tabla de eventos crudos si puedes aplicar el cambio en una tabla estrecha.

Sirve para upserts, CDC aplicado a una tabla actual, SCD tipo 1 (pisar atributos) o pasos de deduplicación. No convierte este capítulo en un manual de modelado dimensional.

## Change Data Feed no es MERGE

`MERGE` **aplica** un source sobre un target. **Change Data Feed (CDF)** **registra** cambios de fila entre versiones (`insert`, `update_preimage`, `update_postimage`, `delete`) para que otro job los lea.

No está activo en todas las tablas. Hay que habilitarlo:

```sql
ALTER TABLE events SET TBLPROPERTIES (delta.enableChangeDataFeed = true);
```

En tablas nuevas, `TBLPROPERTIES` en el `CREATE`. Los registros viven (cuando hacen falta ficheros extra) bajo `_change_data` y **siguen la retención de la tabla**: un `VACUUM` también se los lleva. CDF no es un sistema de auditoría permanente salvo que **copies** el feed a otra tabla o a un log externo.

Lectura batch:

```sql
SELECT *
FROM table_changes_by_path('/data/customers', 18, 22);
```

Streaming: `.option("readChangeFeed", "true")` (capítulo 7). Columnas extra: `_change_type`, `_commit_version`, `_commit_timestamp`.

Si lees CDF desde antes de habilitarlo, falla: no hay eventos de cambio que inventar.

Siguiente: [Time travel](05-time-travel.md).

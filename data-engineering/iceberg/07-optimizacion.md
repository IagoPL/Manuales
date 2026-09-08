# Optimización

El snapshot puede ser correcto y la tabla, cara: **small files**, manifests hinchados, **demasiados snapshots**, metadata JSON acumulado y **orphan files**. Iceberg no tiene un comando `OPTIMIZE` genérico. En Spark se usan **procedures** `CALL catalog.system.*`.

Documentación: [procedures](https://iceberg.apache.org/docs/latest/spark-procedures/), [streaming / mantenimiento](https://iceberg.apache.org/docs/latest/spark-structured-streaming/). En Spark 3.x, `CALL` necesita las Iceberg extensions.

## Rewrite data files (compaction)

Muchos Parquet de unos MB → menos ficheros del tamaño objetivo (`write.target-file-size-bytes`). Eso recorta metadata y file-open cost.

```sql
CALL local.system.rewrite_data_files(table => 'analytics.events');

CALL local.system.rewrite_data_files(
  table => 'analytics.events',
  strategy => 'sort',
  sort_order => 'type ASC NULLS LAST, id ASC'
);

CALL local.system.rewrite_data_files(
  table => 'analytics.events',
  strategy => 'sort',
  sort_order => 'zorder(type, id)'
);
```

Estrategias oficiales: **`binpack`** (default, agrupa) y **`sort`**. Z-order se pide *dentro* de `sort` con `zorder(...)`. No es automáticamente superior: sirve cuando filtras por **varias** columnas de alta cardinalidad y has medido el coste del rewrite. Un `where` acota particiones.

`rewrite_data_files` **no** es `rewrite_manifests`.

## Rewrite manifests

Cada append rápido (sobre todo streaming) puede dejar muchos manifests pequeños. Reescribirlos agrupa entradas y mejora el planning; **no** reescribe data files.

```sql
CALL local.system.rewrite_manifests(table => 'analytics.events');
```

1.11 añade `sort_by` opcional para agrupar manifests. Úsalo si el listing de manifests duele, no en cada micro-batch.

## Expire snapshots

Cada write crea un snapshot. Iceberg los conserva para isolation y time travel **hasta que los expiras**.

```sql
CALL local.system.expire_snapshots(
  table => 'analytics.events',
  older_than => TIMESTAMP '2026-09-01 00:00:00.000',
  retain_last => 10
);
```

Defaults documentados: si no pasas argumentos, rigen las **table properties**; el procedure usa `older_than` ≈ **5 días** y `retain_last` = 1 cuando aplican esos defaults. **No** borra ficheros aún referenciados por un snapshot vivo.

Refs: branches y tags **impiden** expirar el snapshot que apuntan. Por defecto las refs no caducan; `main` **nunca** expira. No lances “borra todo lo viejo” si `audit` o un tag de auditoría siguen vivos.

```text
time travel  ⊂  snapshots retenidos
retención    =  older_than / retain_last / refs
storage      =  lo que aún referencia algún snapshot
```

Retención agresiva (horas) no es práctica universal: rompe jobs largos y cualquier time travel operativo.

`clean_expired_metadata => true` limpia **schemas/specs** ya no referenciados. Es **otra** palanca, no lo mismo que borrar orphans.

## Remove orphan files

Un orphan es un fichero **bajo el location de la tabla** que **ningún** metadata (ni snapshots expirados ya registrados) referencia: un job que murió a mitad, un copy a mano, un prefix equivocado.

```sql
CALL local.system.remove_orphan_files(
  table => 'analytics.events',
  dry_run => true
);
```

Default `older_than` ≈ **3 días**. Es **peligroso** si:

- hay un writer aún commiteando;
- `older_than` es “hace 10 minutos”;
- el prefix/scheme no coincide (`s3` vs `s3a`) y fuerzas `DELETE`.

Empieza siempre con `dry_run => true`. No es `expire_snapshots`.

## Tres limpiezas distintas

| Procedure | Qué quita |
| --- | --- |
| `expire_snapshots` | Snapshots viejos **y** los data/manifest files que **solo** ellos usaban |
| `remove_orphan_files` | Bytes huérfanos, no referenciados por metadata |
| metadata JSON viejo | Se poda con políticas / `clean_expired_metadata`; no lo borres a mano |

No edites ni borres `metadata/*.json` en el bucket para “recuperar” la tabla.

Siguiente: [Buenas prácticas](08-buenas-practicas.md).

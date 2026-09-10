# Snapshots y seeds

::: v-pre

Seeds y snapshots entran en el DAG y se leen con `ref()`. No son models. Un seed **carga** un CSV del repo. Un snapshot **versiona filas** de una tabla mutable (SCD tipo 2). Mezclarlos con “poner datos en dbt” es el error habitual de este capítulo.

Documentación: [seeds](https://docs.getdbt.com/docs/build/seeds), [snapshots](https://docs.getdbt.com/docs/build/snapshots), [config de snapshots](https://docs.getdbt.com/reference/snapshot-configs).

## Seeds: CSV versionado, no el ELT

Un seed es un `.csv` en `seeds/` (o el `seed-paths` del proyecto). `dbt seed` crea una tabla en el target. Downstream:

```sql
select
    orders.*,
    countries.country_name
from {{ ref('stg_orders') }} as orders
left join {{ ref('country_codes') }} as countries
    on orders.country_code = countries.country_code
```

`seeds/country_codes.csv`:

```csv
country_code,country_name
US,United States
ES,Spain
MX,Mexico
```

Sirve para mapeos que cambian poco, listas de exclusión, IDs de cuentas internas. **No** sirve para volcar un export de producción ni para PII. El CSV vive en git: cada fila es una revisión de código, no un load performante.

Por defecto dbt **trunca e inserta**. Si cambias columnas, hace falta `dbt seed --full-refresh` (drop + recreate). Tipado: dbt infiere, o fijas `column_types` (por ejemplo un CP como `varchar` para no perder ceros a la izquierda).

Tests y docs en YAML:

```yaml
seeds:
  - name: country_codes
    description: ISO-2 a nombre. Grain: country_code.
    columns:
      - name: country_code
        data_tests:
          - unique
          - not_null
```

## Snapshots: historial de una tabla que se pisa

La tabla origen `orders` tiene un `status` que se **sobrescribe**:

| id | status | updated_at |
| --- | --- | --- |
| 1 | pending | 2024-01-01 |

Al día siguiente el mismo `id` es `shipped`. Sin snapshot perdiste “cuánto tardó en salir”. El snapshot guarda una fila por intervalo de validez:

| id | status | updated_at | dbt_valid_from | dbt_valid_to |
| --- | --- | --- | --- | --- |
| 1 | pending | 2024-01-01 | 2024-01-01 | 2024-01-02 |
| 1 | shipped | 2024-01-02 | 2024-01-02 | null |

Eso es SCD2. No es un modelo incremental: el incremental actualiza la tabla **tuya**; el snapshot observa **otra** relación y escribe un historial.

### YAML (dbt Core v1.9+)

La forma actual declara el snapshot en YAML. `relation` es `source()` o `ref()`. Las recetas antiguas con `{% snapshot %}` en `.sql` son el legado pre-1.9.

`snapshots/orders_snapshot.yml`:

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('raw', 'orders')
    config:
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
```

```bash
dbt snapshot
```

Downstream: `ref('orders_snapshot')`. Hay que **programar** `dbt snapshot`: si no corre, no hay historia.

Si necesitas filtrar o deduplicar antes, un modelo `ephemeral` y `relation: ref('ephemeral_orders')`. No metas transformaciones de negocio gordas en el snapshot.

### Estrategias

| Estrategia | Detecta cambio con | Cuándo |
| --- | --- | --- |
| `timestamp` | Columna `updated_at` | Preferible si el origen tiene un timestamp fiable |
| `check` | `check_cols` (lista o `all`) | No hay timestamp de verdad |

`timestamp` aguanta mejor columnas nuevas o borradas: solo mira un campo. `check` obliga a mantener `check_cols` al evolucionar el esquema.

`unique_key` tiene que ser única de verdad. Si no lo es, el snapshot mezcla vidas de filas distintas. Testea unicidad en la source.

### Borrados y `dbt_valid_to`

`hard_deletes` (v1.9+):

- `ignore` (defecto): si la fila desaparece del origen, la versión actual sigue abierta;
- `invalidate`: cierra `dbt_valid_to` en las filas que ya no están;
- `new_record`: registra el borrado como fila nueva (metadatos de snapshot).

`invalidate_hard_deletes: true` es la receta vieja; el config actual es `hard_deletes`.

Por defecto la versión vigente tiene `dbt_valid_to` en `NULL`. `dbt_valid_to_current` (p. ej. `'9999-12-31'`) facilita rangos `between` sin tratar nulos.

En v1.9, `target_schema` dejó de ser obligatorio: el snapshot puede ser environment-aware como el resto de recursos (`generate_schema_name`). Un schema aparte sigue siendo buena idea para no mezclar historial con marts.

## Qué no son

| | Seed | Snapshot | Source | Incremental |
| --- | --- | --- | --- | --- |
| Origen de los datos | CSV en git | Tabla que ya existe | Tabla que ya existe | `SELECT` del proyecto |
| Comando | `dbt seed` | `dbt snapshot` | ninguno (ELT externo) | `dbt run` / `build` |
| Pregunta | “¿esta lookup está en el repo?” | “¿cómo era esta fila ayer?” | “¿dónde aterriza el ELT?” | “¿cómo construyo solo lo nuevo?” |

Un snapshot **no** sustituye backups ni CDC completo del origen. Un seed **no** sustituye el loader.

## Errores comunes

- Seeds de millones de filas o de datos personales.
- Snapshot sin `unique_key` real.
- `check` sobre `all` en tablas anchas que cambian de esquema cada semana.
- Correr `dbt run` y asumir que los snapshots se actualizan.
- Usar el snapshot como staging: el grain pasa a ser “versión de fila”, no “pedido actual”.

## Buenas prácticas

- Seeds pequeños, revisados en PR, con tests de unicidad.
- `timestamp` si el origen miente poco; si `updated_at` no se toca al cambiar `status`, usa `check`.
- Schema propio para snapshots.
- Modelos analíticos encima de `ref('orders_snapshot')` con filtro `dbt_valid_to is null` cuando quieras el estado actual.
- `dbt compile --select orders_snapshot` (Core v1.12+) para ver el SQL generado.

## Ejercicio

1. Añade `country_codes.csv` y úsalo desde `stg_orders` con `ref()`.
2. Declara `orders_snapshot` sobre `source('raw', 'orders')` con `strategy: timestamp`.
3. Ejecuta `dbt snapshot` dos veces cambiando un `status` en origen y comprueba `dbt_valid_from` / `dbt_valid_to`.
4. Escribe un modelo que cuente horas entre `pending` y `shipped` usando solo el snapshot.

## Siguiente paso

[Macros y Jinja](05-macros-y-jinja.md): cómo se compiló `source()`, `ref()` y el resto de llaves que ya usaste.

:::

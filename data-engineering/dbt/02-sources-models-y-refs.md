# Sources, models y refs

::: v-pre

Un modelo de dbt es un `SELECT`. dbt lo envuelve en el DDL del warehouse (`create view as` / `create table as`) y lo construye en el schema del target. El nombre del modelo es el del fichero (sin extensión), sensible a mayúsculas. Un fichero, un modelo.

`source()` y `ref()` son funciones Jinja. No son SQL del warehouse: dbt las resuelve al **compilar**. El SQL que llega al motor ya tiene nombres cualificados.

Documentación: [SQL models](https://docs.getdbt.com/docs/build/sql-models), [sources](https://docs.getdbt.com/docs/build/sources), [`source()`](https://docs.getdbt.com/reference/dbt-jinja-functions/source), [`ref()`](https://docs.getdbt.com/reference/dbt-jinja-functions/ref).

## El problema que resuelven

Sin ellas, el SQL apunta a `raw.public.orders` o `analytics.stg_orders` a mano. Eso rompe tres cosas:

- el grafo: dbt no sabe qué construir antes;
- los entornos: el mismo modelo en `dev` debería leer `dbt_ana.stg_orders`, no la tabla de producción;
- el lineage: la documentación no puede dibujar de dónde viene cada columna.

```text
ELT (Fivetran, Airbyte, pipe interno, …)
        ↓
  tablas crudas en el warehouse     ← source()
        ↓
  models/staging/*.sql              ← limpia, tipa, renombra
        ↓
  models/marts/*.sql                ← ref() entre modelos
        ↓
  BI / reverse ETL / otros modelos
```

## Sources: el borde del proyecto

Una source nombra tablas que **otro proceso** carga. dbt no las crea. Las declara para poder testearlas, documentarlas y calcular frescura.

`models/staging/_sources.yml`:

```yaml
sources:
  - name: raw
    database: raw
    schema: public
    tables:
      - name: orders
      - name: customers
        identifier: api_customers
```

- `name` es el nombre **en el proyecto**.
- `database` / `schema` / `identifier` son el nombre **en el warehouse** cuando no coincide.

Modelo `models/staging/stg_orders.sql`:

```sql
select
    id as order_id,
    customer_id,
    status,
    amount,
    order_date
from {{ source('raw', 'orders') }}
```

`source('raw', 'orders')` se compila a algo como `raw.public.orders`. El segundo argumento es el `name` de la tabla, no el `identifier`. En el ejemplo de `customers`, `source('raw', 'customers')` apunta a `api_customers`.

### Freshness

Puedes pedir a dbt que compruebe si la source se actualiza a tiempo. En dbt Core v1.9+ `freshness` y `loaded_at_field` van bajo `config`:

```yaml
sources:
  - name: raw
    database: raw
    schema: public
    config:
      freshness:
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
      loaded_at_field: _etl_loaded_at
    tables:
      - name: orders
      - name: product_skus
        config:
          freshness: null
```

```bash
dbt source freshness
dbt build --select source_status:fresher+
```

`dbt source freshness` no construye modelos: consulta `max(loaded_at_field)` y compara con el SLA. `freshness: null` excluye una tabla del chequeo.

Fusion y dbt State pueden inferir frescura con metadatos del warehouse. Sigue haciendo falta `freshness` si quieres alertas de SLA o lógica custom (`loaded_at_query`). Este manual no asume Fusion.

## Models: SELECT versionado

`models/marts/fct_orders.sql`:

```sql
select
    order_id,
    customer_id,
    order_date,
    amount
from {{ ref('stg_orders') }}
where amount > 0
```

Por defecto dbt materializa como **view** en el schema del target. `dbt run` (o `dbt build`) crea o reemplaza la relación de forma atómica según el adapter.

El dialecto es el del warehouse. dbt no traduce `SELECT`; traduce el envoltorio DDL/DML.

Configuración jerárquica: `dbt_project.yml` para un directorio, `{{ config(...) }}` o YAML de propiedades para un modelo. Las materializaciones son el [capítulo 6](06-materializaciones.md).

## `ref()`: DAG y entorno

`ref('stg_orders')` hace dos cosas:

1. **Dependencia.** dbt ordena el grafo: no construye `fct_orders` hasta que `stg_orders` exista.
2. **Resolución.** Sustituye el nombre por la relación del target actual (`dbt_ana.stg_orders` en dev, `analytics.stg_orders` en prod).

Por eso no escribas `analytics.stg_orders` en un modelo. Ese literal ignora el target.

También puedes `ref()` un seed o un snapshot: el grafo no es solo de models.

Dos argumentos desambiguan paquetes u otros proyectos: `ref('mi_paquete', 'stg_orders')`. Dentro de un proyecto los nombres de modelo/seed/snapshot deben ser únicos, aunque vivan en carpetas distintas.

### `ref()` oculto al parsear

dbt descubre `ref()` en la fase de parse. Un `ref()` dentro de un `{% if %}` que no se evalúa al parsear aparece “de golpe” en runtime y falla. No escondas `ref()` detrás de condiciones que dbt no ve al analizar el proyecto.

## Qué no mezclar

| Recurso | Lo crea dbt | Cómo se lee | Típico |
| --- | --- | --- | --- |
| Source | No | `source('raw', 'orders')` | Landing ELT |
| Model | Sí | `ref('stg_orders')` | Transformación |
| Seed | Sí (`dbt seed`) | `ref('country_codes')` | CSV pequeño en el repo ([capítulo 4](04-snapshots-y-seeds.md)) |
| Snapshot | Sí (`dbt snapshot`) | `ref('orders_snapshot')` | SCD2 de una tabla mutable |

Staging lee **sources**. Marts leen **models** (y a veces seeds/snapshots). Un mart que hace `source()` salta la capa de limpieza y duplica tipado.

## Errores comunes

- Hardcodear `schema.tabla` “porque en prod se llama así”.
- Usar `source()` entre modelos propios: no son sources.
- Declarar la source con un `name` y consultar otro (`orders` vs `order`).
- Un modelo que selecciona tres facts y dos dimensions: el fichero deja de ser revisable.
- Confiar en el orden de `dbt run --select` a mano en lugar del grafo.

## Buenas prácticas

- Un modelo, una responsabilidad; nombres `stg_`, `int_`, `dim_`, `fct_`.
- `identifier` / `schema` cuando el warehouse es feo; `name` cuando el proyecto debe leerse bien.
- Tests de unicidad y no nulos en las sources críticas (capítulo 3), no solo en los marts.
- `dbt compile` y `target/compiled/` para ver el SQL real antes de pelearte con el warehouse.

## Ejercicio

1. Declara `raw.orders` y `raw.customers` (con `identifier` si el nombre físico no coincide).
2. Escribe `stg_orders` y `stg_customers` solo con `source()`.
3. Escribe `fct_orders` solo con `ref()`.
4. Ejecuta `dbt run --select stg_orders+` y comprueba en `target/compiled/` que los schemas son los del target, no literales.

## Siguiente paso

[Tests, documentación y lineage](03-tests-documentacion-y-lineage.md): aserciones sobre sources y modelos, y el grafo que `ref()` / `source()` ya construyeron.

:::

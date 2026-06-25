# Manual de dbt

dbt es una herramienta para transformar datos dentro de un data warehouse o lakehouse usando SQL, control de versiones, tests, documentacion y dependencias entre modelos.

No sustituye a Airflow, Spark ni Snowflake. dbt se centra en la capa de transformacion analitica: convertir tablas crudas en modelos limpios, consistentes y documentados.

## Capitulos previstos

1. [Introduccion y proyecto](01-introduccion-y-proyecto.md)
2. [Sources models y refs](02-sources-models-y-refs.md)
3. [Tests documentacion y lineage](03-tests-documentacion-y-lineage.md)
4. [Snapshots y seeds](04-snapshots-y-seeds.md)
5. [Macros y Jinja](05-macros-y-jinja.md)
6. [Materializaciones](06-materializaciones.md)
7. [CI CD](07-ci-cd.md)
8. [Buenas practicas](08-buenas-practicas.md)

## Que problema resuelve

Sin dbt, muchas transformaciones analiticas terminan como SQL disperso en notebooks, herramientas BI, scripts manuales o jobs dificiles de auditar. dbt aporta:

- Proyecto versionado.
- Dependencias explicitas entre modelos.
- Tests de calidad.
- Documentacion generada.
- Reutilizacion con macros.
- Ejecucion reproducible por entornos.

## Estructura habitual

```txt
dbt_project.yml
models/
  sources.yml
  staging/
  marts/
seeds/
snapshots/
macros/
tests/
```

Capas recomendadas:

- `sources`: tablas origen declaradas.
- `staging`: limpieza ligera, renombres y tipado.
- `intermediate`: transformaciones reutilizables.
- `marts`: modelos finales orientados a negocio.

## Primer modelo

Modelo `models/staging/stg_orders.sql`:

```sql
select
    order_id,
    customer_id,
    cast(order_date as date) as order_date,
    cast(amount as numeric) as amount
from {{ source('raw', 'orders') }}
```

Modelo `models/marts/fct_orders.sql`:

```sql
select
    order_id,
    customer_id,
    order_date,
    amount
from {{ ref('stg_orders') }}
where amount > 0
```

`source()` apunta a datos externos al proyecto. `ref()` apunta a modelos gestionados por dbt y construye el grafo de dependencias.

## Comandos esenciales

```bash
dbt debug
dbt run
dbt test
dbt docs generate
dbt docs serve
```

## Buenas practicas

- Un modelo debe tener una responsabilidad clara.
- Usa `source()` para datos crudos y `ref()` entre modelos.
- Define tests desde el principio: unicidad, no nulos y relaciones.
- Mantén nombres consistentes: `stg_`, `int_`, `dim_`, `fct_`.
- Evita logica de negocio duplicada en dashboards.

## Errores comunes

- Crear modelos enormes imposibles de revisar.
- Saltarse la capa `staging`.
- No declarar sources.
- Usar macros para ocultar SQL innecesariamente.
- No ejecutar tests en CI.

## Ejercicio

1. Define una source `raw.orders`.
2. Crea `stg_orders`.
3. Crea `fct_orders`.
4. Anade tests para `order_id` unico y no nulo.
5. Genera documentacion del proyecto.

# Materializaciones

::: v-pre

La materialización es **cómo** dbt persiste un modelo en el warehouse. El fichero sigue siendo un `SELECT`. Cambia el envoltorio: view, table, incremental, CTE inlined o materialized view.

Hay cinco built-in: `view` (defecto), `table`, `incremental`, `ephemeral`, `materialized_view`. Las custom existen; no hacen falta para operar un proyecto.

Documentación: [materializations](https://docs.getdbt.com/docs/build/materializations), [incremental models](https://docs.getdbt.com/docs/build/incremental-models).

## Dónde se configura

Jerarquía: directorio en `dbt_project.yml` → YAML de propiedades → `{{ config() }}` en el SQL. Lo más específico gana.

```yaml
# dbt_project.yml
models:
  jaffle_shop:
    +materialized: view
    marts:
      +materialized: table
```

```sql
{{ config(materialized='table') }}

select *
from {{ ref('stg_orders') }}
```

Python models solo soportan `table` e `incremental`. Este capítulo es SQL.

## View

`create view as` en cada `dbt run`. No guarda una copia de los datos. Siempre ve el estado de lo de debajo (otra view, una table, una source).

Encaja en staging ligero (renombres, casts). Una pila de views pesadas es lenta de consultar. No es “gratis”: el coste se paga en el `SELECT` del consumidor.

## Table

`create table as` (o el equivalente atómico del adapter) en cada run. Rápida de leer; se queda vieja hasta el siguiente `dbt run`.

Úsala en marts que sirve BI y en transformaciones caras con muchos hijos. No materialices **todo** como table “por si acaso”: el run se vuelve un full-refresh del almacén.

## Incremental

La primera vez construye la table entera. Las siguientes solo transforman las filas que **tú** filtras e insertan o fusionan en `{{ this }}` (la relación ya existente).

```sql
{{ config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge'
) }}

select
    order_id,
    customer_id,
    status,
    amount,
    updated_at
from {{ ref('stg_orders') }}

{% if is_incremental() %}
where updated_at >= (
    select coalesce(max(updated_at), '1900-01-01') from {{ this }}
)
{% endif %}
```

`is_incremental()` es verdadero solo si la table ya existe, no pasaste `--full-refresh` y el modelo es `incremental`. El SQL tiene que ser válido en **ambos** caminos.

`unique_key` identifica el grain. Con ella, una fila ya vista se actualiza (según estrategia). Sin ella, la mayoría de adapters **añaden** y duplicas. Claves con `NULL` o no únicas generan duplicados o fallos de merge.

Estrategias (`incremental_strategy`) dependen del adapter: `merge`, `append`, `delete+insert`, `insert_overwrite`, … No inventes un nombre: mira el adapter. `insert_overwrite` trabaja por particiones, no por `unique_key`.

```bash
dbt run --full-refresh --select fct_orders+
```

Rebuild completo cuando cambia la lógica histórica. `on_schema_change` (`ignore` / `fail` / `append_new_columns` / `sync_all_columns`) controla columnas nuevas; **no** rellena valores en filas antiguas.

No empieces por incremental. Empieza por view/table. Pasa a incremental cuando el run duele y el grain + `updated_at` (o partición) son claros. Un incremental mal filtrado o es un full scan disfrazado o se come eventos tarde.

## Ephemeral

No crea objeto. dbt inyecta el SQL como CTE (`__dbt__cte__…`) en los modelos que hacen `ref()`. No puedes consultarlo en el warehouse ni `ref()` desde un `run-operation`. No soporta contracts.

Sirve para un paso minúsculo usado por uno o dos hijos. Una cadena de ephemerals convierte cada modelo downstream en un SQL ilegible.

## Materialized view

Objeto del warehouse que combina frescura de view y lectura de table. En `dbt run` se comporta como un **deploy de definición**, no como un refresh de datos: el refresco lo agenda la plataforma (si existe). No todos los adapters la tienen; Snowflake usa Dynamic Tables, no este nombre.

Útil cuando el incremental te vale pero quieres que el motor mantenga el objeto. Menos knobs que un incremental clásico.

## Cómo elegir

```text
¿Transformación ligera, pocos consumidores?     → view
¿Mart o paso caro reutilizado?                  → table
¿El run ya no escala y el grain es estable?     → incremental
¿Paso interno de 10 líneas, 1–2 hijos?         → ephemeral
¿El warehouse ofrece MV/Dynamic Table fiable?  → materialized_view
```

Custom materializations (`{% materialization %}`) son macros de adapter. Fuera de alcance hasta que un built-in no baste.

## Errores comunes

- Incremental sin filtro en `is_incremental()`: cada run reinserta la historia.
- `unique_key` que no es única.
- Ephemeral para “no ensuciar el schema” en un modelo que todo el mundo necesita inspeccionar.
- Tratar `materialized_view` como `dbt run` que refresca datos.
- Cambiar de view a table (o al revés) y dejar el objeto viejo: dbt no siempre limpia la relación anterior.

## Buenas prácticas

- Views en `staging/`, tables en `marts/` vía `dbt_project.yml`, excepciones en el modelo.
- Incremental con test de unicidad en la `unique_key` y un camino `--full-refresh` documentado.
- `dbt compile` y `target/run/` para ver el DDL real (rename atómico, merge, etc.).
- Mide el run antes de “optimizar” a incremental.

## Ejercicio

1. Deja staging en `view` y `fct_orders` en `table` solo con YAML de proyecto.
2. Convierte un modelo de eventos a `incremental` con `unique_key` y `is_incremental()`.
3. Ejecuta un run normal y un `--full-refresh`; compara tiempos y el SQL en `target/run/`.
4. Sustituye un paso intermedio minúsculo por `ephemeral` y lee el compilado del hijo.

## Siguiente paso

[CI/CD](07-ci-cd.md): `build`, selectores y el job que tiene que correr `snapshot` y `test`, no solo `run`.

:::

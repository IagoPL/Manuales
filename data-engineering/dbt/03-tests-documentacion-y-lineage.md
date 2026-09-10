# Tests, documentación y lineage

::: v-pre

Un data test es un `SELECT` que busca **filas que contradicen** una aserción. Cero filas → pasa. `unique` busca duplicados; `not_null` busca nulos. No es un `CHECK` del warehouse: dbt no crea constraints. Detecta regresiones cuando el SQL o los datos cambian.

La clave YAML actual es `data_tests`. `tests` sigue existiendo como alias. Los **unit tests** son otra cosa (YAML bajo `model-paths`); no van en `tests/`.

Documentación: [data tests](https://docs.getdbt.com/docs/build/data-tests), [propiedad `data_tests`](https://docs.getdbt.com/reference/resource-properties/data-tests), [describe your project](https://docs.getdbt.com/docs/collaborate/documentation).

## Genéricos: los cuatro de serie

Un test genérico es una consulta parametrizada (`{% test %}`) que reutilizas en YAML. dbt trae cuatro:

| Test | Aserción |
| --- | --- |
| `unique` | La columna no tiene duplicados. |
| `not_null` | La columna no tiene `NULL`. |
| `accepted_values` | Los no nulos están en una lista. |
| `relationships` | Cada valor (no nulo) existe en otra relación. |

`models/marts/schema.yml`:

```yaml
models:
  - name: fct_orders
    description: Un pedido válido. Grain: order_id.
    columns:
      - name: order_id
        description: Clave del pedido.
        data_tests:
          - unique
          - not_null
      - name: status
        data_tests:
          - accepted_values:
              arguments:
                values: ['placed', 'shipped', 'completed', 'returned']
      - name: customer_id
        data_tests:
          - relationships:
              arguments:
                to: ref('stg_customers')
                field: customer_id
```

`arguments` anida los parámetros del test (dbt 1.10.5+). Versiones anteriores ponían `values` / `to` / `field` en el primer nivel.

`relationships` ignora `NULL` en el hijo, igual que una FK. Si el nulo también es error, añade `not_null`.

Los mismos tests se cuelgan de **sources**, seeds y snapshots. Una source sin `unique` + `not_null` en la clave deja que el staging herede basura.

```bash
dbt test
dbt test --select fct_orders
dbt test --select "source:*"
dbt build --select fct_orders+
```

`dbt test` solo corre tests. `dbt build` construye el recurso y después testea. En CI suele interesar `build` sobre el subgrafo tocado.

## Singulares: una query, un caso

Cuando la aserción no cabe en un genérico, un fichero en `tests/` **es** el test. El nombre es el del fichero. Devuelve las filas que fallan. Sin punto y coma final.

`tests/assert_fct_orders_amount_positive.sql`:

```sql
select
    order_id,
    amount
from {{ ref('fct_orders') }}
where amount <= 0
```

No declares tests singulares como si fueran genéricos en el YAML del modelo: dbt los recoge por vivir en `test-paths`.

Si copias la misma forma cambiando solo la columna, ya no es singular: escribe un genérico o instala uno de un paquete (`dbt_utils`, etc.).

## Documentación

`description` en YAML no es un comentario: entra en el sitio de docs y en el catálogo. Un modelo sin descripción sigue compilando; el lineage se lee peor.

```yaml
sources:
  - name: raw
    description: Réplica ELT de la app. dbt no la escribe.
    tables:
      - name: orders
        description: Un registro por pedido, incluidos cancelados.
        columns:
          - name: id
            description: PK de la tabla origen.
```

```bash
dbt docs generate
dbt docs serve
```

`generate` escribe el manifiesto y el catálogo estático en `target/`. `serve` es local. En la plataforma de dbt el mismo grafo aparece como Catalog; el contrato del proyecto (YAML + `ref`/`source`) es el mismo.

Documenta el **grain** y lo que el modelo **no** es (“no incluye pedidos a 0”). Eso evita que BI reinterprete la tabla.

## Lineage

El lineage no se dibuja a mano. Sale de `source()` y `ref()`:

```text
source:raw.orders ──► stg_orders ──► fct_orders ──► (BI / exposiciones)
source:raw.customers ──► stg_customers ─┘
```

Si un mart lee `raw.public.orders` en SQL plano, **desaparece** del grafo. Los docs mostrarán un nodo huérfano o un origen opaco.

Selectores que aprovechan el grafo:

```bash
dbt run --select stg_orders+      # el modelo y downstream
dbt test --select +fct_orders     # upstream de fct_orders, tests incluidos según recurso
dbt ls --select source:raw.orders+
```

## Errores comunes

- Tratar `dbt test` como substituto de constraints del warehouse o de contratos de calidad en origen.
- Tests solo en marts: el fallo aparece tarde y en un JOIN ilegible.
- `accepted_values` sin `quote: false` sobre enteros/booleanos.
- Unit tests en `tests/`: van junto a los modelos, no en `test-paths`.
- Descripciones copiadas (“tabla de pedidos”) que no dicen el grain.

## Buenas prácticas

- Empieza por `unique` + `not_null` en claves de sources y staging.
- `relationships` entre fact y dimensiones que el mart asume.
- `severity: warn` para aserciones que aún no puedes hacer fallar el job; no para olvidarte del test.
- `dbt build` en CI sobre el estado modificado, no `run` sin tests.
- Mira el SQL compilado del test en `target/compiled/` cuando falle: es un `SELECT` más.

## Ejercicio

1. Añade `unique` y `not_null` a `order_id` en `stg_orders` y en la source `raw.orders`.
2. Relaciona `fct_orders.customer_id` con `stg_customers.customer_id`.
3. Escribe un test singular que falle si `sum(amount)` por pedido es negativa.
4. Genera docs y sigue el camino `raw.orders` → `fct_orders`.

## Siguiente paso

[Snapshots y seeds](04-snapshots-y-seeds.md): CSV versionados y SCD tipo 2 sobre tablas que se pisan.

:::

# Macros y Jinja

::: v-pre

Jinja no corre en el warehouse. dbt **compila** el fichero a SQL y después lo envía al adapter. `ref()`, `source()`, `config()` y `is_incremental()` son Jinja. Si el compilado no es un `SELECT` válido, el motor ni llega a opinar.

Documentación: [Jinja and macros](https://docs.getdbt.com/docs/build/jinja-macros), [funciones Jinja de dbt](https://docs.getdbt.com/reference/dbt-jinja-functions).

## Tres delimitadores

| Delimitador | Sale SQL | Uso |
| --- | --- | --- |
| `{{ ... }}` | Sí (expresión) | `ref()`, `source()`, llamadas a macros, variables |
| `{% ... %}` | No (sentencia) | `if`, `for`, `set`, `macro` |
| `{# ... #}` | No | Comentario Jinja. `--` comenta SQL **después** de compilar; no apaga Jinja |

Whitespace: `{%-` / `-%}` recorta espacios. Útil en macros; fácil pasarse y pegar tokens.

## Compilar para ver

```bash
dbt compile --select stg_payments
```

El SQL compilado está en `target/compiled/<proyecto>/`. En Core, ese fichero es la fuente de verdad cuando un `{% for %}` “no hace lo que pensaba”.

Ejemplo en un modelo:

```sql
{% set payment_methods = ["bank_transfer", "credit_card", "gift_card"] %}

select
    order_id,
    {% for payment_method in payment_methods %}
    sum(case when payment_method = '{{ payment_method }}' then amount end)
        as {{ payment_method }}_amount,
    {% endfor %}
    sum(amount) as total_amount
from {{ ref('stg_payments') }}
group by 1
```

Compila a columnas `bank_transfer_amount`, `credit_card_amount`, `gift_card_amount`. El `SELECT` resultante debe ser legal en **tu** dialecto.

`{% set %}` arriba del modelo, no literales repetidos en el `for`. Es el mismo hábito que en cualquier lenguaje.

## Macros: funciones SQL

Viven en `macros/*.sql`. No son modelos: no se `ref()`. Se llaman.

`macros/cents_to_dollars.sql`:

```sql
{% macro cents_to_dollars(column_name, scale=2) %}
    ({{ column_name }} / 100)::numeric(16, {{ scale }})
{% endmacro %}
```

`models/staging/stg_payments.sql`:

```sql
select
    id as payment_id,
    {{ cents_to_dollars('amount') }} as amount_usd
from {{ source('raw', 'payments') }}
```

Las comillas en `'amount'` importan: sin ellas Jinja busca una **variable** `amount` y suele compilar vacío. Dentro de `{{ }}` / `{% %}`, un nombre de columna es un string.

Un paquete se invoca con namespace: `{{ dbt_utils.generate_surrogate_key(['order_id', 'line_id']) }}`. Antes, el paquete tiene que estar en `packages.yml` y haber corrido `dbt deps`.

## Lo que Jinja no debe hacer

Favor **legibilidad** sobre DRY. Si cada modelo es una macro, el SQL deja de ser revisable en PR.

Mal sitio para una macro:

- la definición de un mart (“qué es un pedido válido”);
- un `ref()` escondido en un `{% if %}` que dbt no ve al parsear ([capítulo 2](02-sources-models-y-refs.md));
- copiar el dialecto de Snowflake en una macro “genérica” sin `adapter.dispatch`.

Buen sitio:

- un cast repetido (`cents_to_dollars`);
- un fragmento de filtro de incremental (`is_incremental()` va en el [capítulo 6](06-materializaciones.md));
- diferencias mínimas por adapter cuando de verdad hay dos warehouses.

`target` y `env_var` cambian el compilado según entorno. Úsalos para schema/database o flags, no para ramificar la lógica de negocio de un fact.

## Documentar macros

```yaml
macros:
  - name: cents_to_dollars
    description: Convierte un entero en céntimos a decimal.
    arguments:
      - name: column_name
        type: string
        description: Identificador de columna ya citado en el SELECT.
      - name: scale
        type: integer
        description: Decimales. Por defecto 2.
```

A partir de Core v1.10, `validate_macro_args` puede avisar si los argumentos documentados no coinciden con la macro.

## Errores comunes

- Anidar llaves: `{{ cents_to_dollars({{ col }}) }}`. Pasa la variable sin anidar: `{{ cents_to_dollars(col) }}`.
- Olvidar que el `{% for %}` tiene que producir SQL válido también en el **último** elemento (comas).
- Comentar Jinja con `-- {{ ref('x') }}`: `ref()` **sí** se ejecuta; `--` solo afecta al SQL compilado.
- Macros que emiten DDL: el modelo debe seguir siendo un `SELECT`; el DDL es cosa de materializaciones.

## Buenas prácticas

- Compila siempre que toques un `for` o un `if`.
- Reutiliza paquetes (`dbt_utils`) antes de inventar el quinto `surrogate_key`.
- Una macro, un trabajo; el nombre dice el resultado (`cents_to_dollars`, no `helper1`).
- Tests de datos sobre el modelo que llama a la macro: la macro no se “testea” sola en el warehouse.

## Ejercicio

1. Extrae a macro el `cast` de importes de `stg_orders`.
2. Compila y compara `target/compiled/` antes y después.
3. Sustituye un `case` repetido por un `{% for %}` con la lista `{% set %}` al inicio.
4. Rompe el ejemplo a propósito (coma de más) y lee el SQL compilado, no el error crudo del warehouse.

## Siguiente paso

[Materializaciones](06-materializaciones.md): qué objeto crea dbt a partir de ese `SELECT` compilado.

:::

# Buenas prácticas

::: v-pre

Cierre del manual: decisiones que se revisan en PR, no eslóganes. El CI del [capítulo 7](07-ci-cd.md) solo es útil si los modelos tienen grain, tests con intención y relaciones resueltas por `ref()`/`source()`.

Documentación: [best-practice workflows](https://docs.getdbt.com/best-practices/best-practice-workflows), [how we structure projects](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview), [model contracts](https://docs.getdbt.com/docs/mesh/govern/model-contracts), [model versions](https://docs.getdbt.com/docs/mesh/govern/model-versions).

Ámbito: **dbt Core (v1)** self-hosted. Contratos, versions y Mesh son features vigentes; no son un requisito de cada modelo. Fusion / dbt platform se etiquetan si cambia el runtime.

## Capas (convención, no parser)

```text
models/
├── staging/        stg_*     source() → rename / cast
├── intermediate/   int_*     solo si reutilizas de verdad
└── marts/          dim_* / fct_*  (si modelas en dimensional)
```

dbt no exige estas carpetas. Sí aplica la materialización que pongas en `dbt_project.yml` por directorio (capítulo 6). Un proyecto de cuatro modelos no necesita `intermediate/`.

**Staging.** Una source, una limpieza ligera: nombres, tipos, filtros obvios (`amount is not null`). Lógica de “qué es un cliente activo” no va aquí: el grain del origen se conserva. Excepción rara: un trampolín mínimo antes de un snapshot (capítulo 4).

**Intermediate.** Joins o reglas que **dos marts** compartirían. Si solo hay un consumidor, el SQL puede vivir en el mart. No inventes una capa para el diagrama.

**Marts.** Tablas que alguien consulta. En modelado dimensional, `dim_` (entidad) y `fct_` (evento/medida) ayudan. No es la única arquitectura: un mart ancho por proceso de negocio también es válido si el grain está escrito.

Prefijos `stg_` / `int_` / `dim_` / `fct_` son consistencia para humanos. No son tokens del parser.

## Grain

Cada modelo responde: **¿qué es una fila?**

`fct_orders`: una fila = un pedido. Entonces:

- `unique` + `not_null` en `order_id` (capítulo 3);
- ningún JOIN que duplique pedidos sin agregación;
- `unique_key` de un incremental = ese grain (capítulo 6);
- la descripción YAML lo dice en una frase.

Si no puedes escribir el grain, el modelo mezcla hechos. Parte el fichero; no “añadas una columna más”.

## `source()` en el borde, `ref()` dentro

No hardcodees `raw.public.orders` ni `analytics.stg_orders`. El DAG, el lineage y el Slim CI dependen de ello (capítulo 2). Staging lee sources; marts leen models (y a veces seeds/snapshots). Un mart que salta a `source()` duplica tipado y desaparece del grafo de staging.

## Tests con intención

No pongas `not_null` en las 40 columnas. Prioriza contratos reales:

1. claves de negocio / primary keys;
2. `relationships` donde el mart asume integridad;
3. `accepted_values` en estados que el BI filtra;
4. singulares para invariantes (“`amount` del pedido ≥ 0”).

Un test es una aserción que **alguien defenderá** cuando falle. `warn` mientras el origen aún miente; `error` cuando el contrato ya es de equipo. CI que avisa de todo y no bloquea nada no es contrato.

## Documentación útil

`description: "Order id"` no aporta. Sí aporta:

- grain;
- origen (`raw.orders`, filtro aplicado);
- owner / canal si el mart es interfaz;
- casos límite (pedidos a 0, cancelados, zona horaria).

`dbt docs generate` dibuja el DAG. Un DAG bonito no arregla un grain mal definido.

## Contracts y versions (cuando el mart es API)

**Contract** (`contract: {enforced: true}` + columnas/tipos en YAML): dbt comprueba el `SELECT` contra el esquema declarado y lo refleja en el DDL. Vigente. Útil en marts que otros equipos consumen. Ruido en staging que cambia cada semana. Un contract se rompe al quitar una columna o cambiar el tipo; Slim CI puede **errar** esa PR a propósito.

**Model versions** (Mesh): varias versiones del mismo mart en el proyecto, con ventana de deprecación, cuando **no puedes** migrar a todos los consumidores el mismo día. No es git. No versionas cada `stg_*` “por si acaso”: el coste es materializar v1 y v2 a la vez. Cambio aditivo (columna nueva) → no hace falta versión. Breaking change en un contrato maduro → versión o coordinación explícita.

Ni contracts ni versions aplican a seeds/snapshots/sources.

## Incrementales (capítulo 6)

Antes de `materialized='incremental'`:

- grain estable y `unique_key` realmente única (sin nulls);
- filtro `is_incremental()` que incluye **datos tardíos** (`>= max(updated_at)`, no `>`);
- estrategia que el **adapter** soporta;
- plan de `--full-refresh` (cuándo, quién, cuánto cuesta);
- tests de unicidad en cada CI, no solo en el backfill.

Si el run aún es barato en table, no adelantes el incremental.

## Macros (capítulo 5)

Repetir cinco líneas de SQL legible ≠ necesidad de macro. Extrae cuando la regla es **estable** (céntimos → decimal, surrogate key de paquete). Si la macro es el mart, el review se vuelve arqueología Jinja.

## SQL revisable

Nombres de CTE que dicen el paso (`orders_renamed`, no `tmp2`). Un modelo, un grain. No hay límite mágico de líneas; hay límite de lo que un reviewer entiende en un diff.

## Packages

`packages.yml` + `dbt deps`. Fija versiones (`version: 1.3.2`, no `">0"`). Revisa upgrades como cualquier dependencia. No añadas `dbt_utils` para una macro de tres líneas que ya tienes.

## Entornos

Los mismos modelos, distintos targets: `dev`, CI, `prod`. `ref()` resuelve el schema del target (capítulo 2 y 7). Un literal `analytics_prod.fct_orders` en el SQL anula CI selectiva y el portátil del compañero.

## Coste del warehouse

dbt no abarata un `SELECT *` de tres años. Mide modelos lentos (logs, `run_results`, UI del warehouse). Materializa tables donde BI pega; deja views el staging ligero. Full refresh e incrementales mal filtrados salen caros en Snowflake, BigQuery, Redshift o Databricks por igual: el mecanismo de facturación cambia, el desperdicio no.

## Lineage ≠ diseño

50 modelos en fila no son “más dbt”. Fan-out (un `stg` que alimenta 40 marts copiados) y profundidad inútil encarecen Slim CI: `state:modified+` reconstruye **todos** los hijos. Prefiere reutilizar un `int_` de verdad o aceptar un mart más ancho.

## Seguridad (mínimo dbt)

- Secrets fuera del git (capítulo 7).
- Usuario dbt con el privilegio justo: crear en su schema, leer sources.
- CI aislado; defer lee prod, no la pisa.
- Seeds y logs sin PII.
- `debug`/`--print` no vuelcan `profiles.yml`.

## Workflow de equipo

```text
cambio SQL / YAML
    ↓
dbt compile / build local (target de desarrollo)
    ↓
PR
    ↓
CI: dbt build selectivo o completo, schema efímero
    ↓
review: SQL + grain + tests + lineage (no solo el YAML)
    ↓
merge
    ↓
job de producción + guardar manifest
    ↓
observar tiempos, tests, coste
```

Si el review no mira el grain, el CI solo automatiza el desastre.

## Errores comunes

- `intermediate/` vacío “porque lo dice la guía”.
- `not_null` decorativo en columnas que el origen deja vacías a propósito.
- Contract en todo el proyecto el segundo mes.
- Incremental sin plan de late-arriving.
- Macro por cada CTE.
- DAG profundo como señal de madurez.

## Ejercicio

1. Escribe el grain de `fct_orders` y de `stg_orders` en una línea cada uno. Si coinciden mal, parte o documenta el filtro.
2. Lista los tests de un mart y borra los que no defenderías en un incidente.
3. Coge un modelo >200 líneas con dos facts implícitos y propón el corte.
4. Recorre el workflow de arriba con el último cambio real: ¿dónde faltó `ls`, test o schema de CI?

:::

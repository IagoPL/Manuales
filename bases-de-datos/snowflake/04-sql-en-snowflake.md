# SQL en Snowflake

Snowflake usa SQL como interfaz principal para consultar, transformar, administrar y gobernar datos. Su dialecto es cercano a SQL estandar, con funciones propias para datos semiestructurados, fechas, ventanas y carga.

## Contexto de sesion

Antes de trabajar, fija contexto:

```sql
USE ROLE analyst_role;
USE WAREHOUSE bi_wh;
USE DATABASE analytics_db;
USE SCHEMA marts;
```

Comprueba:

```sql
SELECT CURRENT_ROLE(), CURRENT_WAREHOUSE(), CURRENT_DATABASE(), CURRENT_SCHEMA();
```

## Consultas basicas

```sql
SELECT customer_id, order_date, total_amount
FROM fact_orders
WHERE order_date >= '2026-01-01'
ORDER BY order_date DESC
LIMIT 100;
```

## Fechas

```sql
SELECT
  DATE_TRUNC('month', order_date) AS month,
  SUM(total_amount) AS revenue
FROM fact_orders
GROUP BY 1
ORDER BY 1;
```

## Window functions

```sql
SELECT
  customer_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
  ) AS running_total
FROM fact_orders;
```

## Datos semiestructurados

Snowflake usa `VARIANT` para JSON, Avro, Parquet y otros formatos.

```sql
CREATE TABLE raw_events (
  payload VARIANT,
  loaded_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);
```

Consultar JSON:

```sql
SELECT
  payload:user:id::STRING AS user_id,
  payload:event_type::STRING AS event_type
FROM raw_events;
```

## FLATTEN

```sql
SELECT
  e.payload:order_id::STRING AS order_id,
  item.value:sku::STRING AS sku
FROM raw_events e,
LATERAL FLATTEN(input => e.payload:items) item;
```

## Buenas practicas

- Usa `USE` para dejar contexto claro.
- Castea `VARIANT` a tipos explicitos en capas limpias.
- Evita `SELECT *` en modelos finales.
- Filtra por columnas que ayuden al pruning.
- Usa nombres consistentes en schemas y tablas.

## Errores comunes

- Consultar `VARIANT` directamente en dashboards finales.
- Usar warehouses grandes para consultas pequenas.
- No limitar exploraciones sobre tablas enormes.
- Mezclar SQL de transformacion con administracion sin separar roles.
- No revisar el historial de consultas costosas.

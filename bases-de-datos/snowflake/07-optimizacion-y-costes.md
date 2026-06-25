# Optimizacion y costes

En Snowflake el coste principal viene del computo consumido por warehouses, aunque almacenamiento, servicios y transferencias tambien importan. Optimizar significa gastar mejor, no solo hacer queries mas rapidas.

## Warehouses

Configura warehouses con auto suspend:

```sql
ALTER WAREHOUSE bi_wh SET
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;
```

Escala solo cuando haga falta:

```sql
ALTER WAREHOUSE transform_wh SET WAREHOUSE_SIZE = 'LARGE';
```

## Separar cargas

Usa warehouses distintos para:

- BI interactivo.
- Ingesta.
- Transformaciones.
- Data science.
- Exploracion.

Asi evitas que una carga pesada afecte a usuarios de dashboards.

## Query history

Consulta historial:

```sql
SELECT query_text, warehouse_name, total_elapsed_time, credits_used_cloud_services
FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE start_time >= DATEADD(day, -1, CURRENT_TIMESTAMP())
ORDER BY total_elapsed_time DESC;
```

## Pruning y micro-partitions

Snowflake organiza datos en micro-partitions. Las consultas son mas eficientes cuando pueden descartar particiones.

Ayuda:

- Filtrar por columnas selectivas.
- Evitar transformaciones sobre columnas filtradas.
- Mantener tipos correctos.
- Cargar datos con cierto orden natural cuando sea posible.

## Clustering

Snowflake gestiona mucho automaticamente, pero en tablas enormes puede interesar clustering:

```sql
ALTER TABLE fact_orders CLUSTER BY (order_date);
```

Debe justificarse con metricas; tambien tiene coste.

## Buenas practicas

- Empieza con warehouses pequenos.
- Activa auto suspend.
- Revisa consultas costosas.
- Evita dashboards que lancen queries enormes sin filtros.
- Separa entornos y cargas.
- Borra tablas temporales y clones que ya no se usan.

## Errores comunes

- Usar warehouses grandes por defecto.
- Dejar warehouses activos sin necesidad.
- Clustering prematuro.
- No controlar exploraciones sobre tablas grandes.
- No asignar costes por equipo o carga.

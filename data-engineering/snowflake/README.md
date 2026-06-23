# Snowflake

Snowflake es una plataforma de datos en la nube orientada a analítica, data warehousing, integración de datos y cargas de trabajo de ingeniería de datos.

## Conceptos clave

- **Database:** contenedor lógico de schemas.
- **Schema:** agrupación de tablas, vistas, stages y otros objetos.
- **Table:** objeto donde se almacenan datos estructurados.
- **Warehouse:** recurso de cómputo que ejecuta consultas y cargas.
- **Stage:** ubicación para cargar o leer archivos.
- **Role:** unidad de permisos.
- **Credit:** unidad de consumo asociada al uso de cómputo.
- **Micro-partitions:** particiones internas gestionadas por Snowflake.

## Instalación o configuración

Snowflake se usa como servicio cloud. Para trabajar con él necesitas:

1. Una cuenta de Snowflake.
2. Un usuario con rol asignado.
3. Un warehouse activo.
4. Una base de datos y un schema.
5. Cliente web, SnowSQL, conectores o herramientas de integración.

Ejemplo conceptual de contexto:

```sql
USE ROLE analyst_role;
USE WAREHOUSE compute_wh;
USE DATABASE analytics_db;
USE SCHEMA public;
```

## Uso básico

### Crear warehouse

```sql
CREATE WAREHOUSE IF NOT EXISTS compute_wh
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;
```

### Crear base de datos y schema

```sql
CREATE DATABASE IF NOT EXISTS analytics_db;
CREATE SCHEMA IF NOT EXISTS analytics_db.raw;
```

### Crear tabla

```sql
CREATE TABLE analytics_db.raw.events (
  event_id STRING,
  event_type STRING,
  created_at TIMESTAMP_NTZ
);
```

### Consultar datos

```sql
SELECT event_type, COUNT(*) AS total
FROM analytics_db.raw.events
GROUP BY event_type
ORDER BY total DESC;
```

## Ejemplos prácticos

### Carga desde un stage interno

```sql
CREATE STAGE IF NOT EXISTS raw_stage;

PUT file://events.csv @raw_stage;

COPY INTO analytics_db.raw.events
FROM @raw_stage/events.csv
FILE_FORMAT = (TYPE = CSV FIELD_OPTIONALLY_ENCLOSED_BY = '"' SKIP_HEADER = 1);
```

### Crear una vista

```sql
CREATE VIEW analytics_db.raw.event_summary AS
SELECT event_type, COUNT(*) AS total
FROM analytics_db.raw.events
GROUP BY event_type;
```

### Clonar una tabla

```sql
CREATE TABLE analytics_db.raw.events_backup
CLONE analytics_db.raw.events;
```

## Buenas prácticas

- Usa warehouses separados por tipo de carga: BI, ingestión, transformación y exploración.
- Activa `AUTO_SUSPEND` para controlar costes.
- Define roles por responsabilidad, no por persona.
- Separa capas de datos: `raw`, `staging`, `analytics` o similares.
- Usa vistas o tablas intermedias para transformar progresivamente.
- Controla formatos de archivo y validación durante cargas.
- Revisa historial de consultas y consumo de warehouses.

## Errores comunes

- Dejar warehouses encendidos sin necesidad.
- Usar un único rol con permisos excesivos.
- Mezclar datos crudos y datos transformados en el mismo schema.
- Cargar archivos sin validar formatos.
- No controlar costes de consultas exploratorias pesadas.

## Chuleta rápida

```sql
SHOW WAREHOUSES;
USE WAREHOUSE compute_wh;
CREATE DATABASE analytics_db;
CREATE SCHEMA raw;
CREATE STAGE raw_stage;
COPY INTO tabla FROM @stage;
ALTER WAREHOUSE compute_wh SUSPEND;
```

## Recursos relacionados

- [Apache Spark](../spark/README.md)
- [Databricks](../databricks/01-databricks.md)
- [Pipelines de datos](../pipelines/README.md)
- [SQL](../../bases-de-datos/sql/README.md)

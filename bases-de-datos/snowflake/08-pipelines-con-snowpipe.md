# Pipelines con Snowpipe

Snowpipe permite cargar archivos en Snowflake de forma continua o casi continua desde stages. Este capitulo se centra en la pieza Snowflake; el diseno completo de pipelines vive en el manual de pipelines de datos.

## Flujo basico

```txt
archivo en stage -> Snowpipe -> COPY INTO -> tabla raw
```

## Crear tabla

```sql
CREATE TABLE raw.events (
  payload VARIANT,
  source_file STRING,
  loaded_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);
```

## Crear file format

```sql
CREATE FILE FORMAT raw.json_format
  TYPE = JSON
  STRIP_OUTER_ARRAY = TRUE;
```

## Crear stage

```sql
CREATE STAGE raw.events_stage
  URL = 's3://mi-bucket/events/'
  FILE_FORMAT = raw.json_format;
```

En produccion se recomienda usar storage integrations, no credenciales incrustadas.

## Crear pipe

```sql
CREATE PIPE raw.events_pipe AS
COPY INTO raw.events (payload, source_file)
FROM (
  SELECT
    $1,
    METADATA$FILENAME
  FROM @raw.events_stage
)
FILE_FORMAT = raw.json_format;
```

## Revisar estado

```sql
SELECT SYSTEM$PIPE_STATUS('raw.events_pipe');
```

Historial de cargas:

```sql
SELECT *
FROM TABLE(INFORMATION_SCHEMA.COPY_HISTORY(
  TABLE_NAME => 'raw.events',
  START_TIME => DATEADD(hour, -24, CURRENT_TIMESTAMP())
));
```

## Buenas practicas

- Carga en `raw` y transforma despues.
- Guarda `METADATA$FILENAME`.
- Controla errores de carga.
- Usa integraciones cloud.
- Monitoriza pipes y copy history.
- Manten archivos de tamano razonable.

## Errores comunes

- Cargar directo en marts finales.
- No guardar nombre de archivo.
- No monitorizar fallos de pipe.
- Mezclar formatos en el mismo stage.
- Confundir Snowpipe con orquestador completo.

## Recurso relacionado

- [Pipelines de datos](../../data-engineering/pipelines/01-introduccion.md)

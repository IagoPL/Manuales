# Carga de datos

Cargar datos en Snowflake consiste en mover archivos desde una ubicacion de entrada hacia tablas. La ubicacion puede ser un stage interno de Snowflake o un stage externo en S3, Azure Blob Storage o Google Cloud Storage.

## Flujo basico

```txt
archivo -> stage -> file format -> COPY INTO -> tabla
```

Piezas principales:

- **Stage:** donde estan los archivos.
- **File format:** como interpretar esos archivos.
- **Tabla destino:** estructura final o intermedia.
- **COPY INTO:** comando de carga.

## Carga con stage interno

Crear tabla destino:

```sql
CREATE TABLE analytics_db.raw.events (
  event_id STRING,
  event_type STRING,
  user_id STRING,
  created_at TIMESTAMP_NTZ
);
```

Crear formato CSV:

```sql
CREATE FILE FORMAT analytics_db.raw.csv_with_header
  TYPE = CSV
  FIELD_OPTIONALLY_ENCLOSED_BY = '"'
  SKIP_HEADER = 1
  NULL_IF = ('', 'NULL', 'null');
```

Crear stage interno:

```sql
CREATE STAGE analytics_db.raw.events_stage
  FILE_FORMAT = analytics_db.raw.csv_with_header;
```

Subir archivo con SnowSQL:

```sql
PUT file://events.csv @analytics_db.raw.events_stage AUTO_COMPRESS = TRUE;
```

Cargar:

```sql
COPY INTO analytics_db.raw.events
FROM @analytics_db.raw.events_stage
FILE_FORMAT = analytics_db.raw.csv_with_header;
```

## Validar antes de cargar

Antes de insertar datos definitivamente, puedes validar:

```sql
COPY INTO analytics_db.raw.events
FROM @analytics_db.raw.events_stage
FILE_FORMAT = analytics_db.raw.csv_with_header
VALIDATION_MODE = RETURN_ERRORS;
```

Tambien puedes revisar archivos en un stage:

```sql
LIST @analytics_db.raw.events_stage;
```

## Carga desde stage externo

La idea es la misma, pero el stage apunta a almacenamiento cloud:

```sql
CREATE STAGE analytics_db.raw.s3_events_stage
  URL = 's3://mi-bucket/events/'
  FILE_FORMAT = analytics_db.raw.csv_with_header;
```

En produccion no conviene incrustar credenciales directamente. Lo normal es usar integraciones de almacenamiento gestionadas por Snowflake y permisos cloud bien acotados.

## Buenas practicas

- Carga primero en `raw`; transforma despues.
- Define `FILE FORMAT` reutilizables y versionados.
- Valida errores antes de ejecutar cargas grandes.
- Guarda metadatos de ingesta: nombre de archivo, fecha de carga, lote y fuente.
- Usa archivos de tamano razonable; muchos archivos diminutos penalizan la carga.
- Separa stages por fuente o dominio.

## Errores comunes

- Cargar directamente en tablas finales.
- No definir tipos de datos antes de cargar.
- Ignorar filas rechazadas.
- Mezclar formatos distintos en el mismo stage.
- No registrar que archivo genero cada fila.

## Ejercicio

1. Crea una tabla `raw.customers`.
2. Define un `FILE FORMAT` para CSV con cabecera.
3. Crea un stage interno.
4. Escribe el `COPY INTO`.
5. Anade columnas tecnicas como `source_file` y `loaded_at` usando metadatos de carga.

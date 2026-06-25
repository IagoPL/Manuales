# Manual de Snowflake

Snowflake es una plataforma de datos en la nube para analitica, data warehousing, intercambio de datos y cargas de ingenieria de datos. En este repositorio queda ubicado en `bases-de-datos` porque su nucleo es el almacenamiento, el gobierno, el SQL y la administracion de datos. Los manuales de `data-engineering` lo enlazaran cuando lo usen como destino de pipelines, pero no repetiran su contenido.

La idea principal de Snowflake es separar almacenamiento, computo y servicios de gestion. Los datos viven en una capa gestionada por la plataforma; las consultas se ejecutan en warehouses virtuales; y operaciones como metadatos, seguridad, optimizacion y planificacion se gestionan como servicios.

## Capitulos previstos

1. [Introduccion y arquitectura](01-introduccion-y-arquitectura.md)
2. [Warehouses bases y esquemas](02-warehouses-bases-y-esquemas.md)
3. [Carga de datos](03-carga-de-datos.md)
4. [SQL en Snowflake](04-sql-en-snowflake.md)
5. [Time Travel y cloning](05-time-travel-y-cloning.md)
6. [Roles permisos y seguridad](06-roles-permisos-y-seguridad.md)
7. [Optimizacion y costes](07-optimizacion-y-costes.md)
8. [Pipelines con Snowpipe](08-pipelines-con-snowpipe.md)
9. [Buenas practicas](09-buenas-practicas.md)

## Conceptos esenciales

- **Account:** entorno de Snowflake asociado a una organizacion, region y proveedor cloud.
- **Database:** contenedor logico de schemas.
- **Schema:** agrupacion de tablas, vistas, stages, file formats, streams, tasks y otros objetos.
- **Table:** estructura donde se almacenan datos.
- **Virtual warehouse:** cluster de computo que ejecuta consultas, cargas y transformaciones.
- **Role:** unidad principal para permisos. Los privilegios se conceden a roles, no directamente a personas.
- **Stage:** ubicacion interna o externa desde la que se cargan o consultan archivos.
- **Micro-partitions:** particiones internas gestionadas automaticamente por Snowflake.
- **Credit:** unidad de coste consumida principalmente por computo.

## Arquitectura resumida

```txt
Usuarios y herramientas
        |
        v
Servicios de Snowflake
autenticacion, metadata, optimizador, seguridad
        |
        v
Virtual warehouses
computo elastico para SQL, cargas y transformaciones
        |
        v
Almacenamiento gestionado
tablas, micro-partitions, time travel, clones
```

Separar almacenamiento y computo permite que un equipo de BI use un warehouse pequeno, un proceso de carga use otro distinto y una transformacion pesada use un warehouse mayor sin bloquearse entre si. Esa separacion tambien obliga a controlar costes: un warehouse mal configurado puede consumir creditos aunque las tablas esten bien modeladas.

## Primer contexto de trabajo

Un flujo basico suele empezar fijando rol, warehouse, base de datos y schema:

```sql
USE ROLE analyst_role;
USE WAREHOUSE compute_wh;
USE DATABASE analytics_db;
USE SCHEMA raw;
```

Crear un warehouse pequeno para pruebas:

```sql
CREATE WAREHOUSE IF NOT EXISTS compute_wh
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE;
```

Crear una base y schemas por capas:

```sql
CREATE DATABASE IF NOT EXISTS analytics_db;
CREATE SCHEMA IF NOT EXISTS analytics_db.raw;
CREATE SCHEMA IF NOT EXISTS analytics_db.staging;
CREATE SCHEMA IF NOT EXISTS analytics_db.marts;
```

## Buenas practicas desde el inicio

- Separa warehouses por tipo de carga: BI, ingesta, transformacion y exploracion.
- Activa `AUTO_SUSPEND` en todos los warehouses salvo que haya una razon clara.
- Usa roles por responsabilidad: `loader_role`, `transformer_role`, `analyst_role`.
- Organiza schemas por capas de datos: `raw`, `staging`, `marts`.
- Evita cargar datos directamente en tablas finales sin validacion previa.
- Revisa consumo con frecuencia durante pruebas y aprendizaje.

## Errores comunes

- Tratar Snowflake como una base de datos tradicional instalada en un servidor propio.
- Usar un unico warehouse para todos los procesos.
- Conceder permisos a usuarios individuales en vez de roles.
- Mezclar datos crudos, limpios y analiticos en el mismo schema.
- Olvidar suspender warehouses en entornos de pruebas.

## Ejercicio

1. Crea una base `learning_db`.
2. Crea los schemas `raw`, `staging` y `marts`.
3. Crea un warehouse `learning_wh` con `AUTO_SUSPEND = 60`.
4. Cambia el contexto de sesion con `USE ROLE`, `USE WAREHOUSE`, `USE DATABASE` y `USE SCHEMA`.
5. Comprueba el contexto activo con:

```sql
SELECT CURRENT_ROLE(), CURRENT_WAREHOUSE(), CURRENT_DATABASE(), CURRENT_SCHEMA();
```

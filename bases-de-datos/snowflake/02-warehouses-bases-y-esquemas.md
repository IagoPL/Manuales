# Warehouses bases y esquemas

En Snowflake conviene distinguir tres piezas desde el primer dia:

- **Warehouse:** computo que ejecuta trabajo.
- **Database:** contenedor logico de datos.
- **Schema:** subdivision de una database para organizar objetos.

Un error habitual es pensar que el warehouse contiene los datos. No los contiene: solo aporta computo. Puedes consultar la misma tabla desde warehouses distintos, con tamanos y politicas diferentes.

## Crear warehouses

Un warehouse pequeno para desarrollo:

```sql
CREATE WAREHOUSE dev_wh
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE;
```

Un warehouse para transformaciones mas pesadas:

```sql
CREATE WAREHOUSE transform_wh
  WAREHOUSE_SIZE = 'MEDIUM'
  AUTO_SUSPEND = 120
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE;
```

Cambiar tamano no mueve datos; solo cambia la capacidad de computo:

```sql
ALTER WAREHOUSE transform_wh SET WAREHOUSE_SIZE = 'LARGE';
```

Suspender manualmente:

```sql
ALTER WAREHOUSE transform_wh SUSPEND;
```

## Organizar bases y schemas

Una organizacion sencilla para analitica:

```sql
CREATE DATABASE analytics_db;

CREATE SCHEMA analytics_db.raw;
CREATE SCHEMA analytics_db.staging;
CREATE SCHEMA analytics_db.marts;
CREATE SCHEMA analytics_db.sandbox;
```

Cada capa tiene una intencion:

- `raw`: datos originales o casi originales.
- `staging`: datos tipados, limpios y normalizados.
- `marts`: modelos de negocio listos para BI, reporting o consumo.
- `sandbox`: exploracion temporal, pruebas y prototipos.

## Nombres recomendados

```txt
<dominio>_<entorno>_db
<carga>_<equipo>_wh
```

Ejemplos:

```txt
sales_dev_db
sales_prod_db
bi_reporting_wh
elt_transform_wh
data_science_wh
```

## Privilegios minimos

Crear un rol de analista:

```sql
CREATE ROLE analyst_role;

GRANT USAGE ON WAREHOUSE bi_reporting_wh TO ROLE analyst_role;
GRANT USAGE ON DATABASE analytics_db TO ROLE analyst_role;
GRANT USAGE ON SCHEMA analytics_db.marts TO ROLE analyst_role;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics_db.marts TO ROLE analyst_role;
GRANT SELECT ON FUTURE TABLES IN SCHEMA analytics_db.marts TO ROLE analyst_role;
```

## Buenas practicas

- Usa warehouses pequenos por defecto y escala solo cuando haya evidencia.
- Separa computo interactivo de computo programado.
- Crea databases separadas por entorno: desarrollo, pruebas y produccion.
- Evita schemas genericos como `public` para todo.
- Usa `FUTURE GRANTS` para no repetir permisos cada vez que se crea una tabla.

## Errores comunes

- Dejar warehouses sin `AUTO_SUSPEND`.
- Usar nombres como `test`, `new_schema` o `warehouse1`.
- Dar `OWNERSHIP` cuando basta con `SELECT` o `USAGE`.
- Crear una database por cada tabla.
- Mezclar objetos temporales con modelos productivos.

## Ejercicio

Disena una estructura para una empresa que tiene datos de ventas y marketing:

1. Define databases para `dev` y `prod`.
2. Define schemas por capas.
3. Define tres warehouses: BI, transformacion y exploracion.
4. Escribe los `CREATE` principales.
5. Anota que rol deberia usar cada warehouse.

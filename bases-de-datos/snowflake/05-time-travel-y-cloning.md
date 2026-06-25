# Time Travel y cloning

Time Travel permite consultar, restaurar o clonar datos de un momento anterior. Zero-copy cloning crea copias logicas rapidas sin duplicar todo el almacenamiento inicialmente.

## Time Travel

Consultar una tabla en un momento anterior:

```sql
SELECT *
FROM fact_orders AT (OFFSET => -3600);
```

Consultar por timestamp:

```sql
SELECT *
FROM fact_orders AT (TIMESTAMP => '2026-06-25 10:00:00'::TIMESTAMP);
```

## Restaurar datos

Si una tabla se borra accidentalmente:

```sql
UNDROP TABLE fact_orders;
```

Crear copia desde un punto anterior:

```sql
CREATE TABLE fact_orders_recovered CLONE fact_orders
AT (OFFSET => -3600);
```

## Retencion

La retencion depende del tipo de cuenta y configuracion:

```sql
ALTER TABLE fact_orders SET DATA_RETENTION_TIME_IN_DAYS = 3;
```

Mas retencion da mas margen de recuperacion, pero puede aumentar almacenamiento retenido.

## Zero-copy cloning

Clonar una base:

```sql
CREATE DATABASE analytics_dev CLONE analytics_prod;
```

Clonar un schema:

```sql
CREATE SCHEMA sandbox CLONE analytics_db.marts;
```

Usos:

- Entornos de desarrollo.
- Pruebas con datos realistas.
- Recuperacion rapida.
- Experimentos sin afectar produccion.

## Buenas practicas

- Usa clones para pruebas antes de cambios masivos.
- Define retencion segun criticidad.
- Documenta clones temporales y limpialos.
- Usa Time Travel como red de seguridad, no como unico backup.
- Revisa costes de almacenamiento retenido.

## Errores comunes

- Confiar en Time Travel como backup permanente.
- Dejar clones temporales indefinidamente.
- No saber la ventana de retencion disponible.
- Restaurar sin validar impacto en consumidores.
- Clonar produccion sin controlar permisos.

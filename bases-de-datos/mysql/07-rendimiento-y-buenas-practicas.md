# Rendimiento y buenas practicas

MySQL suele rendir muy bien si el modelo, indices y consultas estan cuidados. La optimizacion empieza midiendo.

## Medir consultas

Usa `EXPLAIN`:

```sql
EXPLAIN ANALYZE
SELECT *
FROM pedidos
WHERE cliente_id = 10;
```

Revisa slow query log en entornos reales.

## Consultas

- Evita `SELECT *`.
- Usa paginacion estable.
- No ordenes grandes resultados sin indice.
- Filtra por columnas indexadas.
- Evita funciones sobre columnas en filtros.

## Indices

```sql
CREATE INDEX idx_pedidos_cliente_fecha
ON pedidos(cliente_id, creado_en);
```

Revisa indices no usados y duplicados.

## Conexiones

Las aplicaciones deben usar pool de conexiones. Abrir y cerrar conexion por cada peticion puede saturar el servidor.

## Buenas practicas

- Usa InnoDB.
- Manten estadisticas actualizadas.
- Usa `utf8mb4`.
- Mide consultas lentas.
- Configura backups y monitorizacion.
- Controla crecimiento de tablas.

## Errores comunes

- Optimizar sin datos.
- Crear indices por si acaso.
- Usar `OFFSET` enorme sin estrategia.
- Ignorar bloqueos.
- No revisar configuracion de memoria y conexiones.

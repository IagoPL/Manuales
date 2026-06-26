# Vacuum, autovacuum y bloat

Por MVCC, PostgreSQL conserva versiones antiguas de filas. Vacuum limpia versiones que ya no son visibles para ninguna transaccion.

## Por que existe vacuum

Un `UPDATE` crea una nueva version de fila. Un `DELETE` marca una version como no visible. Esas versiones antiguas ocupan espacio hasta que vacuum las procesa.

```mermaid
flowchart LR
  A["UPDATE frecuente"] --> B["versiones antiguas"]
  B --> C["bloat"]
  C --> D["VACUUM"]
  D --> E["espacio reutilizable"]
```

## VACUUM

```sql
VACUUM tabla;
```

`VACUUM` libera espacio para reutilizacion interna, pero no siempre devuelve espacio al sistema operativo.

## VACUUM FULL

```sql
VACUUM FULL tabla;
```

Reescribe la tabla y bloquea mas agresivamente. Debe usarse con cuidado.

## ANALYZE

```sql
ANALYZE tabla;
```

Actualiza estadisticas para que el planner estime mejor.

## Autovacuum

Autovacuum ejecuta vacuum y analyze automaticamente.

Senales de problemas:

- Tablas que crecen sin razon.
- Muchas tuplas muertas.
- Consultas cada vez mas lentas.
- Logs de autovacuum frecuentes o fallidos.

## Transacciones largas

Una transaccion abierta durante mucho tiempo puede impedir limpiar versiones antiguas.

Consulta:

```sql
SELECT pid, state, xact_start, query
FROM pg_stat_activity
WHERE state = 'idle in transaction';
```

## Bloat

Bloat es espacio ocupado por versiones antiguas o paginas poco eficientes.

No todo crecimiento es bloat, pero updates/deletes intensivos lo pueden provocar.

## Buenas practicas

- Manten transacciones cortas.
- No desactives autovacuum salvo razon extrema.
- Monitoriza tablas con muchos updates/deletes.
- Ajusta autovacuum por tabla si hace falta.
- Reindexa cuando indices tengan bloat significativo.

## Errores comunes

- Ejecutar `VACUUM FULL` en produccion sin ventana.
- Ignorar `idle in transaction`.
- Pensar que vacuum reduce siempre el archivo en disco.
- Desactivar autovacuum para "mejorar rendimiento".
- No actualizar estadisticas tras grandes cargas.

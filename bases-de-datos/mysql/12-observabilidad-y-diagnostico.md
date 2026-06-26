# Observabilidad y diagnostico

MySQL debe observarse desde consultas, locks, conexiones, memoria, disco, replicacion y errores.

## Variables y estado

```sql
SHOW VARIABLES;
SHOW GLOBAL STATUS;
```

## Performance Schema

Performance Schema permite inspeccionar esperas, consultas y actividad interna.

Consultas utiles dependen de configuracion, pero el objetivo es responder:

- Que consulta consume mas?
- Donde hay esperas?
- Que locks bloquean?
- Que tablas se usan mas?

## Slow query log

Activar en entornos controlados:

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

En produccion, configura con cuidado y centraliza logs.

## EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT *
FROM pedidos
WHERE cliente_id = 10;
```

Compara filas estimadas con reales.

## Locks

```sql
SHOW ENGINE INNODB STATUS;
```

Util para deadlocks y diagnostico InnoDB.

## Metricas clave

- Queries por segundo.
- Latencia p95/p99.
- Threads connected/running.
- Buffer pool hit ratio.
- Slow queries.
- Deadlocks.
- Replica lag.
- Disk usage.
- Connections maxed out.

## Buenas practicas

- Activa slow log con umbrales razonables.
- Monitoriza replica lag.
- Revisa errores de aplicacion y DB juntos.
- Mantén dashboards por servicio critico.
- Documenta runbooks para locks, lag y disco lleno.


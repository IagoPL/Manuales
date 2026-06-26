# Observabilidad y diagnostico

SQL Server ofrece DMVs, Query Store, planes de ejecucion y contadores para diagnosticar rendimiento.

## Query Store

Query Store guarda historico de planes y rendimiento.

```sql
ALTER DATABASE Tienda SET QUERY_STORE = ON;
```

Permite detectar regresiones de planes.

## DMVs utiles

Consultas activas:

```sql
SELECT *
FROM sys.dm_exec_requests;
```

Conexiones:

```sql
SELECT *
FROM sys.dm_exec_sessions;
```

## Wait stats

Las esperas ayudan a saber donde se pierde tiempo.

```sql
SELECT wait_type, waiting_tasks_count, wait_time_ms
FROM sys.dm_os_wait_stats
ORDER BY wait_time_ms DESC;
```

## Planes de ejecucion

Revisa:

- Scans grandes.
- Key lookups.
- Sorts.
- Hash joins inesperados.
- Estimaciones muy distintas de filas reales.

## Bloqueos

```sql
EXEC sp_who2;
```

Para diagnostico serio, usa DMVs y herramientas especificas.

## Buenas practicas

- Activa Query Store.
- Monitoriza waits.
- Revisa planes reales, no solo estimados.
- Mide antes de crear indices.
- Documenta runbooks para bloqueos, log lleno y consultas lentas.

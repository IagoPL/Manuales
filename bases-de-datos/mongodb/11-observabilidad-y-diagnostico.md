# Observabilidad y diagnostico

MongoDB se diagnostica con explain plans, profiler, metricas, logs y estado del replica set/sharding.

## Explain

```javascript
db.pedidos.find({ cliente_id: 1 }).explain("executionStats")
```

Revisa:

- `COLLSCAN`.
- `IXSCAN`.
- Documentos examinados.
- Tiempo de ejecucion.

## Profiler

```javascript
db.setProfilingLevel(1, { slowms: 100 })
```

Registra operaciones lentas.

## Replica set

```javascript
rs.status()
```

## Metricas clave

- Latencia.
- Opcounters.
- Cache WiredTiger.
- Page faults.
- Connections.
- Replication lag.
- Lock percentages.
- Index usage.

## Buenas practicas

- Usa explain antes de optimizar.
- Monitoriza lag.
- Revisa slow queries.
- Alerta por uso de disco.
- Documenta runbooks para primary down, lag y consultas lentas.

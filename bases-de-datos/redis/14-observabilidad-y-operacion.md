# Observabilidad y operacion

Redis requiere observabilidad constante: memoria, latencia, conexiones, comandos lentos, persistencia y replicacion.

## INFO

Comando base:

```bash
INFO
INFO memory
INFO stats
INFO persistence
INFO replication
```

Secciones utiles:

- `memory`
- `clients`
- `stats`
- `persistence`
- `replication`
- `commandstats`
- `cluster`

## Latencia

Herramientas:

```bash
LATENCY DOCTOR
LATENCY LATEST
```

Tambien puedes medir con:

```bash
redis-cli --latency
redis-cli --latency-history
```

## Slowlog

```bash
SLOWLOG GET 20
SLOWLOG RESET
```

El slowlog muestra comandos que superan el umbral configurado. No mide tiempo de red, mide ejecucion dentro de Redis.

## Monitor

```bash
MONITOR
```

Muestra comandos en tiempo real. Es util para diagnostico puntual, pero puede afectar rendimiento. No lo dejes activo en produccion.

## Metricas clave

Monitoriza:

- Memoria usada.
- Ratio de fragmentacion.
- Evicted keys.
- Expired keys.
- Connected clients.
- Blocked clients.
- Ops/sec.
- Hit rate de cache.
- Replication lag.
- AOF/RDB status.
- Slowlog length.

## Cache hit rate

Redis no siempre sabe que es cache y que no. Puedes estimar:

```txt
keyspace_hits / (keyspace_hits + keyspace_misses)
```

Sale de:

```bash
INFO stats
```

## Alertas recomendadas

- Memoria por encima del 80%.
- Evictions inesperadas.
- Replicas con lag alto.
- AOF rewrite fallando.
- RDB save fallando.
- Muchos clientes bloqueados.
- Latencia superior al objetivo.
- Caida de hit rate.

## Backups y restore

No basta con crear backups. Debes probar restore.

Checklist:

- Donde se guarda el backup?
- Esta cifrado?
- Cada cuanto se prueba?
- Cuanto tarda el restore?
- Que perdida de datos es aceptable?

## Operaciones peligrosas

Evita en produccion sin plan:

```bash
FLUSHALL
FLUSHDB
KEYS *
CONFIG SET
DEBUG SEGFAULT
```

Usa ACL y permisos para limitar quien puede ejecutar comandos criticos.

## Runbook basico

Si Redis va lento:

1. `INFO memory`
2. `INFO clients`
3. `SLOWLOG GET 20`
4. `LATENCY DOCTOR`
5. Revisar CPU, red y swap del host.
6. Revisar cambios recientes de aplicacion.
7. Comprobar si hay comandos O(n) nuevos.

## Buenas practicas

- Exporta metricas a Prometheus, Datadog u otra plataforma.
- Define SLO de latencia y disponibilidad.
- Prueba failover y restore regularmente.
- Documenta comandos de emergencia.
- Restringe comandos peligrosos con ACL.


# Alta disponibilidad

La alta disponibilidad en Redis busca reducir caidas y perdida de servicio. No elimina la necesidad de backups ni de disenar bien la aplicacion.

## Replicacion

Redis puede tener replicas de lectura:

```txt
primary -> replica 1
        -> replica 2
```

Las replicas ayudan con lectura y recuperacion, pero la replicacion es asincrona. Puede haber perdida de datos recientes si el primary falla.

## Sentinel

Redis Sentinel monitoriza instancias y puede promover una replica cuando cae el primary.

Funciones:

- Monitorizacion.
- Notificacion.
- Failover automatico.
- Descubrimiento del primary actual.

## Cluster

Redis Cluster reparte datos por slots entre varios nodos.

Sirve para:

- Escalar memoria.
- Escalar throughput.
- Tener failover por shards.

Implica mas complejidad: no todas las operaciones multiclave funcionan igual si las claves viven en slots distintos.

## Backups vs replicas

Una replica copia tambien errores logicos:

- `DEL` accidental.
- Corrupcion de datos por bug.
- Expiraciones mal configuradas.

Por eso replica no sustituye a backup.

## Clientes

La aplicacion debe soportar:

- Reconexiones.
- Timeouts.
- Reintentos con backoff.
- Descubrimiento de primary.
- Errores temporales durante failover.

## Buenas practicas

- Usa servicios gestionados si no tienes experiencia operando Redis.
- Prueba failover.
- Monitoriza lag de replicas.
- Configura timeouts en clientes.
- Manten backups aunque haya replicas.

## Errores comunes

- Pensar que replica equivale a consistencia inmediata.
- No probar caidas.
- Usar operaciones multiclave sin considerar cluster.
- No configurar timeouts.
- Desplegar Sentinel sin quorum adecuado.

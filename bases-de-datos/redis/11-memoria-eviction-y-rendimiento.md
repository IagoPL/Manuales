# Memoria, eviction y rendimiento

Redis vive en memoria. Por eso el diseno de claves, el tamano de los valores y la politica de eviction son decisiones centrales.

## Ver memoria

```bash
INFO memory
MEMORY STATS
MEMORY USAGE user:1
```

Campos importantes:

- `used_memory`: memoria usada por Redis.
- `used_memory_rss`: memoria vista por el sistema operativo.
- `mem_fragmentation_ratio`: relacion entre RSS y memoria usada.
- `maxmemory`: limite configurado.

## Configurar limite

```conf
maxmemory 2gb
maxmemory-policy allkeys-lru
```

Sin limite, Redis puede consumir demasiada memoria y provocar problemas en el host.

## Politicas de eviction

Cuando Redis alcanza `maxmemory`, aplica una politica.

| Politica | Comportamiento |
| --- | --- |
| `noeviction` | Devuelve error en escrituras |
| `allkeys-lru` | Expulsa claves menos usadas |
| `volatile-lru` | Expulsa claves con TTL menos usadas |
| `allkeys-lfu` | Expulsa claves menos frecuentes |
| `volatile-ttl` | Expulsa claves con TTL mas cercano |
| `allkeys-random` | Expulsa claves aleatorias |

Para cache general, `allkeys-lru` o `allkeys-lfu` suelen ser razonables.

## TTL y cardinalidad

El TTL evita acumulacion infinita:

```bash
SET cache:producto:10 "{...}" EX 300
```

Evita claves sin expiracion para datos temporales.

## Diseno de claves

Usa nombres consistentes:

```txt
app:entidad:id
tienda:producto:10
tienda:sesion:abc
tienda:rate:user-1:2026-06-26T10:20
```

No hagas claves gigantes ni metas demasiada semantica dificil de parsear.

## Valores grandes

Redis puede guardar valores grandes, pero no siempre conviene.

Riesgos:

- Mas memoria.
- Mas tiempo de red.
- Bloqueos por serializacion.
- Peor rendimiento en replicacion.

Para documentos grandes, guarda solo lo necesario o usa una base principal externa.

## Comandos lentos

Ver slowlog:

```bash
SLOWLOG GET 10
SLOWLOG LEN
```

Configurar umbral:

```conf
slowlog-log-slower-than 10000
```

El valor esta en microsegundos.

## Pipeline

Pipeline reduce round trips de red.

Ejemplo conceptual con `redis-cli`:

```bash
redis-cli --pipe < comandos.txt
```

En clientes de aplicacion, usa pipeline cuando tengas muchas operaciones independientes.

## MGET y HMGET

Mejor agrupar lecturas relacionadas:

```bash
MGET producto:1 producto:2 producto:3
HMGET user:1 nombre email rol
```

## SCAN en vez de KEYS

No uses:

```bash
KEYS *
```

Usa:

```bash
SCAN 0 MATCH tienda:producto:* COUNT 100
```

`SCAN` itera incrementalmente y evita bloquear tanto.

## Fragmentacion

Una fragmentacion alta puede indicar que Redis reserva mas memoria del sistema de la que aparenta usar.

Revisa:

```bash
INFO memory
```

En casos serios, evalua reinicio controlado, replica promotion o ajustes de allocator. No improvises en produccion.

## Checklist de rendimiento

- Hay `maxmemory` definido?
- La politica de eviction encaja con el uso?
- Los datos temporales tienen TTL?
- Hay comandos O(n) en rutas calientes?
- Se usa pipeline donde hay muchas operaciones?
- `SLOWLOG` muestra comandos sospechosos?
- El host esta evitando swap?


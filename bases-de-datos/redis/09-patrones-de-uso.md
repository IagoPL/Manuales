# Patrones de uso

Redis brilla cuando se usa para problemas concretos: cache, contadores, locks, sesiones, rankings y eventos ligeros.

## Cache

```bash
SET producto:1 "{...}" EX 300
GET producto:1
```

Usa cache-aside y TTL. Define invalidacion para escrituras.

## Sesiones

```bash
SET sesion:abc usuario:1 EX 3600
```

Ventajas:

- Rapido.
- Expiracion natural.
- Compartido entre servidores.

## Rate limiting

```bash
INCR rate:usuario:1:2026-06-25T10:00
EXPIRE rate:usuario:1:2026-06-25T10:00 60
```

Para casos serios, usa Lua para que incremento y expiracion sean atomicos.

## Locks

```bash
SET lock:pedido:10 worker-1 NX PX 30000
```

Un lock debe tener expiracion. Liberarlo debe comprobar que el valor pertenece al cliente que lo creo.

## Rankings

```bash
ZINCRBY ranking 5 usuario:1
ZREVRANGE ranking 0 9 WITHSCORES
```

## Colas ligeras

Para colas simples:

```bash
LPUSH cola:emails email-1
BRPOP cola:emails 5
```

Para mas control, usa Streams.

## Buenas practicas

- Disena claves por dominio: `app:tipo:id`.
- Usa TTL por defecto en datos temporales.
- Monitoriza memoria y eviction.
- Decide si el dato puede perderse.
- Documenta patrones de acceso.

## Errores comunes

- Usar Redis como base principal sin evaluar durabilidad.
- No poner expiracion en locks.
- Crear claves imposibles de localizar.
- No limpiar rankings o historiales.
- Meter logica compleja en Lua.

# Comandos esenciales

Redis se maneja con comandos simples. Lo importante es entender su coste, su efecto y si modifican memoria.

## Claves

```bash
EXISTS usuario:1
DEL usuario:1
TYPE usuario:1
TTL usuario:1
EXPIRE usuario:1 3600
```

Evita `KEYS *` en produccion. Usa `SCAN`:

```bash
SCAN 0 MATCH usuario:* COUNT 100
```

## Strings

```bash
SET sesion:abc "usuario:1" EX 3600
GET sesion:abc
SETNX lock:pedido:10 "worker-1"
INCR contador
DECR contador
```

## Hashes

```bash
HSET producto:1 nombre "Teclado" stock 20
HINCRBY producto:1 stock -1
HGET producto:1 stock
```

## Sets

```bash
SADD usuarios:online usuario:1
SREM usuarios:online usuario:1
SMEMBERS usuarios:online
```

## Sorted sets

```bash
ZADD ranking 100 usuario:1
ZINCRBY ranking 10 usuario:1
ZRANGE ranking 0 -1 WITHSCORES
```

## Transacciones

```bash
MULTI
INCR contador
EXPIRE contador 60
EXEC
```

`MULTI/EXEC` agrupa comandos, pero no equivale a transacciones relacionales complejas.

## Lua

Lua permite operaciones atomicas:

```bash
EVAL "return redis.call('INCR', KEYS[1])" 1 contador
```

Usalo para operaciones pequenas y criticas, no para logica larga.

## Buenas practicas

- Usa `SCAN` para recorrer claves.
- Usa expiraciones en datos temporales.
- Prefiere operaciones atomicas nativas.
- Mide comandos lentos con `SLOWLOG`.
- Documenta patrones de claves.

## Errores comunes

- Ejecutar `KEYS` en produccion.
- Usar comandos bloqueantes sin control.
- No controlar TTL.
- Hacer demasiadas operaciones una a una sin pipeline.
- Guardar claves con nombres inconsistentes.

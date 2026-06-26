# Transacciones, Lua y atomicidad

Redis garantiza atomicidad por comando. Para operaciones compuestas, puedes usar `MULTI/EXEC`, `WATCH` o scripts Lua.

## Atomicidad por comando

Este comando es atomico:

```bash
INCR contador
```

Dos clientes pueden ejecutar `INCR` a la vez y Redis mantendra el contador correcto.

## MULTI y EXEC

Agrupa comandos:

```bash
MULTI
INCR visitas:home
EXPIRE visitas:home 60
EXEC
```

Redis ejecuta los comandos en orden cuando llega `EXEC`.

## Limitaciones

`MULTI/EXEC` no hace rollback como una base relacional. Si un comando falla en ejecucion, otros comandos pueden haberse ejecutado.

Usalo para operaciones simples y bien conocidas.

## WATCH

`WATCH` implementa control optimista.

```bash
WATCH stock:producto:10
GET stock:producto:10
MULTI
DECR stock:producto:10
EXEC
```

Si otro cliente modifica la clave vigilada antes de `EXEC`, la transaccion falla y debes reintentar.

## Lua

Los scripts Lua se ejecutan atomicamente.

Ejemplo: rate limiting con incremento y expiracion en una sola operacion.

```lua
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return current
```

Ejecucion:

```bash
EVAL 'local current = redis.call("INCR", KEYS[1]); if current == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]); end; return current' 1 rate:user:1 60
```

## Locks seguros

Crear lock:

```bash
SET lock:pedido:10 worker-1 NX PX 30000
```

Liberar lock de forma segura requiere comprobar valor:

```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end
```

Asi evitas borrar un lock que ya expiro y fue adquirido por otro proceso.

## Idempotencia

Redis ayuda a evitar duplicados:

```bash
SET evento:abc procesado NX EX 86400
```

Si devuelve OK, procesas. Si no, ya fue visto.

## Contadores con ventana

Ventana fija:

```bash
INCR rate:ip:1.2.3.4:2026-06-26T10:30
EXPIRE rate:ip:1.2.3.4:2026-06-26T10:30 60
```

Para que sea atomico, usa Lua.

## Streams y ACK

Streams permiten entregar mensajes y confirmarlos:

```bash
XADD events:orders * type created order_id 10
XGROUP CREATE events:orders workers $ MKSTREAM
XREADGROUP GROUP workers worker-1 COUNT 10 STREAMS events:orders >
XACK events:orders workers 1690000000000-0
```

## Buenas practicas

- Prefiere comandos atomicos simples cuando existan.
- Usa Lua para operaciones cortas y criticas.
- Evita scripts Lua largos o con logica de negocio compleja.
- Pon TTL a locks, marcas de idempotencia y ventanas de rate limit.
- Disena reintentos: `WATCH` puede fallar correctamente.


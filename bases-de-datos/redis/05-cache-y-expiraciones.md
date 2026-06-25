# Cache y expiraciones

Redis se usa mucho como cache porque responde muy rapido y permite expiraciones por clave.

## Cache-aside

Patron habitual:

```txt
leer cache
si existe -> devolver
si no existe -> leer base de datos -> guardar en Redis con TTL -> devolver
```

Pseudo codigo:

```txt
key = "producto:1"
valor = redis.get(key)
if valor == null:
  valor = db.query(...)
  redis.set(key, valor, ex=300)
return valor
```

## TTL

```bash
SET producto:1 "{...}" EX 300
TTL producto:1
EXPIRE producto:1 600
PERSIST producto:1
```

## Invalidacion

Estrategias:

- Expirar por tiempo.
- Borrar cache al actualizar dato.
- Versionar claves.
- Usar eventos para invalidar.

Ejemplo:

```bash
DEL producto:1
```

## Stampede

Ocurre cuando muchas peticiones recalculan la misma clave al expirar.

Mitigaciones:

- TTL con variacion aleatoria.
- Locks temporales.
- Refresco anticipado.
- Cache de valores stale durante poco tiempo.

## Eviction

Si Redis llega al limite de memoria, aplica una politica:

- `noeviction`
- `allkeys-lru`
- `volatile-lru`
- `allkeys-lfu`
- `volatile-ttl`

Elige segun si Redis es cache pura o contiene datos que no deben perderse.

## Buenas practicas

- Define TTL por tipo de dato.
- Usa claves predecibles.
- No caches datos que cambian constantemente sin invalidacion.
- Serializa de forma compacta.
- Monitoriza hit rate y memoria.

## Errores comunes

- Cachear sin TTL.
- No invalidar despues de escrituras.
- Usar Redis como solucion a consultas mal disenadas.
- Guardar respuestas enormes.
- No definir politica de eviction.

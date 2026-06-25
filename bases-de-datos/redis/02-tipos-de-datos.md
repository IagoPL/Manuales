# Tipos de datos

Redis es una base de datos clave-valor, pero sus valores no son solo strings. Elegir el tipo correcto simplifica el modelo y mejora rendimiento.

## Strings

El tipo mas basico.

```bash
SET usuario:1:nombre "Iago"
GET usuario:1:nombre
INCR contador:visitas
```

Usos:

- Tokens.
- Contadores.
- Flags.
- Valores cacheados serializados.

## Hashes

Representan objetos con campos.

```bash
HSET usuario:1 nombre "Iago" email "iago@example.com" activo "true"
HGET usuario:1 email
HGETALL usuario:1
```

Usos:

- Perfiles de usuario.
- Configuracion.
- Objetos pequenos.

## Lists

Listas ordenadas por insercion.

```bash
LPUSH cola:emails "email-1"
RPOP cola:emails
```

Usos:

- Colas simples.
- Historiales cortos.
- Buffers.

## Sets

Colecciones sin duplicados.

```bash
SADD post:1:likes usuario:1 usuario:2
SISMEMBER post:1:likes usuario:1
SCARD post:1:likes
```

Usos:

- Likes.
- Tags.
- Miembros unicos.

## Sorted sets

Sets con puntuacion.

```bash
ZADD ranking 1500 usuario:1 1200 usuario:2
ZREVRANGE ranking 0 9 WITHSCORES
```

Usos:

- Rankings.
- Prioridades.
- Lineas temporales.

## Streams

Estructuras para eventos append-only.

```bash
XADD pedidos * pedido_id 10 estado creado
XRANGE pedidos - +
```

Usos:

- Eventos.
- Consumer groups.
- Procesamiento asincrono.

## Buenas practicas

- Modela por patrones de acceso.
- Usa TTL cuando el dato sea temporal.
- Manten valores pequenos.
- Define convenciones de nombres.
- Evita guardar documentos enormes en una sola clave.

## Errores comunes

- Usar strings JSON para todo.
- No definir expiraciones en cache.
- Crear millones de claves sin patron de limpieza.
- Usar lists como sistema de colas critico sin entender fallos.
- No estimar memoria.

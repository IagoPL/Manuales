# Redis

Redis es una base de datos en memoria orientada a estructuras de datos. Se usa como cache, almacen de sesiones, contador, cola ligera, ranking, sistema de Pub/Sub y motor de streams.

Su fuerza esta en la latencia muy baja y en operaciones atomicas sobre tipos como strings, hashes, lists, sets, sorted sets y streams.

## Capitulos

1. [Introduccion y casos de uso](01-introduccion-y-casos-de-uso.md)
2. [Tipos de datos](02-tipos-de-datos.md)
3. [Comandos esenciales](03-comandos-esenciales.md)
4. [Persistencia](04-persistencia.md)
5. [Cache y expiraciones](05-cache-y-expiraciones.md)
6. [Pub Sub y streams](06-pub-sub-y-streams.md)
7. [Seguridad](07-seguridad.md)
8. [Alta disponibilidad](08-alta-disponibilidad.md)
9. [Patrones de uso](09-patrones-de-uso.md)

## Instalacion con Docker

```bash
docker run --name redis-dev -p 6379:6379 -d redis:7
```

Conectar:

```bash
docker exec -it redis-dev redis-cli
```

## Primeros comandos

```bash
SET saludo "hola"
GET saludo
INCR contador
EXPIRE saludo 60
TTL saludo
```

## Casos de uso

- Cache de consultas o respuestas HTTP.
- Sesiones de usuario.
- Rate limiting.
- Locks temporales.
- Rankings.
- Pub/Sub para notificaciones efimeras.
- Streams para eventos ligeros con consumidores.

## Cuando no usar Redis como base principal

Redis no siempre debe ser la fuente de verdad. Si necesitas consultas relacionales complejas, historico grande, integridad referencial o durabilidad estricta, una base como PostgreSQL o SQL Server suele ser mejor.

## Buenas practicas iniciales

- Define TTL para datos temporales.
- Disena nombres de claves consistentes.
- Estima memoria antes de crecer.
- Protege Redis a nivel de red.
- Decide si necesitas persistencia.

## Errores comunes

- Exponer Redis publicamente.
- Usar `KEYS *` en produccion.
- Cachear sin estrategia de invalidacion.
- No configurar expiracion en locks.
- Pensar que replica equivale a backup.

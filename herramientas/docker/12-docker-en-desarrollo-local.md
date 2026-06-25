# Docker en desarrollo local

Docker es especialmente util para levantar dependencias externas sin instalar todo en la maquina: bases de datos, caches, colas, buscadores y servicios auxiliares.

## Dependencias comunes

PostgreSQL:

```bash
docker run --name pg-dev \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=app \
  -p 5432:5432 \
  -v pg_data:/var/lib/postgresql/data \
  -d postgres:16
```

Redis:

```bash
docker run --name redis-dev \
  -p 6379:6379 \
  -d redis:7
```

## Redes para desarrollo

```bash
docker network create app-net
docker network connect app-net pg-dev
docker network connect app-net redis-dev
```

Los contenedores de la misma red pueden resolverse por nombre.

## Bind mounts

Para desarrollo puedes montar codigo:

```bash
docker run --rm -it \
  -v ${PWD}:/app \
  -w /app \
  node:22-alpine \
  npm test
```

En produccion no montes el codigo fuente asi.

## Variables de entorno

```bash
docker run --rm \
  -e DATABASE_URL=postgresql://app:app@pg-dev:5432/app \
  --network app-net \
  app:dev
```

## Docker Compose

Cuando hay varios servicios, Compose mejora ergonomia. El detalle esta en el manual de [Docker Compose](../../cloud/docker-compose/01-introduccion-y-casos-de-uso.md).

## Buenas practicas

- Usa Docker para dependencias pesadas.
- Persisten datos con volumenes.
- Documenta comandos en README o scripts.
- Separa `.env.example` de `.env`.
- Usa nombres de contenedores claros.

## Errores comunes

- Depender de datos creados a mano.
- Mezclar puertos entre proyectos.
- No limpiar volumenes de pruebas.
- Creer que desarrollo local equivale a produccion.
- Montar todo el disco dentro del contenedor.

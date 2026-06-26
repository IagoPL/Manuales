# Guia completa de PostgreSQL

PostgreSQL es una base de datos relacional open source, robusta y extensible. Se usa tanto en aplicaciones transaccionales como en analitica ligera, APIs, sistemas internos y productos SaaS.

Destaca por su soporte SQL, transacciones ACID, tipos avanzados, JSONB, extensiones, indices potentes y una comunidad enorme.

## Capitulos

1. [Introduccion e instalacion](01-introduccion-e-instalacion.md)
2. [Modelo relacional y SQL](02-modelo-relacional-y-sql.md)
3. [Tipos de datos y constraints](03-tipos-de-datos-y-constraints.md)
4. [Consultas joins y agregaciones](04-consultas-joins-y-agregaciones.md)
5. [Indices y planes de ejecucion](05-indices-y-planes-de-ejecucion.md)
6. [Transacciones y concurrencia](06-transacciones-y-concurrencia.md)
7. [Funciones vistas y materialized views](07-funciones-vistas-y-materialized-views.md)
8. [JSONB y busqueda](08-jsonb-y-busqueda.md)
9. [Administracion backup y restore](09-administracion-backup-y-restore.md)
10. [Rendimiento y buenas practicas](10-rendimiento-y-buenas-practicas.md)
11. [Arquitectura interna](11-arquitectura-interna.md)
12. [MVCC y aislamiento](12-mvcc-y-aislamiento.md)
13. [WAL checkpoints y recuperacion](13-wal-checkpoints-y-recuperacion.md)
14. [Vacuum autovacuum y bloat](14-vacuum-autovacuum-y-bloat.md)
15. [Seguridad replicacion y operacion](15-seguridad-replicacion-y-operacion.md)
16. [Proyecto final](16-proyecto-final.md)

## Mapa mental

```mermaid
flowchart TD
  A["Cliente"] --> B["Postmaster"]
  B --> C["Backend process"]
  C --> D["Parser / Planner / Executor"]
  D --> E["Shared buffers"]
  E --> F["Data files"]
  C --> G["WAL"]
  G --> H["Archive / replicas"]
  I["Autovacuum"] --> F
```

## Instalacion con Docker

```bash
docker run --name postgres-dev \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=tienda \
  -p 5432:5432 \
  -d postgres:16
```

Conectar:

```bash
psql postgresql://app:app@localhost:5432/tienda
```

## Primeras consultas

```sql
SELECT version();

CREATE TABLE clientes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

INSERT INTO clientes (nombre, email)
VALUES ('Ana', 'ana@example.com');

SELECT * FROM clientes;
```

## Cuando usar PostgreSQL

- Aplicaciones web y APIs.
- Datos relacionales con integridad fuerte.
- Sistemas que necesitan SQL potente.
- Proyectos donde JSONB complementa al modelo relacional.
- Productos que necesitan fiabilidad sin depender de una base propietaria.

## Buenas practicas iniciales

- Define primary keys y foreign keys.
- Usa migraciones versionadas.
- Separa usuarios por responsabilidad.
- Activa backups desde el inicio.
- Mide consultas lentas antes de optimizar.

## Errores comunes

- Usar el superusuario para la aplicacion.
- Guardar dinero en tipos aproximados.
- No probar restauraciones.
- Crear indices sin medir.
- Dejar conexiones abiertas sin pool.

## Recursos relacionados

- [Arquitectura interna](11-arquitectura-interna.md)
- [MVCC y aislamiento](12-mvcc-y-aislamiento.md)
- [WAL checkpoints y recuperacion](13-wal-checkpoints-y-recuperacion.md)

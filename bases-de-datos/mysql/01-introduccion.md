# MySQL

MySQL es un sistema gestor de bases de datos relacional muy usado en aplicaciones web, APIs, CMS, sistemas internos y proyectos full stack. Su motor habitual es InnoDB, que aporta transacciones, claves foraneas, bloqueos por fila e indices B-Tree.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Modelo relacional, tipos y constraints](02-modelo-relacional-tipos-y-constraints.md)
3. [Consultas, joins y agregaciones](03-consultas-joins-y-agregaciones.md)
4. [Indices y EXPLAIN](04-indices-y-explain.md)
5. [Transacciones e InnoDB](05-transacciones-e-innodb.md)
6. [Usuarios, backup y restore](06-usuarios-backup-y-restore.md)
7. [Rendimiento y buenas practicas](07-rendimiento-y-buenas-practicas.md)
8. [Arquitectura interna de InnoDB](08-arquitectura-interna-de-innodb.md)
9. [Locks, MVCC y niveles de aislamiento](09-locks-mvcc-y-niveles-de-aislamiento.md)
10. [Binlog, replicacion y alta disponibilidad](10-binlog-replicacion-y-alta-disponibilidad.md)
11. [Particionado y tablas grandes](11-particionado-y-tablas-grandes.md)
12. [Observabilidad y diagnostico](12-observabilidad-y-diagnostico.md)
13. [MySQL en produccion](13-mysql-en-produccion.md)
14. [Proyecto final](14-proyecto-final.md)

## Instalacion con Docker

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=app_db \
  -p 3306:3306 \
  -d mysql:8
```

Conexion:

```bash
mysql -h localhost -P 3306 -u root -p
```

## Primeros pasos

```sql
CREATE DATABASE app_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE app_db;

CREATE TABLE productos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

INSERT INTO productos (nombre, precio, stock)
VALUES ('Teclado', 49.99, 20);

SELECT id, nombre, precio
FROM productos
WHERE stock > 0;
```

## Cuando usar MySQL

- Aplicaciones web tradicionales.
- APIs con modelo relacional claro.
- WordPress, Laravel y ecosistemas PHP.
- Productos que necesitan SQL fiable y administracion sencilla.
- Servicios que encajan bien con InnoDB y replicas.

## Buenas practicas iniciales

- Usa InnoDB salvo razon clara.
- Define charset `utf8mb4`.
- No uses `root` desde aplicaciones.
- Usa `DECIMAL` para importes.
- Define primary keys y foreign keys.
- Prueba restauraciones, no solo backups.

## Recursos relacionados

- [SQL](../sql/01-introduccion.md)
- [PostgreSQL](../postgresql/01-introduccion-e-instalacion.md)
- [Oracle SQL](../oracle-sql/01-introduccion.md)
- [Docker](../../herramientas/docker/01-introduccion.md)

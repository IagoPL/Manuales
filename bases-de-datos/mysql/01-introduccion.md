# MySQL

MySQL es un sistema de gestión de bases de datos relacionales muy usado en aplicaciones web, APIs, sistemas internos y proyectos full stack.

## Conceptos clave

- **Servidor MySQL:** proceso que almacena y gestiona las bases de datos.
- **Cliente MySQL:** herramienta para conectarse al servidor y ejecutar consultas.
- **Schema o base de datos:** agrupación lógica de tablas.
- **Tabla:** estructura relacional compuesta por filas y columnas.
- **Usuario:** cuenta con permisos concretos.
- **Motor de almacenamiento:** componente que define cómo se guardan los datos. InnoDB es el motor habitual.

## Instalación o configuración

En un entorno local, MySQL suele instalarse mediante instalador oficial, gestor de paquetes o Docker.

Ejemplo con Docker:

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=app_db \
  -p 3306:3306 \
  -d mysql:8
```

Conexión desde terminal:

```bash
mysql -h localhost -P 3306 -u root -p
```

## Uso básico

### Crear una base de datos

```sql
CREATE DATABASE app_db;
USE app_db;
```

### Crear una tabla

```sql
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);
```

### Insertar datos

```sql
INSERT INTO productos (nombre, precio, stock)
VALUES ('Teclado', 49.99, 20);
```

### Consultar datos

```sql
SELECT id, nombre, precio
FROM productos
WHERE stock > 0
ORDER BY precio ASC;
```

## Ejemplos prácticos

### Crear usuario y permisos

```sql
CREATE USER 'app_user'@'%' IDENTIFIED BY 'password_segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
```

### Crear una relación

```sql
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_productos
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

### Backup y restauración

```bash
mysqldump -u root -p app_db > app_db.sql
mysql -u root -p app_db < app_db.sql
```

## Buenas prácticas

- Usa InnoDB salvo que tengas una razón clara para otro motor.
- Crea usuarios con permisos mínimos, evitando usar `root` en aplicaciones.
- Define claves primarias y foráneas.
- Usa `DECIMAL` para importes económicos.
- Añade índices a columnas usadas en búsquedas, joins y ordenaciones frecuentes.
- Automatiza backups y prueba restauraciones.
- Guarda contraseñas fuera del código fuente.

## Errores comunes

- Usar `root` desde la aplicación.
- No definir charset/collation coherentes.
- Guardar dinero en `FLOAT`.
- No crear índices en claves foráneas o columnas de búsqueda.
- Hacer backups sin comprobar que se pueden restaurar.

## Chuleta rápida

```sql
SHOW DATABASES;
USE app_db;
SHOW TABLES;
DESCRIBE productos;
CREATE DATABASE app_db;
DROP DATABASE app_db;
```

```bash
mysql -u usuario -p
mysqldump -u usuario -p base > backup.sql
```

## Recursos relacionados

- [SQL](../sql/README.md)
- [Oracle SQL](../oracle-sql/README.md)
- [Docker](../../herramientas/docker/README.md)

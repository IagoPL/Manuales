# SQL

SQL es el lenguaje estándar para consultar, crear y administrar datos en bases de datos relacionales. Se utiliza para leer información, modificar registros, definir estructuras y controlar permisos.

## Conceptos clave

- **Base de datos:** contenedor lógico de tablas, vistas, índices y otros objetos.
- **Tabla:** estructura formada por filas y columnas.
- **Fila:** registro individual.
- **Columna:** atributo con un tipo de dato definido.
- **Clave primaria:** identificador único de cada fila.
- **Clave foránea:** relación entre una tabla y la clave primaria de otra.
- **Índice:** estructura auxiliar que acelera búsquedas y ordenaciones.
- **Vista:** consulta guardada que se puede tratar como una tabla virtual.

## Instalación o configuración

SQL no se instala como herramienta única: se usa dentro de un motor de base de datos como MySQL, PostgreSQL, Oracle Database, SQL Server o SQLite.

Para practicar puedes usar:

- SQLite para ejemplos locales sencillos.
- MySQL o PostgreSQL para proyectos web.
- Oracle SQL para entornos empresariales.
- Snowflake para analítica y data warehouse.

## Uso básico

### Consultar datos

```sql
SELECT nombre, email
FROM usuarios;
```

### Filtrar resultados

```sql
SELECT *
FROM pedidos
WHERE estado = 'pagado';
```

### Ordenar resultados

```sql
SELECT nombre, fecha_alta
FROM usuarios
ORDER BY fecha_alta DESC;
```

### Limitar columnas

Selecciona solo las columnas necesarias. Evita `SELECT *` en consultas de producción cuando no necesites todos los campos.

## Ejemplos prácticos

### Crear una tabla

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  fecha_alta DATE NOT NULL
);
```

### Insertar datos

```sql
INSERT INTO usuarios (id, nombre, email, fecha_alta)
VALUES (1, 'Ana', 'ana@example.com', '2026-01-15');
```

### Actualizar datos

```sql
UPDATE usuarios
SET email = 'ana.nueva@example.com'
WHERE id = 1;
```

### Eliminar datos

```sql
DELETE FROM usuarios
WHERE id = 1;
```

### Unir tablas

```sql
SELECT u.nombre, p.id AS pedido_id, p.total
FROM usuarios u
INNER JOIN pedidos p ON p.usuario_id = u.id;
```

### Agrupar datos

```sql
SELECT estado, COUNT(*) AS total_pedidos
FROM pedidos
GROUP BY estado;
```

## Buenas prácticas

- Usa nombres claros y consistentes para tablas y columnas.
- Define claves primarias en todas las tablas principales.
- Usa claves foráneas para representar relaciones importantes.
- Evita duplicar datos si puedes modelarlos con relaciones.
- Filtra por columnas indexadas cuando consultes grandes volúmenes.
- Revisa las consultas destructivas con `SELECT` antes de ejecutar `UPDATE` o `DELETE`.
- Usa transacciones cuando varias operaciones deban completarse juntas.

## Errores comunes

- Usar `SELECT *` en consultas que solo necesitan pocas columnas.
- Omitir `WHERE` en un `UPDATE` o `DELETE`.
- Crear relaciones sin claves foráneas.
- Guardar valores múltiples dentro de una sola columna.
- No revisar tipos de datos antes de crear una tabla.

## Chuleta rápida

```sql
SELECT columnas FROM tabla;
SELECT * FROM tabla WHERE condicion;
INSERT INTO tabla (columna) VALUES (valor);
UPDATE tabla SET columna = valor WHERE condicion;
DELETE FROM tabla WHERE condicion;
CREATE TABLE tabla (...);
ALTER TABLE tabla ADD columna tipo;
DROP TABLE tabla;
```

## Recursos relacionados

- [Oracle SQL](../oracle-sql/01-introduccion.md)
- [MySQL](../mysql/01-introduccion.md)
- [Snowflake](../snowflake/01-introduccion-y-arquitectura.md)

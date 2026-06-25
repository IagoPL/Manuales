# Oracle SQL

Oracle SQL es la variante de SQL utilizada en Oracle Database. Mantiene los fundamentos del SQL relacional y añade funciones, tipos y herramientas propias del ecosistema Oracle.

## Conceptos clave

- **Schema:** conjunto de objetos propiedad de un usuario.
- **Tabla:** estructura relacional para almacenar datos.
- **Sequence:** objeto que genera números secuenciales.
- **Synonym:** alias para referenciar objetos.
- **View:** consulta almacenada como objeto consultable.
- **PL/SQL:** lenguaje procedural de Oracle para lógica almacenada.

## Instalación o configuración

Para practicar Oracle SQL puedes usar:

- Oracle Database local o en contenedor.
- Oracle SQL Developer como cliente gráfico.
- SQLcl como cliente de terminal.
- Oracle Live SQL para prácticas en navegador.

Conexión genérica:

```bash
sqlplus usuario/password@host:puerto/servicio
```

## Uso básico

### Consultar datos

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE department_id = 50;
```

### Ordenar y limitar resultados

```sql
SELECT first_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 10 ROWS ONLY;
```

### Fechas

```sql
SELECT SYSDATE AS fecha_actual
FROM dual;
```

### Nulos

```sql
SELECT first_name, NVL(commission_pct, 0) AS comision
FROM employees;
```

## Ejemplos prácticos

### Crear tabla

```sql
CREATE TABLE clientes (
  id NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  email VARCHAR2(150) UNIQUE,
  fecha_alta DATE DEFAULT SYSDATE
);
```

### Crear secuencia

```sql
CREATE SEQUENCE clientes_seq
START WITH 1
INCREMENT BY 1;
```

### Insertar usando secuencia

```sql
INSERT INTO clientes (id, nombre, email)
VALUES (clientes_seq.NEXTVAL, 'Ana', 'ana@example.com');
```

### Join

```sql
SELECT c.nombre, p.fecha, p.total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id;
```

## Buenas prácticas

- Usa `VARCHAR2` para texto variable.
- Define constraints para reglas críticas de datos.
- Usa secuencias o columnas identity para identificadores.
- Evita funciones sobre columnas indexadas en filtros si afecta al rendimiento.
- Usa alias legibles en consultas con varias tablas.
- Revisa planes de ejecución en consultas costosas.

## Errores comunes

- Confundir usuario y schema.
- Olvidar `COMMIT` en sesiones transaccionales.
- Usar formatos de fecha dependientes de configuración regional.
- No gestionar `NULL` en expresiones y comparaciones.
- Portar SQL de otro motor sin revisar funciones específicas.

## Chuleta rápida

```sql
SELECT * FROM tabla;
SELECT SYSDATE FROM dual;
COMMIT;
ROLLBACK;
CREATE SEQUENCE nombre_seq START WITH 1;
SELECT nombre_seq.NEXTVAL FROM dual;
```

## Recursos relacionados

- [SQL](../sql/01-introduccion.md)
- [MySQL](../mysql/01-introduccion.md)
- [Snowflake](../snowflake/01-introduccion-y-arquitectura.md)

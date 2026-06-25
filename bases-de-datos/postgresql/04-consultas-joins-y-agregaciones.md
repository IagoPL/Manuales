# Consultas, joins y agregaciones

Consultar bien PostgreSQL implica filtrar pronto, unir con claves correctas y agregar con intencion.

## SELECT

```sql
SELECT id, nombre, total
FROM pedidos
WHERE estado = 'pagado'
ORDER BY creado_en DESC
LIMIT 20;
```

## Joins

```sql
SELECT c.nombre, p.id AS pedido_id, p.total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id;
```

Tipos comunes:

- `INNER JOIN`: solo coincidencias.
- `LEFT JOIN`: todas las filas de la izquierda.
- `RIGHT JOIN`: menos habitual.
- `FULL JOIN`: filas de ambos lados aunque no coincidan.

## Agregaciones

```sql
SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS facturacion
FROM pedidos
WHERE estado = 'pagado'
GROUP BY cliente_id
HAVING SUM(total) > 1000
ORDER BY facturacion DESC;
```

## Common Table Expressions

```sql
WITH ventas_cliente AS (
  SELECT cliente_id, SUM(total) AS total
  FROM pedidos
  GROUP BY cliente_id
)
SELECT *
FROM ventas_cliente
WHERE total > 1000;
```

## Window functions

```sql
SELECT
  cliente_id,
  creado_en,
  total,
  SUM(total) OVER (PARTITION BY cliente_id ORDER BY creado_en) AS total_acumulado
FROM pedidos;
```

## Buenas practicas

- Selecciona solo columnas necesarias.
- Usa alias claros.
- Filtra antes de agregar cuando sea posible.
- Revisa duplicados al unir tablas uno a muchos.
- Usa CTEs para dividir consultas complejas.

## Errores comunes

- Hacer `SELECT *` en consultas productivas.
- Olvidar condiciones de join.
- Usar `WHERE` cuando corresponde `HAVING`.
- Agregar columnas sin entender la granularidad.
- Ordenar grandes resultados sin necesidad.

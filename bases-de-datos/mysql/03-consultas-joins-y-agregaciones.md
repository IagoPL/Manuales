# Consultas, joins y agregaciones

MySQL permite trabajar con SQL relacional clasico: filtros, joins, agregaciones, subconsultas, CTEs y funciones de ventana.

## SELECT

```sql
SELECT id, nombre, precio
FROM productos
WHERE stock > 0
ORDER BY precio ASC
LIMIT 20;
```

## Joins

```sql
SELECT c.nombre, p.id AS pedido_id, p.total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id;
```

## LEFT JOIN

```sql
SELECT c.nombre, COUNT(p.id) AS pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nombre;
```

## Agregaciones

```sql
SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS facturacion
FROM pedidos
WHERE estado = 'pagado'
GROUP BY cliente_id
HAVING SUM(total) > 1000
ORDER BY facturacion DESC;
```

## CTEs

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

- Evita `SELECT *` en codigo productivo.
- Usa alias legibles.
- Agrupa con la granularidad correcta.
- Filtra antes de agregar si es posible.
- Revisa joins uno a muchos para no duplicar importes.

## Errores comunes

- Usar `LIMIT` sin `ORDER BY`.
- Olvidar condiciones de join.
- Confundir `WHERE` y `HAVING`.
- Desactivar reglas SQL estrictas para ocultar errores.
- Agregar columnas que no pertenecen al mismo nivel de detalle.

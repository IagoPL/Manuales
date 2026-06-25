# Consultas, funciones y joins

Oracle SQL ofrece joins, agregaciones, funciones analiticas y muchas funciones propias para texto, fechas y nulos.

## Joins

```sql
SELECT c.nombre, p.id AS pedido_id, p.total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id;
```

## Agregaciones

```sql
SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS facturacion
FROM pedidos
WHERE estado = 'PAGADO'
GROUP BY cliente_id
HAVING SUM(total) > 1000
ORDER BY facturacion DESC;
```

## Funciones de texto

```sql
SELECT
  UPPER(nombre),
  LOWER(email),
  SUBSTR(nombre, 1, 3)
FROM clientes;
```

## Funciones de fecha

```sql
SELECT
  TRUNC(fecha_alta, 'MM') AS mes,
  COUNT(*) AS clientes
FROM clientes
GROUP BY TRUNC(fecha_alta, 'MM');
```

## Funciones analiticas

```sql
SELECT
  cliente_id,
  fecha,
  total,
  SUM(total) OVER (PARTITION BY cliente_id ORDER BY fecha) AS total_acumulado
FROM pedidos;
```

## Buenas practicas

- Usa joins ANSI (`JOIN ... ON`).
- Evita funciones sobre columnas filtradas si impiden usar indices.
- Usa funciones analiticas para rankings y acumulados.
- Controla conversiones implicitas.
- Usa CTEs para consultas complejas.

## Errores comunes

- Usar sintaxis antigua de outer join `(+)`.
- Depender de conversiones de fecha implicitas.
- Agrupar con granularidad incorrecta.
- Olvidar que `DATE` contiene hora.
- Filtrar con funciones sin medir impacto.

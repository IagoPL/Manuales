# Consultas, joins y agregaciones

SQL Server trabaja muy bien con consultas set-based. La clave es pensar en conjuntos, no en filas procesadas una a una.

## SELECT

```sql
SELECT TOP (50)
  Id,
  ClienteId,
  Total,
  CreadoEn
FROM dbo.Pedidos
WHERE Estado = 'Pagado'
ORDER BY CreadoEn DESC;
```

## Joins

```sql
SELECT
  c.Nombre,
  p.Id AS PedidoId,
  p.Total
FROM dbo.Clientes c
INNER JOIN dbo.Pedidos p ON p.ClienteId = c.Id;
```

## LEFT JOIN

```sql
SELECT c.Nombre, COUNT(p.Id) AS Pedidos
FROM dbo.Clientes c
LEFT JOIN dbo.Pedidos p ON p.ClienteId = c.Id
GROUP BY c.Nombre;
```

## Agregaciones

```sql
SELECT
  ClienteId,
  COUNT(*) AS NumeroPedidos,
  SUM(Total) AS Facturacion
FROM dbo.Pedidos
WHERE Estado = 'Pagado'
GROUP BY ClienteId
HAVING SUM(Total) > 1000
ORDER BY Facturacion DESC;
```

## CTEs

```sql
WITH VentasCliente AS (
  SELECT ClienteId, SUM(Total) AS Total
  FROM dbo.Pedidos
  GROUP BY ClienteId
)
SELECT *
FROM VentasCliente
WHERE Total > 1000;
```

## Window functions

```sql
SELECT
  ClienteId,
  CreadoEn,
  Total,
  SUM(Total) OVER (PARTITION BY ClienteId ORDER BY CreadoEn) AS TotalAcumulado
FROM dbo.Pedidos;
```

## Buenas practicas

- Usa joins explicitos.
- Filtra por columnas indexables.
- Comprueba cardinalidad al agregar.
- Usa CTEs para legibilidad.
- Evita cursores si puedes resolverlo por conjuntos.

## Errores comunes

- `TOP` sin `ORDER BY`.
- Joins que multiplican filas sin querer.
- Agregar columnas con distinta granularidad.
- Usar funciones sobre columnas filtradas sin necesidad.
- Abusar de subconsultas repetidas.

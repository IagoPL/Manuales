# Procedimientos, funciones y vistas

SQL Server permite encapsular consultas y operaciones en vistas, procedimientos almacenados y funciones.

## Vistas

```sql
CREATE VIEW dbo.VentasPorCliente AS
SELECT ClienteId, COUNT(*) AS Pedidos, SUM(Total) AS Total
FROM dbo.Pedidos
WHERE Estado = 'Pagado'
GROUP BY ClienteId;
```

Uso:

```sql
SELECT *
FROM dbo.VentasPorCliente
WHERE Total > 1000;
```

## Procedimientos almacenados

```sql
CREATE PROCEDURE dbo.MarcarPedidoPagado
  @PedidoId INT
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE dbo.Pedidos
  SET Estado = 'Pagado'
  WHERE Id = @PedidoId;
END;
```

Ejecutar:

```sql
EXEC dbo.MarcarPedidoPagado @PedidoId = 10;
```

## Funciones

```sql
CREATE FUNCTION dbo.TotalCliente (@ClienteId INT)
RETURNS DECIMAL(12,2)
AS
BEGIN
  DECLARE @Total DECIMAL(12,2);

  SELECT @Total = COALESCE(SUM(Total), 0)
  FROM dbo.Pedidos
  WHERE ClienteId = @ClienteId AND Estado = 'Pagado';

  RETURN @Total;
END;
```

## Buenas practicas

- Usa `SET NOCOUNT ON` en procedimientos.
- Parametriza entradas.
- Controla errores con `TRY/CATCH` cuando haya transacciones.
- Versiona cambios.
- Manten procedimientos pequenos y enfocados.

## Errores comunes

- Poner toda la logica de negocio en procedimientos enormes.
- Usar funciones escalares en consultas masivas sin medir.
- Cambiar una vista sin revisar consumidores.
- Concatenar SQL dinamico sin proteger parametros.
- No documentar efectos secundarios.

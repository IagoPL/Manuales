# T-SQL esencial

T-SQL es la extension de SQL usada por SQL Server. Anade variables, control de flujo, procedimientos, funciones, manejo de errores y utilidades propias.

## Consultas basicas

```sql
SELECT TOP (20)
  Id,
  Nombre,
  Email
FROM dbo.Clientes
WHERE Activo = 1
ORDER BY Nombre;
```

## Variables

```sql
DECLARE @ClienteId INT = 10;

SELECT *
FROM dbo.Pedidos
WHERE ClienteId = @ClienteId;
```

## Fechas

```sql
SELECT
  GETDATE() AS FechaLocal,
  SYSUTCDATETIME() AS FechaUtc;
```

## CASE

```sql
SELECT
  Id,
  Total,
  CASE
    WHEN Total >= 1000 THEN 'alto'
    WHEN Total >= 100 THEN 'medio'
    ELSE 'bajo'
  END AS Segmento
FROM dbo.Pedidos;
```

## INSERT, UPDATE y DELETE

```sql
INSERT INTO dbo.Clientes (Nombre, Email)
VALUES ('Ana', 'ana@example.com');

UPDATE dbo.Clientes
SET Activo = 0
WHERE Id = 1;

DELETE FROM dbo.Clientes
WHERE Id = 1;
```

## TRY/CATCH

```sql
BEGIN TRY
  BEGIN TRAN;
  UPDATE dbo.Cuentas SET Saldo = Saldo - 100 WHERE Id = 1;
  UPDATE dbo.Cuentas SET Saldo = Saldo + 100 WHERE Id = 2;
  COMMIT;
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK;
  THROW;
END CATCH;
```

## Buenas practicas

- Usa schema explicito: `dbo.Tabla`.
- Evita `SELECT *`.
- Usa `SYSUTCDATETIME()` para auditoria UTC.
- Controla errores con `TRY/CATCH`.
- Parametriza consultas desde aplicaciones.

## Errores comunes

- Concatenar SQL dinamico con valores de usuario.
- Olvidar `WHERE` en `UPDATE` o `DELETE`.
- Confundir `TOP` con orden garantizado sin `ORDER BY`.
- Usar cursores para tareas que pueden resolverse con SQL set-based.

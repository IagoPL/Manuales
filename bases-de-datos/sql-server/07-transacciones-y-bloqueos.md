# Transacciones y bloqueos

SQL Server garantiza consistencia mediante transacciones y bloqueos. Entenderlos evita deadlocks, esperas largas y datos corruptos.

## Transaccion basica

```sql
BEGIN TRAN;

UPDATE dbo.Cuentas SET Saldo = Saldo - 100 WHERE Id = 1;
UPDATE dbo.Cuentas SET Saldo = Saldo + 100 WHERE Id = 2;

COMMIT;
```

Con manejo de errores:

```sql
BEGIN TRY
  BEGIN TRAN;
  -- operaciones
  COMMIT;
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK;
  THROW;
END CATCH;
```

## Niveles de aislamiento

- `READ COMMITTED`: habitual.
- `READ UNCOMMITTED`: permite lecturas sucias.
- `REPEATABLE READ`: evita cambios en filas leidas.
- `SERIALIZABLE`: mayor aislamiento.
- `SNAPSHOT`: usa versionado de filas.

```sql
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
```

## Bloqueos

SQL Server puede usar bloqueos de fila, pagina o tabla. El motor decide segun consulta, indices y volumen.

Pistas de bloqueo existen, pero deben usarse con cuidado:

```sql
SELECT *
FROM dbo.Pedidos WITH (UPDLOCK, ROWLOCK)
WHERE Id = 10;
```

## Deadlocks

Ocurren cuando dos transacciones se bloquean mutuamente. SQL Server elige una victima y cancela su transaccion.

Reduce deadlocks:

- Accediendo a tablas en el mismo orden.
- Manteniendo transacciones cortas.
- Indexando busquedas que actualizan.
- Evitando interacciones externas dentro de transacciones.

## Buenas practicas

- Manten transacciones cortas.
- Usa indices adecuados para reducir bloqueos.
- Considera `READ_COMMITTED_SNAPSHOT` si hay muchas lecturas.
- Reintenta transacciones canceladas por deadlock.
- Monitoriza waits y bloqueos.

## Errores comunes

- Usar `NOLOCK` para esconder problemas.
- Dejar transacciones abiertas.
- Actualizar demasiadas filas sin lotes.
- No manejar deadlocks en la aplicacion.
- Confundir snapshot con ausencia de conflictos.

# TempDB, logs y mantenimiento

TempDB y transaction log son piezas criticas. Muchos problemas de rendimiento en SQL Server vienen de ignorarlos.

## TempDB

TempDB se usa para:

- Tablas temporales.
- Ordenaciones.
- Hash joins.
- Version store.
- Operaciones internas.

## Tablas temporales

```sql
CREATE TABLE #PedidosRecientes (
  Id INT,
  Total DECIMAL(12,2)
);
```

## Version store

Con aislamiento basado en versiones, TempDB puede crecer por transacciones largas.

## Transaction log

El log crece con escrituras. Si no hay backups de log en recovery model full, puede crecer sin control.

Ver recovery model:

```sql
SELECT name, recovery_model_desc
FROM sys.databases;
```

## Backups de log

```sql
BACKUP LOG Tienda TO DISK = 'C:\backups\tienda.trn';
```

## Mantenimiento

Tareas habituales:

- Backups completos.
- Backups diferenciales si aplica.
- Backups de log.
- Actualizacion de estadisticas.
- Reorganizar o reconstruir indices cuando haga falta.
- Revisar integridad con DBCC.

## DBCC CHECKDB

```sql
DBCC CHECKDB ('Tienda');
```

## Buenas practicas

- Monitoriza crecimiento de TempDB.
- Configura backups de log si usas recovery full.
- Prueba restores.
- No hagas shrink como rutina.
- Planifica mantenimiento fuera de horas criticas.

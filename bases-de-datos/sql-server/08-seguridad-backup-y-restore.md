# Seguridad, backup y restore

SQL Server separa logins de servidor, usuarios de base de datos, roles y permisos. Tambien ofrece backups completos, diferenciales y de log.

## Logins y usuarios

```sql
CREATE LOGIN app_login WITH PASSWORD = 'Cambia_Esto_123!';
USE Tienda;
CREATE USER app_user FOR LOGIN app_login;
```

## Roles

```sql
CREATE ROLE app_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO app_readwrite;
ALTER ROLE app_readwrite ADD MEMBER app_user;
```

Evita usar `db_owner` para aplicaciones.

## Backup completo

```sql
BACKUP DATABASE Tienda
TO DISK = 'D:\Backups\Tienda_full.bak'
WITH INIT, COMPRESSION;
```

## Backup diferencial

```sql
BACKUP DATABASE Tienda
TO DISK = 'D:\Backups\Tienda_diff.bak'
WITH DIFFERENTIAL, COMPRESSION;
```

## Backup de log

```sql
BACKUP LOG Tienda
TO DISK = 'D:\Backups\Tienda_log.trn';
```

## Restore

```sql
RESTORE DATABASE Tienda_Restore
FROM DISK = 'D:\Backups\Tienda_full.bak'
WITH MOVE 'Tienda' TO 'D:\Data\Tienda_Restore.mdf',
     MOVE 'Tienda_log' TO 'D:\Logs\Tienda_Restore.ldf',
     RECOVERY;
```

## Buenas practicas

- Define RPO y RTO.
- Prueba restauraciones.
- Usa minimo privilegio.
- Cifra backups si contienen datos sensibles.
- Guarda copias fuera del servidor.
- Monitoriza jobs de backup.

## Errores comunes

- Tener backups que nadie ha restaurado.
- Dar `sysadmin` a usuarios de aplicacion.
- No hacer backups de log en recovery model full.
- Guardar backups en el mismo disco de datos.
- No proteger cadenas de conexion.

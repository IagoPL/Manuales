# Usuarios, backup y restore

Administrar MySQL implica usuarios, permisos, backups, restauraciones y configuracion segura.

## Usuarios

```sql
CREATE USER 'app_user'@'%' IDENTIFIED BY 'password_segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
```

Evita usar `root` desde aplicaciones.

## Permisos de solo lectura

```sql
CREATE USER 'readonly'@'%' IDENTIFIED BY 'password_segura';
GRANT SELECT ON app_db.* TO 'readonly'@'%';
```

## Backup logico

```bash
mysqldump -u root -p app_db > app_db.sql
```

Con rutinas y triggers:

```bash
mysqldump -u root -p --routines --triggers app_db > app_db.sql
```

## Restore

```bash
mysql -u root -p app_db < app_db.sql
```

## Backups consistentes

Para InnoDB:

```bash
mysqldump -u root -p --single-transaction app_db > app_db.sql
```

## Buenas practicas

- Automatiza backups.
- Prueba restauraciones.
- Guarda copias fuera del servidor.
- Usa usuarios con minimo privilegio.
- Protege credenciales fuera del codigo.
- Documenta RPO y RTO.

## Errores comunes

- Tener backup sin restore probado.
- Usar root en produccion.
- No incluir rutinas/triggers si son necesarias.
- Guardar backups en el mismo disco.
- No cifrar copias con datos sensibles.

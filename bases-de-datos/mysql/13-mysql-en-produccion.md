# MySQL en produccion

MySQL en produccion exige backups probados, seguridad, configuracion de memoria, control de conexiones, migraciones y observabilidad.

## Checklist

- Backups completos y restaurados en pruebas.
- Binlog si necesitas PITR o replicas.
- Usuarios con minimo privilegio.
- TLS si la red no es confiable.
- Slow query log y metricas.
- Pool de conexiones en aplicaciones.
- Migraciones revisadas.

## Usuarios

No uses `root` desde la aplicacion.

```sql
CREATE USER 'app'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO 'app'@'%';
```

## Backups

Opciones:

- `mysqldump` para bases pequenas/medianas.
- Backups fisicos para volumenes grandes.
- Snapshots gestionados en cloud.

Siempre prueba restore.

## Configuracion importante

- `innodb_buffer_pool_size`
- `max_connections`
- `innodb_flush_log_at_trx_commit`
- `sync_binlog`
- `tmp_table_size`
- `slow_query_log`

No copies configuraciones de internet sin medir.

## Migraciones

Buenas practicas:

- Migraciones versionadas.
- Cambios backward compatible.
- Evitar locks largos.
- Plan para rollback.
- Probar con volumen similar.

## Seguridad

- Red privada.
- Usuarios por aplicacion.
- Rotacion de credenciales.
- Cifrado en reposo si aplica.
- Auditoria en entornos sensibles.

## Buenas practicas

- Separa OLTP de cargas analiticas pesadas.
- Monitoriza crecimiento.
- Define RPO/RTO.
- Automatiza backups.
- Documenta procedimientos de restore y failover.
- Revisa consultas antes de escalar hardware.


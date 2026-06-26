# Seguridad, replicacion y operacion

PostgreSQL en produccion necesita permisos, autenticacion, backups, replicacion, monitorizacion y procedimientos de recuperacion.

## Roles por responsabilidad

```sql
CREATE ROLE app_rw;
CREATE ROLE app_ro;
CREATE ROLE app_user LOGIN PASSWORD 'cambia_esto';

GRANT CONNECT ON DATABASE tienda TO app_rw;
GRANT USAGE ON SCHEMA public TO app_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_rw;
GRANT app_rw TO app_user;
```

## Minimo privilegio

Evita que la aplicacion use superusuario. Separa:

- Usuario de aplicacion.
- Usuario de migraciones.
- Usuario de solo lectura.
- Usuario de administracion.

## pg_hba.conf

Controla desde donde y como se autentican clientes:

```conf
host    tienda    app_user    10.0.0.0/24    scram-sha-256
```

## Replicacion fisica

```txt
primary -> WAL -> standby
```

Usos:

- Alta disponibilidad.
- Lecturas en replicas.
- Backups desde replica.
- Recuperacion ante fallo.

## Replicacion logica

Publica cambios por tabla:

```sql
CREATE PUBLICATION app_pub FOR TABLE clientes, pedidos;
```

Suscripcion en otro cluster:

```sql
CREATE SUBSCRIPTION app_sub
CONNECTION 'host=primary dbname=tienda user=repl password=secret'
PUBLICATION app_pub;
```

## Monitorizacion minima

Revisa:

- Conexiones.
- Locks.
- Replication lag.
- Tamano de `pg_wal`.
- Queries lentas.
- Autovacuum.
- Uso de disco.
- Backups.

## Buenas practicas

- Usa SCRAM para passwords.
- Aplica minimo privilegio.
- Prueba failover y restore.
- Monitoriza lag de replicas.
- Activa logs utiles.
- Documenta runbooks.

## Errores comunes

- Usar `postgres` para la aplicacion.
- No proteger `pg_hba.conf`.
- Tener replica pero no backup.
- No probar promocion de replica.
- No monitorizar disco y WAL.

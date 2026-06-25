# Administracion, backup y restore

Administrar PostgreSQL implica controlar usuarios, permisos, copias de seguridad, restauraciones, logs y mantenimiento.

## Usuarios y roles

```sql
CREATE ROLE app_user LOGIN PASSWORD 'cambia_esto';
CREATE ROLE readonly;

GRANT CONNECT ON DATABASE tienda TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
GRANT readonly TO app_user;
```

## Backup logico

`pg_dump` exporta una base:

```bash
pg_dump -Fc -d tienda -f tienda.dump
```

Restaurar:

```bash
pg_restore -d tienda_restore tienda.dump
```

Backup SQL plano:

```bash
pg_dump -d tienda > tienda.sql
```

## Backup de cluster

```bash
pg_dumpall > cluster.sql
```

Incluye roles y objetos globales, pero para bases grandes suele ser mejor combinar estrategias.

## Restore probado

Un backup no probado es una esperanza, no una garantia.

Checklist:

- Restaurar en entorno separado.
- Verificar numero de tablas.
- Ejecutar consultas criticas.
- Comprobar permisos.
- Medir tiempo de recuperacion.

## Mantenimiento

PostgreSQL necesita mantenimiento:

- `VACUUM` limpia versiones antiguas.
- `ANALYZE` actualiza estadisticas.
- `REINDEX` reconstruye indices si hace falta.

Normalmente `autovacuum` se encarga, pero hay que monitorizarlo.

## Buenas practicas

- Automatiza backups.
- Cifra copias si contienen datos sensibles.
- Guarda backups fuera del servidor principal.
- Documenta RPO y RTO.
- Prueba restauraciones periodicamente.
- Usa minimo privilegio para usuarios de aplicacion.

## Errores comunes

- Tener backup pero no restore probado.
- Usar superusuario para la aplicacion.
- No vigilar crecimiento de disco.
- Ignorar logs de autovacuum.
- Guardar backups solo en la misma maquina.

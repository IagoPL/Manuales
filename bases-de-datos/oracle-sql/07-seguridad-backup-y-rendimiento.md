# Seguridad, backup y rendimiento

Oracle tiene un modelo de seguridad amplio con usuarios, roles, privilegios y herramientas de administracion. En entornos reales, backup y rendimiento suelen gestionarse con politicas corporativas.

## Usuarios y roles

```sql
CREATE USER app_user IDENTIFIED BY password_segura;
GRANT CREATE SESSION TO app_user;
```

Rol basico:

```sql
CREATE ROLE app_read;
GRANT SELECT ON clientes TO app_read;
GRANT app_read TO app_user;
```

## Privilegios

Tipos:

- Privilegios de sistema.
- Privilegios sobre objetos.
- Roles.

Aplica minimo privilegio. No des permisos administrativos a usuarios de aplicacion.

## Backup

En Oracle, RMAN es la herramienta habitual para backups fisicos:

```txt
RMAN> BACKUP DATABASE;
```

Tambien existen exports logicos con Data Pump:

```bash
expdp usuario/password schemas=APP directory=BACKUP_DIR dumpfile=app.dmp logfile=app.log
impdp usuario/password schemas=APP directory=BACKUP_DIR dumpfile=app.dmp logfile=restore.log
```

## Rendimiento

Revisa:

- Planes de ejecucion.
- Estadisticas.
- Indices.
- Wait events.
- SQL mas costoso.
- Uso de memoria y tablespaces.

## Buenas practicas

- Usa roles y minimo privilegio.
- Prueba restauraciones.
- Usa bind variables.
- Manten estadisticas actualizadas.
- Monitoriza tablespaces.
- Documenta jobs y objetos PL/SQL criticos.

## Errores comunes

- Trabajar con usuarios demasiado privilegiados.
- Tener backups sin restore probado.
- Ignorar crecimiento de tablespaces.
- No usar bind variables.
- Cambiar objetos sin revisar dependencias.

# Seguridad y operacion diaria

Trabajar con Linux implica operar con cuidado: permisos, actualizaciones, accesos remotos y comandos destructivos importan.

## Principios basicos

- Minimo privilegio.
- Accesos trazables.
- Configuracion versionada cuando sea posible.
- Backups antes de cambios delicados.
- Logs disponibles para diagnostico.

## SSH seguro

```bash
ssh usuario@servidor
```

Buenas practicas:

- Usar claves SSH.
- Deshabilitar login directo de root si administras el servidor.
- Limitar usuarios con acceso.
- Revisar logs de autenticacion.

## Actualizaciones

```bash
sudo apt update
sudo apt upgrade
```

En servidores, revisa impacto antes de actualizar servicios criticos.

## Comandos destructivos

Antes de borrar:

```bash
pwd
ls
```

Evita patrones peligrosos si no estas completamente seguro.

## Backups simples

```bash
tar -czf backup.tar.gz carpeta/
```

Restaurar:

```bash
tar -xzf backup.tar.gz
```

## Checklist diario

- Hay espacio en disco.
- Servicios criticos estan activos.
- Logs no muestran errores repetidos.
- Certificados y backups estan controlados.
- Usuarios y claves siguen siendo validos.

## Errores comunes

- Operar siempre como root.
- No hacer backup antes de tocar configuracion.
- No documentar cambios manuales.
- Ignorar alertas de disco.

## Ejercicio

Crea un checklist de operacion para un servidor web con Nginx, una app y una base de datos.

# Linux

Linux es el sistema operativo dominante en servidores, contenedores, plataformas cloud, automatizacion, backend y entornos de datos. Saber moverse con soltura por Linux te permite desplegar, diagnosticar, securizar y automatizar sistemas reales.

Este manual cubre Linux como herramienta de trabajo. Bash tiene su propio manual en [DevOps](../../devops/bash/01-introduccion-y-terminal.md), y la terminal se documenta aparte en [Terminal](../terminal/01-introduccion-y-navegacion.md).

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Filesystem y rutas](02-filesystem-y-rutas.md)
3. [Usuarios grupos y permisos](03-usuarios-grupos-y-permisos.md)
4. [Procesos y servicios](04-procesos-y-servicios.md)
5. [Red paquetes y logs](05-red-paquetes-y-logs.md)
6. [Seguridad y operacion diaria](06-seguridad-y-operacion-diaria.md)

## Formas de trabajar con Linux

- Instalacion local.
- Maquina virtual.
- WSL en Windows.
- Contenedor Docker.
- Servidor remoto por SSH.

## Conceptos clave

- **Kernel:** nucleo del sistema.
- **Shell:** programa que interpreta comandos.
- **Usuario:** identidad que ejecuta procesos.
- **Grupo:** conjunto de usuarios para permisos compartidos.
- **Proceso:** programa en ejecucion.
- **Servicio:** proceso gestionado por el sistema.
- **Filesystem:** arbol de archivos y directorios.
- **Variable de entorno:** valor disponible para procesos.

## Primeros comandos

```bash
pwd
ls -la
cd /tmp
whoami
uname -a
```

## Buenas practicas iniciales

- No uses `root` para tareas normales.
- Revisa rutas antes de borrar o mover archivos.
- Lee logs antes de reiniciar servicios.
- Documenta comandos criticos de despliegue.
- Usa SSH con claves, no con contrasenas, cuando sea posible.

## Ejercicio

1. Comprueba tu usuario con `whoami`.
2. Mira el directorio actual con `pwd`.
3. Lista archivos ocultos con `ls -la`.
4. Comprueba informacion del sistema con `uname -a`.

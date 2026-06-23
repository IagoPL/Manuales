# Linux

Linux es un sistema operativo muy usado en servidores, desarrollo backend, contenedores, automatización y entornos de datos.

## Conceptos clave

- **Shell:** intérprete de comandos.
- **Usuario:** cuenta que ejecuta procesos.
- **Grupo:** conjunto de usuarios con permisos compartidos.
- **Permisos:** reglas de lectura, escritura y ejecución.
- **Proceso:** programa en ejecución.
- **Servicio:** proceso gestionado por el sistema.
- **Filesystem:** estructura de directorios y archivos.
- **Variable de entorno:** valor disponible para procesos.

## Instalación o configuración

Puedes trabajar con Linux mediante:

- Instalación local.
- Máquina virtual.
- WSL en Windows.
- Contenedor Docker.
- Servidor remoto por SSH.

Conexión por SSH:

```bash
ssh usuario@servidor
```

## Uso básico

### Navegación

```bash
pwd
ls
cd /ruta
```

### Archivos y carpetas

```bash
touch archivo.txt
mkdir carpeta
cp origen destino
mv origen destino
rm archivo.txt
```

### Lectura de archivos

```bash
cat archivo.txt
less archivo.txt
tail -f app.log
```

### Búsqueda

```bash
find . -name "*.log"
grep "ERROR" app.log
```

## Permisos

Ver permisos:

```bash
ls -l
```

Cambiar permisos:

```bash
chmod 755 script.sh
```

Cambiar propietario:

```bash
chown usuario:grupo archivo.txt
```

## Procesos y servicios

Ver procesos:

```bash
ps aux
top
```

Finalizar proceso:

```bash
kill PID
```

Servicios con systemd:

```bash
systemctl status nginx
systemctl restart nginx
```

## Buenas prácticas

- Usa usuarios sin privilegios para tareas habituales.
- Evita ejecutar comandos como root salvo que sea necesario.
- Revisa comandos destructivos antes de lanzarlos.
- Usa variables de entorno para configuración.
- Consulta logs antes de reiniciar servicios.
- Automatiza tareas repetitivas con scripts simples.
- Documenta comandos críticos usados en despliegues.

## Errores comunes

- Borrar archivos con rutas mal escritas.
- Usar `sudo` para todo.
- No revisar permisos después de mover archivos.
- Confundir ruta relativa y absoluta.
- No comprobar logs al diagnosticar servicios.

## Chuleta rápida

```bash
pwd
ls -la
cd ruta
cp origen destino
mv origen destino
rm archivo
grep "texto" archivo
find . -name "*.md"
chmod 755 script.sh
ps aux
tail -f archivo.log
```

## Recursos relacionados

- [Terminal de Linux](../terminal/uso-de-terminal-en-linux.md)
- [Git](../git/01-fundamentos-basicos.md)
- [Docker](../docker/README.md)

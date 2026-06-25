# Filesystem y rutas

Linux organiza todo como un arbol que parte de `/`. Entender rutas y directorios evita errores al desplegar, mover archivos o revisar logs.

## Directorios importantes

- `/`: raiz del sistema.
- `/home`: carpetas de usuarios.
- `/etc`: configuracion del sistema.
- `/var`: datos variables, logs, caches.
- `/tmp`: archivos temporales.
- `/usr`: programas y recursos instalados.
- `/opt`: software externo o aplicaciones.
- `/bin` y `/sbin`: comandos esenciales.

## Rutas absolutas y relativas

Ruta absoluta:

```bash
/var/log/nginx/access.log
```

Ruta relativa:

```bash
logs/app.log
```

Comprobar ubicacion:

```bash
pwd
```

## Navegacion

```bash
cd /var/log
cd ..
cd ~
cd -
```

## Listado

```bash
ls
ls -la
ls -lh
```

## Crear mover copiar borrar

```bash
mkdir -p proyectos/app
touch app.log
cp app.log backup.log
mv backup.log logs/
rm app.log
```

Para directorios:

```bash
cp -r origen destino
rm -r carpeta
```

## Buenas practicas

- Usa `pwd` antes de comandos destructivos.
- Usa `mkdir -p` en scripts.
- Prefiere rutas absolutas en tareas automatizadas.
- Cuidado con espacios en nombres de archivos.

## Errores comunes

- Ejecutar `rm -r` desde la ruta equivocada.
- Confundir `~` con `/`.
- Copiar directorios sin `-r`.
- Usar rutas relativas en cron o servicios.

## Ejercicio

Crea una estructura `labs/linux/logs`, entra en ella, crea dos archivos, copia uno y elimina la copia.

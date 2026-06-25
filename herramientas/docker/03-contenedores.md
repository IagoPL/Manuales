# Contenedores

Un contenedor es un proceso aislado creado desde una imagen. Puedes iniciarlo, detenerlo, inspeccionarlo, entrar dentro y eliminarlo.

## Ejecutar contenedores

```bash
docker run --name web -d -p 8080:80 nginx:alpine
```

Opciones habituales:

- `--name`: nombre del contenedor.
- `-d`: modo detached.
- `-p host:contenedor`: publica puertos.
- `--rm`: elimina el contenedor al terminar.
- `-e`: variable de entorno.

## Listar

```bash
docker ps
docker ps -a
```

## Detener iniciar y eliminar

```bash
docker stop web
docker start web
docker rm web
```

Eliminar forzando:

```bash
docker rm -f web
```

## Entrar en un contenedor

```bash
docker exec -it web sh
```

En imagenes Debian o Ubuntu puede existir Bash:

```bash
docker exec -it web bash
```

## Inspeccionar

```bash
docker inspect web
docker stats
docker top web
```

## Variables de entorno

```bash
docker run --rm -e APP_ENV=dev alpine env
```

## Buenas practicas

- Usa nombres claros para contenedores de desarrollo.
- Usa `--rm` en pruebas rapidas.
- Revisa `docker ps -a` para limpiar contenedores parados.
- No edites manualmente dentro del contenedor como solucion permanente.

## Errores comunes

- Perder cambios hechos dentro de un contenedor eliminado.
- Confundir puerto interno y puerto del host.
- Entrar en el contenedor y olvidar modificar el Dockerfile.

## Ejercicio

Ejecuta un contenedor Alpine, imprime variables de entorno, entra en el shell y comprueba procesos activos.

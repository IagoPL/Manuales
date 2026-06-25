# Docker

Docker permite empaquetar aplicaciones con sus dependencias en imagenes reproducibles y ejecutarlas como contenedores. Es una herramienta base para desarrollo local, pruebas, despliegues, laboratorios de bases de datos y entornos consistentes.

Este manual cubre Docker como herramienta individual. Docker Compose tiene su propio manual en [Cloud](../../cloud/docker-compose/01-introduccion-y-casos-de-uso.md) para evitar duplicar contenido.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Imagenes y Dockerfile](02-imagenes-y-dockerfile.md)
3. [Contenedores](03-contenedores.md)
4. [Volumenes y redes](04-volumenes-y-redes.md)
5. [Logs debug y diagnostico](05-logs-debug-y-diagnostico.md)
6. [Buenas practicas](06-buenas-practicas.md)

## Conceptos clave

- **Imagen:** plantilla inmutable con sistema base, runtime, dependencias y aplicacion.
- **Contenedor:** instancia en ejecucion de una imagen.
- **Dockerfile:** receta para construir una imagen.
- **Volumen:** almacenamiento persistente fuera del ciclo de vida del contenedor.
- **Red:** comunicacion entre contenedores o entre contenedor y host.
- **Registry:** repositorio de imagenes, como Docker Hub o GitHub Container Registry.

## Instalacion y comprobacion

```bash
docker --version
docker run hello-world
```

Ver informacion general:

```bash
docker info
```

## Primer contenedor

```bash
docker run --name nginx-demo -p 8080:80 -d nginx:alpine
```

Comprobar:

```bash
docker ps
docker logs nginx-demo
```

Detener y eliminar:

```bash
docker stop nginx-demo
docker rm nginx-demo
```

## Buenas practicas iniciales

- Fija versiones de imagenes: `postgres:16`, no solo `postgres`.
- No metas secretos dentro de imagenes.
- Usa `.dockerignore`.
- Elimina contenedores de prueba cuando termines.
- Usa volumenes para datos persistentes.

## Errores comunes

- Confundir imagen y contenedor.
- Pensar que borrar un contenedor borra siempre los volumenes.
- Publicar puertos al reves.
- Construir imagenes con archivos innecesarios.

## Ejercicio

1. Ejecuta `nginx:alpine` en el puerto `8080`.
2. Mira sus logs.
3. Entra en el contenedor con `docker exec`.
4. Detenlo y eliminalo.
5. Lista imagenes locales.

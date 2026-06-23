# Docker

Docker permite empaquetar aplicaciones y sus dependencias en contenedores reproducibles. Es útil para desarrollo local, despliegues, pruebas y entornos consistentes.

## Conceptos clave

- **Imagen:** plantilla inmutable con aplicación y dependencias.
- **Contenedor:** instancia en ejecución de una imagen.
- **Dockerfile:** archivo con instrucciones para construir una imagen.
- **Volumen:** almacenamiento persistente fuera del ciclo de vida del contenedor.
- **Red:** comunicación entre contenedores.
- **Docker Compose:** herramienta para levantar varios servicios con un archivo YAML.

## Instalación o configuración

Comprueba la instalación:

```bash
docker --version
docker compose version
```

Verifica que Docker responde:

```bash
docker run hello-world
```

## Uso básico

### Ejecutar un contenedor

```bash
docker run --name nginx-demo -p 8080:80 -d nginx
```

### Ver contenedores

```bash
docker ps
docker ps -a
```

### Ver logs

```bash
docker logs nginx-demo
```

### Detener y eliminar

```bash
docker stop nginx-demo
docker rm nginx-demo
```

## Dockerfile básico

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

Construir imagen:

```bash
docker build -t mi-app .
```

Ejecutar imagen:

```bash
docker run -p 3000:3000 mi-app
```

## Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: app_db
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Levantar servicios:

```bash
docker compose up -d
```

## Buenas prácticas

- Usa imágenes base pequeñas cuando sea posible.
- Copia primero archivos de dependencias para aprovechar caché.
- No incluyas secretos dentro de imágenes.
- Usa `.dockerignore`.
- Define healthchecks en servicios importantes.
- Persiste datos con volúmenes.
- Separa configuración por variables de entorno.

## Errores comunes

- Ejecutar bases de datos sin volumen.
- Construir imágenes con archivos innecesarios.
- Guardar credenciales en el Dockerfile.
- No fijar versiones de imágenes base.
- Confundir puertos internos y externos.

## Chuleta rápida

```bash
docker build -t nombre .
docker run -p 8080:80 imagen
docker ps
docker logs contenedor
docker exec -it contenedor sh
docker stop contenedor
docker rm contenedor
docker images
docker compose up -d
docker compose down
```

## Recursos relacionados

- [Terminal de Linux](../terminal/uso-de-terminal-en-linux.md)
- [Linux](../linux/README.md)
- [Arquitectura full stack](../../full-stack/arquitectura/README.md)

# Imagenes y Dockerfile

Una imagen Docker se construye a partir de capas. Cada instruccion relevante del Dockerfile crea una capa reutilizable, por eso el orden de instrucciones afecta al cache y al rendimiento de builds.

## Dockerfile basico para Node.js

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Construir:

```bash
docker build -t mi-app:dev .
```

Ejecutar:

```bash
docker run --rm -p 3000:3000 mi-app:dev
```

## Instrucciones principales

- `FROM`: imagen base.
- `WORKDIR`: directorio de trabajo.
- `COPY`: copia archivos desde el host.
- `RUN`: ejecuta comandos durante la construccion.
- `ENV`: define variables de entorno.
- `EXPOSE`: documenta puertos usados.
- `CMD`: comando por defecto al iniciar contenedor.
- `ENTRYPOINT`: ejecutable principal del contenedor.

## .dockerignore

Evita copiar archivos innecesarios:

```txt
node_modules
.git
.env
dist
coverage
```

## Cache de capas

Este orden aprovecha cache:

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

Si copias todo antes de instalar, cualquier cambio en codigo invalida tambien la instalacion de dependencias.

## Imagenes multi-stage

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## Buenas practicas

- Usa imagenes base pequenas.
- Fija versiones.
- Separa build y runtime cuando aporte.
- No copies `.env`.
- Ejecuta como usuario no root si la imagen lo permite.

## Errores comunes

- Usar `latest` en produccion.
- No tener `.dockerignore`.
- Instalar dependencias cada vez por mal orden de capas.
- Meter credenciales durante el build.

## Ejercicio

Crea una imagen para una app Node sencilla que sirva un `index.js`. Usa `.dockerignore`, etiqueta la imagen y ejecutala publicando un puerto.

## Recursos relacionados

- [Capas y overlay filesystem](08-capas-y-overlay-filesystem.md)
- [Seguridad](11-seguridad.md)
- [CI/CD con Docker](14-ci-cd-con-docker.md)

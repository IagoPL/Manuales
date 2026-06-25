# Nginx y despliegue de aplicaciones

Docker se usa a menudo para empaquetar aplicaciones web. Nginx puede servir frontend estatico, actuar como reverse proxy o terminar trafico HTTP antes de una API.

## Frontend estatico

Dockerfile multi-stage:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Nginx basico:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

## API detras de Nginx

```nginx
server {
  listen 80;

  location /api/ {
    proxy_pass http://api:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
```

## Logs

En contenedores, los logs deben ir a stdout/stderr para que Docker los recoja:

```bash
docker logs nombre-contenedor
```

## Buenas practicas

- Usa multi-stage para frontend.
- No metas certificados privados en imagenes.
- Configura cache HTTP con cuidado.
- Expone solo el puerto necesario.
- Usa healthchecks.

## Errores comunes

- Servir una SPA sin `try_files`.
- Copiar `node_modules` a imagen final de Nginx.
- Guardar certificados dentro del repo.
- No revisar logs de Nginx.
- Confundir red interna de Docker con puertos publicados.

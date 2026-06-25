# Buenas practicas

Docker se vuelve peligroso o caro de mantener cuando las imagenes crecen sin control, los secretos se copian al build o no hay criterio de persistencia.

## Imagenes

- Usa imagenes base pequenas y mantenidas.
- Fija versiones cuando necesites reproducibilidad.
- Ordena el Dockerfile para aprovechar cache.
- Usa `.dockerignore`.
- Usa multi-stage builds.
- No instales herramientas innecesarias en produccion.

## Dockerfile saludable

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
CMD ["node", "server.js"]
```

## Seguridad

- No ejecutes como root si no hace falta.
- No copies secretos a la imagen.
- Escanea vulnerabilidades.
- Reduce paquetes instalados.
- Usa permisos minimos.
- Manten imagenes base actualizadas.

## Desarrollo local

- Usa Docker para dependencias externas: bases, colas, caches.
- Evita convertir Docker en una caja negra.
- Documenta comandos frecuentes.
- Separa configuracion local de produccion.
- No dependas de cambios manuales dentro de contenedores.

## Produccion

- Define healthchecks.
- Centraliza logs.
- Usa variables de entorno para configuracion.
- Usa volumenes solo donde haya datos persistentes.
- No montes codigo fuente como bind mount en produccion.
- Publica solo puertos necesarios.

## Checklist

- Hay `.dockerignore`.
- El Dockerfile aprovecha cache.
- La imagen final no incluye dependencias de build innecesarias.
- No hay secretos en la imagen.
- El contenedor no necesita root.
- Hay healthcheck si es servicio persistente.
- Logs van a stdout/stderr.
- Volumenes y redes tienen una razon clara.

## Errores comunes

- Usar `latest` en produccion.
- Copiar todo el repo antes de instalar dependencias.
- Meter `.env` o claves en la imagen.
- Arreglar contenedores a mano en vez de cambiar el Dockerfile.
- No limpiar imagenes antiguas en CI.

## Recursos relacionados

- [Seguridad](11-seguridad.md)
- [CI/CD con Docker](14-ci-cd-con-docker.md)
- [Proyecto final](16-proyecto-final.md)
- [Docker Compose](../../cloud/docker-compose/01-introduccion-y-casos-de-uso.md)

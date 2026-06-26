# Despliegue

Una aplicacion NestJS se compila a JavaScript y se ejecuta sobre Node.js.

## Build

```bash
npm run build
```

## Ejecutar

```bash
node dist/main.js
```

## Dockerfile

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/main.js"]
```

## Configuracion

Usa `@nestjs/config` y variables de entorno.

## Health check

Expón `/health` para despliegues y orquestadores.

## Buenas practicas

- No usar `npm run start:dev` en produccion.
- Logs a stdout.
- Imagenes con tag inmutable.
- Secrets fuera del repo.
- Migraciones controladas.

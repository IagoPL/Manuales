# Despliegue de Vue

Una app Vue con Vite se compila a estaticos (HTML/JS/CSS). El despliegue es servir esa carpeta `dist/` tras `vite build`, con routing correcto si usas Vue Router en modo history.

## Build

```bash
npm run build
# genera dist/
npm run preview   # sirve dist localmente
```

Variables de entorno: solo las prefijadas con `VITE_` se exponen al cliente.

```bash
# .env.production
VITE_API_URL=https://api.ejemplo.com
```

```typescript
const api = import.meta.env.VITE_API_URL
```

## SPA y el server

Con `createWebHistory`, el servidor debe reescribir rutas a `index.html`:

Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Si no, un refresh en `/users/1` devuelve 404.

## Opciones de hosting

| Destino | Notas |
|---------|-------|
| Netlify / Cloudflare Pages / Vercel | Simple para SPA |
| S3 + CloudFront | Estaticos a escala |
| Nginx / Caddy en VPS | Control total |
| Contenedor Nginx | Mismo artefacto en k8s |

Dockerfile minimo:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## Checklist pre-prod

1. `vite build` sin warnings criticos.
2. API URL de produccion correcta.
3. HTTPS y cabeceras basicas.
4. Sourcemaps solo si los necesitas (y privados).
5. Cache de assets hasheados (`max-age` largo).

## Errores habituales

- Llamar APIs relativas sin proxy/CORS en prod.
- Olvidar `try_files` para history mode.
- Meter secretos en `VITE_*` (todo es publico en el bundle).

## Buenas practicas

- Un artefacto `dist` por commit/SHA.
- Healthcheck del hosting + monitorizacion de errores front (Sentry, etc.).
- Prefiere `createWebHistory` + server config; `hash` mode solo si no controlas el server.

## Ejercicio

1. Build de tu app y sirvela con `vite preview`.
2. Configura Nginx (o Netlify redirects) para history mode.
3. Parametriza `VITE_API_URL` entre staging y prod.

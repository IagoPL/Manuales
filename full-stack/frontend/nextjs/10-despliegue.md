# Despliegue

Next.js puede desplegarse como aplicacion Node, en plataformas serverless o con export estatico limitado. La estrategia depende de las features usadas.

## Build

```bash
npm run build
```

## Ejecutar

```bash
npm run start
```

## Variables de entorno

Variables publicas:

```txt
NEXT_PUBLIC_ANALYTICS_ID=...
```

Las variables sin `NEXT_PUBLIC_` solo deben usarse en servidor.

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

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Health check

Crea un route handler:

```tsx
export function GET() {
  return Response.json({ status: "ok" })
}
```

## Buenas practicas

- Ejecuta `next build` en CI.
- Separa variables publicas y privadas.
- No uses export estatico si necesitas servidor.
- Revisa cache y rutas dinamicas antes de desplegar.
- Configura logs y errores.

# Despliegue

Una API Express se despliega como proceso Node.js detrás de proxy, contenedor u orquestador.

## Producción

```bash
NODE_ENV=production node src/server.js
```

## Dockerfile

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## Health check

```js
app.get('/health', (req, res) => res.json({ status: 'ok' }))
```

## Proxy

Usa Nginx, Traefik o gateway para TLS, compresión y routing.

## Buenas practicas

- Logs a stdout.
- Graceful shutdown.
- Variables de entorno.
- Health checks.
- No ejecutar con nodemon en producción.
- Migraciones controladas.

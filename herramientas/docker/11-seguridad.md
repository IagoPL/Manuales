# Seguridad

Docker reduce friccion, pero no elimina riesgos. Una imagen insegura o un contenedor demasiado privilegiado puede comprometer el host o exponer secretos.

## Principios

- Menor privilegio.
- Imagenes pequenas.
- Dependencias actualizadas.
- Secretos fuera de la imagen.
- Puertos minimos.
- Logs sin credenciales.

## Usuario no root

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "server.js"]
```

## Capabilities

Linux capabilities dividen privilegios de root. Puedes reducirlas:

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
```

## Read-only filesystem

```bash
docker run --read-only nginx
```

Si la app necesita escribir, monta rutas concretas.

## Secretos

No hagas:

```dockerfile
ENV API_KEY=secreto
COPY .env .env
```

Mejor:

- Variables inyectadas en runtime.
- Secret managers.
- Secrets del orquestador.
- Archivos montados temporalmente.

## Socket de Docker

Montar el socket da control casi total del host:

```bash
-v /var/run/docker.sock:/var/run/docker.sock
```

Evitalo salvo que entiendas muy bien el riesgo.

## Escaneo

```bash
docker scout quickview
docker scout cves imagen:tag
```

Tambien puedes usar herramientas de CI como Trivy, Grype o escaneres del registry.

## Buenas practicas

- No ejecutes como root.
- Fija versiones de imagen base.
- Escanea imagenes.
- No copies secretos.
- Limita capabilities.
- Publica solo puertos necesarios.

## Errores comunes

- Usar imagenes abandonadas.
- Ejecutar con `--privileged`.
- Montar el socket Docker.
- Guardar tokens en capas.
- Exponer servicios internos a Internet.

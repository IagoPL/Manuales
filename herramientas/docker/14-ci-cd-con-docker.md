# CI/CD con Docker

Docker encaja muy bien en CI/CD porque permite construir, probar y publicar artefactos reproducibles.

## Flujo recomendado

```mermaid
flowchart LR
  A["Commit"] --> B["Tests"]
  B --> C["Build image"]
  C --> D["Scan"]
  D --> E["Push registry"]
  E --> F["Deploy"]
```

## Build en CI

```bash
docker build -t ghcr.io/iagopl/app:${GITHUB_SHA} .
```

## GitHub Actions basico

```yaml
name: docker

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/iagopl/app:${{ github.sha }}
```

## Cache de builds

BuildKit puede acelerar builds:

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

## Tests con Docker

```bash
docker build -t app:test .
docker run --rm app:test npm test
```

## Buenas practicas

- Publica imagenes desde CI.
- Etiqueta con commit SHA.
- Escanea vulnerabilidades.
- No uses secretos en build args.
- Separa tags de branch y release.
- Guarda provenance si el entorno lo exige.

## Errores comunes

- Construir en local y subir manualmente.
- Usar `latest` como unico tag.
- No cachear dependencias.
- Exponer secretos en logs.
- Saltarse tests antes del push.

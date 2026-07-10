# Pipelines de build, test y deploy

Un pipeline CI/CD bien diseñado valida el codigo en capas, produce un artefacto inmutable y lo promociona entre entornos con gates claros. Este capitulo estructura jobs, dependencias y despliegues usando patrones aplicables a cualquier plataforma.

## Anatomia tipica

```txt
         +--------+
  PR --> |  lint  |
         +---+----+
             |
         +---v----+
         |  test  | (unit)
         +---+----+
             |
         +---v------------+
         |  build         | -> artefacto (imagen, jar, dist)
         +---+------------+
             |
         +---v------------+
         |  deploy staging|
         +---+------------+
             |
         +---v------------+
         |  smoke / e2e   |
         +---+------------+
             |
         +---v------------+
         |  deploy prod   | (manual o automatico)
         +----------------+
```

## Ejemplo: API Node.js con GitHub Actions

```yaml
name: CI API

on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build

  docker:
    needs: validate
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build image
        run: docker build -t myapi:${{ github.sha }} .

      - name: Push image
        run: |
          echo "${{ secrets.REGISTRY_TOKEN }}" | docker login -u user --password-stdin registry.example.com
          docker tag myapi:${{ github.sha }} registry.example.com/myapi:${{ github.sha }}
          docker push registry.example.com/myapi:${{ github.sha }}
```

## Jobs y dependencias

- **`needs`:** un job espera a otro (`docker` tras `validate`).
- **`if`:** condiciones (`solo en main`, `solo si no es draft`).
- **Paralelismo:** jobs independientes (lint frontend + lint backend) reducen tiempo total.

```yaml
jobs:
  lint-backend:
    runs-on: ubuntu-latest
    steps: [...]

  lint-frontend:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: [lint-backend, lint-frontend]
    runs-on: ubuntu-latest
    steps: [...]
```

## Capas de testing en el pipeline

| Capa | Donde | Duracion |
|------|-------|----------|
| Lint / format | PR | segundos |
| Unit tests | PR | 1–3 min |
| Integration (DB, APIs mock) | PR o main | 5–15 min |
| Build artefacto | main | 2–10 min |
| E2E / smoke | staging | 10–30 min |

No metas E2E lentos en cada commit si bloquean el equipo; ejecutalos en staging tras deploy.

## Matrices

Prueba varias versiones en paralelo:

```yaml
strategy:
  matrix:
    node: [20, 22, 24]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node }}
```

Util para librerias; en apps suele bastar la version de produccion.

## Cache

```yaml
- uses: actions/setup-node@v4
  with:
    cache: npm
```

Invalida cache cuando cambien `package-lock.json`, `Dockerfile` o dependencias del sistema.

## Deploy a entornos

### Staging automatico

Cada merge a `main` despliega staging con el SHA del commit:

```txt
imagen: myapi:abc123f
```

### Produccion con aprobacion

```yaml
deploy-prod:
  needs: deploy-staging
  environment: production
  runs-on: ubuntu-latest
  steps:
    - run: ./deploy.sh production ${{ github.sha }}
```

GitHub `environment` puede exigir revisores antes de ejecutar.

## Artefactos entre jobs

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/

# job posterior
- uses: actions/download-artifact@v4
  with:
    name: dist
```

Alternativa: subir imagen Docker o paquete a registry y referenciar por tag.

## Smoke test post-deploy

```bash
#!/usr/bin/env bash
set -euo pipefail
URL="https://staging.example.com/health"
for i in {1..30}; do
  if curl -fsS "$URL" | grep -q '"status":"ok"'; then
    echo "Smoke OK"
    exit 0
  fi
  sleep 5
done
echo "Smoke failed"
exit 1
```

## Buenas practicas

- Un pipeline por servicio o monorepo con filtros por path (`paths: ['api/**']`).
- Nombra jobs por intencion (`test-unit`, no `job2`).
- Usa el mismo Dockerfile que produccion para build en CI.
- Etiqueta despliegues con `git sha`, no solo `latest`.
- Falla el pipeline si baja cobertura bajo umbral (si lo usais).

## Errores habituales

- `npm install` en vez de `npm ci` (builds no reproducibles).
- Secrets en logs (`echo ${{ secrets.X }}`).
- Deploy a prod desde rama feature.
- Tests que dependen de orden de ejecucion.
- Sin smoke test tras deploy.

## Siguiente paso

El [capitulo 3](03-versionado-y-artefactos.md) profundiza en versionado semantico, tags y gestion de artefactos.

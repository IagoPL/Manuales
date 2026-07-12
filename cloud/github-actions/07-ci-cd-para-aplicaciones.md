
::: v-pre
﻿# CI/CD para aplicaciones

Este capitulo une conceptos previos en pipelines reales: API backend, frontend estatico, imagen Docker y despliegue. Complementa el manual de [CI/CD](../../devops/cicd/01-introduccion-y-principios.md).

## Pipeline API (Node / FastAPI pattern)

```yaml
name: API CI/CD

on:
  pull_request:
    paths: ['api/**']
  push:
    branches: [main]
    paths: ['api/**']

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: api
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: api/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:test@localhost:5432/postgres

  build-image:
    needs: test
    if: github.ref == 'refs/heads/main'
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
          context: ./api
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/api:${{ github.sha }}
            ghcr.io/${{ github.repository }}/api:latest
```

## Pipeline frontend (Vite / React)

Similar al deploy de documentacion de este repo:

```yaml
name: Web CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test --if-present
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy-pages:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Despliegue a servidor (SSH)

```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest
  environment: production
  steps:
    - uses: actions/download-artifact@v4
      with:
        name: dist
        path: dist
    - name: Upload via SCP
      uses: appleboy/scp-action@v0.1.7
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        source: dist/*
        target: /var/www/app
```

Preferir imagen inmutable o GitOps (Argo CD) frente a SCP en equipos grandes.

## Kubernetes con kubectl / helm

```yaml
- uses: azure/setup-kubectl@v4
- run: |
    echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
    export KUBECONFIG=kubeconfig
    kubectl set image deployment/api api=ghcr.io/org/api:${{ github.sha }}
    kubectl rollout status deployment/api
```

O `helm upgrade --install` con chart versionado.

## Gates antes de produccion

```yaml
deploy-prod:
  needs: [test, build-image, deploy-staging]
  environment:
    name: production
  # reviewers configurados en Settings -> Environments
```

Smoke test en job intermedio:

```yaml
- run: curl -fsS https://staging.example.com/health
```

## Monorepo con workflows separados

```txt
.github/workflows/
  api.yml      paths: api/**
  web.yml      paths: web/**
  docs.yml     paths: **.md, .vitepress/**
```

Evita un workflow gigante que corre siempre.

## Referencia: workflows de Manuales

| Workflow | Funcion |
|----------|---------|
| [validate.yml](../../../.github/workflows/validate.yml) | Build + enlaces en PR/push |
| [deploy.yml](../../../.github/workflows/deploy.yml) | Publica VitePress en gh-pages |

## Buenas practicas

- Artefacto versionado por `github.sha`.
- Staging automatico, prod con aprobacion.
- Services de BD en CI para tests de integracion.
- Paths filters en monorepos.
- Reutiliza workflows con `workflow_call`.

## Errores habituales

- Desplegar sin tests de integracion con dependencias reales.
- Tag `latest` sin tag SHA en registry.
- Secrets de prod en workflows que corren en PR.
- Un solo job que hace test + build + deploy sin `needs`.
- No verificar health post-deploy.

## Siguiente paso

El [capitulo 8](08-buenas-practicas.md) resume recomendaciones para operar GitHub Actions a largo plazo.

:::

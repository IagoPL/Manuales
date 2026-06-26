# CI/CD para Next.js

Una pipeline de Next.js debe comprobar formato, tipos, tests, build y despliegue.

## Pipeline

```mermaid
flowchart LR
  A["Install"] --> B["Lint"]
  B --> C["Typecheck"]
  C --> D["Tests"]
  D --> E["Build"]
  E --> F["Deploy"]
```

## GitHub Actions

```yaml
name: nextjs-ci

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
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

## Buenas practicas

- Build en cada PR.
- Variables por entorno.
- Smoke test tras despliegue.
- Cache de dependencias.
- No imprimir secretos en logs.
- Versionar imagenes con SHA.


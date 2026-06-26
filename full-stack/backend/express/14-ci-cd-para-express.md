# CI/CD para Express

Una pipeline de Express debe instalar dependencias, ejecutar lint, tests, build si aplica y construir imagen.

## GitHub Actions

```yaml
name: express-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
```

## Checks

- Lint.
- Tests.
- Audit controlado.
- Docker build.
- Smoke test.

## Buenas practicas

- CI en PR.
- Imagen con SHA.
- Secrets fuera de logs.
- Migraciones controladas.
- Rollback definido.

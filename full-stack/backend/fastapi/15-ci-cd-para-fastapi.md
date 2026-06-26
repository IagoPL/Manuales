# CI/CD para FastAPI

Una pipeline de FastAPI debe ejecutar lint, typecheck, tests, build de imagen y despliegue.

## Pipeline

```mermaid
flowchart LR
  A["Install"] --> B["Lint"]
  B --> C["Typecheck"]
  C --> D["Tests"]
  D --> E["Docker build"]
  E --> F["Deploy"]
```

## GitHub Actions

```yaml
name: fastapi-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
```

## Checks

- Ruff/flake8.
- Mypy o pyright si aplica.
- Pytest.
- Alembic migrations check.
- Docker build.

## Buenas practicas

- Tests en cada PR.
- Imagen etiquetada con SHA.
- Secrets en entorno seguro.
- Migraciones controladas.
- Smoke test tras desplegar.

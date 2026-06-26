# CI/CD para Django

Una pipeline de Django debe ejecutar lint, tests, migraciones, build de imagen y despliegue.

## GitHub Actions

```yaml
name: django-ci

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
      - run: python manage.py test
```

## Checks

- Lint.
- Tests.
- Check de migraciones.
- Build Docker.
- Smoke test.

## Buenas practicas

- CI en cada PR.
- Secretos fuera del repo.
- Migraciones controladas.
- Imagen versionada.
- Rollback documentado.

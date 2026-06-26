# CI/CD para ASP.NET Core

Una pipeline debe restaurar dependencias, compilar, ejecutar tests, publicar artefacto y construir imagen.

## GitHub Actions

```yaml
name: aspnet-core-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "8.0.x"
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build
      - run: dotnet publish -c Release -o publish
```

## Checks

- Build.
- Tests.
- Análisis estático si aplica.
- Docker build.
- Scan de dependencias.

## Buenas practicas

- CI en cada PR.
- Versionar imagen con SHA.
- Secretos en entorno seguro.
- Migraciones controladas.
- Smoke test tras despliegue.

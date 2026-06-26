# CI/CD y operacion

Una aplicacion Spring Boot profesional debe poder construirse, probarse, analizarse y desplegarse de forma repetible.

## Pipeline base

```mermaid
flowchart LR
  A["Checkout"] --> B["Test"]
  B --> C["Build"]
  C --> D["Docker image"]
  D --> E["Security scan"]
  E --> F["Deploy"]
```

## GitHub Actions

```yaml
name: spring-boot-ci

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
      - run: ./mvnw test
      - run: ./mvnw package -DskipTests
```

## Calidad

Incluye:

- Tests.
- Coverage razonable.
- Static analysis.
- Dependency check.
- Build de imagen.
- Smoke test.

## Migraciones en despliegue

Opciones:

- Flyway al arrancar.
- Job previo al despliegue.
- Pipeline manual para migraciones sensibles.

Evita migraciones destructivas sin rollback.

## Configuracion por entorno

```txt
dev -> test -> staging -> prod
```

El artefacto debe ser el mismo; cambia la configuracion.

## Operacion

Runbooks minimos:

- API devuelve 5xx.
- Base de datos no conecta.
- Latencia alta.
- Migracion fallida.
- Rollback de version.

## Buenas practicas

- Pipeline en cada PR.
- Build reproducible.
- Imagen versionada con commit SHA.
- Secrets en gestor seguro.
- Health checks antes de recibir trafico.
- Rollback probado.
- Logs y metricas disponibles desde el primer despliegue.


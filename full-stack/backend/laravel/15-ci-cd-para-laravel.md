# CI/CD para Laravel

Una pipeline Laravel debe instalar dependencias, ejecutar tests, validar estilo y preparar despliegue.

## GitHub Actions

```yaml
name: laravel-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
      - run: composer install --no-interaction --prefer-dist
      - run: php artisan test
```

## Checks

- Tests.
- Pint/PHPStan si aplica.
- Migraciones.
- Build assets.
- Docker build.

## Buenas practicas

- CI en cada PR.
- Secrets seguros.
- Migraciones con `--force`.
- Rollback definido.
- Workers reiniciados tras deploy.

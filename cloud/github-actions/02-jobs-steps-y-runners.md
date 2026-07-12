# Jobs, steps y runners

Un **workflow** de GitHub Actions se divide en **jobs**; cada job corre en un **runner** y ejecuta **steps** en secuencia (o en paralelo entre jobs).

## Jerarquia

```txt
Workflow (.yml)
  └── Job (validate, deploy, ...)
        └── Step (checkout, npm ci, ...)
              └── Action (uses) o comando (run)
```

Ejemplo real de este repositorio:

```yaml
name: Validate documentation

on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build with link validation
        run: npm run docs:build
        env:
          CI_VALIDATE_LINKS: true
```

## Jobs

- Un job es una unidad que comparte el mismo runner (maquina virtual).
- Jobs en paralelo por defecto; `needs` define orden.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps: [...]
```

### Condiciones en jobs

```yaml
deploy:
  needs: test
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  runs-on: ubuntu-latest
```

## Steps

Dos tipos:

### 1. `uses` — accion reutilizable

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: 24
```

Fija version mayor (`@v4`) para estabilidad; evita `@main`.

### 2. `run` — shell script

```yaml
- name: Run tests
  run: npm test

- name: Multi-line
  run: |
    npm run build
    npm run lint
```

Shell por defecto:

- `ubuntu` / `macos` → bash
- `windows` → pwsh

```yaml
- run: echo hello
  shell: bash
```

## Runners

| Tipo | Descripcion |
|------|-------------|
| **GitHub-hosted** | `ubuntu-latest`, `windows-latest`, `macos-latest` |
| **Self-hosted** | Maquina propia en tu red o cloud |

```yaml
runs-on: ubuntu-latest
```

Self-hosted:

```yaml
runs-on: [self-hosted, linux, gpu]
```

Util para GPUs, acceso a red interna o builds pesados.

## Variables de contexto

Disponibles en expresiones `${{ }}`:

| Contexto | Ejemplos |
|----------|----------|
| `github` | `github.sha`, `github.ref`, `github.repository` |
| `env` | Variables de entorno del job |
| `secrets` | `secrets.API_TOKEN` |
| `runner` | `runner.os` |
| `job` | `job.status` |

```yaml
- run: echo "Commit ${{ github.sha }} en ${{ github.ref }}"
```

## Variables de entorno

```yaml
env:
  NODE_ENV: test

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      APP_URL: http://localhost:3000
    steps:
      - run: npm test
```

## Timeouts y reintentos

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: nick-fields/retry@v3
        with:
          timeout_minutes: 10
          max_attempts: 3
          command: npm test
```

## Working directory

```yaml
- run: npm ci
  working-directory: ./frontend
```

## Artefactos entre jobs

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/

# otro job

::: v-pre
- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: dist/
```

## Buenas practicas

- Nombra steps con `name:` descriptivo.
- Un proposito claro por job (test vs deploy).
- `timeout-minutes` en jobs largos.
- Pin de version en actions (`@v4`, no flotante).
- No repetir checkout/setup; extrae a workflow reutilizable.

## Errores habituales

- Jobs que podrian ir en paralelo encadenados sin necesidad.
- Secrets impresos en logs.
- `runs-on` incorrecto (script bash en windows sin adaptar).
- Olvidar `needs` y desplegar antes de test.
- Actions sin version fija que rompen de repente.

## Siguiente paso

El [capitulo 3](03-eventos-y-triggers.md) detalla que eventos disparan workflows: push, PR, schedule, manual y mas.

:::

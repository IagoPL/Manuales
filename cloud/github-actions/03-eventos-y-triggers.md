# Eventos y triggers

El bloque `on` define **cuando** se ejecuta un workflow. Elegir el trigger correcto evita builds innecesarios y protege ramas sensibles.

## Sintaxis basica

```yaml
on: push
```

Equivalente a cualquier push en cualquier rama.

## Push a ramas concretas

```yaml
on:
  push:
    branches:
      - main
      - release/*
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - '**.md'
```

- `branches` / `branches-ignore`
- `paths` / `paths-ignore` — solo si cambian esos archivos

Util en monorepos:

```yaml
on:
  push:
    paths:
      - 'api/**'
      - '.github/workflows/api.yml'
```

## Pull request

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened, ready_for_review]
```

- `synchronize` — nuevo commit en el PR.
- `ready_for_review` — sale de draft.

Workflow de validacion de este repo:

```yaml
on:
  pull_request:
  push:
    branches: [main]
```

## workflow_dispatch (manual)

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Entorno de despliegue
        required: true
        default: staging
        type: choice
        options:
          - staging
          - production
```

Ejecutar desde Actions -> Run workflow. Usar inputs en steps:

```yaml
- run: ./deploy.sh ${{ inputs.environment }}
```

## schedule (cron)

```yaml
on:
  schedule:
    - cron: '0 6 * * 1'  # lunes 06:00 UTC
```

Casos: backups, limpieza, eval nocturna, dependabot report.

Atencion: puede haber retraso en runners ocupados; no uses cron para tareas criticas al segundo.

## release y tags

```yaml
on:
  push:
    tags:
      - 'v*'

on:
  release:
    types: [published]
```

Patron para publicar artefactos versionados.

## workflow_call (reutilizable)

Workflow invocado desde otro:

```yaml
# .github/workflows/reusable-test.yml

::: v-pre
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm test
```

```yaml
# caller
jobs:
  call-test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '22'
```

## repository_dispatch y otros

- `repository_dispatch` — webhook API externo.
- `issue_comment` — bots en PRs (`/retest`).
- `pull_request_target` — cuidado con seguridad (ejecuta en contexto base).

## Concurrencia

Evita deploys solapados:

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true
```

Este repo en deploy:

```yaml
concurrency:
  group: gh-pages
  cancel-in-progress: false
```

## Buenas practicas

- PR: validacion rapida; `main`: build completo + deploy.
- `paths` para no correr CI en cambios solo de docs (si aplica).
- `workflow_dispatch` para prod con inputs claros.
- Documenta cron en comentario (UTC).
- Revisa seguridad de `pull_request_target` antes de usarlo.

## Errores habituales

- `on: push` sin filtros en repos con mucha actividad.
- Cron en hora local sin convertir a UTC.
- Deploy en PR desde forks con secrets expuestos.
- No usar `concurrency` y pisar despliegues.
- Triggers duplicados que lanzan el mismo job dos veces.

## Siguiente paso

El [capitulo 4](04-actions-reutilizables.md) explica actions del marketplace y workflows compartidos.

:::

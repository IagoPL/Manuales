
::: v-pre
﻿# Actions reutilizables

Las **actions** encapsulan pasos repetidos (checkout, setup, deploy). Puedes usar las oficiales, del marketplace o crear las propias en el repositorio.

## Actions oficiales frecuentes

| Action | Uso |
|--------|-----|
| `actions/checkout@v4` | Clonar el repo |
| `actions/setup-node@v4` | Node.js + cache npm |
| `actions/setup-python@v5` | Python + cache pip |
| `actions/upload-artifact@v4` | Guardar artefactos |
| `actions/download-artifact@v4` | Descargar artefactos |
| `actions/cache@v4` | Cache generico |
| `actions/github-script@v7` | Ejecutar JS con API de GitHub |

## Anatomia de una action

```yaml
- name: Descripcion humana
  uses: owner/repo@version
  with:
    parametro: valor
  env:
    SECRET_VAR: ${{ secrets.MI_SECRETO }}
```

## Composite action propia

`.github/actions/setup-app/action.yml`:

```yaml
name: Setup app
description: Instala dependencias del proyecto

inputs:
  node-version:
    description: Version de Node
    required: false
    default: '22'

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: npm
    - run: npm ci
      shell: bash
```

Uso:

```yaml
- uses: actions/checkout@v4
- uses: ./.github/actions/setup-app
  with:
    node-version: '24'
```

## Workflow reutilizable

`.github/workflows/ci-node.yml`:

```yaml
name: CI Node reusable

on:
  workflow_call:
    inputs:
      working-directory:
        required: false
        type: string
        default: '.'
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ${{ inputs.working-directory }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
```

Llamada:

```yaml
jobs:
  frontend-ci:
    uses: ./.github/workflows/ci-node.yml
    with:
      working-directory: frontend
```

## Versionado de actions

Preferencia:

1. Tag semver de la action (`@v4.2.1`).
2. Tag mayor movil (`@v4`) — equilibrio actualizacion/estabilidad.
3. Evitar `@main` en produccion.

Para actions propias, publica releases y documenta breaking changes.

## Marketplace y terceros

Antes de usar una action externa:

- Mantenimiento reciente.
- Permisos que pide.
- Codigo auditable (preferir acciones simples o oficiales).
- Pin de commit SHA para maxima seguridad:

```yaml
uses: external/action@abc123def456...
```

## Organizar repositorios grandes

```txt
.github/
  workflows/
    api.yml
    web.yml
    docs.yml
  actions/
    setup-api/
    setup-web/
```

Cada servicio un workflow; steps comunes en composite actions.

## Buenas practicas

- DRY: mismo setup en un solo composite action.
- Inputs documentados en `action.yml`.
- Secrets solo en workflows que los necesitan.
- Tests de composite actions en un workflow de ejemplo.
- README en `.github/actions/` con uso.

## Errores habituales

- Copiar 50 lineas de setup en cada workflow.
- Actions de terceros sin pin de version.
- Composite action sin `shell: bash` en steps `run`.
- Pasar secrets a forks en PRs no confiables.
- Logica de negocio compleja dentro de actions opacas.

## Siguiente paso

El [capitulo 5](05-secrets-permisos-y-seguridad.md) cubre secrets, `permissions` y hardening.

:::

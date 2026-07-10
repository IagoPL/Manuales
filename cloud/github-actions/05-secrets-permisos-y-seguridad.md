# Secrets, permisos y seguridad

Los workflows tienen acceso al codigo, secretos y API de GitHub. Configurar **permissions** minimas y proteger **secrets** es obligatorio en repositorios serios.

## Secrets

### Repository secrets

Settings -> Secrets and variables -> Actions.

```yaml
- run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Nunca:

```yaml
- run: echo ${{ secrets.API_KEY }}  # puede filtrarse en logs
```

GitHub enmascara valores conocidos, pero evita imprimir secrets.

### Environment secrets

Secretos por entorno (`staging`, `production`) con reglas de aprobacion:

```yaml
jobs:
  deploy-prod:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

### Organization secrets

Compartidos entre repos con politicas de acceso.

## permissions en el workflow

Por defecto GitHub ajusto permisos conservadores. Declara explicitamente:

```yaml
permissions:
  contents: read
```

Deploy que escribe en `gh-pages`:

```yaml
permissions:
  contents: write
```

Workflow de validacion de este repo:

```yaml
permissions:
  contents: read
```

### Permisos comunes

| Permiso | Uso |
|---------|-----|
| `contents: read` | Checkout, leer codigo |
| `contents: write` | Commits, tags, pages |
| `packages: write` | GHCR npm/docker |
| `pull-requests: write` | Comentar en PR |
| `id-token: write` | OIDC a cloud (AWS, Azure) |

```yaml
permissions:
  contents: read
  pull-requests: read
```

## OIDC sin secrets de larga duracion

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789:role/github-deploy
      aws-region: eu-west-1
```

GitHub emite token JWT; AWS confia en el. Mejor que access keys estaticas.

## Seguridad en pull requests de forks

Los workflows de PR desde forks **no** reciben secrets del repo base por defecto.

Cuidado con:

- `pull_request_target` — corre en contexto base con secrets; riesgo si ejecutas codigo del PR sin aislar.
- Workflows que hacen checkout del head del PR y ejecutan scripts arbitrarios.

Patron seguro: solo validar codigo sin secrets o usar `pull_request` estandar.

## GITHUB_TOKEN

Token automatico por job:

```yaml
- run: gh pr comment 123 --body "CI OK"
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Limitado por `permissions` del workflow.

## Branch protection

Complementa Actions:

- Require status checks antes de merge.
- Require review.
- Restrict who can push to `main`.
- Require signed commits (opcional).

## Auditar actions

- Preferir `actions/*` y acciones conocidas.
- Pin SHA para supply chain security.
- Habilitar Dependabot para actions.

## Buenas practicas

- Principio de minimo privilegio en `permissions`.
- Secrets por entorno, no un mega-secret global.
- Rotacion periodica de tokens.
- No pasar secrets a logs ni artefactos.
- OIDC para cloud en lugar de keys en GitHub.
- Revisar workflows en PRs como codigo de produccion.

## Errores habituales

- `permissions: write-all` o omitir permissions en repos antiguos.
- Secrets en variables de entorno de repositorio publico en forks.
- `pull_request_target` ejecutando `npm install` del contribuidor sin sandbox.
- Compartir un deploy key entre staging y prod.
- Tokens personales en secrets en vez de fine-grained o OIDC.

## Siguiente paso

El [capitulo 6](06-matrices-y-cache.md) optimiza pipelines con matrices de versiones y cache de dependencias.

# Introducción a workflows

GitHub Actions ejecuta automatización **dentro del repositorio**: tests, builds, linters, deploys. Un **workflow** es un fichero YAML en `.github/workflows/` que GitHub descubre solo si está en esa ruta y termina en `.yml` o `.yaml`.

No sustituye a un runner de CI externo: es el CI de GitHub, disparado por eventos del propio repo (`push`, `pull_request`, cron, disparo manual, …).

Documentación oficial: [Quickstart](https://docs.github.com/en/actions/get-started/quickstart), [sintaxis](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions).

## Piezas (mapa, no el detalle)

| Pieza | Qué es |
| --- | --- |
| Evento | Lo que arranca una ejecución (`on:`). |
| Workflow | El YAML. Puede tener varios jobs. |
| Job | Unidad que corre en **un** runner (VM efímera). En paralelo por defecto. |
| Step | Un comando (`run`) o una action (`uses`). |
| Runner | Máquina: `ubuntu-latest`, Windows, macOS o self-hosted. |

Jobs, steps y runners se desarrollan en el [siguiente capítulo](02-jobs-steps-y-runners.md). Los triggers, en el [capítulo 3](03-eventos-y-triggers.md).

## Primer workflow

Crea `.github/workflows/ci.yml` en la rama por defecto:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: echo "El workflow arranco"
```

Tras el push, la pestaña **Actions** del repo muestra la ejecución. `runs-on: ubuntu-latest` pide un runner alojado por GitHub. `actions/checkout` clona el repo en esa VM: sin checkout, los `run` no ven tu código.

Las versiones de las actions oficiales cambian. Fija una major (`@v6`) o, en producción, un SHA; el capítulo 2 y el de seguridad cubren el pin.

## Cuándo usarlo

- CI en cada PR: lint, tests, build.
- Deploy al fusionar `main` (este repo publica VitePress así).
- Tareas programadas (backups, informes) con `schedule`.

No hace falta un workflow por cada script: agrupa pasos relacionados en jobs con un propósito claro.

## Errores habituales

- Guardar el YAML fuera de `.github/workflows/` o con extensión que no sea YAML: GitHub no lo ejecuta.
- Olvidar `actions/checkout` y preguntarse por qué `npm test` no encuentra `package.json`.
- Disparar deploys en todos los `push` de todas las ramas. Restringe `branches` o deja el deploy en un job con `needs` + condición (capítulo 2).
- Copiar actions de Marketplace sin mirar permisos ni versión.

## Buenas prácticas

- Un `name:` legible: aparece en la UI.
- Empieza por un workflow mínimo y añade jobs; no copies un YAML de 200 líneas el primer día.
- En el YAML de este propio repo (`validate.yml`, `deploy.yml`) verás el mismo esquema: evento → job → checkout → comandos.
- Secrets y `permissions` van en el [capítulo 5](05-secrets-permisos-y-seguridad.md). No pongas tokens en el YAML.

## Ejercicio

1. Añade un workflow que se ejecute en `push` a tu rama y liste ficheros con `ls`.
2. Fuerza un fallo (`run: exit 1`) y observa el estado en Actions.
3. Abre el `validate.yml` de este repositorio y localiza `on`, `jobs` y `steps`.

## Siguiente paso

Continúa con [Jobs, steps y runners](02-jobs-steps-y-runners.md).

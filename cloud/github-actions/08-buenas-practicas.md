# Buenas practicas de GitHub Actions

Recomendaciones transversales para mantener workflows rapidos, seguros y faciles de evolucionar.

## Diseno de workflows

- **Un proposito por workflow** — `ci.yml`, `deploy.yml`, `nightly.yml`.
- **Nombres claros** en workflows, jobs y steps.
- **Comentarios** en cron y condiciones `if` no obvias.
- **DRY** con composite actions y `workflow_call`.
- **Paths filters** para no gastar minutos en cambios irrelevantes.

## Rendimiento y coste

| Tecnica | Beneficio |
|---------|-----------|
| Cache npm/pip | Menos tiempo de install |
| `fail-fast` estrategico | Feedback rapido en PR |
| Jobs paralelos | Menor wall-clock time |
| Self-hosted selectivo | GPUs / red interna |
| `concurrency` + cancel | Evita colas duplicadas |

Revisa Usage en Settings -> Billing para detectar workflows caros.

## Seguridad (resumen)

- `permissions` minimas explicitas.
- Secrets en environments con aprobacion para prod.
- OIDC a cloud en lugar de keys estaticas.
- Pin de versions en `uses:`.
- Cuidado con `pull_request_target` y scripts de forks.
- Dependabot para actions y dependencias.

## Mantenibilidad

```txt
.github/
  workflows/       # orquestacion
  actions/         # composite reutilizables
  CODEOWNERS       # quien aprueba cambios en CI
```

- Versiona cambios de pipeline como codigo de aplicacion.
- Documenta en README como reejecutar workflows y interpretar fallos.
- Alerta si `main` queda rojo (integracion Slack/email).

## Observabilidad

- Badges en README: `![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)`
- Annotations con `::error` / `::warning` en scripts.
- Retencion de logs y artefactos acorde a compliance.
- Enlazar commit -> deployment en environments de GitHub.

## Testing del propio CI

- PR que rompe lint debe fallar el workflow (prueba una vez al configurar).
- Workflow `workflow_dispatch` para probar deploy sin merge.
- Branch de prueba antes de tocar prod deploy.

## Integracion con el ecosistema

| Necesidad | Recurso |
|-----------|---------|
| Principios CI/CD | [CI/CD](../../devops/cicd/01-introduccion-y-principios.md) |
| Contenedores | [Docker](../../herramientas/docker/14-ci-cd-con-docker.md) |
| Kubernetes | [Kubernetes](../kubernetes/12-gitops-y-ci-cd.md) |
| Terraform | [Terraform](../../devops/terraform/01-introduccion-e-instalacion.md) |

## Checklist de madurez

### Basico
- [ ] CI en cada PR
- [ ] Checkout + setup + test + build
- [ ] Secrets fuera del repo

### Intermedio
- [ ] Cache de dependencias
- [ ] Artefactos entre jobs
- [ ] Deploy staging en main
- [ ] Branch protection con required checks

### Avanzado
- [ ] Matrices de compatibilidad
- [ ] OIDC a cloud
- [ ] Environments con aprobacion
- [ ] Workflows reutilizables en monorepo
- [ ] Docker layer cache (GHA)

## Errores que frenan equipos

- Workflows de 40 min que nadie optimiza.
- Copiar YAML de internet sin entender permissions.
- Secrets compartidos entre todos los entornos.
- No actualizar actions deprecadas hasta que fallan.
- CI verde en PR pero deploy manual sin automatizar ni documentar.

## Cierre

GitHub Actions es la capa de automatizacion mas accesible si ya usas GitHub. Invierte en pipelines pequenos, seguros y rapidos; reutiliza patrones de este manual y de [CI/CD](../../devops/cicd/07-buenas-practicas.md) para cerrar el ciclo hasta produccion.

Este repositorio aplica practicas concretas: validacion en PR, deploy documentado y permisos acotados por workflow.

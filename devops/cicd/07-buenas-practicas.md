# Buenas practicas de CI/CD

Este capitulo cierra el manual con recomendaciones transversales para equipos que ya tienen pipelines basicos y quieren madurar hacia entrega continua fiable.

## Cultura y flujo de trabajo

- **Main siempre verde:** un pipeline roto en `main` es prioridad P1.
- **PRs pequenos:** menos riesgo, revision mas facil, rollback mas simple.
- **Trunk-based development:** ramas cortas; feature flags para trabajo largo.
- **Revision de codigo obligatoria:** el CI no sustituye ojos humanos en diseno y seguridad.

## Diseno de pipelines

```txt
Rapido y frecuente en PR  |  Completo en main / nightly
-------------------------|---------------------------
lint, unit test          |  integration, e2e, security scan
< 10 min objetivo        |  < 45 min aceptable
```

- Falla rapido: lint antes que e2e.
- Paraleliza jobs independientes.
- Usa `paths` / `paths-ignore` en monorepos.
- Reutiliza workflows (`workflow_call`) y composite actions.

## Reproducibilidad

- Lockfiles commiteados.
- Imagenes base con version o digest fijo.
- Mismo Dockerfile en dev y CI.
- Variables de entorno documentadas en `.env.example`.

## Seguridad integrada (DevSecOps)

- Secretos en vault / GitHub Secrets, nunca en repo.
- Principio de minimo privilegio en tokens de CI.
- Rotacion periodica de credenciales de deploy.
- Firmar artefactos y verificar en deploy.
- Auditar quien puede lanzar produccion.

## Entornos

| Entorno | Proposito |
|---------|-----------|
| Local | Desarrollo rapido |
| CI | Validacion automatica |
| Staging | Replica de prod, QA, demos |
| Production | Usuarios finales |

Staging debe parecerse a prod en:

- Version de runtime y dependencias.
- Configuracion (con secretos distintos).
- Topologia (Kubernetes, no solo docker-compose si prod es k8s).

## Metricas DORA (referencia)

1. **Deployment frequency** — con que frecuencia desplegais.
2. **Lead time for changes** — commit a produccion.
3. **Change failure rate** — % cambios que degradan servicio.
4. **Time to restore** — tiempo en recuperar tras fallo.

Mejorar CI/CD impacta directamente en estas cuatro metricas.

## Documentacion viva

Mantener en el repo:

- `CONTRIBUTING.md` — como correr tests y abrir PR.
- Runbooks de deploy y rollback.
- Diagrama de pipeline (aunque sea ASCII en markdown).
- Owners por servicio (`CODEOWNERS`).

## Relacion con otros manuales

| Necesidad | Manual |
|-----------|--------|
| Workflows concretos en GitHub | [GitHub Actions](../../cloud/github-actions/01-introduccion-a-workflows.md) |
| Contenedores | [Docker](../../herramientas/docker/01-introduccion.md) |
| Orquestacion | [Kubernetes](../../cloud/kubernetes/01-introduccion-y-arquitectura.md) |
| Infra como codigo | [Terraform](../terraform/01-introduccion-e-instalacion.md) |
| Automatizacion shell | [Bash](../bash/01-introduccion-y-terminal.md) |

## Checklist de madurez

### Nivel inicial
- [ ] CI en cada PR (lint + test)
- [ ] Build automatico en main
- [ ] Secretos fuera del repo

### Nivel intermedio
- [ ] Deploy automatico a staging
- [ ] Artefactos versionados por SHA
- [ ] Smoke test post-deploy
- [ ] Escaneo de dependencias

### Nivel avanzado
- [ ] Canary o blue-green
- [ ] Feature flags
- [ ] Metricas DORA visibles
- [ ] Rollback probado y documentado
- [ ] SBOM y firma de imagenes

## Errores que frenan equipos

- Pipeline de 60 min que nadie respeta.
- "Funciona en mi maquina" sin paridad con CI.
- Desplegar viernes tarde sin observabilidad.
- 15 pipelines copy-paste desincronizados.
- Confundir "tenemos Jenkins" con "hacemos CI/CD bien".

## Cierre

CI/CD no es una herramienta: es el camino desde un commit hasta valor en produccion con feedback rapido. Itera el pipeline como iteras el producto: mide, simplifica, automatiza y reduce riesgo en cada ciclo.

Este repositorio aplica parte de estas practicas: el workflow [Validate documentation](../../../.github/workflows/validate.yml) valida build y enlaces; [Deploy documentation](../../../.github/workflows/deploy.yml) publica la web en cada push a `main`.

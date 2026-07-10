# Calidad, seguridad y gates

Los **gates** son comprobaciones automaticas o humanas que bloquean un despliegue si no se cumplen criterios minimos de calidad y seguridad. Sin gates, el pipeline solo "compila" pero no protege produccion.

## Tipos de gates

| Gate | Ejemplo |
|------|---------|
| **Calidad de codigo** | Lint sin errores, cobertura >= 80% |
| **Seguridad** | Sin CVE criticas en dependencias o imagen |
| **Revision** | PR aprobado por 2 revisores |
| **Compliance** | Licencias permitidas, SBOM generado |
| **Funcional** | Smoke test staging en verde |
| **Manual** | Aprobacion en environment `production` |

## Calidad en el pipeline

```yaml
- run: npm run lint
- run: npm test -- --coverage
- run: |
    COVERAGE=$(jq .total.lines.pct coverage/coverage-summary.json)
    test "$(echo "$COVERAGE >= 80" | bc)" -eq 1
```

Herramientas:

- **ESLint**, **Ruff**, **golangci-lint**
- **SonarQube**, **CodeClimate**
- **Prettier** / **Black** en check mode

## Seguridad de dependencias

```yaml
- name: Audit npm
  run: npm audit --audit-level=high
```

Alternativas: **Dependabot**, **Snyk**, **Trivy** (OS + libs), **OWASP Dependency-Check**.

Politica tipica:

- Critico / alto: bloquea merge.
- Medio: ticket en 30 dias.
- Bajo: informativo.

## Seguridad de imagenes Docker

```yaml
- uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:${{ github.sha }}
    severity: CRITICAL,HIGH
    exit-code: 1
```

Escanea:

- Paquetes OS de la imagen base.
- Dependencias de la aplicacion.
- Secretos embebidos por error.

## SAST y secret scanning

- **GitHub Advanced Security / gitleaks:** secretos en repo.
- **Semgrep**, **CodeQL:** patrones inseguros en codigo.

```yaml
- uses: github/codeql-action/init@v3
  with:
    languages: javascript, python
```

## Infraestructura como codigo

Terraform y manifests Kubernetes tambien pasan por gates:

```bash
terraform fmt -check
terraform validate
tflint
kubeconform manifest.yaml
```

Policy as Code con **OPA**, **Checkov**, **tfsec**.

## Gates en GitHub Actions

### Branch protection

- Require status checks (`validate`, `security`).
- Require pull request reviews.
- Dismiss stale reviews.

### Environments

```yaml
deploy-prod:
  environment:
    name: production
    url: https://app.example.com
```

Configura required reviewers en Settings -> Environments.

## Matriz de severidad

```txt
Bloqueante: tests fallidos, CVE critical, secret en repo
Advertencia: cobertura -2%, CVE medium
Informativo: estilo menor, deps patch
```

No bloquees por ruido o el equipo saltara los gates.

## Buenas practicas

- Gates rapidos en PR; escaneos lentos en main o nightly.
- Un dashboard de deuda de seguridad visible.
- Excepciones documentadas con fecha de expiracion.
- Mismas reglas en local (pre-commit) y en CI.
- Revisar falsos positivos de scanners regularmente.

## Errores habituales

- `npm audit fix --force` en CI sin control (rompe deps).
- Gates que tardan 45 min en cada PR.
- Solo escanear app, no imagen Docker final.
- Aprobacion manual que siempre se auto-aprueba.
- Sin politica para vulnerabilidades en imagen base.

## Siguiente paso

El [capitulo 6](06-rollback-y-observabilidad.md) trata como revertir despliegues fallidos y monitorizar pipelines.

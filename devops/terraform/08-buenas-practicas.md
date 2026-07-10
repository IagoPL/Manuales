# Buenas practicas de Terraform

Recomendaciones para operar Terraform en equipo: estilo, seguridad, CI/CD y gobernanza.

## Codigo y estilo

- `terraform fmt -recursive` en pre-commit o CI.
- `terraform validate` en cada PR.
- Nombres descriptivos: `aws_instance.api`, no `aws_instance.a`.
- Archivos por proposito: `network.tf`, `database.tf`, `variables.tf`.
- Comentarios solo donde el HCL no sea obvio.

## Versionado

```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.70" }
  }
}
```

- Fija version de Terraform en CI (`.terraform-version`, `tfenv`).
- Actualiza providers de forma controlada (changelog, plan en staging).

## Seguridad

- No secrets en `.tf` ni tfvars commiteados.
- Usa `sensitive = true`, Vault, AWS Secrets Manager, TF Cloud variables.
- IAM roles con minimo privilegio para CI (OIDC).
- **checkov**, **tfsec**, **trivy config** en pipeline.
- State cifrado y sin acceso publico.

## CI/CD

```yaml
- run: terraform fmt -check -recursive
- run: terraform init -backend=false
- run: terraform validate
- run: tflint
- run: terraform plan -var-file=staging.tfvars -no-color -out=tfplan
- uses: actions/upload-artifact@v4
  with:
    name: tfplan
    path: tfplan
```

Apply a prod solo con aprobacion y artefacto de plan de main.

## Politica y revision

- Todo cambio infra via PR con plan pegado.
- CODEOWNERS en `infra/`.
- Ambiente prod: dos revisores o environment protection.
- Documentar excepciones a `-target`.

## Modulos y DRY

- Modulos pequenos y reutilizables.
- Registry interno para versionado.
- Evita copy-paste entre entornos; usa tfvars.

## Operaciones

- Runbook: lock huerfano, import recurso, destroy selectivo.
- Drift detection nightly.
- Etiquetado obligatorio (`Environment`, `Owner`, `CostCenter`).
- Cost estimation (Infracost) en PRs opcional.

## Relacion con Ansible

| Terraform | Ansible |
|-----------|---------|
| Provisionar infra | Configurar SO, paquetes, apps |
| API cloud | SSH / WinRM |

Patron comun: TF crea VM + red; Ansible instala stack.

## Checklist de madurez

- [ ] Backend remoto + lock
- [ ] fmt/validate/plan en CI
- [ ] tfvars por entorno
- [ ] Modulos versionados
- [ ] Scan de seguridad
- [ ] Sin apply manual a prod sin plan
- [ ] Drift monitoring
- [ ] Documentacion de bootstrap

## Errores de equipos maduros que aun ocurren

- "Arreglar en consola rapido" sin volcar a HCL.
- State compartido por Slack.
- Provider years old por miedo a actualizar.
- Monolito de 2000 lineas en un `main.tf`.
- Ignorar warnings de deprecacion hasta que rompe.

## Cierre

Terraform brilla cuando infra es **declarativa**, **revisable** y **repetible**. Combinado con [CI/CD](../cicd/01-introduccion-y-principios.md), [GitHub Actions](../../cloud/github-actions/01-introduccion-a-workflows.md) y [Ansible](../ansible/01-introduccion-e-inventarios.md), cierra el ciclo desde codigo hasta recursos en cloud.

# Workspaces y entornos

Separar **dev**, **staging** y **produccion** evita aplicar cambios experimentales en infra critica. Terraform ofrece workspaces y/o directorios por entorno.

## Workspaces

Varios states en el mismo backend:

```bash
terraform workspace list
terraform workspace new staging
terraform workspace select production
terraform workspace show
```

En HCL:

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "myapp-logs-${terraform.workspace}"
}
```

`terraform.workspace` devuelve el nombre actual (`default`, `staging`, `prod`).

## Workspaces vs directorios

| Enfoque | Ventajas | Desventajas |
|---------|----------|-------------|
| **Workspaces** | Un solo codigo, cambio rapido | Facil equivocarse de workspace |
| **Carpetas por entorno** | Aislamiento claro | Duplicacion si no usas modulos |
| **Mismo codigo + tfvars** | DRY + explicito | Requiere disciplina en apply |

Recomendacion en equipos: **mismo modulo root + `-var-file` por entorno** o carpetas `env/staging`, `env/prod` que llaman modulos compartidos.

## Estructura por entorno

```txt
environments/
  staging/
    main.tf
    backend.tf
    terraform.tfvars
  production/
    main.tf
    backend.tf
    terraform.tfvars
modules/
  app/
```

`environments/staging/main.tf`:

```hcl
module "app" {
  source      = "../../modules/app"
  environment = "staging"
  instance_type = "t3.small"
}
```

## Backend distinto por entorno

```hcl
# environments/production/backend.tf
terraform {
  backend "s3" {
    bucket         = "tfstate-prod"
    key            = "app/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "tf-lock-prod"
    encrypt        = true
  }
}
```

States separados = blast radius menor.

## CI/CD por entorno

```yaml
# PR: plan staging
- run: terraform plan -var-file=staging.tfvars

# main: apply staging automatico
# tag v*: apply prod con aprobacion manual
```

Nunca `terraform apply` a prod desde laptop sin revision.

## Variables por entorno

`staging.tfvars`:

```hcl
environment   = "staging"
instance_count = 1
```

`production.tfvars`:

```hcl
environment   = "prod"
instance_count = 3
```

## Buenas practicas

- Nombres de workspace o carpeta explicitos (`prod`, no `p`).
- Prompt o script que muestre entorno antes de `apply`.
- Politicas: prod solo desde CI con aprobacion.
- Mismos modulos, distintos tfvars (paridad staging/prod).
- Documentar que backend usa cada entorno.

## Errores habituales

- `apply` en prod estando en workspace `default`.
- Staging sin paridad de recursos con prod (sorpresas al promover).
- Un solo state para todo (riesgo y conflictos).
- tfvars de prod en repo sin cifrado de secretos.
- Olvidar `workspace select` en scripts.

## Siguiente paso

El [capitulo 6](06-plan-apply-y-drift.md) cubre el ciclo plan/apply y deteccion de drift.

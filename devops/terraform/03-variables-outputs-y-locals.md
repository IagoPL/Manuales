# Variables, outputs y locals

Variables parametrizan modulos y entornos. Outputs exponen valores a otros modulos o a humanos. Locals son valores intermedios reutilizables dentro del mismo modulo.

## Variables

`variables.tf`:

```hcl
variable "environment" {
  description = "Entorno de despliegue"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment debe ser dev, staging o prod."
  }
}

variable "instance_count" {
  type    = number
  default = 1
}

variable "db_password" {
  type      = string
  sensitive = true
}
```

Valores via:

```hcl
# terraform.tfvars
environment    = "staging"
instance_count = 2
```

```bash
terraform apply -var="environment=prod"
export TF_VAR_db_password='secreto'
```

## Outputs

`outputs.tf`:

```hcl
output "bucket_name" {
  description = "Nombre del bucket de logs"
  value       = aws_s3_bucket.logs.id
}

output "db_endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}
```

```bash
terraform output bucket_name
terraform output -json
```

Otros modulos consumen outputs con `module.xxx.output_name` o `terraform_remote_state`.

## Locals

```hcl
locals {
  name_prefix = "${var.project}-${var.environment}"
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket" "logs" {
  bucket = "${local.name_prefix}-logs"
  tags   = local.common_tags
}
```

Evita repetir expresiones; no son inputs externos.

## Tipos de variables

```hcl
variable "config" {
  type = object({
    region = string
    size   = number
    flags  = map(bool)
  })
}

variable "subnets" {
  type = list(string)
}
```

## tfvars por entorno

```txt
environments/
  staging.tfvars
  production.tfvars
```

```bash
terraform apply -var-file=environments/staging.tfvars
```

## Variables de entorno TF_VAR_

```bash
export TF_VAR_environment=staging
export TF_VAR_instance_count=3
```

Util en CI sin commitear tfvars sensibles.

## Sensitive values

```hcl
variable "api_key" {
  type      = string
  sensitive = true
}
```

Terraform oculta en logs de plan; igualmente no commitees el valor.

## Buenas practicas

- `description` en cada variable.
- `validation` para enums y rangos.
- Defaults solo para valores seguros.
- tfvars por entorno, no un archivo gigante.
- Outputs minimos y documentados para consumidores.

## Errores habituales

- Secrets en `terraform.tfvars` commiteado.
- Variables sin tipo (menos claro en equipos grandes).
- Locals que deberian ser variables (config externa).
- Outputs con datos sensibles sin `sensitive = true`.
- Duplicar mismos tags en cada recurso en vez de `local.common_tags`.

## Siguiente paso

El [capitulo 4](04-modulos.md) encapsula configuracion reutilizable en modulos.

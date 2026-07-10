# Backends remotos

Por defecto Terraform guarda state en `terraform.tfstate` local. En equipo necesitas **backend remoto** con **bloqueo** para evitar applies concurrentes y perdida de state.

## Por que remoto

| Problema local | Backend remoto |
|----------------|----------------|
| State en laptop de una persona | State centralizado |
| Sin bloqueo (dos apply a la vez) | Lock (DynamoDB, etc.) |
| Sin backup | Versionado en S3 |
| Secretos en git por error | Cifrado en reposo |

## Backend S3 + DynamoDB (AWS)

```hcl
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "apps/myapp/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

- **S3** almacena state.
- **DynamoDB** tabla con `LockID` para mutex.

Bootstrap (una vez, a mano o modulo bootstrap):

```hcl
resource "aws_s3_bucket" "tfstate" {
  bucket = "mycompany-terraform-state"
}

resource "aws_dynamodb_table" "locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

## Migrar state local a remoto

```hcl
# Anadir bloque backend en terraform {} luego:
```

```bash
terraform init -migrate-state
```

Terraform pregunta si mover state existente.

## Terraform Cloud / HCP Terraform

```hcl
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      name = "myapp-production"
    }
  }
}
```

UI, runs remotos, policy as code (Sentinel / OPA), variables sensibles.

## Otros backends

| Backend | Uso |
|---------|-----|
| **azurerm** | Azure Storage + lease |
| **gcs** | Google Cloud Storage |
| **kubernetes** | Secret en cluster |
| **remote** | Terraform Cloud |

## State locking

Si otro apply esta en curso:

```txt
Error: Error acquiring the state lock
Lock Info: ID: ..., Who: ci@github, Operation: OperationTypeApply
```

Espera o `terraform force-unlock LOCK_ID` solo si estas seguro de que el lock es huerfano.

## Versionado de state (S3)

Habilita versioning en el bucket:

```hcl
resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration { status = "Enabled" }
}
```

Recuperacion ante corrupcion accidental.

## Workspaces y keys

Con workspaces en S3 backend, keys suelen ser:

```txt
env:/staging/apps/myapp/terraform.tfstate
env:/prod/apps/myapp/terraform.tfstate
```

## Buenas practicas

- Bucket dedicado solo para state.
- Cifrado SSE-KMS o SSE-S3.
- IAM minimo: CI solo write en keys necesarias.
- Versioning y lifecycle (no borrar versiones recientes).
- Nunca commitear `terraform.tfstate`.
- Backup periodico y prueba de restore.

## Errores habituales

- Bucket sin versioning (state perdido irreversible).
- Sin DynamoDB lock (states corruptos por apply paralelo).
- Misma key para staging y prod.
- `force-unlock` con apply real en curso.
- Permisos IAM demasiado amplios en bucket de state.

## Siguiente paso

El [capitulo 8](08-buenas-practicas.md) cierra el manual con recomendaciones de equipo y seguridad.

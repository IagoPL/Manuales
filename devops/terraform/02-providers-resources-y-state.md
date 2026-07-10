# Providers, resources y state

Terraform traduce configuracion HCL en llamadas a APIs mediante **providers**. Los **resources** definen infraestructura deseada. El **state** es la fuente de verdad de lo que Terraform cree que existe.

## Providers

Bloque `terraform` + `provider`:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}
```

Credenciales via entorno (recomendado):

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

O perfiles IAM / OIDC en CI.

## Resources

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "myapp-logs-${var.environment}"

  tags = {
    Project     = "myapp"
    Environment = var.environment
  }
}
```

Sintaxis: `resource "TIPO" "NOMBRE_LOCAL" { ... }`

- `TIPO` — definido por el provider (`aws_s3_bucket`).
- `NOMBRE_LOCAL` — referencia en el mismo modulo (`aws_s3_bucket.logs`).

## Data sources

Leer sin gestionar:

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}
```

## Dependencias

Implicitas por referencia:

```hcl
resource "aws_subnet" "a" { vpc_id = aws_vpc.main.id }
```

Explicitas con `depends_on` cuando no hay referencia directa.

## State (`terraform.tfstate`)

JSON que mapea recursos Terraform a IDs reales:

```json
{
  "resources": [
    {
      "type": "aws_s3_bucket",
      "name": "logs",
      "instances": [{ "attributes": { "id": "myapp-logs-staging", ... } }]
    }
  ]
}
```

- **No edites el state a mano** salvo emergencia (`terraform state` commands).
- Contiene datos sensibles; backend remoto cifrado en produccion.

## Comandos de state

```bash
terraform state list
terraform state show aws_s3_bucket.logs
terraform state mv aws_s3_bucket.old aws_s3_bucket.new
terraform state rm aws_instance.orphan
terraform import aws_s3_bucket.logs my-existing-bucket-name
```

`import` adopta recursos creados fuera de Terraform.

## Plan y grafo

```bash
terraform plan
terraform graph | dot -Tpng > graph.png
```

El plan muestra `+` crear, `~` modificar, `-` destruir, `-/+` reemplazar.

## Lifecycle

```hcl
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [tags["LastDeployed"]]
    create_before_destroy = true
  }
}
```

## Destroy

```bash
terraform destroy
```

Elimina todos los recursos del state. Peligroso en prod sin controles.

## Buenas practicas

- Pin de version de provider en `required_providers`.
- Tags consistentes en todos los recursos.
- `terraform validate` en CI.
- State remoto con bloqueo (capitulo 7).
- Importar recursos legacy antes de gestionarlos.

## Errores habituales

- Borrar state y perder referencia a infra existente.
- Recurso renombrado en HCL sin `state mv` (destruye y recrea).
- Provider mal configurado (region incorrecta).
- Confundir data source con resource.
- Commitear state con secretos.

## Siguiente paso

El [capitulo 3](03-variables-outputs-y-locals.md) organiza parametros con variables, outputs y locals.

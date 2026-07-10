# Modulos en Terraform

Un **modulo** es un contenedor de recursos reutilizable. El directorio raiz es el modulo `root`; subcarpetas en `modules/` son modulos hijos.

## Modulo local

`modules/vpc/main.tf`:

```hcl
variable "cidr" {
  type = string
}

variable "name" {
  type = string
}

resource "aws_vpc" "this" {
  cidr_block = var.cidr
  tags = { Name = var.name }
}

output "vpc_id" {
  value = aws_vpc.this.id
}
```

Uso en root:

```hcl
module "vpc" {
  source = "./modules/vpc"
  cidr   = "10.0.0.0/16"
  name   = "${local.name_prefix}-vpc"
}

resource "aws_subnet" "public" {
  vpc_id = module.vpc.vpc_id
  # ...
}
```

## Modulo del registry

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["eu-west-1a", "eu-west-1b"]
}
```

Pin de `version` obligatorio en produccion.

## Estructura recomendada

```txt
modules/
  network/
    main.tf
    variables.tf
    outputs.tf
  database/
  app/
```

Root solo compone modulos y pasa variables.

## Pasar datos entre modulos

```hcl
module "db" {
  source     = "./modules/database"
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}

output "db_endpoint" {
  value = module.db.endpoint
}
```

Evita acoplar modulos leyendo state de terceros sin contrato claro.

## count y for_each en modulos

```hcl
module "app" {
  for_each = toset(var.regions)
  source   = "./modules/app"
  region   = each.key
}
```

## Versionado de modulos internos

- Modulos internos: versiona con tags git (`source = "git::https://...?ref=v1.2.0"`).
- Registry privado (Terraform Cloud, Artifactory).

## Testing de modulos

- `terraform validate` en CI por modulo.
- **terratest** (Go) para pruebas de integracion.
- **tflint**, **checkov** para lint y seguridad.

## Buenas practicas

- Un modulo = una responsabilidad (red, DB, app).
- Documenta variables requeridas.
- Outputs solo los necesarios.
- No anidar modulos demasiado profundo (3 niveles max orientativo).
- Ejemplos en `examples/` dentro del modulo.

## Errores habituales

- Modulo "god" con 40 recursos mezclados.
- `source` sin version en registry publico.
- Pasar 30 variables sueltas en vez de un objeto `config`.
- Copiar-pegar modulo en vez de parametrizar.
- Cambiar modulo sin plan en todos los entornos.

## Siguiente paso

El [capitulo 5](05-workspaces-y-entornos.md) separa dev, staging y produccion.

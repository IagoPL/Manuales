# Terraform: introduccion e instalacion

Terraform es una herramienta de **infraestructura como codigo (IaC)** de HashiCorp. Describe recursos cloud o on-premise en archivos declarativos y los crea, actualiza o destruye de forma reproducible mediante un plan de ejecucion.

## Capitulos

1. [Introduccion e instalacion](01-introduccion-e-instalacion.md)
2. [Providers resources y state](02-providers-resources-y-state.md)
3. [Variables outputs y locals](03-variables-outputs-y-locals.md)
4. [Modulos](04-modulos.md)
5. [Workspaces y entornos](05-workspaces-y-entornos.md)
6. [Plan apply y drift](06-plan-apply-y-drift.md)
7. [Backends remotos](07-backends-remotos.md)
8. [Buenas practicas](08-buenas-practicas.md)

## Que problema resuelve

Sin IaC:

- Configuracion manual en consola web (no reproducible).
- "Funciona en mi cuenta" sin documentacion.
- Drift entre entornos staging y produccion.

Con Terraform:

```txt
main.tf + variables -> terraform plan -> terraform apply -> infraestructura real
```

El estado (`terraform.tfstate`) registra que recursos gestiona Terraform.

## Conceptos clave

| Concepto | Descripcion |
|----------|-------------|
| **Provider** | Plugin (AWS, Azure, GCP, Docker, Kubernetes…) |
| **Resource** | Objeto a crear (`aws_instance`, `azurerm_resource_group`) |
| **Data source** | Leer recursos existentes sin crearlos |
| **State** | Mapa recurso logico -> ID real |
| **Plan** | Diff entre codigo y estado |
| **Apply** | Aplicar cambios |

## Instalacion

### Windows (winget)

```powershell
winget install HashiCorp.Terraform
```

### Linux / macOS

```bash
# Ejemplo con tfenv (gestor de versiones)
git clone https://github.com/tfutils/tfenv.git ~/.tfenv
tfenv install 1.9.0
tfenv use 1.9.0
```

Verifica:

```bash
terraform version
```

Fija version en equipos y CI (`.terraform-version` o `required_version`).

## Primer proyecto

```bash
mkdir terraform-demo && cd terraform-demo
terraform init
```

`main.tf`:

```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

provider "local" {}

resource "local_file" "hello" {
  content  = "Hola desde Terraform"
  filename = "${path.module}/hello.txt"
}
```

```bash
terraform init
terraform plan
terraform apply
```

`plan` muestra cambios; `apply` los ejecuta (confirma con `yes` o `-auto-approve` en CI).

## Estructura de carpetas tipica

```txt
infra/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  modules/
    network/
    compute/
  environments/
    staging/
    production/
```

## Flujo de trabajo

```txt
editar .tf -> fmt + validate -> plan -> review -> apply -> commit
```

Comandos utiles:

```bash
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

## Terraform vs alternativas

| Herramienta | Enfoque |
|-------------|---------|
| **Terraform** | Declarativo, multi-cloud, ecosistema HCL |
| **Pulumi** | IaC con lenguajes generalistas (TS, Python) |
| **CloudFormation** | Solo AWS, nativo |
| **Ansible** | Mas orientado a configuracion; puede complementar TF |

## Buenas practicas iniciales

- Versiona `.tf` en git; **nunca** commitees `terraform.tfstate` con secretos.
- Usa backend remoto en equipo (capitulo 7).
- `terraform fmt` antes de cada commit.
- Un directorio por entorno o workspaces claros.
- Documenta variables en `variables.tf`.

## Errores comunes

- Aplicar sin revisar el plan.
- State local compartido por copia manual (conflictos).
- Provider sin pin de version (`version = "~> 5.0"`).
- Recursos creados a mano fuera de Terraform (drift).
- Secrets en texto plano en `.tf` (usa variables sensibles + vault).

## Siguiente paso

El [capitulo 2](02-providers-resources-y-state.md) profundiza en providers, recursos y el fichero de estado.

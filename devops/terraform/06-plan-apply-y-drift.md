# Plan, apply y drift

El ciclo central de Terraform es **plan -> review -> apply**. El **drift** ocurre cuando la infra real difiere del state/codigo (cambios manuales en consola).

## Plan

```bash
terraform plan
terraform plan -out=tfplan
terraform show tfplan
```

Salida tipica:

```txt
Terraform will perform the following actions:
  # aws_instance.web will be updated in-place
  ~ resource "aws_instance" "web" {
      ~ instance_type = "t3.micro" -> "t3.small"
    }
Plan: 0 to add, 1 to change, 0 to destroy.
```

Guardar plan en archivo garantiza que `apply` ejecuta exactamente lo revisado:

```bash
terraform apply tfplan
```

## Apply

```bash
terraform apply                    # plan interactivo + confirmacion
terraform apply -auto-approve      # CI (con cuidado)
terraform apply -target=aws_instance.web  # parcial (emergencias)
```

`-target` rompe dependencias si abusas; solo incidentes.

## Refresh y drift

```bash
terraform plan -refresh-only
terraform apply -refresh-only
```

Actualiza state desde la API real sin cambiar infra. Util para detectar drift.

### Drift manual

Alguien cambia security group en consola:

```txt
plan muestra ~ cambios para volver al codigo
```

Opciones:

1. **Revertir en codigo** si el cambio manual fue error.
2. **Actualizar .tf** si el cambio manual es deseado (nuevo estado deseado).
3. **import** si recurso nuevo fuera de TF.

## Deteccion continua

- `terraform plan` en CI nightly contra entornos.
- Herramientas: **Spacelift**, **Terraform Cloud**, **driftctl**.
- Alertas si plan no vacio en prod sin PR.

## Ciclo en equipo

```txt
1. PR con cambios .tf
2. CI: fmt, validate, plan (comentario en PR)
3. Review humano del plan
4. Merge -> apply staging
5. Smoke tests
6. Apply prod (manual o gated)
```

## Destroy y reemplazos

Recursos con `forces replacement`:

```txt
-/+ aws_instance.web must be replaced
```

Causa downtime si no usas `create_before_destroy`.

## Buenas practicas

- Siempre plan en PR; apply tfplan en prod.
- Prohibir cambios manuales en recursos gestionados (politica + IAM).
- Nightly drift detection en prod.
- Runbook para `-target` en incidentes.
- Guardar planes de prod como artefactos CI.

## Errores habituales

- Apply sin leer plan en produccion.
- Ignorar drift meses (apply destructivo sorpresa).
- `-auto-approve` en local contra prod.
- No usar `-refresh-only` tras incidentes en consola.
- Confiar en que nadie tocara la consola cloud.

## Siguiente paso

El [capitulo 7](07-backends-remotos.md) configura state remoto y bloqueo.

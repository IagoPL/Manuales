# Automatizacion con Bash

Bash conecta tareas programadas, servicios del sistema y pipelines CI. Este capitulo muestra patrones para ejecutar scripts de forma fiable y repetible.

## Cron

```bash
crontab -e
```

```cron
# min hora dia mes dia_semana comando

::: v-pre
0 3 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
*/15 * * * * /opt/scripts/healthcheck.sh
```

Buenas practicas en cron:

- Rutas absolutas a scripts y binarios.
- `PATH` explicito al inicio del script o en crontab.
- Redirigir stdout/stderr a log.
- Usar `flock` para evitar solapamiento.

```cron
0 2 * * * flock -n /var/lock/backup.lock /opt/scripts/backup.sh
```

## systemd timers (alternativa moderna)

`/etc/systemd/system/backup.service`:

```ini
[Unit]
Description=Backup diario

[Service]
Type=oneshot
ExecStart=/opt/scripts/backup.sh
User=backup
```

`/etc/systemd/system/backup.timer`:

```ini
[Unit]
Description=Timer backup

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now backup.timer
systemctl list-timers
```

Ventajas: logs en journald, dependencias, calendario expresivo.

## GitHub Actions

```yaml
- name: Run deploy script
  run: bash scripts/deploy.sh staging
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

El script debe ser no interactivo y salir con codigo != 0 en error.

## Ansible y Bash

Ansible usa modulos; Bash en `script:` o `shell:` para casos puntuales:

```yaml
- name: Ejecutar migracion
  ansible.builtin.script: scripts/migrate.sh {{ version }}
```

Preferir modulos idempotentes cuando existan.

## Plantilla de script de deploy

```bash
#!/usr/bin/env bash
set -euo pipefail

ENV="${1:?Falta entorno}"
VERSION="${2:?Falta version}"

log() { echo "[$(date -Iseconds)] $*"; }

log "Deploy $VERSION -> $ENV"
./scripts/build.sh "$VERSION"
./scripts/push_image.sh "$VERSION"
./scripts/k8s_rollout.sh "$ENV" "$VERSION"
./scripts/smoke_test.sh "$ENV"
log "Deploy OK"
```

## Notificaciones

```bash
notify_slack() {
  local msg="$1"
  curl -fsS -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"$msg\"}"
}

trap 'notify_slack "Deploy FALLIDO"' ERR
```

## Buenas practicas

- Un script = una responsabilidad (build, deploy, rollback).
- Config por entorno en archivos o variables, no hardcode.
- Logs con timestamp y entorno.
- Prueba scripts en staging con mismos permisos que prod.
- Documenta requisitos (paquetes, version bash).

## Errores habituales

- Cron sin PATH (comando no encontrado).
- Scripts interactivos en CI.
- Olvidar `chmod +x` en servidor (usar `bash script.sh`).
- Secrets en crontab en texto plano.
- Deploy sin smoke test posterior.

## Siguiente paso

El [capitulo 8](08-buenas-practicas.md) resume estilo, seguridad y herramientas de apoyo.

:::

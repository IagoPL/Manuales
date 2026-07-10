# Scripts robustos

Scripts de produccion deben fallar pronto, manejar errores y ser predecibles. Este capitulo cubre opciones de shell, validacion y patrones defensivos.

## Shebang y modo estricto

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

| Opcion | Efecto |
|--------|--------|
| `set -e` | Sale si un comando falla |
| `set -u` | Error si variable no definida |
| `set -o pipefail` | Falla el pipe si cualquier etapa falla |
| `IFS` | Evita split raro en espacios/tabs |

## Errores controlados

```bash
set -e

if ! cp config.yml /etc/app/config.yml; then
  echo "Fallo al copiar config" >&2
  exit 1
fi

# o temporalmente desactivar -e
set +e
risky_command
code=$?
set -e
if (( code != 0 )); then
  handle_error "$code"
fi
```

## Funcion de error central

```bash
die() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -f "$CONFIG" ]] || die "Falta archivo $CONFIG"
```

## Rutas absolutas al script

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$SCRIPT_DIR/lib/common.sh"
```

Funciona aunque invoques el script desde otro directorio.

## Validacion de argumentos

```bash
usage() {
  echo "Uso: $0 <entorno> <version>"
  exit 1
}

[[ $# -eq 2 ]] || usage
ENV="$1"
VERSION="$2"
```

## Logging

```bash
log() {
  printf '[%s] %s\n' "$(date -Iseconds)" "$*"
}

log "Deploy $VERSION a $ENV"
```

Redirige a archivo en CI:

```bash
exec > >(tee -a deploy.log) 2>&1
```

## Locks (evitar ejecuciones paralelas)

```bash
LOCK=/var/lock/mydeploy.lock
exec 200>"$LOCK"
flock -n 200 || die "Otro deploy en curso"
```

## dry-run

```bash
DRY_RUN="${DRY_RUN:-false}"

run() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

run kubectl apply -f manifest.yaml
```

## Buenas practicas

- `shellcheck script.sh` en CI.
- Idempotencia donde sea posible (`mkdir -p`, `install`).
- Timeouts en comandos de red (`curl -m 30`).
- Documentar variables de entorno requeridas.
- Version del script en cabecera o `--version`.

## Errores habituales

- `set -e` sin entender que no aplica a todos los contextos (`if cmd`).
- Scripts que continuan tras fallo silencioso.
- Rutas relativas que dependen del cwd del cron.
- Sin lock en cron cada 5 minutos (solapamiento).
- `rm -rf $VAR` con VAR vacio (usa `set -u` y `"$VAR"`).

## Siguiente paso

El [capitulo 7](07-automatizacion.md) integra Bash con cron, systemd y CI.

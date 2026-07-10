# Funciones en Bash

Las funciones agrupan comandos con nombre, parametros y variables locales. Mejoran legibilidad y evitan duplicacion en scripts de deploy y mantenimiento.

## Definicion basica

```bash
#!/usr/bin/env bash

greet() {
  echo "Hola, $1"
}

greet "Ana"
```

## Parametros y return

```bash
backup_file() {
  local src="$1"
  local dest="$2"

  if [[ ! -f "$src" ]]; then
    echo "No existe: $src" >&2
    return 1
  fi

  cp "$src" "$dest"
  return 0
}

backup_file "/etc/app.conf" "/backup/app.conf"
echo "Exit: $?"
```

`return` solo devuelve codigo numerico (0-255). Para texto usa `echo` y captura con `$()`.

## Capturar salida

```bash
get_timestamp() {
  date +%Y%m%d-%H%M%S
}

ts=$(get_timestamp)
echo "Backup-$ts.tar.gz"
```

## Variables locales

```bash
counter=0

increment() {
  local counter=$((counter + 1))
  echo "local: $counter"
}

increment   # local: 1
echo "global: $counter"  # 0
```

Sin `local`, modificas variables globales por accidente.

## Funciones en librerias

`lib/log.sh`:

```bash
log_info() {
  echo "[INFO] $(date -Iseconds) $*"
}

log_error() {
  echo "[ERROR] $(date -Iseconds) $*" >&2
}
```

`deploy.sh`:

```bash
#!/usr/bin/env bash
source "$(dirname "$0")/lib/log.sh"

log_info "Iniciando deploy"
```

Usa rutas relativas al script con `dirname "$0"`.

## export -f (scripts avanzados)

```bash
myfn() { echo "ok"; }
export -f myfn
# disponible en subshells de parallel (con cuidado)
```

## Documentar funciones

```bash
# backup_dir SRC DEST
# Copia recursiva de SRC a DEST con tar.
backup_dir() {
  local src="$1" dest="$2"
  tar -czf "$dest" -C "$(dirname "$src")" "$(basename "$src")"
}
```

## Buenas practicas

- Nombres verbo_sustantivo: `deploy_app`, `check_health`.
- `local` para todas las variables internas.
- Validar argumentos al inicio (`$#`).
- Mensajes de error a stderr (`>&2`).
- `source` solo archivos de confianza.

## Errores habituales

- Olvidar que `$1` en funcion no es `$1` del script si no pasas args.
- Recursion sin caso base.
- Funciones gigantes (dividir en pasos).
- `source` de script con efectos secundarios al cargar.
- Usar `exit` dentro de funcion sourced (mata el shell padre).

## Siguiente paso

El [capitulo 5](05-pipes-redirecciones-y-procesos.md) conecta comandos con pipes y maneja procesos en segundo plano.

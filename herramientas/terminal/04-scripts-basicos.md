# Scripts basicos

Un script es un archivo de texto con comandos del shell. Sirve para repetir tareas sin errores de tipeo: backups, arranque local, checks de entorno.

## Shebang y permisos

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Hola desde el script"
```

```bash
chmod u+x hola.sh
./hola.sh
```

| Directiva | Para que sirve |
|-----------|----------------|
| `set -e` | Sale si un comando falla |
| `set -u` | Falla al usar variables no definidas |
| `set -o pipefail` | El pipe falla si falla cualquier etapa |

## Argumentos

```bash
#!/usr/bin/env bash
set -euo pipefail

nombre="${1:-mundo}"
echo "Hola, $nombre"
```

```bash
./hola.sh Ada
# $0 = script, $1 $2 ... = args, $# = cantidad, "$@" = todos
```

## Condicionales y bucles

```bash
#!/usr/bin/env bash
set -euo pipefail

archivo="$1"
if [[ ! -f "$archivo" ]]; then
  echo "No existe: $archivo" >&2
  exit 1
fi

while IFS= read -r line; do
  echo "LINEA: $line"
done < "$archivo"
```

Pruebas frecuentes: `-f` archivo, `-d` directorio, `-z` string vacio, `-n` string no vacio.

## Funciones

```bash
log() {
  echo "[$(date +%H:%M:%S)] $*"
}

log "arrancando"
```

## Ejemplo: check de entorno

```bash
#!/usr/bin/env bash
set -euo pipefail

need() {
  command -v "$1" >/dev/null || {
    echo "Falta: $1" >&2
    exit 1
  }
}

need git
need node
need docker
echo "OK: herramientas basicas presentes"
```

## Errores habituales

- Ejecutar con `sh script.sh` cuando usas sintaxis Bash (`[[ ]]`).
- No poner comillas en `"$var"` y romper con espacios.
- Olvidar `exit 1` en errores (CI marca verde).

## Buenas practicas

- Nombres claros: `backup-db.sh`, no `script2.sh`.
- Cabecera con comentario de uso: `# Usage: ./backup-db.sh <env>`.
- Idempotencia cuando sea posible (correr dos veces no destroza).
- Para logica compleja, considera Python; el shell brilla en pegamento.

## Ejercicio

1. Escribe `mkproject.sh` que reciba un nombre y cree `nombre/{src,tests,README.md}`.
2. Anade validacion si no pasan argumentos.
3. Ejecutalo dos veces y observa el comportamiento con `mkdir -p`.

## Siguiente paso

Continua con [Diagnostico y trabajo remoto](05-diagnostico-y-trabajo-remoto.md).

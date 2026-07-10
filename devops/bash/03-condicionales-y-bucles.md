# Condicionales y bucles

El control de flujo en Bash permite reaccionar a codigos de salida, comparar strings y recorrer listas o archivos.

## Codigos de salida

```bash
ls /existente
echo $?   # 0 = exito

ls /no-existe 2>/dev/null
echo $?   # distinto de 0 = error
```

En scripts, `set -e` hace fallar el script si un comando falla (capitulo 6).

## if / elif / else

```bash
if [[ -f "config.yml" ]]; then
  echo "Config encontrada"
elif [[ -d "config.d" ]]; then
  echo "Directorio de config"
else
  echo "Sin config"
  exit 1
fi
```

Preferir `[[ ]]` sobre `[ ]` en bash: mas seguro con strings y patrones.

### Comparaciones numericas

```bash
count=5
if (( count > 3 )); then
  echo "mayor que 3"
fi
```

### Comparaciones de strings

```bash
env="${APP_ENV:-dev}"
if [[ "$env" == "production" ]]; then
  echo "Modo prod"
fi
```

### Comandos en if

```bash
if grep -q "ERROR" app.log; then
  echo "Hay errores"
fi
```

## case

```bash
case "$1" in
  start)
    systemctl start myapp
    ;;
  stop)
    systemctl stop myapp
    ;;
  restart)
    systemctl restart myapp
    ;;
  *)
    echo "Uso: $0 {start|stop|restart}"
    exit 1
    ;;
esac
```

## for

```bash
for file in *.log; do
  echo "Procesando $file"
  gzip "$file"
done

for i in {1..5}; do
  echo "Iteracion $i"
done

for ((i=0; i<3; i++)); do
  echo $i
done
```

## while y until

```bash
while read -r line; do
  echo "Linea: $line"
done < access.log

# esperar servicio
until curl -fsS http://localhost:8080/health; do
  sleep 2
done
```

## break y continue

```bash
for f in *; do
  [[ "$f" == *.tmp ]] && continue
  [[ "$f" == "STOP" ]] && break
  process "$f"
done
```

## Operadores de archivos

| Test | Significado |
|------|-------------|
| `-f file` | Archivo regular existe |
| `-d dir` | Directorio existe |
| `-r file` | Legible |
| `-x file` | Ejecutable |
| `-s file` | No vacio |
| `file1 -nt file2` | file1 mas nuevo |

## Buenas practicas

- `[[ ]]` con variables entre comillas.
- `(( ))` para numeros.
- `read -r` para no interpretar backslash.
- Salir con codigo distinto de 0 en error.
- Evita bucles infinitos sin `sleep` o limite.

## Errores habituales

- `if [ $var == value ]` con `var` vacio (syntax error); usa `[[ ]]`.
- No quotar `$file` en `for` con nombres con espacios.
- `while read line` sin `-r`.
- Confundir `=` y `==` dentro de `[ ]` (depende del shell).
- Olvidar `;;` en `case`.

## Siguiente paso

El [capitulo 4](04-funciones.md) organiza scripts con funciones reutilizables.

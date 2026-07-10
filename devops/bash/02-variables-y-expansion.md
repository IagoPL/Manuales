# Variables y expansion en Bash

Las variables en Bash almacenan strings. La **expansion** sustituye `$var` por su valor; las **comillas** controlan si se interpretan espacios y metacaracteres.

## Asignacion y uso

```bash
name="Ana"
echo "Hola $name"
echo Hola $name
```

Sin comillas, el shell divide por espacios (word splitting).

```bash
path="/mi carpeta/archivo.txt"
cat $path      # ERROR: cat /mi carpeta/archivo.txt
cat "$path"    # OK
```

## Comillas

| Forma | Expansion |
|-------|-----------|
| `'texto'` | Literal, sin expansion |
| `"texto"` | Expansion de `$var`, `` `cmd` ``, `$()` |
| `` `cmd` `` | Sustitucion de comando (legacy) |
| `$(cmd)` | Sustitucion de comando (preferida) |

```bash
now=$(date +%Y-%m-%d)
echo "Backup del $now"
```

## Variables de entorno

```bash
export APP_ENV=production
echo "$APP_ENV"

# leer con default
port="${PORT:-3000}"
echo "Puerto $port"
```

`${VAR:-default}` — si VAR vacia o no definida, usa default.

Otras expansiones utiles:

```bash
${VAR:=default}   # asigna default si vacia
${VAR:?mensaje}   # error si vacia
${#VAR}           # longitud
${VAR%.txt}       # quitar sufijo
${VAR#prefix}     # quitar prefijo
```

## Variables especiales

```bash
$0    # nombre del script
$1 $2 # argumentos
$#    # numero de argumentos
$@    # todos los argumentos (lista)
$?    # exit code del ultimo comando
$$    # PID del shell
$PWD  # directorio actual
```

```bash
#!/usr/bin/env bash
echo "Script: $0"
echo "Primer arg: ${1:-sin argumento}"
echo "Total args: $#"
```

## Arrays (bash)

```bash
servers=(web1 web2 web3)
echo "${servers[0]}"
echo "${servers[@]}"   # todos los elementos
echo "${#servers[@]}"  # cantidad

for s in "${servers[@]}"; do
  echo "Ping $s"
done
```

Siempre `"${array[@]}"` entre comillas para preservar elementos con espacios.

## readonly y local

```bash
readonly CONFIG_DIR="/etc/myapp"
# CONFIG_DIR=/otro  # error

myfunc() {
  local temp="solo dentro de la funcion"
}
```

## Buenas practicas

- Mayusculas para variables de entorno (`DB_HOST`), minusculas para locales.
- Siempre `"$variable"` al expandir.
- `$(...)` en vez de backticks.
- `${var:-default}` para parametros opcionales.
- No uses `eval` con input externo.

## Errores habituales

- `VAR = valor` (espacios invalidos en asignacion).
- Olvidar comillas con rutas o argumentos vacios.
- `$@` sin comillas en funciones (usa `"$@"`).
- Confundir `=` y `==` (este ultimo en `[[ ]]`).
- Exportar secrets en historial (`set +o history` o archivos env).

## Siguiente paso

El [capitulo 3](03-condicionales-y-bucles.md) controla flujo con if, case y bucles.

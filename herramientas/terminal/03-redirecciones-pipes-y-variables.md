# Redirecciones, pipes y variables

La potencia del shell esta en **combinar** programas pequenos. Las redirecciones mueven stdin/stdout/stderr; los pipes conectan la salida de un comando con la entrada del siguiente.

## stdout y stderr

```bash
comando > salida.txt    # sobrescribe stdout
comando >> salida.txt   # append stdout
comando 2> errores.txt  # solo stderr
comando > todo.txt 2>&1 # stdout+stderr al mismo archivo
```

Ejemplo:

```bash
ls /existe /no-existe >out.txt 2>err.txt
```

## Pipes

```bash
cat access.log | grep " 500 " | wc -l
ps aux | grep node | grep -v grep
docker ps | awk '{print $1,$2}'
```

Patron mental:

```txt
datos -> filtro -> filtro -> resumen
```

## Variables de entorno

```bash
export NODE_ENV=production
echo "$NODE_ENV"
echo "Home es $HOME"
```

Listar:

```bash
env | sort
printenv PATH
```

Variables utiles: `PATH`, `HOME`, `USER`, `PWD`.

En un solo comando:

```bash
NODE_ENV=test npm test
```

## Sustitucion de comandos

```bash
echo "Hoy es $(date +%F)"
files=$(ls | wc -l)
echo "Entradas: $files"
```

## Comillas

```bash
echo "$HOME"      # expande
echo '$HOME'      # literal
echo "Hola $USER"
```

Usa comillas dobles cuando haya espacios:

```bash
cp "$archivo" "$destino"
```

## Historial y expansion

```bash
history | tail
!!          # repite ultimo comando
sudo !!     # tipico: olvidaste sudo
```

## Errores habituales

- `comando > file 2>&1` vs `comando 2>&1 > file` (el orden importa).
- Olvidar comillas con rutas con espacios.
- Hacer `export SECRET=...` y luego pegar el historial en un ticket.

## Buenas practicas

- En scripts, `set -euo pipefail` (capitulo siguiente).
- No imprimas secretos; redirige logs con cuidado.
- Prefiere pipes cortos y legibles a monstruos de una linea sin comentarios.

## Ejercicio

1. Guarda `ls -la` en un archivo y los errores de un path inventado en otro.
2. Cuenta lineas de un log (o de un `.md`) que contengan `error` (case insensitive).
3. Exporta una variable y usala en un `echo`.

## Siguiente paso

Continua con [Scripts basicos](04-scripts-basicos.md).

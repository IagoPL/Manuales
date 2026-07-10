# Pipes, redirecciones y procesos

Bash brilla encadenando comandos: **pipes** pasan salida entre procesos; **redirecciones** envian flujos a archivos; el control de **procesos** permite paralelismo y jobs en background.

## Tres flujos estandar

| FD | Nombre | Default |
|----|--------|---------|
| 0 | stdin | Teclado |
| 1 | stdout | Terminal |
| 2 | stderr | Terminal |

## Redirecciones

```bash
command > file.txt          # stdout a archivo (sobrescribe)
command >> file.txt         # append
command 2> errors.log       # stderr
command &> all.log          # stdout + stderr
command 2>&1                # stderr a stdout
command > /dev/null 2>&1    # silenciar todo
```

```bash
# stdin desde archivo
sort < unsorted.txt

# here document
cat <<EOF > config.env
APP_ENV=production
PORT=8080
EOF
```

## Pipes

```bash
cat access.log | grep "POST" | awk '{print $1}' | sort | uniq -c | sort -nr | head
```

Cada comando en la tuberia corre en subshell. Solo el **stdout** del anterior alimenta el siguiente (stderr no, salvo `2>&1`).

```bash
npm test 2>&1 | tee test.log
```

`tee` escribe a archivo y muestra en pantalla.

## xargs

```bash
find . -name "*.tmp" -print0 | xargs -0 rm -f
```

`-0` maneja nombres con espacios (con `find -print0`).

## Procesos en background

```bash
long_task &
echo "PID: $!"

wait          # esperar todos los jobs
wait $!       # esperar ultimo background
```

## jobs y fg/bg

```bash
sleep 100 &
jobs
fg %1
# Ctrl+Z suspende
bg %1
```

## Subshells

```bash
(cd /tmp && ls)    # cd no afecta al shell padre
( export X=1; ./child.sh )
```

## trap (senales)

```bash
cleanup() {
  echo "Limpiando..."
  rm -f /tmp/mylock
}

trap cleanup EXIT
trap 'echo Interrumpido; exit 130' INT
```

Util para borrar temporales al salir.

## Paralelismo simple

```bash
for host in web1 web2 web3; do
  ssh "$host" 'sudo systemctl reload nginx' &
done
wait
echo "Todos recargados"
```

Para mucho paralelismo considera `GNU parallel`.

## Buenas practicas

- `2>&1 | tee log` en scripts de deploy.
- `find ... -print0 | xargs -0` con nombres raros.
- `wait` tras jobs en background antes de salir.
- `trap` para cleanup.
- No pipelines fragiles sin `set -o pipefail` (capitulo 6).

## Errores habituales

- Pipeline exit 0 aunque un comando falle (sin `pipefail`).
- Olvidar que variables en subshell no actualizan el padre.
- `xargs` sin `-0` con espacios en nombres.
- Matar proceso sin entender hijos (`kill` vs `kill -9`).
- Redirigir stderr a /dev/null y perder errores utiles.

## Siguiente paso

El [capitulo 6](06-scripts-robustos.md) endurece scripts con `set -euo pipefail` y manejo de errores.

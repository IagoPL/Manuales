# Bash: introduccion y terminal

Bash (Bourne Again Shell) es el interprete de comandos por defecto en la mayoria de distribuciones Linux y macOS. En DevOps sirve para automatizar tareas, encadenar herramientas CLI y escribir scripts de despliegue y mantenimiento.

## Capitulos

1. [Introduccion y terminal](01-introduccion-y-terminal.md)
2. [Variables y expansion](02-variables-y-expansion.md)
3. [Condicionales y bucles](03-condicionales-y-bucles.md)
4. [Funciones](04-funciones.md)
5. [Pipes redirecciones y procesos](05-pipes-redirecciones-y-procesos.md)
6. [Scripts robustos](06-scripts-robustos.md)
7. [Automatizacion](07-automatizacion.md)
8. [Buenas practicas](08-buenas-practicas.md)

## Shell interactivo vs script

| Modo | Uso |
|------|-----|
| **Interactivo** | Explorar, depurar, comandos puntuales |
| **Script** (`.sh`) | Automatizacion repetible, CI, cron |

Primer script:

```bash
#!/usr/bin/env bash
echo "Hola desde Bash"
```

```bash
chmod +x hello.sh
./hello.sh
```

Shebang `#!/usr/bin/env bash` busca bash en PATH (portable).

## Comandos basicos de navegacion

```bash
pwd                    # directorio actual
ls -la                 # listar con detalles
cd /var/log            # cambiar directorio
cd ..                  # subir nivel
mkdir -p proyecto/src  # crear carpetas
cp -r src backup/      # copiar recursivo
mv old.txt new.txt     # renombrar/mover
rm -i archivo.txt      # borrar con confirmacion
```

## Ayuda y documentacion

```bash
man ls
ls --help
type cd              # builtin o binario
which python3
```

## Historial y atajos

```bash
history
!!           # repetir ultimo comando
!grep        # ultimo que empezaba por grep
Ctrl+R       # busqueda inversa en historial
Ctrl+C       # cancelar
Ctrl+D       # EOF / cerrar sesion
```

## Tab completion

Doble Tab completa nombres de archivos y comandos. Reduce errores de ruta.

## Entornos donde corre Bash

- Servidores Linux.
- Contenedores (`docker exec`).
- GitHub Actions (`ubuntu-latest`).
- WSL en Windows.
- macOS (zsh por defecto en terminal, bash sigue instalado).

En scripts de produccion indica `bash` explicitamente si usas caracteristicas bash (arrays, `[[ ]]`).

## Relacion con DevOps

| Tarea | Bash |
|-------|------|
| Deploy | Scripts que llaman `kubectl`, `terraform` |
| CI | Steps `run:` en GitHub Actions |
| Logs | `grep`, `tail`, `journalctl` |
| Backup | `tar`, `rsync`, cron |

Complementa [Terminal](../../herramientas/terminal/01-introduccion-y-navegacion.md) y [Linux](../../herramientas/linux/01-introduccion.md).

## Buenas practicas iniciales

- No ejecutes comandos destructivos sin confirmar (`rm -rf`).
- Usa rutas relativas conscientes del `cwd`.
- En scripts, empieza con shebang y `set -euo pipefail` (capitulo 6).
- Prefiere herramientas idempotentes cuando existan (`mkdir -p`, `install`).

## Errores comunes

- Espacios en rutas sin comillas: `cd $dir` -> usa `"$dir"`.
- Confundir `/` final en rutas.
- Ejecutar scripts sin `chmod +x` o sin `bash script.sh`.
- Copiar comandos de internet sin entender `rm -rf /`.
- Asumir macOS = Linux (diferencias en `sed`, `date`).

## Siguiente paso

El [capitulo 2](02-variables-y-expansion.md) cubre variables, comillas y expansion.

# Troubleshooting y recuperacion

Git permite recuperar mucho, pero conviene actuar con calma. Antes de tocar historial o borrar cosas, mira el estado.

## Primer diagnostico

```bash
git status
git log --oneline --decorate --graph --all -n 20
git diff
git diff --staged
```

## Deshacer cambios no staged

Para ver cambios:

```bash
git diff archivo.md
```

Para descartar cambios de un archivo:

```bash
git restore archivo.md
```

Usalo solo si quieres perder esos cambios.

## Sacar cambios del staging

```bash
git restore --staged archivo.md
```

El archivo sigue modificado, pero deja de estar preparado para commit.

## Corregir el ultimo commit

Si falta un archivo:

```bash
git add archivo.md
git commit --amend
```

Si solo quieres cambiar el mensaje:

```bash
git commit --amend -m "Nuevo mensaje"
```

No hagas amend de commits ya compartidos salvo que sepas que vas a reescribir historia.

## Reflog

`reflog` muestra movimientos recientes de HEAD.

```bash
git reflog
```

Recuperar un commit:

```bash
git branch rescate abc1234
```

## Revertir un commit publicado

Si el commit ya esta en remoto y no quieres reescribir historia:

```bash
git revert abc1234
```

Esto crea un nuevo commit que deshace el anterior.

## Resolver pull con cambios locales

Si tienes cambios sin commit:

```bash
git status
git add .
git commit -m "Guarda cambios locales"
git pull
```

O usa stash:

```bash
git stash push -m "trabajo temporal"
git pull
git stash pop
```

## Historias no relacionadas

Si Git dice:

```txt
fatal: refusing to merge unrelated histories
```

Significa que las dos ramas no comparten base. Solo usa esto si realmente quieres unirlas:

```bash
git pull origin main --allow-unrelated-histories
```

## Buenas practicas

- Lee `git status` antes de actuar.
- Haz commits pequenos antes de operaciones arriesgadas.
- Prefiere `revert` en historia compartida.
- Usa `reflog` antes de asumir que algo se perdio.
- No uses `reset --hard` como primer recurso.

## Errores comunes

- Hacer `git reset --hard` sin revisar cambios locales.
- Forzar push sin `--force-with-lease`.
- Resolver conflictos aceptando todo sin leer.
- Reescribir commits compartidos sin avisar al equipo.

## Chuleta

```bash
git status
git restore archivo
git restore --staged archivo
git commit --amend
git reflog
git revert commit
git stash push -m "mensaje"
git stash pop
git push --force-with-lease
```

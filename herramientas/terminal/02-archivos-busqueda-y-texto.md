# Archivos, busqueda y texto

Crear, copiar, mover, buscar y leer archivos desde la terminal es el dia a dia. Estos comandos existen en casi cualquier Linux y en Git Bash.

## Crear y eliminar

```bash
mkdir -p proyectos/app/src
touch proyectos/app/README.md
rm archivo.txt
rm -r carpeta_vacia_o_con_contenido
rm -rf carpeta    # peligroso: sin confirmacion
```

`-p` crea padres intermedios. Piensa dos veces antes de `rm -rf`.

## Copiar y mover

```bash
cp archivo.txt backup.txt
cp -r src/ src_backup/
mv viejo.txt nuevo.txt
mv archivo.txt ../otra-carpeta/
```

`mv` tambien renombra.

## Ver contenido

```bash
cat archivo.txt           # todo
less archivo.txt          # paginado (q para salir)
head -n 20 archivo.txt
tail -n 20 archivo.txt
tail -f /var/log/syslog   # seguir en vivo
```

## Buscar archivos

```bash
find . -name "*.md"
find . -type f -name "docker-compose*.yml"
find /var/log -name "*.log" -mtime -1
```

`fd` (si esta instalado) es mas rapido y amigable; `find` es el universal.

## Buscar dentro de archivos

```bash
grep -R "TODO" .
grep -Rn "function setup" src/
grep -i "error" app.log
```

Opciones utiles: `-i` (case insensitive), `-n` (numero de linea), `-R` (recursivo), `-v` (invertir).

Con ripgrep (si existe):

```bash
rg "Pendiente de completar" -g "*.md"
```

## Espacio en disco

```bash
du -sh .
du -h --max-depth=1 . | sort -h
df -h
```

## Permisos basicos (Linux)

```bash
ls -l script.sh
chmod u+x script.sh
chmod 600 secreto.env
```

| Modo | Significado tipico |
|------|--------------------|
| `755` | Ejecutable / carpeta usable |
| `644` | Archivo de texto normal |
| `600` | Solo el dueno lee/escribe (secretos) |

## Errores habituales

- `rm -rf` con ruta mal expandida (`$VAR` vacia -> borra demasiado).
- Usar `cat` en ficheros enormes (mejor `less` / `tail`).
- Buscar con `grep -R` en `node_modules/` sin excluir (lento y ruidoso).

## Buenas practicas

- Excluye dependencias: `grep -R --exclude-dir=node_modules`.
- Nombra backups con fecha: `cp db.sqlite "db-$(date +%F).sqlite"`.
- No copies secretos a directorios compartidos con permisos abiertos.

## Ejercicio

1. Crea una jerarquia `lab/terminal/{a,b}` con `mkdir -p`.
2. Genera tres `.txt`, busca la palabra `hola` con `grep`.
3. Copia la carpeta con `cp -r` y mide tamano con `du -sh`.

## Siguiente paso

Continua con [Redirecciones pipes y variables](03-redirecciones-pipes-y-variables.md).

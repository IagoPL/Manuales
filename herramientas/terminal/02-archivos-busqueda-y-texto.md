# Archivos busqueda y texto

La terminal permite crear, mover, copiar, leer y buscar archivos rapidamente.

## Crear y manipular

```bash
mkdir docs
touch docs/notas.txt
cp docs/notas.txt docs/copia.txt
mv docs/copia.txt docs/notas-backup.txt
rm docs/notas-backup.txt
```

## Leer archivos

```bash
cat archivo.txt
less archivo.txt
head archivo.txt
tail archivo.txt
tail -f app.log
```

## Buscar archivos

```bash
find . -name "*.md"
find . -type f -name "*.log"
```

## Buscar texto

```bash
grep "ERROR" app.log
grep -R "TODO" .
```

Si tienes `rg` instalado, suele ser mas rapido:

```bash
rg "TODO"
```

## Contar

```bash
wc archivo.txt
wc -l archivo.txt
```

## Buenas practicas

- Usa comillas si hay espacios en rutas.
- Prefiere `less` para archivos largos.
- Usa `tail -f` para seguir logs.
- Revisa resultados antes de borrar en masa.

## Errores comunes

- Usar `rm` con una ruta equivocada.
- Confundir mayusculas y minusculas en nombres.
- Buscar en todo el sistema cuando basta con el proyecto.

## Ejercicio

Crea tres archivos `.txt`, busca uno por nombre y luego busca una palabra dentro de todos.

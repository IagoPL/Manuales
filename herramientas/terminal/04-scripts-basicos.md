# Scripts basicos

Un script automatiza una secuencia de comandos.

## Primer script

Archivo `backup.sh`:

```bash
#!/usr/bin/env bash

set -e

mkdir -p backups
cp app.log backups/app.log
echo "Backup completado"
```

Dar permisos:

```bash
chmod +x backup.sh
```

Ejecutar:

```bash
./backup.sh
```

## Variables

```bash
#!/usr/bin/env bash

PROJECT_DIR="/var/www/app"
echo "Proyecto: $PROJECT_DIR"
```

## Argumentos

```bash
#!/usr/bin/env bash

name="$1"
echo "Hola, $name"
```

Ejecutar:

```bash
./saludo.sh Iago
```

## Condicionales

```bash
if [ -f "app.log" ]; then
  echo "Existe"
else
  echo "No existe"
fi
```

## Buenas practicas

- Usa `set -e` para fallar ante errores.
- Usa nombres claros para variables.
- Cita variables: `"$ruta"`.
- Comprueba argumentos.
- Documenta scripts que afecten despliegues o datos.

## Errores comunes

- No dar permiso de ejecucion.
- Usar rutas relativas desde cron o servicios.
- No controlar errores.
- No citar variables con espacios.

## Ejercicio

Crea un script que reciba una carpeta como argumento, compruebe si existe y muestre cuanto ocupa con `du -sh`.

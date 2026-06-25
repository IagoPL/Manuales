# Terminal

La terminal es una interfaz de texto para ejecutar comandos, automatizar tareas y trabajar con sistemas locales o remotos. En Linux y macOS suele usarse Bash, Zsh u otro shell; en Windows puedes usar PowerShell, Git Bash o WSL.

Este manual cubre uso general de terminal. Bash como lenguaje de scripting tiene su propio manual en [DevOps](../../devops/bash/01-introduccion-y-terminal.md).

## Capitulos

1. [Introduccion y navegacion](01-introduccion-y-navegacion.md)
2. [Archivos busqueda y texto](02-archivos-busqueda-y-texto.md)
3. [Redirecciones pipes y variables](03-redirecciones-pipes-y-variables.md)
4. [Scripts basicos](04-scripts-basicos.md)
5. [Diagnostico y trabajo remoto](05-diagnostico-y-trabajo-remoto.md)

## Comandos iniciales

```bash
pwd
ls
cd /ruta
cd ..
cd ~
```

## Rutas

- Ruta absoluta: `/home/iago/proyecto`.
- Ruta relativa: `docs/manual.md`.
- Directorio actual: `.`.
- Directorio padre: `..`.
- Home del usuario: `~`.

## Ayuda

```bash
comando --help
man ls
```

## Buenas practicas

- Comprueba donde estas con `pwd`.
- Usa tabulacion para autocompletar.
- Lee el comando antes de pulsar Enter.
- Copia comandos destructivos con especial cuidado.

## Ejercicio

Crea una carpeta `terminal-lab`, entra en ella, crea un archivo y vuelve al directorio anterior.

# Terminal: introduccion y navegacion

La terminal es la interfaz de texto con el sistema operativo. Dominala acelera Git, Docker, SSH, builds y diagnostico: casi todas las herramientas DevOps nacieron primero como CLI.

Este manual usa sintaxis compatible con **Bash** (Linux/macOS y Git Bash en Windows). En PowerShell los equivalentes existen, pero los ejemplos priorizan Bash por ser el comun denominador en servidores.

## Capitulos

1. [Introduccion y navegacion](01-introduccion-y-navegacion.md)
2. [Archivos busqueda y texto](02-archivos-busqueda-y-texto.md)
3. [Redirecciones pipes y variables](03-redirecciones-pipes-y-variables.md)
4. [Scripts basicos](04-scripts-basicos.md)
5. [Diagnostico y trabajo remoto](05-diagnostico-y-trabajo-remoto.md)

## Anatomia del prompt

```bash
usuario@host:~/proyectos$
```

Escribes un comando + Enter. El shell busca el ejecutable en `$PATH`, lo lanza y muestra la salida.

```bash
whoami
pwd
echo "hola"
```

## Navegacion esencial

| Comando | Que hace |
|---------|----------|
| `pwd` | Directorio actual |
| `ls` | Lista entradas |
| `ls -la` | Incluye ocultos y detalles |
| `cd ruta` | Cambia de directorio |
| `cd ..` | Sube un nivel |
| `cd ~` o `cd` | Va al home |
| `cd -` | Vuelve al directorio anterior |

```bash
cd ~/proyectos/manuales
pwd
ls -la
```

Rutas:

- **Absolutas**: empiezan por `/` (Linux/macOS) — `/var/log/nginx`
- **Relativas**: desde donde estas — `./src` , `../README.md`

## Atajos que ahorran horas

| Atajo | Efecto |
|-------|--------|
| `Tab` | Autocompletar |
| `Ctrl+C` | Cancelar proceso en primer plano |
| `Ctrl+L` o `clear` | Limpiar pantalla |
| `Ctrl+R` | Buscar en historial |
| `↑` / `↓` | Recorrer historial |
| `Ctrl+A` / `Ctrl+E` | Inicio / fin de linea |
| `Ctrl+U` | Borrar desde el cursor al inicio |

## Ayuda integrada

```bash
ls --help
man ls          # Linux/macOS
man -k copy     # buscar en paginas man
```

## Windows: que terminal usar

- **Git Bash** o **WSL**: maxima compatibilidad con ejemplos Linux.
- **PowerShell**: nativo Windows; comandos distintos (`Get-ChildItem` vs `ls`).
- **cmd.exe**: legacy; evitalo para trabajo moderno.

## Errores habituales

- Confundir `\` de Windows con `/` de Bash.
- Olvidar que `~` no se expande igual dentro de comillas simples.
- Ejecutar `cd` en un subshell de un script y esperar que cambie tu shell padre.

## Buenas practicas

- Trabaja siempre sabiendo el `pwd`.
- Prefiere rutas relativas dentro de un repo.
- Usa Tab; no teclees rutas largas a mano.
- En equipo, documenta si los scripts asumen Bash o PowerShell.

## Ejercicio

1. Abre la terminal y navega hasta un proyecto con solo `cd` y `ls`.
2. Lista ocultos con `ls -la` y localiza `.git` si existe.
3. Usa `cd -` para alternar entre dos carpetas.

## Siguiente paso

Continua con [Archivos busqueda y texto](02-archivos-busqueda-y-texto.md).

# Fundamentos Básicos de Git

## Introducción a la gestión de versiones y Git

La gestión de versiones es una práctica esencial en el desarrollo de software que permite rastrear y controlar los
cambios en el código fuente y otros recursos del proyecto. Git es un sistema de control de versiones distribuido
ampliamente utilizado en la industria.

**Zona Clave**: Comprender la importancia de la gestión de versiones, control de versiones centralizado vs. distribuido
y la función de Git en el control de versiones.

## Instalación de Git en tu sistema

Antes de comenzar a utilizar Git, debes instalarlo en tu sistema operativo. Git es compatible con Windows, macOS y
Linux. A continuación, se detallan los pasos para la instalación en los sistemas operativos más comunes:

**Windows**:

1. Descarga el instalador de Git desde [https://git-scm.com/download/win](https://git-scm.com/download/win).
2. Ejecuta el instalador y sigue las instrucciones.

**macOS**:

1. Puedes instalar Git a través de Xcode Command Line Tools o utilizando Homebrew.
2. Si usas Homebrew, ejecuta el comando `brew install git`.

**Linux**:

1. En distribuciones basadas en Debian (como Ubuntu), ejecuta `sudo apt-get install git`.
2. En distribuciones basadas en Red Hat (como CentOS), ejecuta `sudo yum install git`.

**Zona Clave**: Aprender a instalar Git en tu sistema operativo específico y verificar la instalación
con `git --version`.

## Configuración inicial de Git

Después de instalar Git, es importante configurar tu nombre de usuario y dirección de correo electrónico. Estas
configuraciones se utilizan para identificarte en los commits que realices en tus proyectos.

**Configuración Global**:
Ejecuta los siguientes comandos en tu terminal:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

**Zona Clave**: Configurar la identidad de Git con `git config --global`, que se aplica a todos los proyectos Git en tu
sistema.

## Inicialización de un repositorio Git local

Un repositorio Git (repo) es una ubicación donde Git almacena datos y registros de cambios. Puedes iniciar un
repositorio Git en tu proyecto existente o comenzar uno desde cero.

**Creación de un Repositorio Nuevo**:

1. Navega hasta el directorio raíz de tu proyecto en la terminal.
2. Ejecuta el comando `git init` para crear un nuevo repositorio.

**Zona Clave**: Iniciar un repositorio con `git init` y comprender la diferencia entre el área de trabajo, el
repositorio local y el repositorio remoto.

## Comandos básicos de Git

Git ofrece una serie de comandos básicos para interactuar con el repositorio. Aquí se describen algunos de los comandos
fundamentales:

- `git add`: Agrega cambios de tu área de trabajo al área de preparación (staging).
- `git commit`: Guarda los cambios en el área de preparación en el repositorio.
- `git status`: Muestra el estado actual de los archivos en tu repositorio.
- `git log`: Muestra un registro de todos los commits en el repositorio.

**Zona Clave**: Comprender los conceptos de control de versiones, el área de trabajo, el área de preparación y el
repositorio local. Usar `git add` y `git commit`.

## Creación y gestión de ramas (branch) en Git

Las ramas son líneas de desarrollo independientes en Git. Aprende a crear y gestionar ramas para trabajar en paralelo y
realizar cambios experimentales sin afectar la rama principal.

**Creación de una Rama Nueva**:

1. Ejecuta el comando `git branch nombre_de_rama` para crear una nueva rama.
2. Utiliza `git checkout nombre_de_rama` para cambiar a la nueva rama.

**Zona Clave**: Comprender las ramas y cómo crear, cambiar y fusionar con `git branch`, `git checkout` y `git merge`.

## Inicialización de un repositorio Git local

Supongamos que tienes un proyecto web y deseas iniciar un repositorio Git en él. Sigue estos pasos:

1. **Instala Git en tu sistema** si aún no lo has hecho según las instrucciones para tu sistema operativo.

2. Abre una **terminal** y navega hasta el **directorio raíz de tu proyecto**.

3. Inicia un nuevo **repositorio Git** con el comando `git init`.


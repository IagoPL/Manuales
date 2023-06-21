# Manual completo de Terminal de Linux

## Índice
1. Introducción a la Terminal de Linux
2. Comandos básicos
   1. Navegación por directorios
   2. Manipulación de archivos y directorios
   3. Trabajo con archivos
   4. Visualización de archivos
   5. Comandos de búsqueda
   6. Gestión de procesos
   7. Administración de paquetes
   8. Gestión de usuarios y permisos
3. Ejercicios prácticos
   1. Ejercicio 1: Navegación y manipulación de archivos
   2. Ejercicio 2: Comandos de búsqueda y visualización
   3. Ejercicio 3: Gestión de procesos
   4. Ejercicio 4: Administración de paquetes
   5. Ejercicio 5: Gestión de usuarios y permisos

## 1. Introducción a la Terminal de Linux

La Terminal de Linux es una interfaz de línea de comandos que te permite interactuar con el sistema operativo mediante comandos. A continuación, se presentarán los comandos más comunes junto con ejemplos y ejercicios prácticos.

## 2. Comandos básicos

### 2.1. Navegación por directorios

- `pwd`: Muestra el directorio actual.
- `ls`: Lista los archivos y directorios en el directorio actual.
- `cd [directorio]`: Cambia al directorio especificado.
- `cd ..`: Navega al directorio padre.
- Ejemplo:
   ```
   $ pwd
   /home/usuario
   $ ls
   archivo1.txt carpeta1 carpeta2
   $ cd carpeta1
   $ pwd
   /home/usuario/carpeta1
   $ cd ..
   ```

### 2.2. Manipulación de archivos y directorios

- `mkdir [nombre]`: Crea un nuevo directorio.
- `touch [nombre]`: Crea un nuevo archivo.
- `cp [archivo] [destino]`: Copia un archivo o directorio.
- `mv [archivo] [destino]`: Mueve un archivo o directorio.
- `rm [archivo]`: Elimina un archivo.
- Ejemplo:
   ```
   $ mkdir nueva_carpeta
   $ touch nuevo_archivo.txt
   $ cp nuevo_archivo.txt nueva_carpeta/
   $ mv nuevo_archivo.txt nueva_carpeta/
   $ rm nuevo_archivo.txt
   ```

### 2.3. Trabajo con archivos

- `cat [archivo]`: Muestra el contenido de un archivo.
- `head [archivo]`: Muestra las primeras líneas de un archivo.
- `tail [archivo]`: Muestra las últimas líneas de un archivo.
- `nano [archivo]`: Abre un archivo en el editor de texto Nano.
- Ejemplo:
   ```
   $ cat archivo.txt
   Contenido del archivo.
   $ head archivo.txt
   Primera línea.
   Segunda línea.
   $ tail archivo.txt
   Última línea.
   $ nano archivo.txt
   ```

### 2.4. Visualización de archivos

- `less [archivo]`: Permite desplazarse y ver el contenido de un archivo.
- `grep [patrón] [archivo]`: Busca un patrón en un archivo.
- `wc [archivo]`: Cuenta las palabras, líneas y caracteres en un archivo.
- Ejemplo:
   ```
   $ less archivo.txt
   $ grep "patrón" archivo.txt
   $ wc archivo.txt
   ```

### 2.5. Comandos de búsqueda

- `find [directorio] [criterios]`: Busca archivos y directorios según los criterios especificados.
- `locate [archivo]`: Encuentra la ruta de un archivo en la base de datos del sistema.
- Ejemplo:
   ```
   $ find /home/usuario -name "*.txt"
   $ locate archivo.txt
   ```

### 2.6. Gestión de procesos

- `ps`: Muestra los procesos en ejecución.
- `top`: Muestra una lista en tiempo real de los procesos en ejecución.
- `kill [PID]`: Finaliza un proceso según su identificador.
- Ejemplo:
   ```
   $ ps
   $ top
   $ kill 1234
   ```

### 2.7. Administración de paquetes

- `apt-get install [paquete]`: Instala un paquete.
- `apt-get remove [paquete]`: Desinstala un paquete.
- `apt-get update`: Actualiza la lista de paquetes disponibles.
- `apt-get upgrade`: Actualiza los paquetes instalados.
- Ejemplo:
   ```
   $ apt-get install firefox
   $ apt-get remove firefox
   $ apt-get update
   $ apt-get upgrade
   ```

### 2.8. Gestión de usuarios y permisos

- `sudo [comando]`: Ejecuta un comando con privilegios de superusuario.
- `useradd [usuario]`: Crea un nuevo usuario.
- `passwd [usuario]`: Cambia la contraseña de un usuario.
- `chmod [permisos] [archivo]`: Cambia los permisos de un archivo.
- Ejemplo:
   ```
   $ sudo apt-get install [paquete]
   $ useradd nuevo_usuario
   $ passwd nuevo_usuario
   $ chmod 755 archivo.txt
   ```

## 3.1 Ejercicios prácticos

### 3.1.1. Ejercicio 1: Navegación y manipulación de archivos

1. Crea una carpeta llamada "Ejercicio1".
2. Entra en la carpeta creada.
3. Crea un archivo llamado "archivo1.txt".
4. Copia el archivo "archivo1.txt" a una carpeta llamada "Carpeta1".
5. Muestra el contenido del archivo "archivo1.txt".
6. Vuelve al directorio anterior y elimina la carpeta "Carpeta1" y su contenido.

### 3.1.2. Ejercicio 2: Comandos de búsqueda y visualización

1. Encuentra todos los archivos con extensión ".txt" en tu directorio personal.
2. Muestra las líneas que contengan la palabra "hola" en el archivo "archivo.txt".
3. Cuenta las palabras, líneas y caracteres en el archivo "documento.txt".

### 3.1.3. Ejercicio 3: Gestión de procesos

1. Muestra los procesos en ejecución.
2. Encuentra el proceso con el ID 1234 y finalízalo.

### 3.1.4. Ejercicio 4: Administración de paquetes

1. Instala el paquete "firefox".
2. Desinstala el paquete "firefox".
3. Actualiza la lista de paquetes disponibles.
4. Actualiza los paquetes instalados.

### 3.1.5. Ejercicio 5: Gestión de usuarios y permisos

1. Ejecuta un comando con privilegios de superusuario.
2. Crea un nuevo usuario llamado "nuevo_usuario".
3. Cambia la contraseña del usuario "nuevo_usuario".
4. Cambia los permisos del archivo "archivo.txt" para que solo el propietario pueda leer, escribir y ejecutar el archivo.

## 3.2 Respuestas Ejercicios prácticos

### 3.2.1. Ejercicio 1: Navegación y manipulación de archivos

1. Crea una carpeta llamada "Ejercicio1":
   ```
   $ mkdir Ejercicio1
   ```

2. Entra en la carpeta creada:
   ```
   $ cd Ejercicio1
   ```

3. Crea un archivo llamado "archivo1.txt":
   ```
   $ touch archivo1.txt
   ```

4. Copia el archivo "archivo1.txt" a una carpeta llamada "Carpeta1":
   ```
   $ cp archivo1.txt Carpeta1/
   ```

5. Muestra el contenido del archivo "archivo1.txt":
   ```
   $ cat archivo1.txt
   ```

6. Vuelve al directorio anterior y elimina la carpeta "Carpeta1" y su contenido:
   ```
   $ cd ..
   $ rm -r Ejercicio1/Carpeta1
   ```

### 3.2.2. Ejercicio 2: Comandos de búsqueda y visualización

1. Encuentra todos los archivos con extensión ".txt" en tu directorio personal:
   ```
   $ find ~ -name "*.txt"
   ```

2. Muestra las líneas que contengan la palabra "hola" en el archivo "archivo.txt":
   ```
   $ grep "hola" archivo.txt
   ```

3. Cuenta las palabras, líneas y caracteres en el archivo "documento.txt":
   ```
   $ wc documento.txt
   ```

### 3.2.3. Ejercicio 3: Gestión de procesos

1. Muestra los procesos en ejecución:
   ```
   $ ps
   ```

2. Encuentra el proceso con el ID 1234 y finalízalo:
   ```
   $ kill 1234
   ```

### 3.2.4. Ejercicio 4: Administración de paquetes

1. Instala el paquete "firefox":
   ```
   $ sudo apt-get install firefox
   ```

2. Desinstala el paquete "firefox":
   ```
   $ sudo apt-get remove firefox
   ```

3. Actualiza la lista de paquetes disponibles:
   ```
   $ sudo apt-get update
   ```

4. Actualiza los paquetes instalados:
   ```
   $ sudo apt-get upgrade
   ```

### 3.2.5. Ejercicio 5: Gestión de usuarios y permisos

1. Ejecuta un comando con privilegios de superusuario:
   ```
   $ sudo [comando]
   ```

2. Crea un nuevo usuario llamado "nuevo_usuario":
   ```
   $ useradd nuevo_usuario
   ```

3. Cambia la contraseña del usuario "nuevo_usuario":
   ```
   $ passwd nuevo_usuario
   ```

4. Cambia los permisos del archivo "archivo.txt" para que solo el propietario pueda leer, escribir y ejecutar el archivo:
   ```
   $ chmod 700 archivo.txt
   ```


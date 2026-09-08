# Trabajo con archivos

Los capítulos 1–6 dejan datos en memoria, en `$_POST` o en la sesión. Persistencia en disco: leer y escribir ficheros **fuera** del DocumentRoot cuando el contenido no debe ser ejecutable.

Documentación oficial: [sistema de ficheros](https://www.php.net/manual/es/ref.filesystem.php), [file_get_contents](https://www.php.net/manual/es/function.file-get-contents.php), [file_put_contents](https://www.php.net/manual/es/function.file-put-contents.php), [__DIR__](https://www.php.net/manual/es/language.constants.magic.php).

## Rutas y `__DIR__`

`__DIR__` es el directorio del fichero **actual**, no el cwd del proceso. Úsalo para no depender de desde dónde lanzaste `php` o `php -S`.

```php
<?php

declare(strict_types=1);

$baseDatos = dirname(__DIR__) . '/data'; // hermano de public/, no dentro
```

`./notas.txt` relativo al cwd se rompe en cron o en otro DocumentRoot.

## Existencia, leer, escribir

Para un fichero entero, `file_get_contents` / `file_put_contents` bastan. `fopen` + `fgets`/`fwrite` + `fclose` sirven cuando lees línea a línea o no quieres cargar el archivo en RAM.

```php
<?php

declare(strict_types=1);

$base = dirname(__DIR__) . '/data';
if (!is_dir($base) && !mkdir($base, 0750, true)) {
    throw new RuntimeException('No se pudo crear data/');
}

$ruta = $base . '/notas.json';

if (!is_file($ruta)) {
    file_put_contents($ruta, "[]\n", LOCK_EX);
}

$json = file_get_contents($ruta);
if ($json === false) {
    throw new RuntimeException('Lectura fallida');
}

file_put_contents($ruta, $json, FILE_APPEND | LOCK_EX); // fragmento: append crudo
```

`LOCK_EX` evita que dos procesos pisen el fichero a la vez. `0750` en `mkdir` es un punto de partida: el usuario del PHP (www-data, etc.) escribe; el resto no. El umask del sistema puede recortar bits: comprueba el resultado.

`is_file` es un fichero regular; `is_dir` un directorio. Un path que no existe da `false`, no una excepción.

## No confíes en el nombre que manda el usuario

Path traversal: `../` o `..\\` para salir de `data/` y leer `/etc/passwd` o un `.php` público.

```php
<?php

declare(strict_types=1);

function rutaBajoBase(string $base, string $nombreUsuario): string
{
    $baseReal = realpath($base);
    if ($baseReal === false || !is_dir($baseReal)) {
        throw new RuntimeException('Base inválida');
    }

    $candidato = $baseReal . DIRECTORY_SEPARATOR . basename($nombreUsuario);
    if (is_file($candidato) || is_dir($candidato)) {
        $real = realpath($candidato);
        if ($real === false || !str_starts_with($real, $baseReal . DIRECTORY_SEPARATOR)) {
            throw new InvalidArgumentException('Ruta fuera de data/');
        }
    }

    return $candidato;
}

// $entrada = $_GET['f'] ?? '';  // nunca: $base . '/' . $entrada
$ruta = rutaBajoBase($base, 'notas.json');
```

`basename()` tira directorios. Aun así, un nombre como `nota.php` no debe acabarse **dentro de `public/`**: el servidor lo ejecutaría. Guarda datos en `data/` (o similar) que Nginx/Apache no sirvan.

Uploads (`$_FILES`): `move_uploaded_file`, tamaño y tipo acotados, nombre generado por ti (`bin2hex(random_bytes(16))`), no el `name` original. El detalle HTTP ya está en el capítulo 5; aquí el riesgo es **dónde** aterriza el fichero.

## Errores habituales

- Concatenar `$_GET['path']` a `__DIR__`.
- `0755` o `0777` “para que funcione” en un directorio público.
- Guardar un `.php` subido junto a `index.php`.
- Ignorar `false` de `file_get_contents` (permiso, disco lleno).

## Buenas prácticas

- Datos y logs fuera del DocumentRoot.
- Permisos mínimos; el proceso PHP no corre como root.
- Un fichero JSON/txt no sustituye a una base (capítulo 8) cuando hay concurrencia o consultas.
- El capítulo 10 cubre cómo registrar el fallo sin enseñarlo al usuario.

## Ejercicio

1. Crea `data/` al lado de un script y escribe un JSON con `file_put_contents`.
2. Intenta (a propósito) `rutaBajoBase($base, '../secret.txt')` y comprueba que no sale de `$base`.
3. Lee el mismo fichero con `fopen`/`fgets` y con `file_get_contents`; anota cuándo preferirías cada uno.

## Siguiente paso

Continúa con [PDO y acceso a bases de datos](08-pdo-y-acceso-a-bases-de-datos.md).

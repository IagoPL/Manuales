# Proyecto final con arquitectura simple

Cierra el manual: una app **pequeña** de notas que no vive en un único `contacto.php`. No es Laravel, ni un contenedor de DI, ni hexagonal. El objetivo es **separar** HTTP, dominio, SQL y HTML.

Documentación: reutiliza [PDO](https://www.php.net/manual/es/book.pdo.php), [sesiones](https://www.php.net/manual/es/book.session.php) y lo ya citado en 05–11.

## Qué integra

| Pieza | Dónde |
| --- | --- |
| HTTP GET/POST, validación, PRG | Front controller + formularios |
| Sesión y login básico | Igual que el cap. 6, con CSRF del 11 |
| PDO + prepared | `NotaRepositorioPdo` |
| OOP | `Nota`, interfaz, `Database` |
| Errores | 404 de negocio vs 500 + `error_log` |
| Ficheros | SQLite y logs **fuera** de `public/` |

Un usuario autenticado lista, crea y ve notas. Sin router de 15 clases: `match` sobre `$_SERVER['REQUEST_URI']` (path) o un `?r=`.

## Estructura

```text
notas/
├── public/                 ← DocumentRoot (php -S localhost:8080 -t public)
│   └── index.php
├── src/
│   ├── Database.php
│   ├── Nota.php
│   └── NotaRepositorioPdo.php
├── templates/
│   ├── layout.php
│   ├── lista.php
│   └── form.php
├── data/                   ← no servido
│   └── notas.sqlite
└── config/
    └── app.php             ← lee getenv; no commitees secretos
```

`php -S` del capítulo 1, con `-t public`, para que nadie pida `/src/Database.php` por HTTP.

## Responsabilidades

**`config/app.php`** — DSN y opciones de sesión. Placeholder local:

```php
<?php

declare(strict_types=1);

return [
    'dsn' => getenv('NOTAS_DSN') ?: ('sqlite:' . dirname(__DIR__) . '/data/notas.sqlite'),
    'db_user' => getenv('NOTAS_DB_USER') ?: null,
    'db_pass' => getenv('NOTAS_DB_PASS') ?: null,
];
```

En un servidor real, `NOTAS_DB_PASS` sale del entorno, no de un string en git.

**`src/Database.php`** — un `PDO` con `ERRMODE_EXCEPTION` (capítulo 8). Nada de HTML.

**`src/Nota.php` + repositorio** — capítulo 9.

**`templates/*.php`** — solo presentación; cada variable pasa por `h()` (capítulo 11).

**`public/index.php`** — arranque:

```php
<?php

declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'use_strict_mode' => true,
]);

$config = require dirname(__DIR__) . '/config/app.php';
$pdo = Database::conectar($config);
$repo = new NotaRepositorioPdo($pdo);

$ruta = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

try {
    match (true) {
        $ruta === '/' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'GET'
            => require dirname(__DIR__) . '/templates/lista.php',
        $ruta === '/nueva' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST'
            => altaNota($repo), // valida, csrfOk, PRG a /
        default => http_response_code(404),
    };
} catch (PDOException $e) {
    error_log('notas: ' . $e->getMessage());
    http_response_code(500);
    echo 'Error interno';
}
```

`altaNota` (en un fichero `src/` o en el mismo index si aún es corto): CSRF + `trim` + longitudes + `$repo->guardar` + `header(..., 303)` + `exit`. Autoload: `require` explícitos o un `spl_autoload_register` de tres líneas; **no** hace falta Composer en este ejercicio (Composer es otro tema).

No construyas: event bus, ORM, router con middleware stack, contenedor. Si la `match` crece, extrae funciones; no anticipes un framework.

## Arranque local

```bash
mkdir -p notas/{public,src,templates,data,config}
# crea tablas SQLite una vez (script CLI, no desde el navegador)
php -S localhost:8080 -t notas/public
```

Sigue **sin** ser producción (capítulo 1).

## Errores habituales

- DocumentRoot = raíz del repo (`src/` descargable).
- Password de MySQL en `Database.php` commiteado.
- Plantilla que imprime `$_POST` o el mensaje PDO.
- Un `index.php` de 800 líneas “porque aún no es un framework”.

## Buenas prácticas

- Un sitio de entrada (`public/`).
- Dependencias hacia adentro: plantilla → objetos; repositorio → PDO; nadie al revés.
- Secretos en el entorno; `data/` y logs ignorados por git.
- Cuando esto se quede corto, *entonces* un framework (Laravel, Symfony) reutiliza las mismas ideas.

## Ejercicio

1. Monta la carpeta `notas/` y sirve solo `public/`.
2. Implementa lista + alta con CSRF y `h()`.
3. Fuerza un DSN malo y comprueba que el usuario ve “Error interno”, no el stack.

Fin del manual PHP.

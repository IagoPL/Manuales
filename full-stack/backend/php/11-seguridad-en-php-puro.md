# Seguridad en PHP puro

Los capítulos 5 (HTTP), 6 (sesión/passwords) y 8 (PDO) ya evitan los errores groseros. Aquí se **conectan**: el mismo dato recorre validación, almacén y HTML; el atacante elige el eslabón débil.

Documentación oficial: [XSS / datos](https://www.php.net/manual/es/security.variables.php), [SQL injection](https://www.php.net/manual/es/security.database.sql-injection.php), [sesiones](https://www.php.net/manual/es/session.security.ini.php), [htmlspecialchars](https://www.php.net/manual/es/function.htmlspecialchars.php), [hash_equals](https://www.php.net/manual/es/function.hash-equals.php), [random_bytes](https://www.php.net/manual/es/function.random-bytes.php), [password_hash](https://www.php.net/manual/es/function.password-hash.php).

## XSS: se guarda crudo, se escapa al pintar

Validar “que no tenga `<`” no sustituye el escape. El título de una nota se almacena como el usuario lo escribió (capítulo 8); **al generar HTML** (contexto texto):

```php
function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

echo '<h1>', h($nota->titulo), '</h1>';
```

“Sanitiza todo” es un consejo vacío: en un atributo `href` o dentro de `<script>` las reglas cambian. Este manual cubre texto HTML; CSP (abajo) reduce el daño si algo se cuela.

## SQL injection: prepared, no escape artesanal

El capítulo 8 lo demostró. Recuerdo operativo: **todo** literal que venga de fuera va en placeholder. Identificadores (`ORDER BY`) = lista blanca. Interpolación de `$email` en el SQL no es “más rápido”; es un bug.

## CSRF: token de sesión

El navegador envía la cookie de sesión en un POST fabricado desde otro origen (según SameSite). Un token **aleatorio** en la sesión, pintado en un hidden y comparado con `hash_equals` (tiempo constante; el secreto va en el **primer** argumento):

```php
<?php

declare(strict_types=1);

session_start(/* mismas opciones HttpOnly / SameSite / Secure del cap. 6 */);

if (empty($_SESSION['csrf']) || !is_string($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function csrfCampo(): string
{
    return '<input type="hidden" name="csrf" value="'
        . htmlspecialchars($_SESSION['csrf'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
        . '">';
}

function csrfOk(?string $enviado): bool
{
    return is_string($enviado)
        && hash_equals($_SESSION['csrf'], $enviado);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrfOk($_POST['csrf'] ?? null)) {
        http_response_code(403);
        exit('CSRF');
    }
    // … validar título/cuerpo y guardar (caps. 5 y 8)
    $_SESSION['csrf'] = bin2hex(random_bytes(32)); // un uso
}
```

`random_bytes` es CSPRNG. No uses `uniqid()` ni `mt_rand()` para esto. SameSite=Lax ayuda; el token cubre el POST same-site que SameSite no bloquea del todo (formularios).

## Passwords y sesión (recordatorio)

- `password_hash` / `password_verify` (capítulo 6). Nada de MD5.
- Tras login: `session_regenerate_id(true)`.
- Cookie: HttpOnly, SameSite, Secure en HTTPS, `use_strict_mode`.
- No guardar el secreto en `$_SESSION`.

## Cabeceras (las que cambian algo)

No hay un “pack” universal. Dos que suelen aportar sin romper la app:

| Cabecera | Idea |
| --- | --- |
| `X-Content-Type-Options: nosniff` | El navegador no adivina el MIME (menos XSS por ficheros). |
| `Content-Security-Policy` | Lista **de este sitio** (scripts, estilos, imágenes). Una CSP copiada de un blog puede romper el admin o no bloquear nada. |

```php
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'self'");
```

La segunda es un **punto de partida** para una app sin JS inline; ajústala. HTTPS + HSTS es decisión del proxy (capítulo 1: no uses `php -S` en público).

## Secretos

DSN, API keys y `NOTAS_DB_PASS` viven en el entorno o en un fichero **fuera** de git y de `public/`. El código lee `getenv('NOTAS_DSN')`. Un `password = 'supersecret'` en `Database.php` acaba en el historial del repo.

## Errores habituales

- Escapar al guardar y no al mostrar (o al revés, solo al guardar).
- CSRF comparado con `===` y longitudes distintas (usa `hash_equals`).
- CSP `unsafe-inline` “para que vaya el snippet” y creer que estás cubierto.
- Commitear `.env` con la prod.

## Buenas prácticas

- Defensa en capas: cookie + CSRF + prepared + `h()`.
- Tokens de un solo uso en acciones sensibles (transferencia, borrar cuenta).
- El [proyecto](12-proyecto-final-con-arquitectura-simple.md) junta estas piezas sin un framework.

## Ejercicio

1. Añade el hidden CSRF al formulario del capítulo 5 y rechaza un POST sin él.
2. Guarda un título `<em>x</em>` y míralo con y sin `h()`.
3. Lista tres valores que **nunca** pasarías a `error_log` (capítulo 10).

## Siguiente paso

Continúa con [Proyecto final con arquitectura simple](12-proyecto-final-con-arquitectura-simple.md).

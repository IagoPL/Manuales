# Sesiones, cookies y autenticación básica

Tres ideas distintas que a menudo se mezclan:

| Concepto | Dónde vive | Para qué |
| --- | --- | --- |
| **Cookie** | Cliente (navegador). Cada petición la reenvía según reglas. | Recordar un id, preferencias no secretas. |
| **Sesión** | Datos en **servidor**; el cliente solo guarda el id de sesión (casi siempre en cookie). | Estado entre peticiones (carrito, “quién soy”). |
| **Autenticación** | Verificar identidad (usuario + secreto). | Decidir si esa sesión pertenece a Ana. |

Una cookie no autentica. Una sesión no es un usuario. Un login **rellena** la sesión *después* de verificar el secreto.

Documentación oficial: [sesiones](https://www.php.net/manual/es/book.session.php), [session_start](https://www.php.net/manual/es/function.session-start.php), [session_regenerate_id](https://www.php.net/manual/es/function.session-regenerate-id.php), [setcookie](https://www.php.net/manual/es/function.setcookie.php), [password_hash](https://www.php.net/manual/es/function.password-hash.php), [password_verify](https://www.php.net/manual/es/function.password-verify.php), [ajustes seguros de sesión](https://www.php.net/manual/es/session.security.ini.php).

## Cookies

`setcookie()` manda un `Set-Cookie`. Atributos que importan:

- **HttpOnly:** JavaScript no lee la cookie (mitiga robo vía XSS).
- **Secure:** solo HTTPS. En local con `http://127.0.0.1` déjalo `false`; en producción con TLS, `true`.
- **SameSite:** `Lax` o `Strict` reducen envío en peticiones cross-site (ayuda frente a CSRF). `None` exige `Secure`.

La cookie de sesión la emite PHP al hacer `session_start`. Prefiere configurarla ahí, no con un `setcookie` paralelo del mismo nombre.

## Sesiones

```php
<?php

declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'use_strict_mode' => true,
    'use_only_cookies' => true,
]);

$_SESSION['ultimo_sku'] = 'CAM-01';
echo $_SESSION['ultimo_sku'];
```

`session_start` debe ir **antes** de cualquier salida HTML. `use_strict_mode` rechaza ids que PHP no haya emitido. Los datos están en ficheros o Redis en el servidor (config); el navegador no ve `ultimo_sku`.

Cerrar sesión: vaciar `$_SESSION`, caducar la cookie, `session_destroy()`. El patrón está en la doc de [`session_destroy`](https://www.php.net/manual/es/function.session-destroy.php).

## Autenticación (pedagógica)

No es un sistema de producción: no hay CSRF, ni límite de intentos, ni usuarios en PDO (capítulo 8). Sirve para ver **hash + sesión + regenerar id**.

- Guarda `password_hash($plano, PASSWORD_DEFAULT)`, nunca el texto ni MD5/SHA1.
- Comprueba con `password_verify($plano, $hash)`.
- Tras un login **correcto**, `session_regenerate_id(true)`: el id antiguo deja de valer (mitiga session fixation).
- En `$_SESSION` guarda el identificador (`email`, `user_id`), **no** la contraseña.

```php
<?php

declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'use_strict_mode' => true,
]);

function h(string $t): string
{
    return htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Demo: un único usuario. En un proyecto real esto sale de PDO.
$usuarios = [
    'ana@example.com' => password_hash('solo-demo', PASSWORD_DEFAULT),
];

$accion = $_POST['accion'] ?? $_GET['accion'] ?? '';

if ($accion === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: login.php', true, 303);
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $accion === 'login') {
    $email = trim((string) ($_POST['email'] ?? ''));
    $clave = (string) ($_POST['password'] ?? '');
    $hash = $usuarios[$email] ?? null;
    if ($hash !== null && password_verify($clave, $hash)) {
        session_regenerate_id(true);
        $_SESSION['user'] = $email;
        header('Location: login.php', true, 303);
        exit;
    }
    $error = 'Credenciales incorrectas.';
}
?>
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Login demo</title></head>
<body>
<?php if (isset($_SESSION['user'])): ?>
  <p>Sesión: <?= h($_SESSION['user']) ?></p>
  <form method="post">
    <input type="hidden" name="accion" value="logout">
    <button>Salir</button>
  </form>
<?php else: ?>
  <?php if ($error !== ''): ?><p><?= h($error) ?></p><?php endif; ?>
  <form method="post">
    <input type="hidden" name="accion" value="login">
    <label>Email <input name="email" type="email"></label>
    <label>Clave <input name="password" type="password"></label>
    <button>Entrar</button>
  </form>
<?php endif; ?>
</body>
</html>
```

`password_hash` en cada request para el array demo es lento a propósito (bcrypt); en datos reales el hash se calcula **al registrar** y se guarda. `PASSWORD_DEFAULT` puede cambiar de algoritmo entre versiones de PHP: el string del hash ya lleva el identificador, `password_verify` sigue funcionando.

Logout por POST evita que un `<img src="login.php?accion=logout">` cierre la sesión (GET no debería mutar). El ejemplo simplifica el destroy de la cookie; copia el bloque completo de la doc cuando lo lleves a un proyecto.

## Errores habituales

- Guardar la contraseña en `$_SESSION` o en una cookie.
- No regenerar el id al autenticar.
- `cookie_secure` en HTTP local y “no me llega la cookie”: coherente con el esquema.
- Comparar hashes con `===` a mano en lugar de `password_verify` (timing y formato).

## Buenas prácticas

- HttpOnly + SameSite en la cookie de sesión; Secure en HTTPS.
- Mensaje de error genérico (“credenciales incorrectas”), no “el email no existe”.
- Este capítulo no sustituye al [11, seguridad](11-seguridad-en-php-puro.md) (XSS, CSRF, headers).
- Frameworks (Laravel, etc.) implementan esto con middleware; los primitivos son los mismos.

## Ejercicio

1. Entra con `ana@example.com` / `solo-demo`, copia el valor de la cookie `PHPSESSID`, sal y vuelve a entrar: el id debe cambiar.
2. Intenta poner `$_SESSION['password'] = $clave` y bórralo: no debe quedar rastro del secreto.
3. Lee `session_regenerate_id` en php.net: qué hace el argumento `true`.

## Siguiente paso

Continúa con [Trabajo con archivos](07-trabajo-con-archivos.md).

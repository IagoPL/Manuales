# Formularios y peticiones HTTP

Hasta ahora los datos salían de arrays en el propio script. En la web llegan en la **petición**: query string (`GET`) o cuerpo del formulario (`POST`). PHP los expone en `$_GET` y `$_POST`. Eso no los convierte en fiables: son **entrada de usuario**.

Documentación oficial: [variables predefinidas](https://www.php.net/manual/es/language.variables.predefined.php), [$_POST](https://www.php.net/manual/es/reserved.variables.post.php), [htmlspecialchars](https://www.php.net/manual/es/function.htmlspecialchars.php), [filter_var](https://www.php.net/manual/es/function.filter-var.php), [header](https://www.php.net/manual/es/function.header.php).

## GET frente a POST

| | GET | POST |
| --- | --- | --- |
| Dónde va | URL (`?q=camisa`) | Cuerpo de la petición |
| PHP | `$_GET['q']` | `$_POST['nombre']` |
| Uso | Lectura, filtros, enlaces compartibles | Cambiar estado (alta, login, borrar) |
| Caché / logs | La URL se guarda en historial y logs | No viaja en la URL |

El método real está en `$_SERVER['REQUEST_METHOD']` (`GET`, `POST`, …). Un formulario HTML `method="post"` no impide que alguien envíe un POST a mano: **valida siempre**.

No hagas esto:

```php
echo $_POST['nombre']; // XSS: el atacante inyecta HTML/JS
```

## Validar entrada ≠ escapar salida

- **Validar:** ¿el valor es aceptable para *tu* regla? (email con `@` válido, unidades entre 1 y 99, campo obligatorio). Si falla, no procesas. `filter_var($email, FILTER_VALIDATE_EMAIL)` ayuda; no sustituye reglas de negocio.
- **Sanitizar:** recortar espacios (`trim`), normalizar. No es un antivirus. Quitar `<script>` a mano es frágil.
- **Escapar al pintar HTML:** `htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')` convierte `& < > " '` en entidades. Eso evita XSS **en contexto HTML de texto**. No vale igual dentro de un `<script>` o de una URL: ahí hay otras reglas (capítulo 11).

Puedes validar y aún así escapar al mostrar: son capas distintas.

## POST/Redirect/GET

Si tras un POST correcto vuelves a pintar la misma URL, recargar el navegador **reenvía** el formulario. El patrón: procesar el POST → `header('Location: ...', true, 303)` → `exit` → el siguiente GET muestra el resultado (o errores en sesión; flash va en el capítulo 6). El `303` pide al cliente que el redirect sea GET.

## Ejemplo: formulario de contacto

Arranca el servidor de desarrollo del capítulo 1 en este directorio. Un solo fichero `contacto.php`:

```php
<?php

declare(strict_types=1);

function h(string $texto): string
{
    return htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$errores = [];
$nombre = '';
$email = '';
$mensaje = '';
$ok = isset($_GET['ok']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim((string) ($_POST['nombre'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $mensaje = trim((string) ($_POST['mensaje'] ?? ''));

    if ($nombre === '' || mb_strlen($nombre) > 80) {
        $errores[] = 'El nombre es obligatorio (máx. 80).';
    }
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $errores[] = 'Email no válido.';
    }
    if ($mensaje === '' || mb_strlen($mensaje) > 1000) {
        $errores[] = 'El mensaje es obligatorio (máx. 1000).';
    }

    if ($errores === []) {
        // Aquí persistirías (capítulo 7/8). No imprimas éxito en el POST.
        header('Location: contacto.php?ok=1', true, 303);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Contacto</title></head>
<body>
<?php if ($ok): ?>
  <p>Mensaje registrado.</p>
<?php endif; ?>
<?php foreach ($errores as $error): ?>
  <p><?= h($error) ?></p>
<?php endforeach; ?>
<form method="post" action="contacto.php">
  <label>Nombre <input name="nombre" value="<?= h($nombre) ?>"></label>
  <label>Email <input name="email" type="email" value="<?= h($email) ?>"></label>
  <label>Mensaje <textarea name="mensaje"><?= h($mensaje) ?></textarea></label>
  <button type="submit">Enviar</button>
</form>
</body>
</html>
```

Los errores se pintan en el mismo POST (el usuario no pierde el formulario). El éxito sí redirige. CSRF y autenticación no están: el capítulo 6 cubre sesión/login; el 11, ataques más amplios. No envíes este script a producción como “el formulario de la empresa”.

## Errores habituales

- Confiar en `$_POST['campo']` sin `??` (Notice/Warning si falta).
- Escapar al guardar y no al mostrar, o al revés.
- Redirect sin `exit`: PHP sigue ejecutando y puede mandar más cuerpo.
- Usar GET para borrar o pagar (`/borrar?id=1` en un `<a>`).

## Buenas prácticas

- Un método, un propósito; POST cambia estado.
- Listas de `$errores`; no un `echo` suelto con HTML crudo del usuario.
- `mb_strlen` si limitas caracteres (bytes ≠ grafemas).
- Frameworks rellenan esto con componentes; las reglas son las mismas.

## Ejercicio

1. Arranca `php -S localhost:8080` y envía el formulario vacío; luego con un email mal formado.
2. Quita `h()` en el `value` del nombre, envía `<b>x</b>` y mira el HTML resultante. Vuelve a poner `h()`.
3. Añade un campo opcional `telefono` que, si viene, deba coincidir con `/^\d{9}$/`.

## Siguiente paso

Continúa con [Sesiones, cookies y autenticación básica](06-sesiones-cookies-y-autenticacion-basica.md).

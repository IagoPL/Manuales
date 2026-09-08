# Errores, excepciones y logging

PHP distingue avisos del motor, excepciones que *tú* lanzas, y fallos de negocio (“esa nota no existe”). Tratarlos igual —o tragárselos— deja la app muda o el usuario viendo un stack trace.

Documentación oficial: [errores](https://www.php.net/manual/es/errorfunc.constants.php), [excepciones](https://www.php.net/manual/es/language.exceptions.php), [error_log](https://www.php.net/manual/es/function.error-log.php), [PDOException](https://www.php.net/manual/es/class.pdoexception.php).

## Error, warning, excepción, negocio

| Qué | Ejemplo | Qué hacer |
| --- | --- | --- |
| **Notice / Warning** | `file_get_contents` de un path que no existe (según config) | No ignores el `false`; en PHP 8 muchos casos ya son `Error`/`ValueError`. |
| **Error / TypeError** | Pasar `null` a `int` con `strict_types` | Fallo de programación: no lo “gestiones” con un `catch` genérico en cada función. |
| **Excepción** | `PDOException`, `RuntimeException` al escribir disco | Recupera *si puedes*; si no, registra y falla hacia arriba. |
| **Negocio** | `NotaNoEncontrada` | Respuesta 404 o mensaje de formulario; no es un bug del servidor. |

Un `throw` interrumpe. Un `return null` en `porId` (capítulo 9) es un “no hay fila”, no una excepción, salvo que el contrato diga lo contrario.

## try / catch / finally / throw

```php
<?php

declare(strict_types=1);

final class NotaNoEncontrada extends RuntimeException
{
}

function notaOFallo(NotaRepositorio $repo, int $id): Nota
{
    $nota = $repo->porId($id);
    if ($nota === null) {
        throw new NotaNoEncontrada('id ' . $id);
    }

    return $nota;
}

// Fragmento: $repo es un NotaRepositorio (cap. 9); $id viene validado (int).
try {
    $nota = notaOFallo($repo, $id);
} catch (NotaNoEncontrada $e) {
    http_response_code(404);
    echo 'No existe';
} catch (PDOException $e) {
    error_log('pdo notas: ' . $e->getMessage());
    http_response_code(500);
    echo 'No se pudo cargar';
} finally {
    // Cerrar un handle si lo abriste a mano. El PDO suele vivir toda la petición.
}
```

`finally` corre tanto si hubo `return` como si hubo excepción.

**No** hagas esto:

```php
try {
    $repo->guardar($titulo, $cuerpo);
} catch (Throwable $e) {
    // ignorar
}
```

El usuario cree que guardó; tú no tienes pista. Si capturas `Throwable`, registra y relanza, o convierte a una respuesta HTTP consciente. Atrapar para “que no pete la página” sin log es borrar evidencia.

## Logging

`error_log()` escribe donde diga `error_log` en php.ini (syslog, fichero). Es el mínimo del lenguaje. En un proyecto real acabarás con Monolog u otro canal (stdout del contenedor, servicio): el **criterio** no cambia.

- Contexto útil: id de nota, ruta *sanitizada*, código SQL **sin** bind de contraseñas.
- Nunca loguees `$_POST['password']`, cookies de sesión, tokens CSRF, DSN con password.
- En producción: `display_errors=0`. El HTML muestra un mensaje corto; el detalle va al log.

```php
<?php

error_log(sprintf('nota.create failed user=%s', $_SESSION['user'] ?? 'anon'));
```

No concatenes el cuerpo de la nota si puede tener PII; un id basta.

## Producción frente a desarrollo

| | Desarrollo | Producción |
| --- | --- | --- |
| `display_errors` | On (tú eres el único usuario) | Off |
| Stack trace | En pantalla o Xdebug | Solo log |
| Mensaje al usuario | Puede ser técnico | Genérico (“inténtalo más tarde”) |

`ini_set('display_errors', '1')` en un fichero público de producción es un incidente. El capítulo 12 pondrá el front controller detrás de `public/`; los logs, fuera.

## Errores habituales

- `catch (Exception $e) { echo $e; }` en la web.
- Un único `catch (Throwable)` en `index.php` que oculta `NotaNoEncontrada` y `TypeError` por igual.
- Log del SQL interpolado (además de ser inyectable, filtra datos).

## Buenas prácticas

- Excepciones de dominio para lo esperado; `PDOException` hacia un handler.
- Relanzar (`throw $e`) si no puedes resolver.
- Un canal de log por entorno (env `LOG_PATH`), no `chmod 777` a `php.log` en `public/`.

## Ejercicio

1. Lanza `NotaNoEncontrada` y captura solo esa clase; deja que un `TypeError` suba.
2. Añade `error_log` en el `catch` de PDO **sin** imprimir el mensaje al HTML.
3. Activa y desactiva `display_errors` y compara qué ve el navegador.

## Siguiente paso

Continúa con [Seguridad en PHP puro](11-seguridad-en-php-puro.md).

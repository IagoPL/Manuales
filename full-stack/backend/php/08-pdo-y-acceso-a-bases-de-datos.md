# PDO y acceso a bases de datos

El capítulo 7 persiste en ficheros. Cuando hay filas, filtros y varios procesos, entra una base de datos. **PDO** (PHP Data Objects) es una capa de acceso: mismo estilo de API para SQLite, MySQL, PostgreSQL… No es un ORM: escribes SQL.

Documentación oficial: [PDO](https://www.php.net/manual/es/book.pdo.php), [conexiones](https://www.php.net/manual/es/pdo.connections.php), [consultas preparadas](https://www.php.net/manual/es/pdo.prepared-statements.php), [inyección SQL](https://www.php.net/manual/es/security.database.sql-injection.php).

## DSN, conexión y atributos

El **DSN** dice motor + dónde está la base. Credenciales **no** van en el repo: `getenv()` (o un fichero de config **fuera** de `public/` que no commiteas).

```php
<?php

declare(strict_types=1);

$dsn = getenv('NOTAS_DSN') ?: ('sqlite:' . dirname(__DIR__) . '/data/notas.sqlite');

$pdo = new PDO(
    $dsn,
    getenv('NOTAS_DB_USER') ?: null,
    getenv('NOTAS_DB_PASS') ?: null,
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ],
);
```

SQLite no usa user/pass; el DSN es un path. MySQL sería `mysql:host=127.0.0.1;dbname=notas;charset=utf8mb4`.

`PDO::ERRMODE_EXCEPTION` convierte fallos SQL en `PDOException`. Sin eso, muchos métodos devuelven `false` y es fácil seguir como si nada.

## Prepared statements ≠ escapar SQL a mano

Esto **no** es aceptable:

```php
$sql = "SELECT * FROM notas WHERE email = '$email'";
```

El atacante pone `email` = `' OR 1=1 --` y cambia el significado del SQL. Escapar comillas a mano (`addslashes`, concatenar) es frágil (encoding, LIKE, identificadores).

Una **consulta preparada** separa el SQL de los datos: placeholders (`:email` o `?`). El motor (o el driver) envía los valores aparte.

```php
<?php

declare(strict_types=1);

$stmt = $pdo->prepare('SELECT id, titulo, cuerpo FROM notas WHERE id = :id');
$stmt->execute(['id' => $id]);
$fila = $stmt->fetch();
```

`prepare` + `execute` con array (o `bindValue`) es el patrón. Los placeholders **solo** sustituyen literales (valores). Un `ORDER BY` dinámico no se “bindea”: filtra contra una lista blanca de columnas.

INSERT:

```php
$stmt = $pdo->prepare(
    'INSERT INTO notas (titulo, cuerpo) VALUES (:titulo, :cuerpo)',
);
$stmt->execute([
    'titulo' => $titulo,
    'cuerpo' => $cuerpo,
]);
$id = (int) $pdo->lastInsertId();
```

No mezcles HTML y SQL en el mismo bloque: el repositorio devuelve arrays/objetos (capítulo 9); la plantilla escapa (capítulos 5 y 11).

## Transacciones

Varias escrituras que deben ir todas o ninguna:

```php
<?php

$pdo->beginTransaction();
try {
    $pdo->prepare('INSERT INTO notas (titulo, cuerpo) VALUES (?, ?)')
        ->execute([$titulo, $cuerpo]);
    $pdo->prepare('INSERT INTO auditoria (accion) VALUES (?)')
        ->execute(['alta']);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}
```

Si capturas y no relanzas, el llamador cree que guardó. El capítulo 10 cubre *qué* registrar.

## Errores habituales

- Concatenar `$_GET` en el SQL.
- Un único usuario de BD con privilegios de `DROP` para la app.
- Mostrar `$e->getMessage()` de PDO al navegador (dsn, tablas).
- `ATTR_EMULATE_PREPARES` y asumir que “ya está preparado” en todos los drivers: el placeholder sigue siendo obligatorio; no vuelvas a interpolar.

## Buenas prácticas

- Un `PDO` por petición (o un wrapper), no `new PDO` en cada método.
- `charset=utf8mb4` en MySQL/MariaDB.
- Consultas concretas (`id, titulo`), no `SELECT *` por costumbre.
- El esquema (CREATE TABLE) vive en migraciones o un script; no lo inventes en el HTML.

## Ejercicio

1. Crea una tabla `notas` en SQLite y un SELECT por `:id`.
2. Reproduce (en local, tabla de juguete) la consulta interpolada con `email = ' OR 1=1 --` y compara con el `prepare`.
3. Envuelve dos INSERT en una transacción y fuerza un error en el segundo: la primera fila no debe quedar.

## Siguiente paso

Continúa con [Programación orientada a objetos en PHP](09-programacion-orientada-a-objetos-en-php.md).

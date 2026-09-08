# Programación orientada a objetos en PHP

Hasta aquí funciones y arrays. Una **clase** agrupa datos y operaciones con un contrato (tipos, visibilidad). No hace falta un árbol de herencia para un CRUD de notas: **composición** (un repositorio *tiene* un `PDO`) suele bastar.

Documentación oficial: [clases y objetos](https://www.php.net/manual/es/language.oop5.php), [visibilidad](https://www.php.net/manual/es/language.oop5.visibility.php), [constructores](https://www.php.net/manual/es/language.oop5.decon.php), [interfaces](https://www.php.net/manual/es/language.oop5.interfaces.php), [readonly](https://www.php.net/manual/es/language.oop5.properties.php#language.oop5.properties.readonly-properties) (PHP 8.1).

## Clase, instancia, constructor

```php
<?php

declare(strict_types=1);

final class Nota
{
    public function __construct(
        public readonly int $id,
        public readonly string $titulo,
        public readonly string $cuerpo,
    ) {
    }
}

$nota = new Nota(1, 'Lista', 'Leche y pan');
echo $nota->titulo, "\n";
```

`new` crea la **instancia**. Las propiedades `public readonly` (8.1) se asignan en el constructor y no se reasignan: un objeto-valor. `final` impide `class NotaHija extends Nota` — útil cuando no hay un motivo real para heredar.

Visibilidad: `public` (fuera), `protected` (clase + hijas), `private` (solo esta clase). Por defecto, sin palabra, un método es público; en propiedades modernas **declara** `private` o `public`.

## Tipos y métodos

```php
<?php

declare(strict_types=1);

final class Nota
{
    public function __construct(
        public readonly int $id,
        public readonly string $titulo,
        public readonly string $cuerpo,
    ) {
    }

    public function resumen(int $max = 40): string
    {
        if (mb_strlen($this->cuerpo) <= $max) {
            return $this->cuerpo;
        }

        return mb_substr($this->cuerpo, 0, $max) . '…';
    }
}
```

El tipo del parámetro y del retorno es el mismo contrato que en funciones (capítulo 2–3). `$this` es la instancia.

## Interfaz y composición

El HTML no debe saber si las notas viven en SQLite o en un fichero (capítulo 7). Una **interfaz** nombra el contrato; la implementación **usa** PDO, no *es* un PDO.

```php
<?php

declare(strict_types=1);

interface NotaRepositorio
{
    public function porId(int $id): ?Nota;

    public function guardar(string $titulo, string $cuerpo): int;
}

final class NotaRepositorioPdo implements NotaRepositorio
{
    public function __construct(private PDO $pdo)
    {
    }

    public function porId(int $id): ?Nota
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, titulo, cuerpo FROM notas WHERE id = :id',
        );
        $stmt->execute(['id' => $id]);
        $fila = $stmt->fetch();
        if ($fila === false) {
            return null;
        }

        return new Nota((int) $fila['id'], $fila['titulo'], $fila['cuerpo']);
    }

    public function guardar(string $titulo, string $cuerpo): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO notas (titulo, cuerpo) VALUES (:titulo, :cuerpo)',
        );
        $stmt->execute(['titulo' => $titulo, 'cuerpo' => $cuerpo]);

        return (int) $this->pdo->lastInsertId();
    }
}
```

Herencia (`extends`) tiene sentido para *es-un* real (p. ej. una excepción concreta). Una `class MysqlNota extends PDO` mezcla infraestructura y dominio: evítalo. Si mañana hay `NotaRepositorioArchivo`, el controlador sigue pidiendo `NotaRepositorio`.

Esto no es DDD: es separar “cómo se guarda” de “qué es una nota”. El ensamblaje (quién hace `new PDO` y `new NotaRepositorioPdo`) está en el [capítulo 12](12-proyecto-final-con-arquitectura-simple.md).

## Errores habituales

- Getters/setters vacíos para cada campo “porque OOP”.
- Jerarquías `BaseManager` → `NotaManager` → `NotaManagerEspecial` sin comportamiento extra.
- Propiedades `public` mutables que cualquier script pisa.
- Meter `echo` HTML dentro del repositorio.

## Buenas prácticas

- Una clase, una razón de cambio.
- Tipado en constructor y métodos; `declare(strict_types=1)`.
- Interfaces estrechas (`porId`, `guardar`), no un “God repository”.
- Hereda excepciones o DTOs si aporta; no copies un framework de capas.

## Ejercicio

1. Instancia una `Nota` y llama a `resumen(10)`.
2. Escribe un `NotaRepositorio` falso en un array (sin PDO) que cumpla la interfaz.
3. Marca una clase `final` e intenta extenderla: lee el error.

## Siguiente paso

Continúa con [Errores, excepciones y logging](10-errores-excepciones-y-logging.md).

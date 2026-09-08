# Sintaxis básica y tipos de datos

El capítulo 1 deja un `echo`. Aquí: **qué puede guardar una variable** y cómo PHP decide el tipo. PHP es de **tipado dinámico**: el tipo vive en el valor, no en el nombre de la variable. Eso no impide declarar tipos en funciones (y activar comprobación estricta).

Documentación oficial: [tipos](https://www.php.net/manual/es/language.types.php), [declaraciones de tipo](https://www.php.net/manual/es/language.types.declarations.php), [declare](https://www.php.net/manual/es/control-structures.declare.php), [operadores de comparación](https://www.php.net/manual/es/language.operators.comparison.php).

## Variables y escalares

Los nombres empiezan por `$`. Distingue mayúsculas. No hace falta declarar el tipo al asignar:

```php
<?php

$titulo = 'Pedido #42';   // string
$unidades = 3;            // int
$precio = 12.5;           // float
$pagado = false;          // bool
$notas = null;            // null: “no hay valor”
```

`null` no es `''` ni `0`. Un `if ($notas)` trata `null`, `0`, `''` y `[]` como falsy: por eso más abajo usamos `===`.

Arrays (introducción; el detalle es el [capítulo 4](04-arrays-y-manejo-de-datos.md)):

```php
$etiquetas = ['urgente', 'b2b'];           // indexado 0, 1, …
$cliente = ['nombre' => 'Ana', 'id' => 7]; // asociativo
```

## Strings: concatenar e interpolar

- Comillas dobles interpolan `$var` y secuencias como `\n`.
- Comillas simples no interpolan: `'Hola, $titulo'` sale literal.
- Concatenación: `.`

```php
<?php

$nombre = 'Iago';
$linea = "Hola, $nombre\n";
$otra = 'Hola, ' . $nombre . "\n";
```

## Comparación estricta

`==` convierte tipos (`0 == '0'` es true). `===` exige mismo tipo y valor.

```php
<?php

var_dump(0 == '0');   // true
var_dump(0 === '0');  // false
var_dump(null ?? 'x'); // 'x'  — solo si el izquierdo es null
```

`??` (null coalescing) no captura `0` ni `''`: esos no son `null`. Útil para “si no vino este valor, usa el default”: `$unidades = $pedido['unidades'] ?? 1;`

## Type declarations y `strict_types`

Puedes anotar parámetros y retorno (`int`, `string`, `bool`, `float`, `array`, `?string`, uniones `int|string` en PHP 8). **Por defecto PHP coerce**: `suma(1.9, 2)` con `int` puede truncar a enteros.

`declare(strict_types=1);` debe ser **la primera sentencia** del fichero. Activa el modo estricto para las **llamadas hechas desde ese fichero**: si pasas un float donde se pide `int`, hay `TypeError`. No convierte PHP en un lenguaje estáticamente tipado: el análisis sigue siendo en runtime, no hay compilador que rechace el proyecto entero, y las llamadas desde un fichero *sin* `strict_types` siguen coercing.

```php
<?php

declare(strict_types=1);

function precioLinea(int $unidades, float $precio): float
{
    return $unidades * $precio;
}

echo precioLinea(3, 12.5), "\n";
// precioLinea(3.2, 12.5); // TypeError en este fichero
```

Usa `bool` / `int` / `float` / `string`, no los alias `boolean` o `integer` en declaraciones: PHP los trata como nombres de clase.

## Errores habituales

- Confiar en `==` con strings que parecen números.
- Pensar que `strict_types` “congela” todas las variables del proceso.
- Interpolación en comillas simples y preguntarse por qué no sale el valor.
- Usar `null` y `''` como si fueran lo mismo en un formulario (capítulo 5).

## Buenas prácticas

- `===` y `!==` por defecto; `==` solo con motivo.
- `declare(strict_types=1);` en ficheros nuevos con funciones tipadas.
- Nombres que dicen qué es (`$precioEuros`, no `$p`).
- Los arrays profundos esperan al capítulo 4; aquí basta con leer una clave.

## Ejercicio

1. Ejecuta `precioLinea` con `strict_types` y sin él (quita el `declare`) pasando `3.9` como unidades. Anota la diferencia.
2. Compara `'0'` con `0` usando `==` y `===`.
3. Usa `??` con un array que no tiene la clave `notas`.

## Siguiente paso

Continúa con [Control de flujo y funciones](03-control-de-flujo-y-funciones.md).

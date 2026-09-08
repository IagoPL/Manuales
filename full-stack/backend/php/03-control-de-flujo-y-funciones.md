# Control de flujo y funciones

Con tipos del capítulo 2, el siguiente paso es **decidir** (`if`, `match`) e **iterar**, y agrupar lógica en funciones con tipos. No es un catálogo de cada bucle: un ejemplo de pedidos en memoria basta para ver el patrón.

Documentación oficial: [if](https://www.php.net/manual/es/control-structures.if.php), [match](https://www.php.net/manual/es/control-structures.match.php) (PHP 8), [foreach](https://www.php.net/manual/es/control-structures.foreach.php), [funciones](https://www.php.net/manual/es/language.functions.php), [argumentos nombrados](https://www.php.net/manual/es/functions.arguments.php).

## Condiciones

```php
<?php

declare(strict_types=1);

$unidades = 4;

if ($unidades <= 0) {
    $estado = 'invalido';
} elseif ($unidades < 10) {
    $estado = 'stock-ok';
} else {
    $estado = 'revisar-almacen';
}
```

`match` es una **expresión** (devuelve valor), compara con `===` y no hace *fall-through* como `switch`. Tiene que ser exhaustivo (`default` o todos los casos):

```php
$iva = match ($estado) {
    'stock-ok' => 0.21,
    'revisar-almacen' => 0.21,
    'invalido' => 0.0,
    default => throw new InvalidArgumentException($estado),
};
```

Úsalo cuando mapeas un valor a otro. Para rangos con varias sentencias, `if` sigue siendo más claro.

## Bucles

- `foreach` es el habitual sobre arrays (capítulo 4).
- `for` cuando tienes índice numérico y un tope.
- `while` cuando la condición no es “N elementos”, sino “hasta que pase X”.

```php
<?php

$lineas = [
    ['sku' => 'CAM-01', 'unidades' => 2, 'precio' => 19.9],
    ['sku' => 'PANT-02', 'unidades' => 1, 'precio' => 39.0],
];

$total = 0.0;
foreach ($lineas as $linea) {
    $total += $linea['unidades'] * $linea['precio'];
}
```

## Funciones tipadas

Parámetros y retorno se anotan igual que en el capítulo 2. Los opcionales van **después** de los obligatorios. Los argumentos nombrados (PHP 8) evitan huecos `null` intermedios:

```php
<?php

declare(strict_types=1);

function importeLinea(int $unidades, float $precio, float $descuento = 0.0): float
{
    $bruto = $unidades * $precio;
    return $bruto * (1 - $descuento);
}

$a = importeLinea(2, 19.9);
$b = importeLinea(unidades: 1, precio: 39.0, descuento: 0.1);
```

Funciones flecha (`fn`, PHP 7.4): una expresión, capturan variables del exterior por valor. Sirven para callbacks cortos (`array_map` en el capítulo 4), no para sustituir funciones de varias líneas.

```php
$conIva = fn (float $neto): float => $neto * 1.21;
echo $conIva($a), "\n";
```

Ejemplo que procesa las líneas (mismo fichero que `importeLinea`):

```php
<?php

declare(strict_types=1);

$lineas = [
    ['sku' => 'CAM-01', 'unidades' => 2, 'precio' => 19.9],
    ['sku' => 'PANT-02', 'unidades' => 1, 'precio' => 39.0],
];

function importeLinea(int $unidades, float $precio, float $descuento = 0.0): float
{
    $bruto = $unidades * $precio;
    return $bruto * (1 - $descuento);
}

function totalPedido(array $lineas, float $descuento = 0.0): float
{
    $suma = 0.0;
    foreach ($lineas as $linea) {
        $suma += importeLinea($linea['unidades'], $linea['precio']);
    }

    return $suma * (1 - $descuento);
}

echo totalPedido($lineas), "\n";
```

El array no está tipado en runtime: las claves `sku` / `unidades` / `precio` las garantiza tu código (objetos en el capítulo 9).

## Errores habituales

- `switch` con `==` y un `case '0'` que captura `0` entero; `match` no tiene ese problema.
- Parámetros opcionales *antes* de los obligatorios.
- Funciones que solo hacen `echo` y no devuelven nada: peor de probar. Devuelve; el `echo` queda en el borde (CLI o plantilla).
- Recursión o `while (true)` sin salida.

## Buenas prácticas

- Una función, una pregunta (`totalPedido`, no `procesarTodo`).
- `declare(strict_types=1)` en ficheros con firmas.
- `match` + `default` que falle alto si llega un estado imposible.
- El detalle de transformar listas enteras (`array_map`) es el capítulo 4.

## Ejercicio

1. Añade una línea al array `$lineas` y recalcula `totalPedido`.
2. Sustituye el `if` de `$estado` por un `match` sobre `$unidades` (elige umbrales).
3. Llama `importeLinea` solo con argumentos nombrados.

## Siguiente paso

Continúa con [Arrays y manejo de datos](04-arrays-y-manejo-de-datos.md).

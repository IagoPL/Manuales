# Arrays y manejo de datos

En PHP el array es la estructura de datos cotidiana: lista indexada **o** mapa clave → valor. El capítulo 2 solo los nombró; aquí se recorre, se muta y se transforma. Sigue el ejemplo de **líneas de pedido**.

Documentación oficial: [arrays](https://www.php.net/manual/es/language.types.array.php), [array_map](https://www.php.net/manual/es/function.array-map.php), [array_filter](https://www.php.net/manual/es/function.array-filter.php), [array_reduce](https://www.php.net/manual/es/function.array-reduce.php), [ordenación](https://www.php.net/manual/es/array.sorting.php).

## Indexados y asociativos

```php
<?php

$skus = ['CAM-01', 'PANT-02', 'ZAP-03']; // 0, 1, 2

$linea = [
    'sku' => 'CAM-01',
    'unidades' => 2,
    'precio' => 19.9,
];

echo $skus[0], "\n";
echo $linea['sku'], "\n";
```

Mezclar ambos en el mismo array es legal y casi siempre una mala idea. Acceder a una clave que no existe avisa (`Warning`) y produce `null`; con `??` evitas el aviso: `$linea['descuento'] ?? 0`.

## Añadir, quitar, recorrer

```php
<?php

$pedido = [
    ['sku' => 'CAM-01', 'unidades' => 2, 'precio' => 19.9],
    ['sku' => 'PANT-02', 'unidades' => 1, 'precio' => 39.0],
];

$pedido[] = ['sku' => 'ZAP-03', 'unidades' => 1, 'precio' => 54.5]; // al final
$pedido[0]['unidades'] = 3;
unset($pedido[1]); // el índice 1 desaparece; no “compacta”

foreach ($pedido as $i => $linea) {
    echo $i, ' ', $linea['sku'], "\n";
}
```

`unset` no reindexa. Si necesitas 0..n consecutivos: `array_values($pedido)`.

## Ordenar

Las `sort` / `asort` / `ksort` (y sus primas `r*`) mutan el array. `asort` mantiene claves y ordena por valor; `ksort` por clave. Para una lista de líneas, suele ser más claro `usort`:

```php
<?php

usort($pedido, function (array $a, array $b): int {
    return $a['sku'] <=> $b['sku'];
});
```

`<=>` (nave) devuelve -1, 0 o 1. `usort` reindexa.

## Transformar: foreach frente a map/filter/reduce

| Herramienta | Cuándo |
| --- | --- |
| `foreach` | Varios pasos, early `break`, o mutar con claridad. |
| `array_map` | Una función pura: cada elemento → otro. |
| `array_filter` | Quedarte un subconjunto. El callback `false` descarta. |
| `array_reduce` | Acumular un único resultado (total, string, otro array). |

`foreach` no es “menos PHP 8”. Las funciones de array brillan cuando el callback cabe en una línea y no necesitas el índice para otra estructura.

```php
<?php

declare(strict_types=1);

$pedido = [
    ['sku' => 'CAM-01', 'unidades' => 2, 'precio' => 19.9],
    ['sku' => 'PANT-02', 'unidades' => 0, 'precio' => 39.0],
    ['sku' => 'ZAP-03', 'unidades' => 1, 'precio' => 54.5],
];

$conStock = array_filter(
    $pedido,
    fn (array $l): bool => $l['unidades'] > 0,
);

$importes = array_map(
    fn (array $l): float => $l['unidades'] * $l['precio'],
    $conStock,
);

$total = array_reduce(
    $importes,
    fn (float $acc, float $n): float => $acc + $n,
    0.0,
);

echo $total, "\n";
```

`array_filter` **conserva claves**. Si luego haces `json_encode` de una lista, reindexa con `array_values($conStock)` o el JSON saldrá objeto (`{"0":..., "2":...}`).

Equivalente con `foreach` (mejor si mañana añades logs o varias acumulaciones):

```php
$total = 0.0;
foreach ($pedido as $linea) {
    if ($linea['unidades'] <= 0) {
        continue;
    }
    $total += $linea['unidades'] * $linea['precio'];
}
```

## Errores habituales

- Asumir que `foreach` por valor te deja mutar el array original (`foreach ($pedido as &$linea)` es fácil de olvidar el `&` y de dejar la referencia viva: si lo usas, `unset($linea)` después).
- `array_filter` sin `array_values` y un JSON inesperado.
- `sort()` sobre una lista asociativa y perder las claves que te importaban (`asort` / `usort`).
- Copiar el snippet `$data = ['id' => 1, 'name' => 'Ejemplo']` como “modelo de dominio”.

## Buenas prácticas

- Un shape estable: mismas claves en cada línea.
- Transformaciones puras cuando encadenas map/filter; `foreach` cuando hay reglas de negocio raras.
- No uses arrays como “base de datos”: persistir es [PDO](08-pdo-y-acceso-a-bases-de-datos.md) o ficheros ([capítulo 7](07-trabajo-con-archivos.md)).

## Ejercicio

1. Filtra las líneas con `precio >= 20` y calcula el total.
2. Ordena `$pedido` por `unidades` descendente.
3. Reescribe el `array_map` + `reduce` con un solo `foreach` y compara legibilidad.

## Siguiente paso

Continúa con [Formularios y peticiones HTTP](05-formularios-y-peticiones-http.md).

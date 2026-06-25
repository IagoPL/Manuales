# Programacion funcional

Python permite usar ideas funcionales: funciones puras, transformaciones, inmutabilidad parcial y funciones como valores.

## Funciones como valores

```python
def double(x: int) -> int:
    return x * 2


operation = double
print(operation(4))
```

## map filter y reduce

Aunque existen, en Python suelen preferirse comprensiones cuando son mas legibles.

```python
numbers = [1, 2, 3, 4]
squares = list(map(lambda x: x * x, numbers))
```

Equivalente mas idiomatico:

```python
squares = [x * x for x in numbers]
```

Filtrar:

```python
even = [x for x in numbers if x % 2 == 0]
```

## sorted con key

```python
users = [
    {"name": "Ana", "age": 30},
    {"name": "Luis", "age": 24},
]

by_age = sorted(users, key=lambda user: user["age"])
```

## functools

```python
from functools import partial


def multiply(a: int, b: int) -> int:
    return a * b


double = partial(multiply, 2)
```

## Generadores

Los generadores producen valores bajo demanda.

```python
def read_lines(lines: list[str]):
    for line in lines:
        yield line.strip()
```

## Buenas practicas

- Prefiere funciones puras para reglas de negocio.
- Usa comprensiones si mejoran legibilidad.
- No abuses de lambdas complejas.
- Usa generadores para flujos grandes.

## Errores comunes

- Encadenar `map`, `filter` y lambdas hasta volver el codigo opaco.
- Modificar estructuras compartidas dentro de funciones que parecen puras.
- Convertir generadores a lista sin controlar tamaño.

## Ejercicio

Dada una lista de pedidos, crea funciones puras para filtrar pedidos validos, calcular total y ordenar por fecha.

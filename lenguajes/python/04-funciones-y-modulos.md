# Funciones y modulos

Las funciones permiten encapsular comportamiento y los modulos permiten organizar codigo en archivos reutilizables.

## Definir funciones

```python
def greet(name: str) -> str:
    return f"Hola, {name}"
```

Parametros con valor por defecto:

```python
def create_user(name: str, active: bool = True) -> dict:
    return {"name": name, "active": active}
```

## Argumentos variables

```python
def total(*numbers: float) -> float:
    return sum(numbers)
```

```python
def build_user(**fields) -> dict:
    return fields
```

## Scope

```python
tax = 0.21

def price_with_tax(price: float) -> float:
    return price * (1 + tax)
```

Evita modificar variables globales desde funciones salvo que haya una razon clara.

## Modulos

Archivo `math_utils.py`:

```python
def add(a: int, b: int) -> int:
    return a + b
```

Uso:

```python
from math_utils import add

print(add(2, 3))
```

## Paquetes

Estructura:

```txt
app/
  __init__.py
  services.py
  repositories.py
```

Import relativo dentro del paquete:

```python
from .repositories import UserRepository
```

## Buenas practicas

- Una funcion debe hacer una cosa clara.
- Prefiere devolver valores a imprimir desde todas partes.
- Usa anotaciones de tipo en funciones publicas.
- Evita funciones con demasiados parametros.
- Agrupa modulos por responsabilidad, no por tipo generico.

## Errores comunes

- Ejecutar codigo al importar un modulo sin protegerlo.
- Crear dependencias circulares entre modulos.
- Usar nombres de archivo como `random.py` o `json.py`.

## Ejercicio

Crea un modulo `calculator.py` con funciones `add`, `subtract`, `multiply` y `divide`. Importalas desde `main.py` y valida division por cero.

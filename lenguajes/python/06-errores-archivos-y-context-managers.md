# Errores archivos y context managers

Python usa excepciones para representar errores. Tambien ofrece context managers para gestionar recursos como archivos, conexiones o bloqueos.

## Capturar excepciones

```python
try:
    value = int("abc")
except ValueError:
    print("No es un numero valido")
```

Captura excepciones concretas:

```python
try:
    result = 10 / divisor
except ZeroDivisionError:
    result = 0
```

## Lanzar excepciones

```python
def withdraw(balance: float, amount: float) -> float:
    if amount < 0:
        raise ValueError("amount must be positive")
    if amount > balance:
        raise ValueError("insufficient balance")
    return balance - amount
```

## finally

```python
try:
    process()
finally:
    cleanup()
```

## Archivos

Usa `with` para cerrar archivos automaticamente:

```python
with open("data.txt", "r", encoding="utf-8") as file:
    content = file.read()
```

Escritura:

```python
with open("output.txt", "w", encoding="utf-8") as file:
    file.write("resultado")
```

## CSV y JSON

```python
import csv

with open("users.csv", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row["name"])
```

```python
import json

with open("config.json", encoding="utf-8") as file:
    config = json.load(file)
```

## Crear un context manager

```python
from contextlib import contextmanager


@contextmanager
def section(name: str):
    print(f"start {name}")
    try:
        yield
    finally:
        print(f"end {name}")
```

## Buenas practicas

- Captura excepciones especificas.
- No escondas errores con `except Exception: pass`.
- Usa `with` para recursos.
- Incluye contexto en mensajes de error.
- Separa validacion de manejo de errores.

## Ejercicio

Lee un archivo CSV de usuarios, valida que tenga email y guarda en JSON solo los usuarios validos.

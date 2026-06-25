# Programacion orientada a objetos

Python permite programacion orientada a objetos, pero no obliga a usarla para todo. Conviene crear clases cuando necesitas representar entidades con estado y comportamiento.

## Clase basica

```python
class User:
    def __init__(self, user_id: int, name: str) -> None:
        self.user_id = user_id
        self.name = name

    def greet(self) -> str:
        return f"Hola, soy {self.name}"


user = User(1, "Ana")
print(user.greet())
```

## Dataclasses

Para objetos de datos, `dataclass` reduce ruido.

```python
from dataclasses import dataclass


@dataclass
class Product:
    id: int
    name: str
    price: float
```

## Encapsulacion

Python no usa `private` estricto. Por convencion, un atributo con `_` es interno:

```python
class Counter:
    def __init__(self) -> None:
        self._value = 0

    def increment(self) -> None:
        self._value += 1
```

## Herencia

```python
class Animal:
    def speak(self) -> str:
        raise NotImplementedError


class Dog(Animal):
    def speak(self) -> str:
        return "Woof"
```

Usa herencia con moderacion. Muchas veces composicion es mas clara.

## Protocolos

Los protocolos permiten tipar por comportamiento.

```python
from typing import Protocol


class Notifier(Protocol):
    def send(self, message: str) -> None:
        ...
```

## Buenas practicas

- Usa clases para representar conceptos del dominio.
- Usa `dataclass` para datos simples.
- Evita jerarquias profundas.
- Prefiere composicion cuando solo quieres reutilizar comportamiento.
- Separa reglas de negocio de entrada/salida.

## Errores comunes

- Crear clases vacias solo por costumbre.
- Guardar demasiado estado mutable.
- Usar herencia para compartir dos lineas de codigo.
- Mezclar acceso a base de datos, validacion y presentacion en la misma clase.

## Ejercicio

Modela un carrito de compra con clases `Product`, `CartItem` y `Cart`. El carrito debe calcular el total.

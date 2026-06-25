# Colecciones y estructuras de datos

Python incluye estructuras muy expresivas para trabajar con grupos de valores.

## Listas

Las listas son colecciones ordenadas y mutables.

```python
names = ["Ana", "Luis", "Marta"]
names.append("Iago")
names[0] = "Andrea"

print(names[0])
print(len(names))
```

Recorrer:

```python
for name in names:
    print(name)
```

## Tuplas

Las tuplas son ordenadas e inmutables.

```python
point = (10, 20)
x, y = point
```

Son utiles para devolver varios valores:

```python
def min_max(numbers: list[int]) -> tuple[int, int]:
    return min(numbers), max(numbers)
```

## Diccionarios

Los diccionarios almacenan pares clave-valor.

```python
user = {
    "id": 1,
    "name": "Ana",
    "active": True,
}

print(user["name"])
print(user.get("email", "sin email"))
```

Recorrer:

```python
for key, value in user.items():
    print(key, value)
```

## Conjuntos

Los conjuntos eliminan duplicados y permiten operaciones matematicas.

```python
roles = {"admin", "editor", "admin"}
print(roles)
```

```python
a = {"python", "sql", "git"}
b = {"python", "docker"}

print(a & b)
print(a | b)
print(a - b)
```

## Comprensiones

```python
numbers = [1, 2, 3, 4]
squares = [number ** 2 for number in numbers]
```

```python
active_users = {
    user["id"]: user
    for user in users
    if user["active"]
}
```

## Buenas practicas

- Usa listas para secuencias ordenadas.
- Usa diccionarios para acceder por clave.
- Usa sets para deduplicar o comparar pertenencia.
- Evita modificar una lista mientras la recorres.

## Errores comunes

- Acceder a una clave que no existe con `dict["clave"]`.
- Usar listas para busquedas frecuentes cuando un `set` seria mejor.
- Confundir mutabilidad de listas con inmutabilidad de tuplas.

## Ejercicio

Dada una lista de pedidos con `id`, `country` y `amount`, calcula el total por pais usando un diccionario.

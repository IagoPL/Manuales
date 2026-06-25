# Fundamentos del lenguaje

Este capitulo cubre variables, tipos basicos, operadores y control de flujo.

## Variables

Python usa tipado dinamico: una variable referencia un valor y el tipo pertenece al valor.

```python
name = "Iago"
age = 25
is_active = True
price = 19.99
```

Aunque Python no obliga a declarar tipos, puedes usar anotaciones:

```python
name: str = "Iago"
age: int = 25
```

## Tipos basicos

- `str`: texto.
- `int`: enteros.
- `float`: decimales.
- `bool`: verdadero o falso.
- `None`: ausencia de valor.

```python
message = "Hola"
count = 10
ratio = 0.75
enabled = False
result = None
```

## Operadores

```python
a = 10
b = 3

print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a // b)
print(a % b)
print(a ** b)
```

Comparaciones:

```python
age = 20
print(age >= 18)
print(age == 20)
print(age != 30)
```

Logica:

```python
is_admin = True
is_active = False

can_access = is_admin and not is_active
```

## Condicionales

```python
score = 8

if score >= 9:
    print("Excelente")
elif score >= 5:
    print("Aprobado")
else:
    print("Suspenso")
```

## Bucles

```python
for number in range(5):
    print(number)
```

```python
counter = 0

while counter < 5:
    print(counter)
    counter += 1
```

## Entrada y salida

```python
name = input("Nombre: ")
print(f"Hola, {name}")
```

## Buenas practicas

- Usa `f-strings` para construir texto.
- Evita comparar booleanos con `== True`.
- Mantén bloques pequeños y claros.
- Convierte entradas de usuario explicitamente.

## Errores comunes

- Olvidar la indentacion.
- Mezclar strings y numeros sin convertir.
- Usar `=` cuando querias comparar con `==`.
- Crear bucles `while` sin condicion de salida.

## Ejercicio

Crea un programa que pida una nota de 0 a 10 y muestre:

- `Excelente` si es 9 o mas.
- `Aprobado` si es 5 o mas.
- `Suspenso` en el resto.

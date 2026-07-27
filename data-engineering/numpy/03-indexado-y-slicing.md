# Indexado y slicing

El indexado de NumPy parece el de listas, pero anade indices multidimensionales, mascaras booleanas e indexado fancy. Ademas, muchos slices son **vistas**: mutarlos muta el array original.

## Basico

```python
import numpy as np

a = np.arange(10)
a[0], a[-1]
a[2:7]
a[::2]
a[:5] = 0          # modifica a
```

## 2D

```python
m = np.arange(12).reshape(3, 4)
m[1, 2]            # elemento
m[0:2, 1:3]        # submatriz
m[:, 0]            # primera columna
m[1, :]            # segunda fila
```

## Vistas vs copias

```python
m = np.arange(6).reshape(2, 3)
v = m[0, :]        # vista
v[:] = 99
print(m)           # la primera fila cambio

c = m[0, :].copy()
c[:] = 0
print(m)           # intacto
```

Regla: si vas a modificar un recorte y no quieres side effects, `.copy()`.

## Mascaras booleanas

```python
a = np.array([3, 1, 4, 1, 5, 9])
a[a > 3]
a[a > 3] = 0
```

Combinaciones:

```python
mask = (a >= 1) & (a <= 5)
a[mask]
```

Usa `& | ~` con parentesis; `and`/`or` de Python no funcionan elemento a elemento.

## Fancy indexing

```python
a = np.array([10, 20, 30, 40])
a[[0, 2, 3]]
m = np.arange(12).reshape(3, 4)
m[[0, 2], :]
```

Fancy indexing suele devolver **copia**, no vista.

## np.where

```python
a = np.array([3, -1, 2, -4])
np.where(a >= 0, a, 0)       # clip negativo a 0
idx = np.where(a < 0)        # indices
```

## Errores habituales

- Modificar una vista y corromper el dataset original.
- Indexar con `and` en vez de `&`.
- Asumir que `m[0]` y `m[0, :]` siempre copian.

## Buenas practicas

- Filtra con mascaras en vez de bucles.
- Documenta cuando una funcion devuelve vista.
- Para asignaciones complejas, prefiere `np.where` o mascaras claras.

## Ejercicio

1. Dado `arange(16).reshape(4, 4)`, extrae el bloque central 2x2.
2. Pon a `-1` todos los pares con mascara.
3. Demuestra una vista mutando un slice y una copia segura.

## Siguiente paso

Continua con [Operaciones vectorizadas](04-operaciones-vectorizadas.md).

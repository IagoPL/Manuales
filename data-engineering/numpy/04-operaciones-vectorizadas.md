# Operaciones vectorizadas

Vectorizar significa expresar el calculo sobre arrays enteros en vez de bucles Python. NumPy delega en codigo compilado (y a veces BLAS) y aprovecha SIMD.

## Aritmetica y ufuncs

```python
import numpy as np

a = np.array([1.0, 2.0, 3.0])
b = np.array([10.0, 20.0, 30.0])

a + b
a * b
a ** 2
np.sqrt(a)
np.exp(a)
np.log1p(a)
np.clip(a, 0, 2)
```

Las **ufuncs** operan elemento a elemento y soportan broadcasting.

## Agregaciones

```python
m = np.arange(1, 7).reshape(2, 3)
m.sum(), m.mean(), m.std()
m.min(axis=0)
m.max(axis=1)
np.percentile(m, 95)
```

## Comparaciones y logica

```python
a = np.array([1, 2, 3, 4])
a > 2
np.all(a > 0)
np.any(a > 3)
np.count_nonzero(a > 2)
```

## Algebra element-wise vs matmul

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[2, 0], [1, 2]])
A * B          # elemento a elemento
A @ B          # producto matricial
np.dot(A, B)
```

## Evitar bucles

```python
# Evitar
out = []
for x in a:
    out.append(x ** 2)

# Preferir
out = a ** 2
```

Si el algoritmo no se vectoriza limpio, considera `np.vectorize` (comodidad, no magia de velocidad) o Numba.

## Errores habituales

- Usar `*` cuando queriamos `@`.
- Agregar sin `axis` y aplanar mentalmente mal el resultado.
- `np.vectorize` pensando que es tan rapido como una ufunc C.

## Buenas practicas

- Encadena ufuncs legibles; si la linea supera ~80-100 chars, parte en pasos nombrados.
- Usa agregaciones con `axis` explicito.
- Mide con `%timeit` antes de micro-optimizar.

## Ejercicio

1. Dado un array de temperaturas en C, convierte a F de forma vectorizada.
2. Calcula media y desviacion por columna de una matriz `(100, 4)` aleatoria.
3. Cuenta cuantos valores estan fuera de `[mean-2std, mean+2std]`.

## Siguiente paso

Continua con [Algebra lineal](05-algebra-lineal.md).

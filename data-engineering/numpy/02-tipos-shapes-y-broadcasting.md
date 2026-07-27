# Tipos, shapes y broadcasting

El rendimiento y la correccion en NumPy dependen del **dtype**, del **shape** y de las reglas de **broadcasting** que alinean arrays de distinto tamano sin copiar datos de mas.

## dtypes

```python
import numpy as np

np.array([1, 2, 3]).dtype          # int64 (o int32 en algunos Windows)
np.array([1.0, 2.0]).dtype         # float64
np.array([1, 2, 3], dtype=np.float32)
np.array([True, False]).dtype      # bool
```

Conversiones:

```python
a = np.array([1, 2, 3])
a.astype(np.float64)
```

Cuidado: convertir float->int trunca; strings numericos requieren conversion explicita.

## shape, reshape, ravel

```python
a = np.arange(12)
b = a.reshape(3, 4)
c = b.reshape(2, 6)
flat = b.ravel()      # vista si es contiguo
copy = b.flatten()    # siempre copia
```

`reshape(-1, 4)` infiere la primera dimension.

## Broadcasting

Dos arrays son compatibles si, de atras hacia adelante, las dimensiones son iguales o una es 1.

```python
a = np.array([[1, 2, 3],
              [4, 5, 6]])      # (2, 3)
b = np.array([10, 20, 30])     # (3,) -> se ve como (1, 3)
print(a + b)
# [[11 22 33]
#  [14 25 36]]
```

Normalizar columnas:

```python
X = np.array([[1., 2.], [3., 4.], [5., 6.]])
mu = X.mean(axis=0)            # (2,)
X_centered = X - mu            # broadcast (3,2) - (2,)
```

## newaxis

```python
v = np.array([1, 2, 3])
col = v[:, np.newaxis]   # (3, 1)
row = v[np.newaxis, :]   # (1, 3)
```

Util para productos externos o alinear batches.

## Errores habituales

- `ValueError: operands could not be broadcast together` -> revisa shapes con `.shape`.
- Hacer `reshape` incompatible (`12` elementos a `(5, 3)`).
- Usar `float32` sin darse cuenta y perder precision en sumas largas.

## Buenas practicas

- Imprime shapes al depurar pipelines.
- Normaliza con broadcasting en vez de bucles por fila.
- Elige `float32` en deep learning / memoria justa; `float64` en analisis general.

## Ejercicio

1. Resta la media por columna a una matriz `(5, 3)` usando broadcasting.
2. Multipplica una columna `(5, 1)` por una fila `(1, 3)` y explica el shape resultado.
3. Convierte un array int a float32 y verifica `dtype`.

## Siguiente paso

Continua con [Indexado y slicing](03-indexado-y-slicing.md).

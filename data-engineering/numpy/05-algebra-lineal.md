# Algebra lineal

NumPy expone operaciones de algebra lineal usadas en regresion, PCA, embeddings y resolucion de sistemas. El submodulo clave es `numpy.linalg`.

## Producto matricial

```python
import numpy as np

A = np.array([[1., 2.], [3., 4.]])
v = np.array([5., 6.])
A @ v
A.T
```

## Sistemas lineales

Resolver `Ax = b`:

```python
A = np.array([[3., 1.], [1., 2.]])
b = np.array([9., 8.])
x = np.linalg.solve(A, b)
print(A @ x)
```

Prefiere `solve` a invertir la matriz (`inv`) y multiplicar: es mas estable y rapido.

## Normas, det, rank

```python
np.linalg.norm(v)
np.linalg.norm(A, ord="fro")
np.linalg.det(A)
np.linalg.matrix_rank(A)
```

## Autovalores y SVD

```python
w, Q = np.linalg.eig(A)
U, S, Vt = np.linalg.svd(A, full_matrices=False)
```

SVD aparece en reduccion de dimensionalidad, recomendaciones y compresion.

## Minimos cuadrados

```python
X = np.array([[1., 1.], [1., 2.], [1., 3.]])
y = np.array([1., 2., 2.5])
coef, residuals, rank, s = np.linalg.lstsq(X, y, rcond=None)
```

## Errores habituales

- Matrices singulares en `solve` -> `LinAlgError`.
- Confundir fila/columna en vectores 1D.
- Invertir matrices mal condicionadas sin revisar el numero de condicion:

```python
np.linalg.cond(A)
```

## Buenas practicas

- Trabaja en `float64` salvo necesidad de memoria.
- Valida shapes antes de `@`.
- Para problemas grandes y dispersos, mira SciPy (`scipy.sparse.linalg`).

## Ejercicio

1. Resuelve un sistema 2x2 y verifica `A @ x - b`.
2. Calcula la norma L2 de un vector de 1000 gaussianas.
3. Ajusta una recta por minimos cuadrados a 20 puntos ruidosos.

## Siguiente paso

Continua con [Aleatoriedad y simulacion](06-aleatoriedad-y-simulacion.md).

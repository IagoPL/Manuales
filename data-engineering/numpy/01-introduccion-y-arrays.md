# NumPy: introduccion y arrays

NumPy es la libreria base del stack cientifico en Python. Define el `ndarray`: un bloque contiguo de memoria con tipo homogeneo y operaciones vectorizadas en C. Pandas, scikit-learn, PyTorch (tensores) y muchas APIs de datos se apoyan en el.

Si escribes bucles Python sobre millones de numeros, NumPy suele ser el primer salto de rendimiento.

## Capitulos

1. [Introduccion y arrays](01-introduccion-y-arrays.md)
2. [Tipos shapes y broadcasting](02-tipos-shapes-y-broadcasting.md)
3. [Indexado y slicing](03-indexado-y-slicing.md)
4. [Operaciones vectorizadas](04-operaciones-vectorizadas.md)
5. [Algebra lineal](05-algebra-lineal.md)
6. [Aleatoriedad y simulacion](06-aleatoriedad-y-simulacion.md)
7. [Rendimiento](07-rendimiento.md)
8. [Integracion con Pandas](08-integracion-con-pandas.md)

## Instalacion

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate
pip install numpy
```

```python
import numpy as np
print(np.__version__)
```

## Primer array

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a)
print(a.shape, a.dtype, a.ndim)
```

Arrays multidimensionales:

```python
m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.shape)  # (2, 3)
```

## Constructores habituales

```python
np.zeros((2, 3))
np.ones((3,))
np.full((2, 2), 7)
np.arange(0, 10, 2)
np.linspace(0, 1, 5)
np.eye(3)
np.empty((2, 2))  # sin inicializar; solo si vas a rellenar ya
```

## Por que no usar listas para calculo

```python
# Lento e inconveniente
xs = [1, 2, 3]
ys = [x * 2 for x in xs]

# Vectorizado
a = np.array([1, 2, 3])
b = a * 2
```

NumPy aplica la operacion a todo el buffer sin el overhead del interpretador por elemento.

## Axis mental model

En 2D: eje 0 = filas, eje 1 = columnas.

```python
m = np.array([[1, 2, 3], [4, 5, 6]])
m.sum(axis=0)  # por columna -> [5, 7, 9]
m.sum(axis=1)  # por fila    -> [6, 15]
```

## Errores habituales

- Mezclar listas Python y arrays sin convertir (`np.array`).
- Asumir que `dtype` es siempre `float64` (enteros truncan divisiones segun version/reglas).
- Mutar vistas pensando que son copias (capitulo 3).

## Buenas practicas

- Import convencional: `import numpy as np`.
- Fija `dtype` cuando leas datos externos.
- Prefiere constructores (`zeros`, `arange`) a bucles de append.

## Ejercicio

1. Crea un array 3x3 de ceros y otro con `arange(9).reshape(3, 3)`.
2. Suma ambos.
3. Imprime `shape`, `dtype` y `ndim`.

## Siguiente paso

Continua con [Tipos shapes y broadcasting](02-tipos-shapes-y-broadcasting.md).

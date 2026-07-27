# Rendimiento en NumPy

NumPy es rapido cuando los datos son contiguos, tipados y las operaciones estan vectorizadas. Deja de serlo con bucles Python, dtypes objeto o copias ocultas.

## Contigüidad

```python
import numpy as np

a = np.arange(12).reshape(3, 4)
print(a.flags.c_contiguous)
b = a.T
print(b.flags.c_contiguous)
c = np.ascontiguousarray(b)
```

Algunas rutinas BLAS exigen memoria contigua; si no, NumPy copia internamente.

## Evitar dtype=object

```python
# Lento: array de punteros Python
np.array([1, 2, "x"], dtype=object)
```

Mantén columnas numericas en dtypes nativos.

## Preallocar

```python
out = np.empty(10_000)
for i in range(10_000):
    out[i] = i * i
# Mejor:
i = np.arange(10_000)
out = i * i
```

Si el bucle es inevitable, prealloca; no hagas `list.append` + `np.array` al final en hot paths enormes sin medir.

## Medir

```python
import timeit

setup = "import numpy as np; a=np.arange(1000000)"
print(timeit.timeit("a*a", setup=setup, number=100))
```

En notebooks: `%timeit a * a`.

## Reducir memoria

```python
a = np.arange(1_000_000, dtype=np.float64)
b = a.astype(np.float32, copy=False)
```

Views (`ravel`, slices) ahorran RAM frente a `flatten` / copias.

## Cuando salir de NumPy

| Escala | Opcion |
|--------|--------|
| Cabecera en RAM, tabular | Pandas / Polars |
| SQL analitico local | DuckDB |
| No cabe en una maquina | PySpark / Dask / warehouse |

## Errores habituales

- Concatenar en bucle con `np.concatenate` repetido (coste cuadratico).
- Convertir a lista, procesar, volver a array.
- Ignorar warnings de overflow en enteros pequenos.

## Buenas practicas

- Perfila antes de reescribir.
- Unifica dtypes al leer datos.
- Prefiere operaciones in-place (`np.multiply(a, a, out=a)`) solo cuando midas beneficio y legibilidad no sufra.

## Ejercicio

1. Compara `%timeit` de un bucle Python vs `a*a` en 1e6 elementos.
2. Mide `a.T.sum(axis=0)` vs `ascontiguousarray(a.T).sum(axis=0)`.
3. Reescribe un `concatenate` en bucle por preallocacion.

## Siguiente paso

Continua con [Integracion con Pandas](08-integracion-con-pandas.md).

# Integracion con Pandas

Pandas usa NumPy por debajo: cada columna de un `DataFrame` (en el motor clasico) es, en esencia, un array tipado. Saber cruzar ambos evita conversiones innecesarias y permite vectorizar limpiezas.

## De NumPy a Pandas

```python
import numpy as np
import pandas as pd

data = np.array([[1, 2.5], [3, 4.5], [5, 6.5]])
df = pd.DataFrame(data, columns=["id", "score"])
```

## De Pandas a NumPy

```python
df = pd.DataFrame({"a": [1, 2, 3], "b": [4.0, 5.0, 6.0]})
df.to_numpy()
df["a"].to_numpy()
df["a"].values          # legacy; preferible to_numpy()
```

`to_numpy()` puede devolver una vista o copia segun dtypes homogeneos.

## Operaciones hibridas

```python
df = pd.DataFrame({"x": np.arange(5), "y": np.linspace(0, 1, 5)})
df["z"] = np.sqrt(df["x"].to_numpy())
df["z2"] = np.where(df["x"] > 2, df["y"], 0.0)
```

Cuando la expresion es numerica pura, bajar a NumPy suele ser mas predecible.

## Cuidado con NaN

```python
a = df["y"].to_numpy()
np.nanmean(a)
```

Los enteros con nulos en Pandas modernos pueden ser `Int64` nullable; al pasar a NumPy a veces se upcastea a float.

## Flujo recomendado

```txt
leer CSV/Parquet (Pandas o DuckDB)
  -> limpiar tipos
  -> calculo pesado numerico (NumPy)
  -> volver a DataFrame para export/joins
```

## Errores habituales

- Encadenar `.values` mutables y romper columnas del DataFrame.
- Mezclar dtypes y obtener `dtype=object` silencioso.
- Hacer `for idx, row in df.iterrows()` para calculo numerico.

## Buenas practicas

- Usa Pandas para tabular/joins/IO; NumPy para algebra y kernels.
- Fija dtypes al cargar (`dtype=`, `parse_dates`).
- Si el dataset crece, evalua Polars o DuckDB antes de micro-optimizar NumPy.

## Ejercicio

1. Crea un DataFrame a partir de un `ndarray` (100, 3).
2. Normaliza una columna restando media y dividiendo std con NumPy.
3. Reinyecta el resultado como nueva columna y exporta a Parquet.

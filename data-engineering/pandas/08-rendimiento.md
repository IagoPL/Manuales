# Rendimiento

Pandas es rapido para datasets que caben en memoria y para operaciones vectorizadas. Se vuelve lento cuando hay bucles Python, dtypes `object`, copias innecesarias o archivos mal leidos. Este capitulo resume palancas practicas antes de saltar a Polars, DuckDB o Spark.

## Mide antes de optimizar

```python
import time
import pandas as pd

def timed(fn):
    t0 = time.perf_counter()
    result = fn()
    print(f"{fn.__name__}: {time.perf_counter() - t0:.3f}s")
    return result

df = pd.read_parquet("orders.parquet")

def with_loop():
    total = 0.0
    for v in df["amount"]:
        total += float(v)
    return total

def vectorized():
    return df["amount"].sum()

timed(with_loop)
timed(vectorized)
```

Tambien puedes usar `%timeit` en notebooks o `df.memory_usage(deep=True)`.

## Reduce memoria con dtypes

```python
print(df.memory_usage(deep=True).sum() / 1e6, "MB")

df["country"] = df["country"].astype("category")
df["status"] = df["status"].astype("category")

# Enteros pequenos
df["quantity"] = pd.to_numeric(df["quantity"], downcast="integer")

# Floats si la precision lo permite
df["amount"] = pd.to_numeric(df["amount"], downcast="float")

# String dtype moderno (a veces mejor que object)
df["sku"] = df["sku"].astype("string")
```

`category` brilla con baja cardinalidad (paises, canales, status). Con millones de valores unicos no ayuda.

## Lee menos datos

```python
cols = ["order_id", "country", "amount", "created_at"]
orders = pd.read_parquet("orders.parquet", columns=cols)

# CSV: prototipa y selecciona
sample = pd.read_csv("orders.csv", nrows=10_000, usecols=cols)
orders = pd.read_csv(
    "orders.csv",
    usecols=cols,
    dtype={"country": "category"},
    parse_dates=["created_at"],
)
```

Parquet columnar evita parsear columnas que no pides. CSV no.

## Evita apply y bucles

```python
import numpy as np

# Mal
df["vat"] = df.apply(lambda r: r["amount"] * 1.21, axis=1)

# Bien
df["vat"] = df["amount"] * 1.21

# Condiciones: np.select / np.where
df["tier"] = np.select(
    [df["amount"] >= 200, df["amount"] >= 50],
    ["high", "mid"],
    default="low",
)
```

Si necesitas logica por grupos, preferible `groupby.transform` / `agg` a `apply` fila a fila.

## Encadenar sin copias inutiles

```python
# Preferible: expresiones claras
out = (
    df.loc[df["status"] == "paid", ["country", "amount"]]
    .assign(amount_vat=lambda d: d["amount"] * 1.21)
    .groupby("country", as_index=False)["amount_vat"]
    .sum()
)
```

Cuidado con fragmentacion de DataFrames en pandas 2.x: operaciones repetidas in-place a veces avisan; perfiles reales mandan mas que micro-optimizar cada assign.

## Categorical y merge/groupby

```python
df["country"] = df["country"].astype("category")
dim = dim.astype({"country": "category"})

# Alinea categorias si mergeas
df["country"] = df["country"].cat.set_categories(dim["country"].cat.categories)
```

Groupby sobre categorias suele ser mas rapido que sobre object.

## Chunks y procesamiento por bloques

Cuando el CSV es grande pero el resultado agregado es pequeno:

```python
acc = []
for chunk in pd.read_csv("orders.csv", chunksize=100_000, usecols=cols):
    chunk["amount"] = pd.to_numeric(chunk["amount"], errors="coerce")
    g = chunk.groupby("country", as_index=False)["amount"].sum()
    acc.append(g)

partial = pd.concat(acc, ignore_index=True)
final = partial.groupby("country", as_index=False)["amount"].sum()
```

Para analitica SQL sobre Parquet, DuckDB suele ser mas simple que reinventar chunks.

## Multihilo / motor

```python
# Algunas operaciones numericas usan BLAS; no esperes milagros en groupby object
# Pandas 2 + PyArrow backend (experimental / segun version):
# pd.options.mode.dtype_backend = "pyarrow"
```

No dependas de flags experimentales sin medir en tu version.

## Cuando Pandas no basta

| Senal | Alternativa tipica |
|-------|--------------------|
| Dataset >> RAM | DuckDB, Polars lazy, Spark |
| SQL analitico sobre Parquet | DuckDB |
| Pipelines muy tipados y lazy | Polars |
| Cluster / multi-TB | Spark |
| Solo necesitas agregados de un CSV enorme | DuckDB `read_csv_auto` / `read_parquet` |

```python
import duckdb

duckdb.sql("""
    SELECT country, sum(amount) AS revenue
    FROM 'orders.parquet'
    GROUP BY 1
    ORDER BY 2 DESC
""").df()
```

Puedes quedarte en el ecosistema Python y usar Pandas solo al final para el resultado pequeno.

## Checklist rapido

1. `info()` y `memory_usage(deep=True)`.
2. Categorias y numericos downcast.
3. Columnas minimas al leer; Parquet intermedio.
4. Sin `apply(axis=1)` ni `iterrows` en el camino caliente.
5. Medir; si sigue justo de RAM, salir a DuckDB/Polars.

## Errores habituales

- Optimizar sin medir (y romper legibilidad).
- `iterrows` / `itertuples` para transformar columnas enteras.
- Leer Excel de varios millones de filas "porque el negocio lo manda" sin convertirlo antes.
- Duplicar DataFrames gigantes (`df2 = df` es vista/referencia; `copy()` consciente).
- Concatenar dentro de un bucle sin lista intermedia.

## Buenas practicas

- Perfila 2–3 operaciones del pipeline real, no microbenchmarks aislados.
- Materializa Parquet limpio tras la primera pasada de limpieza.
- Mantén el grano y las columnas que realmente usa el siguiente paso.
- Documenta el techo de filas/RAM en el que el notebook deja de ser viable.
- Separa exploracion (Pandas comodo) de produccion (job medido).

## Ejercicios

1. Compara `sum` vectorizado vs bucle sobre una columna de 1e6 filas.
2. Mide `memory_usage` antes y despues de pasar `country`/`status` a `category`.
3. Reescribe un `apply(axis=1)` con `np.select`.
4. Agrega un CSV grande por chunks y valida el total contra una lectura completa (si cabe).
5. Repite la agregacion en DuckDB sobre el mismo Parquet y compara tiempos.

## Siguiente paso

El [capitulo 9](09-proyecto-de-analisis.md) ensambla lectura, limpieza, agregaciones y export en un mini proyecto de extremo a extremo.

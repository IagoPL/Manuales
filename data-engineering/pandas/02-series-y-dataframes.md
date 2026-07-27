# Series y DataFrames

Series y DataFrame son las dos estructuras centrales de Pandas. Una Series es una columna etiquetada (un vector con indice). Un DataFrame es una tabla: varias Series alineadas por el mismo indice.

Si entiendes indices, dtypes y alineacion, el resto del manual (filtros, groupby, joins) encaja sin sorpresas.

## Series

```python
import pandas as pd

revenue = pd.Series(
    [120.5, 80.0, 310.0],
    index=["ES", "PT", "FR"],
    name="revenue",
)

print(revenue)
print(revenue["ES"])
print(revenue.mean())
```

Operaciones aritmeticas son vectorizadas y respetan el indice:

```python
tax = pd.Series({"ES": 0.21, "PT": 0.23, "FR": 0.20})
net = revenue / (1 + tax)
print(net.round(2))
```

Si los indices no coinciden, Pandas inserta `NaN` en las posiciones sin pareja. Eso no es un bug: es alineacion por etiqueta.

## DataFrame

```python
orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104],
    "country": ["ES", "PT", "ES", "FR"],
    "amount": [120.5, 80.0, 310.0, 45.0],
    "status": ["paid", "paid", "refunded", "paid"],
})

print(orders)
print(orders.shape)      # (filas, columnas)
print(orders.columns)
print(orders.dtypes)
```

Cada columna es una Series:

```python
print(type(orders["amount"]))
print(orders["amount"].describe())
```

## Indice

Por defecto el indice es `0..n-1`. Puedes usar una columna como indice cuando aporta semantica (IDs unicos, fechas):

```python
orders_indexed = orders.set_index("order_id")
print(orders_indexed.loc[102])

# Volver a columna
orders_reset = orders_indexed.reset_index()
```

Reglas practicas:

- Indice unico cuando vas a hacer `join` o lookups frecuentes por clave.
- Indice datetime cuando trabajas series temporales (capitulo 7).
- No uses indices raros solo por "limpieza visual"; `reset_index()` es valido.

## Creacion desde listas, dicts y registros

```python
# Lista de dicts (muy comun al parsear APIs)
rows = [
    {"sku": "A1", "qty": 2, "price": 10.0},
    {"sku": "B2", "qty": 1, "price": 25.5},
]
catalog = pd.DataFrame(rows)

# Desde numpy / listas alineadas
import numpy as np

df = pd.DataFrame({
    "x": np.arange(5),
    "y": np.linspace(0, 1, 5),
})
```

## Inspeccion basica

```python
orders.head(3)
orders.tail(2)
orders.info()           # tipos, nulos, memoria
orders.describe()       # estadisticos de columnas numericas
orders["country"].value_counts()
orders.isna().sum()
```

`info()` es el primer sitio donde cazas tipos incorrectos (`object` donde esperabas `float` o `datetime`).

## Seleccion de columnas y filas (preview)

```python
# Columnas
orders[["order_id", "amount"]]

# Filas por posicion
orders.iloc[0]
orders.iloc[0:2]

# Filas por etiqueta de indice
orders_indexed.loc[101]

# Filtro booleano
paid = orders[orders["status"] == "paid"]
```

El capitulo 4 profundiza en `loc`/`iloc`, mascara booleanas y transformaciones. Aqui basta con no mezclar estilos a ciegas.

## Asignacion y columnas derivadas

```python
orders = orders.copy()
orders["amount_eur"] = orders["amount"]
orders["is_refund"] = orders["status"] == "refunded"
orders["amount_bucket"] = pd.cut(
    orders["amount"],
    bins=[0, 50, 150, 1000],
    labels=["low", "mid", "high"],
)
```

Prefiere `.copy()` cuando reasignas subtablas para evitar `SettingWithCopyWarning` y efectos laterales.

## Tipos de datos utiles

| Tipo | Uso tipico |
|------|------------|
| `int64` / `Int64` | Contadores; `Int64` admite nulos |
| `float64` | Importes, ratios |
| `object` / `string` | Texto; preferible `string` dtype moderno |
| `bool` / `boolean` | Flags |
| `datetime64[ns]` | Fechas y timestamps |
| `category` | Cardinalidad baja (pais, status) |

```python
orders["country"] = orders["country"].astype("category")
orders["status"] = orders["status"].astype("category")
orders["amount"] = orders["amount"].astype("float64")
```

`category` reduce memoria y acelera `groupby` cuando hay pocas categorias repetidas.

## Alineacion y broadcasting

```python
# Restar la media de amount a cada fila (broadcasting)
orders["amount_centered"] = orders["amount"] - orders["amount"].mean()

# Mapear con Series indexada por pais
fx = pd.Series({"ES": 1.0, "PT": 1.0, "FR": 1.0})
orders["fx"] = orders["country"].map(fx)
```

## Errores habituales

- Confundir `orders["col"]` (Series) con `orders[["col"]]` (DataFrame de una columna).
- Asumir que el indice es unico sin comprobarlo (`orders.index.is_unique`).
- Encadenar filtros y asignar (`df[df.a > 0]["b"] = 1`) sin `.loc` ni `.copy()`.
- Dejar columnas numericas como `object` porque habia un `"N/A"` en el CSV.
- Crear DataFrames fila a fila en un bucle (`pd.concat` dentro del loop): construye la lista de dicts y crea el DataFrame una vez.

## Buenas practicas

- Nombra columnas en `snake_case` y sin espacios.
- Documenta el significado del indice (o dejalo por defecto y usa columnas de clave).
- Tras crear o cargar, ejecuta `info()` y `isna().sum()`.
- Usa dtypes explicitos cuanto antes (`astype`, `to_numeric`, `to_datetime`).
- Trabaja con copias conscientes cuando vas a mutar subtablas.

## Ejercicios

1. Crea un DataFrame de 6 pedidos con `order_id`, `customer_id`, `country`, `amount` y `status`.
2. Convierte `country` y `status` a `category`.
3. Anade una columna `is_high_value` para `amount >= 100`.
4. Pon `order_id` como indice y recupera un pedido con `.loc`.
5. Calcula la media de `amount` por `country` con `groupby` (preview del cap. 6).

## Siguiente paso

Con Series y DataFrames claros, el [capitulo 3](03-lectura-y-escritura.md) cubre como leer y escribir CSV, Parquet, Excel y JSON sin perder tipos por el camino.

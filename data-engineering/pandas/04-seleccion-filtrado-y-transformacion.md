# Seleccion, filtrado y transformacion

Una vez cargado el DataFrame, el trabajo diario es proyectar columnas, filtrar filas y crear campos derivados. Hazlo con operaciones vectorizadas: son mas claras y mucho mas rapidas que bucles.

## Seleccion de columnas

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105],
    "country": ["ES", "PT", "ES", "FR", "ES"],
    "channel": ["web", "app", "web", "store", "app"],
    "amount": [120.5, 80.0, 310.0, 45.0, 15.0],
    "status": ["paid", "paid", "refunded", "paid", "paid"],
})

# Una columna -> Series
amounts = orders["amount"]

# Varias columnas -> DataFrame
view = orders[["order_id", "amount", "status"]]

# Exclusion
meta = orders.drop(columns=["channel"])
```

## loc e iloc

- `loc` selecciona por **etiqueta** de indice y nombre de columna.
- `iloc` selecciona por **posicion** entera.

```python
orders_idx = orders.set_index("order_id")

orders_idx.loc[101]                         # una fila
orders_idx.loc[[101, 103], ["amount", "status"]]
orders_idx.loc[101:103]                     # rango de etiquetas (incluye ambos extremos)

orders.iloc[0]                              # primera fila
orders.iloc[0:3, 0:2]                        # filas 0..2, columnas 0..1
```

Para asignar, usa `loc` de forma explicita:

```python
orders = orders.copy()
orders.loc[orders["amount"] < 20, "status"] = "review"
```

Evita el patron encadenado `df[df.a > 0]["b"] = ...` (SettingWithCopy).

## Filtros booleanos

```python
mask = (orders["status"] == "paid") & (orders["amount"] >= 50)
paid_big = orders.loc[mask]

# isin / between
iberia = orders[orders["country"].isin(["ES", "PT"])]
mid = orders[orders["amount"].between(50, 200)]

# Negacion
not_refund = orders[orders["status"] != "refunded"]
# o: orders[~orders["status"].eq("refunded")]
```

Operadores: usa `&`, `|`, `~` con parentesis. `and` / `or` de Python no funcionan sobre Series.

### query (opcional)

```python
orders.query("status == 'paid' and amount >= 50")
orders.query("country in ['ES', 'PT']")
```

Util en notebooks; en scripts largos muchos equipos prefieren mascaras explicitas.

## Ordenar y rankear

```python
orders.sort_values(["country", "amount"], ascending=[True, False])
orders.assign(rank_amount=orders["amount"].rank(ascending=False, method="dense"))
```

## Transformaciones de columnas

### Asignacion vectorizada

```python
orders = orders.copy()
orders["amount_vat"] = orders["amount"] * 1.21
orders["is_es"] = orders["country"] == "ES"
```

### assign (encadenable, no muta in-place)

```python
clean = (
    orders
    .assign(
        amount_vat=lambda d: d["amount"] * 1.21,
        channel=lambda d: d["channel"].str.lower(),
    )
    .loc[lambda d: d["status"] == "paid"]
)
```

### map, replace, where

```python
region = {"ES": "south", "PT": "south", "FR": "central"}
orders["region"] = orders["country"].map(region)

orders["status_norm"] = orders["status"].replace({"refunded": "refund"})

# where: mantener valor si True, si no NaN u otro valor
orders["amount_paid"] = orders["amount"].where(orders["status"] == "paid", 0.0)
```

### apply: usalo con criterio

`apply` es flexible y lento. Reservealo para logica que no cabe en vectorizacion:

```python
# Preferible
orders["label"] = pd.cut(orders["amount"], bins=[0, 50, 150, 10_000], labels=["L", "M", "H"])

# Solo si hace falta
def tag(row):
    if row["status"] == "refunded":
        return "bad"
    if row["amount"] > 200:
        return "vip"
    return "ok"

orders["tag"] = orders.apply(tag, axis=1)  # mas lento
```

## Strings

```python
orders["channel"] = orders["channel"].astype("string").str.strip().str.lower()
orders["country"].str.len()
orders["channel"].str.contains("web", case=False, na=False)
orders["order_code"] = "ORD-" + orders["order_id"].astype("string")
```

Metodos `.str` requieren dtype string/object; valores nulos se propagan (controla con `na=`).

## Renombrar y reordenar

```python
orders = orders.rename(columns={"amount": "amount_eur"})
orders = orders[["order_id", "country", "amount_eur", "status", "channel"]]
```

## Explode y columnas listas

```python
baskets = pd.DataFrame({
    "order_id": [1, 2],
    "skus": [["A", "B"], ["A"]],
})
baskets.explode("skus", ignore_index=True)
```

## Errores habituales

- Mezclar `and`/`or` con Series en lugar de `&`/`|`.
- Asignacion encadenada y `SettingWithCopyWarning` ignorado.
- Usar `apply(axis=1)` para sumas, ratios o maps simples.
- Filtrar y olvidar que el indice queda "agujereado" (usar `reset_index(drop=True)` si molesta).
- Comparar floats con `==` exacto cuando hay redondeo; usa rangos o `np.isclose` si aplica.

## Buenas practicas

- Filtra con `loc[mask, columns]` cuando seleccionas y proyectas a la vez.
- Encadena con `.assign` / `.loc` / `.pipe` para pipelines legibles.
- Normaliza strings (`strip`, `lower`) antes de filtrar o agrupar.
- Prefiere `isin`, `between`, `str.contains` a bucles.
- Tras transformar, valida con `value_counts`, `describe` y conteo de filas.

## Ejercicios

1. Filtra pedidos `paid` de `ES` o `PT` con amount entre 50 y 300.
2. Crea `amount_vat` y `region` con `assign` y un dict de mapeo.
3. Sustituye status `refunded` por `refund` con `replace`.
4. Ordena por `amount` descendente y anade un ranking denso.
5. Reescribe un `apply` innecesario usando `np.where` o `pd.cut`.

## Siguiente paso

Con columnas derivadas y filtros claros, el [capitulo 5](05-limpieza-de-datos.md) se centra en nulos, duplicados, tipos sucios y validaciones.

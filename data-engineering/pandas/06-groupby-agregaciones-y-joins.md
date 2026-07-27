# GroupBy, agregaciones y joins

Agrupar y unir tablas es el nucleo del analisis tabular: ventas por pais, pedidos por cliente, enriquecer hechos con dimensiones. En Pandas esto se hace con `groupby`, `agg`, `merge` y, a veces, `pivot_table`.

## GroupBy basico

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6],
    "country": ["ES", "ES", "PT", "FR", "ES", "PT"],
    "channel": ["web", "app", "web", "web", "app", "app"],
    "amount": [100.0, 80.0, 50.0, 40.0, 120.0, 60.0],
    "customer_id": [10, 11, 10, 12, 11, 13],
})

by_country = (
    orders
    .groupby("country", as_index=False)
    .agg(
        orders=("order_id", "count"),
        revenue=("amount", "sum"),
        avg_ticket=("amount", "mean"),
    )
    .sort_values("revenue", ascending=False)
)
print(by_country)
```

`as_index=False` deja la clave como columna (mas comodo para exportar y merge posteriores).

## Varias claves y varias metricas

```python
summary = (
    orders
    .groupby(["country", "channel"], as_index=False)
    .agg(
        orders=("order_id", "nunique"),
        revenue=("amount", "sum"),
        customers=("customer_id", "nunique"),
    )
)
```

Funciones habituales: `sum`, `mean`, `median`, `min`, `max`, `count`, `nunique`, `std`, `first`, `last`.

### agg con dict o lista

```python
orders.groupby("country")["amount"].agg(["sum", "mean", "median"])

orders.groupby("country").agg({
    "amount": ["sum", "mean"],
    "order_id": "count",
})
```

La forma con nombres nombrados (`revenue=("amount", "sum")`) suele ser mas legible.

## transform y filter

`transform` devuelve una Series alineada al DataFrame original (misma longitud):

```python
orders = orders.copy()
orders["country_avg"] = orders.groupby("country")["amount"].transform("mean")
orders["delta_vs_country"] = orders["amount"] - orders["country_avg"]
```

`filter` conserva grupos completos que cumplen una condicion:

```python
# Paises con al menos 2 pedidos
big = orders.groupby("country").filter(lambda g: len(g) >= 2)
```

## value_counts y crosstabs

```python
orders["country"].value_counts()
pd.crosstab(orders["country"], orders["channel"], values=orders["amount"], aggfunc="sum")
```

## pivot_table

```python
pivot = pd.pivot_table(
    orders,
    index="country",
    columns="channel",
    values="amount",
    aggfunc="sum",
    fill_value=0,
    margins=True,
)
```

Equivale a un groupby + unstack en muchos casos. Usa pivot cuando quieras forma ancha para informes.

## Joins con merge

```python
customers = pd.DataFrame({
    "customer_id": [10, 11, 12, 14],
    "segment": ["gold", "silver", "gold", "bronze"],
    "city": ["Madrid", "Lisboa", "Paris", "Sevilla"],
})

enriched = orders.merge(customers, on="customer_id", how="left")
print(enriched)
```

### Tipos de join

| how | Efecto |
|-----|--------|
| `inner` | Solo claves en ambos |
| `left` | Todas las filas de la izquierda |
| `right` | Todas las de la derecha |
| `outer` | Union de claves |

```python
# Claves con nombres distintos
enriched = orders.merge(
    customers,
    left_on="customer_id",
    right_on="customer_id",
    how="left",
    validate="m:1",  # muchos pedidos : un cliente
)
```

`validate` evita explosiones silenciosas por duplicados en la dimension:

- `1:1`, `1:m`, `m:1`, `m:m`

### Indicador de match

```python
check = orders.merge(customers, on="customer_id", how="left", indicator=True)
print(check["_merge"].value_counts())
orphan = check[check["_merge"] == "left_only"]
```

## concat

```python
q1 = pd.read_parquet("orders_q1.parquet")
q2 = pd.read_parquet("orders_q2.parquet")
year = pd.concat([q1, q2], ignore_index=True)

# Unir columnas lado a lado (mismo indice)
pd.concat([features, labels], axis=1)
```

`concat` apila; `merge` une por claves. No los intercambies.

## Join por indice

```python
left = orders.set_index("customer_id")
right = customers.set_index("customer_id")
left.join(right, how="left")
```

En codigo nuevo suele preferirse `merge` explicito por columnas: es mas legible.

## Cardinalidad y fan-out

Antes de unir, inspecciona:

```python
print(orders["customer_id"].is_unique)      # False esperado
print(customers["customer_id"].is_unique)  # True esperado

before = len(orders)
after = len(orders.merge(customers, on="customer_id", how="left"))
print(before, after)  # si after >> before, hay duplicados en customers
```

## Errores habituales

- Hacer `merge` sin `validate` y multiplicar filas por duplicados en la dimension.
- Usar `how="inner"` sin querer y perder pedidos sin cliente.
- Agrupar y luego olvidar que las metricas ya no son a nivel fila (mezclar granos).
- `count` vs `size` vs `nunique`: `count` ignora nulos en la columna; `size` cuenta filas del grupo.
- Concatenar DataFrames con columnas distintas sin alinear esquemas.

## Buenas practicas

- Fija el grano (fila = pedido, cliente-dia, etc.) antes de agregar.
- Nombra metricas con claridad (`revenue`, no `amount_sum` ambiguo).
- Valida joins con `indicator` y conteos antes/despues.
- Dimensiones pequenas: asegura unicidad de la clave.
- Para tablas grandes, proyecta columnas antes del merge.

## Ejercicios

1. Calcula revenue, pedidos y ticket medio por `country` y `channel`.
2. Anade con `transform` la media de amount del pais a cada fila.
3. Haz `left` merge con una tabla `customers` y lista los `customer_id` sin match.
4. Repite el merge con `validate="m:1"` tras asegurar unicidad en customers.
5. Construye un `pivot_table` pais x canal con `sum` de amount y `margins=True`.

## Siguiente paso

El [capitulo 7](07-fechas-y-series-temporales.md) aplica estas ideas a timestamps: parseo, zonas horarias, resampling y ventanas temporales.

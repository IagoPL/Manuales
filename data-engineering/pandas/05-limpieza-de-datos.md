# Limpieza de datos

La limpieza convierte un dump sucio en una tabla fiable: nulos tratados, tipos correctos, duplicados resueltos y reglas de negocio aplicadas de forma explicita. Sin este paso, groupby y joins solo amplifican el ruido.

## Diagnostico inicial

```python
import pandas as pd

orders = pd.read_csv("orders.csv")

orders.shape
orders.info()
orders.isna().sum().sort_values(ascending=False)
orders.duplicated().sum()
orders.describe(include="all")
```

Preguntas utiles:

- Que porcentaje de nulos tiene cada columna?
- Hay claves duplicadas (`order_id`)?
- Que columnas son `object` y deberian ser numero o fecha?
- Hay valores centinela (`-1`, `9999`, `"?"`) ademas de `NaN`?

## Nulos

### Detectar

```python
orders.isna()
orders["email"].isna().mean()  # fraccion nula
orders.dropna(how="all")       # filas totalmente vacias
```

### Eliminar

```python
# Solo si la columna es critica y el nulo invalida la fila
orders = orders.dropna(subset=["order_id", "amount", "created_at"])
```

### Imputar

```python
orders["country"] = orders["country"].fillna("UNKNOWN")

# Numerico: mediana suele ser mas robusta que la media
orders["amount"] = orders["amount"].fillna(orders["amount"].median())

# Forward / backward fill en series ordenadas (con cuidado)
ts = orders.sort_values("created_at")
ts["temperature"] = ts["temperature"].ffill()
```

No imputes a ciegas: documenta la regla. A veces el nulo es senal (cliente sin email) y conviene un flag:

```python
orders["has_email"] = orders["email"].notna()
orders["email"] = orders["email"].fillna("")
```

## Duplicados

```python
orders.duplicated(subset=["order_id"]).sum()

# Ver conflictos
orders[orders.duplicated(subset=["order_id"], keep=False)].sort_values("order_id")

# Conservar la ultima version por timestamp
orders = (
    orders
    .sort_values("updated_at")
    .drop_duplicates(subset=["order_id"], keep="last")
)
```

Define la clave de negocio antes de deduplicar. Filas identicas completas no son lo mismo que misma clave con payloads distintos.

## Tipos y valores sucios

```python
orders["amount"] = (
    orders["amount"]
    .astype("string")
    .str.replace(",", ".", regex=False)
    .str.replace(r"[^\d.\-]", "", regex=True)
)
orders["amount"] = pd.to_numeric(orders["amount"], errors="coerce")

orders["created_at"] = pd.to_datetime(orders["created_at"], errors="coerce", utc=True)

orders["country"] = (
    orders["country"]
    .astype("string")
    .str.strip()
    .str.upper()
    .replace({"": pd.NA, "ESP": "ES", "SPA": "ES"})
)
```

Centinelas:

```python
orders["age"] = orders["age"].replace([-1, 999], pd.NA)
```

## Espacios, mayusculas y categorias

```python
for col in ["status", "channel"]:
    orders[col] = orders[col].astype("string").str.strip().str.lower()

allowed_status = {"paid", "pending", "refunded", "cancelled"}
bad = ~orders["status"].isin(allowed_status) & orders["status"].notna()
print(orders.loc[bad, "status"].value_counts())

orders["status"] = orders["status"].where(orders["status"].isin(allowed_status), pd.NA)
orders["status"] = orders["status"].astype("category")
```

## Outliers

No borres extremos sin contexto. Primero inspecciona:

```python
q1 = orders["amount"].quantile(0.25)
q3 = orders["amount"].quantile(0.75)
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr

suspect = orders[~orders["amount"].between(low, high)]
print(suspect[["order_id", "amount", "country"]].head(20))
```

Opciones: corregir errores de unidad (centimos vs euros), capar (winsorize), o dejarlos y usar metricas robustas (mediana).

## Validaciones como contrato

```python
def validate_orders(df: pd.DataFrame) -> pd.DataFrame:
    required = ["order_id", "amount", "created_at", "country"]
    missing = set(required) - set(df.columns)
    if missing:
        raise ValueError(f"Faltan columnas: {sorted(missing)}")

    if df["order_id"].isna().any():
        raise ValueError("order_id nulo")
    if df["order_id"].duplicated().any():
        raise ValueError("order_id duplicado")
    if (df["amount"].dropna() < 0).any():
        raise ValueError("amount negativo")
    return df

orders = validate_orders(orders)
```

En pipelines, falla rapido ante violaciones duras; registra filas dudosas en un fichero de rechazo en lugar de silenciarlas.

## Pipeline de limpieza reproducible

```python
def clean_orders(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out.columns = [c.strip().lower() for c in out.columns]

    out["amount"] = pd.to_numeric(out["amount"], errors="coerce")
    out["created_at"] = pd.to_datetime(out["created_at"], errors="coerce", utc=True)
    out["country"] = out["country"].astype("string").str.strip().str.upper()

    out = out.dropna(subset=["order_id", "amount", "created_at"])
    out = (
        out.sort_values("created_at")
        .drop_duplicates(subset=["order_id"], keep="last")
    )
    return validate_orders(out)

orders_clean = clean_orders(pd.read_csv("orders.csv"))
orders_clean.to_parquet("orders_clean.parquet", index=False)
```

## Errores habituales

- `fillna(0)` en importes donde el nulo significa "desconocido", no cero.
- Deduplicar sin ordenar por fecha de actualizacion.
- Borrar outliers sin mirar si son errores de escala.
- Limpiar en celdas sueltas del notebook sin funcion reutilizable.
- Convertir a categoria antes de normalizar strings (acabas con 50 variantes de "ES").

## Buenas practicas

- Separa diagnostico, limpieza y validacion.
- Escribe funciones puras `clean_*` / `validate_*` con tests sobre fixtures pequenas.
- Guarda el dataset limpio en Parquet y no re-limpies desde CSV cada vez.
- Loguea cuantas filas entran, cuantas salen y cuantas se rechazan.
- Documenta cada regla (por que se imputa, por que se dropea).

## Ejercicios

1. Genera un CSV con nulos, duplicados de `order_id`, amounts como `"1.200,50"` y paises `esp`/`ES`.
2. Implementa `clean_orders` que normalice tipos, paises y deduplique.
3. Anade `validate_orders` con al menos tres reglas.
4. Calcula el porcentaje de filas descartadas y guardalo en un dict de metricas.
5. Exporta limpio a Parquet y un CSV `rejects.csv` con las filas invalidas.

## Siguiente paso

Con tablas limpias, el [capitulo 6](06-groupby-agregaciones-y-joins.md) cubre agregaciones, groupby y joins entre DataFrames.

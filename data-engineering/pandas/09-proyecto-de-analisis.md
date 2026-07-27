# Proyecto de analisis

Este capitulo cierra el manual con un flujo completo: datos crudos de pedidos -> limpieza -> metricas de negocio -> exportes. El objetivo no es un dashboard perfecto, sino un script reproducible que puedas adaptar a un dataset real.

## Enunciado

Tienes tres ficheros:

- `orders.csv` — pedidos
- `customers.csv` — clientes
- `products.csv` — catalogo (opcional para el bonus)

Quieres responder:

1. Revenue y pedidos por pais y mes.
2. Top 10 clientes por revenue.
3. Tasa de refund por canal.
4. Ticket medio semanal (serie temporal).

Salidas:

- `out/country_month.parquet`
- `out/top_customers.csv`
- `out/channel_quality.parquet`
- `out/weekly_ticket.parquet`
- `out/run_metrics.json` (filas in/out, nulos, tiempos)

## Datos de ejemplo

Si no tienes ficheros, genera fixtures:

```python
from pathlib import Path
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
Path("data").mkdir(exist_ok=True)

n = 5_000
days = pd.date_range("2024-01-01", periods=180, freq="D", tz="UTC")

orders = pd.DataFrame({
    "order_id": np.arange(1, n + 1),
    "customer_id": rng.integers(1, 400, size=n),
    "country": rng.choice(["ES", "PT", "FR", "DE", "es", "N/A"], size=n, p=[0.35, 0.15, 0.2, 0.2, 0.05, 0.05]),
    "channel": rng.choice(["web", "app", "store", "Web "], size=n),
    "status": rng.choice(["paid", "paid", "paid", "refunded", "pending"], size=n),
    "amount": rng.normal(80, 40, size=n).round(2),
    "created_at": rng.choice(days, size=n),
})
# Suciedad controlada
orders.loc[rng.choice(n, 50, replace=False), "amount"] = np.nan
orders.loc[rng.choice(n, 20, replace=False), "amount"] = -10
orders = pd.concat([orders, orders.sample(15, random_state=1)], ignore_index=True)  # dup order_id

customers = pd.DataFrame({
    "customer_id": np.arange(1, 401),
    "segment": rng.choice(["gold", "silver", "bronze"], size=400),
    "city": rng.choice(["Madrid", "Lisboa", "Paris", "Berlin"], size=400),
})

orders.to_csv("data/orders.csv", index=False)
customers.to_csv("data/customers.csv", index=False)
```

## Estructura del proyecto

```txt
pandas-project/
  data/
    orders.csv
    customers.csv
  out/
  src/
    clean.py
    analyze.py
  run.py
```

## 1. Limpieza

```python
# src/clean.py
from __future__ import annotations

import pandas as pd


def clean_orders(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out.columns = [c.strip().lower() for c in out.columns]

    out["country"] = (
        out["country"]
        .astype("string")
        .str.strip()
        .str.upper()
        .replace({"N/A": pd.NA, "ESP": "ES"})
    )
    out["channel"] = out["channel"].astype("string").str.strip().str.lower()
    out["status"] = out["status"].astype("string").str.strip().str.lower()
    out["amount"] = pd.to_numeric(out["amount"], errors="coerce")
    out["created_at"] = pd.to_datetime(out["created_at"], errors="coerce", utc=True)

    out = out[out["amount"].notna() & (out["amount"] >= 0)]
    out = out.dropna(subset=["order_id", "customer_id", "created_at", "country"])

    out = (
        out.sort_values("created_at")
        .drop_duplicates(subset=["order_id"], keep="last")
    )

    out["country"] = out["country"].astype("category")
    out["channel"] = out["channel"].astype("category")
    out["status"] = out["status"].astype("category")
    return out.reset_index(drop=True)


def validate_orders(df: pd.DataFrame) -> None:
    if df["order_id"].duplicated().any():
        raise ValueError("order_id duplicado tras limpieza")
    if df["amount"].isna().any():
        raise ValueError("amount nulo")
    if not df["created_at"].is_monotonic_increasing:
        # no obligatorio globalmente; solo aviso analitico
        pass
```

## 2. Analisis

```python
# src/analyze.py
from __future__ import annotations

import pandas as pd


def country_month(orders: pd.DataFrame) -> pd.DataFrame:
    tmp = orders.assign(month=orders["created_at"].dt.to_period("M").astype("string"))
    return (
        tmp.groupby(["country", "month"], as_index=False, observed=True)
        .agg(
            orders=("order_id", "nunique"),
            revenue=("amount", "sum"),
            avg_ticket=("amount", "mean"),
        )
        .sort_values(["month", "revenue"], ascending=[True, False])
    )


def top_customers(orders: pd.DataFrame, customers: pd.DataFrame, n: int = 10) -> pd.DataFrame:
    paid = orders[orders["status"] == "paid"]
    ranked = (
        paid.groupby("customer_id", as_index=False)
        .agg(revenue=("amount", "sum"), orders=("order_id", "nunique"))
        .sort_values("revenue", ascending=False)
        .head(n)
    )
    return ranked.merge(customers, on="customer_id", how="left", validate="1:1")


def channel_quality(orders: pd.DataFrame) -> pd.DataFrame:
    g = (
        orders.groupby("channel", as_index=False, observed=True)
        .agg(
            orders=("order_id", "nunique"),
            refunds=("status", lambda s: (s == "refunded").sum()),
        )
    )
    g["refund_rate"] = g["refunds"] / g["orders"]
    return g.sort_values("refund_rate", ascending=False)


def weekly_ticket(orders: pd.DataFrame) -> pd.DataFrame:
    paid = orders[orders["status"] == "paid"].set_index("created_at").sort_index()
    weekly = paid.resample("W")["amount"].mean().rename("avg_ticket").to_frame()
    weekly["orders"] = paid.resample("W")["order_id"].nunique()
    return weekly.reset_index()
```

Nota: el `lambda` en refunds es aceptable en un proyecto pequeno; una alternativa vectorizada es marcar `is_refund` antes del groupby.

```python
orders = orders.assign(is_refund=orders["status"].eq("refunded"))
orders.groupby("channel", as_index=False, observed=True).agg(
    orders=("order_id", "nunique"),
    refunds=("is_refund", "sum"),
)
```

## 3. Orquestacion

```python
# run.py
from __future__ import annotations

import json
import time
from pathlib import Path

import pandas as pd

from src.analyze import channel_quality, country_month, top_customers, weekly_ticket
from src.clean import clean_orders, validate_orders

DATA = Path("data")
OUT = Path("out")
OUT.mkdir(exist_ok=True)

t0 = time.perf_counter()
raw = pd.read_csv(DATA / "orders.csv")
customers = pd.read_csv(DATA / "customers.csv")

orders = clean_orders(raw)
validate_orders(orders)

metrics = {
    "rows_in": int(len(raw)),
    "rows_out": int(len(orders)),
    "rows_dropped": int(len(raw) - len(orders)),
    "null_country_pct_in": float(raw["country"].isna().mean()) if "country" in raw else None,
    "elapsed_sec": None,
}

cm = country_month(orders)
top = top_customers(orders, customers, n=10)
cq = channel_quality(orders)
wt = weekly_ticket(orders)

cm.to_parquet(OUT / "country_month.parquet", index=False)
top.to_csv(OUT / "top_customers.csv", index=False)
cq.to_parquet(OUT / "channel_quality.parquet", index=False)
wt.to_parquet(OUT / "weekly_ticket.parquet", index=False)

metrics["elapsed_sec"] = round(time.perf_counter() - t0, 3)
(OUT / "run_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
print(json.dumps(metrics, indent=2))
```

## 4. Comprobaciones manuales

Tras ejecutar:

```python
import pandas as pd

print(pd.read_parquet("out/country_month.parquet").head())
print(pd.read_csv("out/top_customers.csv"))
print(pd.read_parquet("out/channel_quality.parquet"))
print(pd.read_parquet("out/weekly_ticket.parquet").tail())
```

Verifica:

- No hay `order_id` duplicados.
- Paises solo en un conjunto conocido (`ES`, `PT`, `FR`, `DE`, ...).
- `refund_rate` entre 0 y 1.
- La serie semanal no tiene semanas negativas de amount.

## Extension (bonus)

1. Une `products` y calcula revenue por categoria.
2. Anade un test con `pytest` sobre `clean_orders` usando un DataFrame de 5 filas sucias.
3. Sustituye la agregacion pesada por DuckDB y deja Pandas para el export.
4. Parametriza fechas `start`/`end` por CLI (`argparse`).

## Errores habituales en proyectos

- Mezclar limpieza y plots en un unico notebook sin funciones.
- Sobrescribir `data/` limpio sin dejar rastro del crudo.
- Joins a clientes sin `validate` y rankings inflados.
- No registrar filas descartadas (imposible auditar).
- Depender de la ruta de trabajo del IDE en lugar de rutas relativas al script.

## Buenas practicas

- Un directorio `out/` regenerable; no lo versionas (salvo fixtures pequenas).
- Funciones puras + un `run.py` fino.
- Metricas de ejecucion al lado de los artefactos.
- Semilla (`random_state` / `default_rng`) cuando generas datos sinteticos.
- README de tres lineas: como instalar, como ejecutar, que ficheros salen.

## Ejercicios

1. Genera los CSV de ejemplo y ejecuta el pipeline completo.
2. Cambia la regla de deduplicacion a `keep="first"` y compara `rows_out`.
3. Filtra solo `paid` en `country_month` y documenta el cambio de grano.
4. Anade validacion: fallar si `refund_rate > 0.5` en algun canal (umbral de alerta).
5. Escribe el README del proyecto en 10 lineas.

## Siguiente paso

Con este flujo base puedes volver atras segun necesidad: [lectura](03-lectura-y-escritura.md), [limpieza](05-limpieza-de-datos.md), [groupby/joins](06-groupby-agregaciones-y-joins.md) o [rendimiento](08-rendimiento.md). Para analitica SQL sobre Parquet a mayor escala, el manual de DuckDB es el companero natural.

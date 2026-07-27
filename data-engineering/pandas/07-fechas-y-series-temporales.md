# Fechas y series temporales

Las fechas mal tipadas son una de las fuentes de error mas caras en analitica: ordenaciones incorrectas, groupby por string, joins que no cuadran y graficos con huecos fantasmas. Convierte a datetime pronto y trabaja con metodos `.dt` y indices temporales.

## Parseo a datetime

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4],
    "created_at": [
        "2024-01-15 10:00:00",
        "15/02/2024 18:30",
        "2024-03-01T09:15:00Z",
        "no-fecha",
    ],
    "amount": [100.0, 80.0, 50.0, 40.0],
})

orders["created_at"] = pd.to_datetime(
    orders["created_at"],
    errors="coerce",
    utc=True,
    format="mixed",  # pandas reciente; si falla, parsea en dos pasadas
)
print(orders)
```

Si el formato es conocido, fijalo:

```python
pd.to_datetime(series, format="%d/%m/%Y %H:%M", errors="coerce")
```

`errors="coerce"` deja `NaT` en valores imposibles; luego decide si dropear.

## Zonas horarias

```python
# Naive -> UTC (asume que el naive ya era UTC)
ts = pd.to_datetime(["2024-06-01 12:00:00"])
ts_utc = ts.tz_localize("UTC")

# O desde string con offset
ts = pd.to_datetime(["2024-06-01 14:00:00+02:00"], utc=True)

# Convertir a zona local para informes
ts_madrid = ts.tz_convert("Europe/Madrid")
```

Reglas:

- Almacena en **UTC** en datasets y Parquet.
- Convierte a zona local solo en la capa de presentacion.
- No mezcles columnas naive y aware en la misma comparacion.

## Componentes con .dt

```python
orders = orders.dropna(subset=["created_at"]).copy()
orders["date"] = orders["created_at"].dt.floor("D")
orders["year"] = orders["created_at"].dt.year
orders["month"] = orders["created_at"].dt.month
orders["year_month"] = orders["created_at"].dt.to_period("M").astype("string")
orders["weekday"] = orders["created_at"].dt.day_name()
orders["hour"] = orders["created_at"].dt.hour
```

## Filtros por rango

```python
start = pd.Timestamp("2024-02-01", tz="UTC")
end = pd.Timestamp("2024-02-29 23:59:59", tz="UTC")
feb = orders[(orders["created_at"] >= start) & (orders["created_at"] <= end)]

# Alternativa
feb = orders.set_index("created_at").loc["2024-02"].reset_index()
```

## Indice DatetimeIndex y resampling

```python
daily = (
    orders
    .set_index("created_at")
    .sort_index()
    .resample("D")["amount"]
    .sum()
    .fillna(0)
)
print(daily.head())
```

Frecuencias utiles: `D`, `W`, `ME` (mes), `QE`, `h`, `15min`.

```python
monthly = (
    orders
    .set_index("created_at")
    .sort_index()
    .resample("ME")
    .agg(revenue=("amount", "sum"), orders=("order_id", "count"))
)
```

## Grouper (groupby por tiempo sin set_index)

```python
(
    orders
    .groupby(pd.Grouper(key="created_at", freq="W"))
    .agg(revenue=("amount", "sum"))
)
```

## Ventanas moviles

```python
daily_revenue = (
    orders
    .set_index("created_at")
    .sort_index()
    .resample("D")["amount"]
    .sum()
)

rolling_7d = daily_revenue.rolling(window=7, min_periods=1).mean()
```

Tambien existe `expanding()` para acumulados desde el inicio.

## Diferencias y desplazamientos

```python
daily_revenue.diff()           # cambio vs dia anterior
daily_revenue.pct_change()     # variacion relativa
daily_revenue.shift(1)         # valor del periodo previo (features lag)
```

## Rellenar huecos temporales

```python
idx = pd.date_range(daily_revenue.index.min(), daily_revenue.index.max(), freq="D", tz="UTC")
complete = daily_revenue.reindex(idx).fillna(0)
```

Elige `fillna(0)` solo si "sin pedidos" = cero. En sensores, a veces conviene `ffill` o interpolar.

## Fechas de negocio

```python
# Sumar dias laborables (excluye fines de semana; festivos aparte)
ship_by = orders["created_at"] + pd.offsets.BDay(3)
```

Para calendarios con festivos locales usa librerias dedicadas o una tabla de festivos propia.

## Errores habituales

- Dejar fechas como `object` y ordenar lexicograficamente (`"10/02"` vs `"2/10"`).
- Mezclar timezone-aware y naive.
- Usar `utc=False` por defecto y luego comparar logs de servidores en UTC.
- `resample` sin `sort_index()` previo.
- Agrupar por `dt.strftime` cuando basta `Grouper` o `Period` (mas lento y fragil).

## Buenas practicas

- `to_datetime` + UTC al cargar.
- Indice temporal ordenado para `resample`, `rolling` y slices por etiqueta.
- Guarda timestamps en Parquet; evita CSV para series largas.
- Separa grano diario/mensual del grano transaccional (no mezcles en la misma tabla analitica).
- Documenta si el timestamp es evento (`created_at`) o foto (`snapshot_at`).

## Ejercicios

1. Parsea una columna con formatos mixtos y cuenta cuantos `NaT` salen.
2. Localiza/convierte a UTC y crea columnas `year_month` y `weekday`.
3. Calcula revenue diario con `resample("D")` y una media movil de 7 dias.
4. Completa dias faltantes con `reindex` y `fillna(0)`.
5. Agrega revenue semanal con `pd.Grouper(freq="W")` por pais (merge con groupby doble).

## Siguiente paso

El [capitulo 8](08-rendimiento.md) explica como mantener estos flujos rapidos: dtypes, vectorizacion, categorical, Parquet y alternativas cuando Pandas se queda corto.

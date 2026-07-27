# Lectura y escritura

Cargar mal un archivo arrastra errores a todo el analisis: tipos incorrectos, fechas como texto, columnas fantasma y memoria inflada. Este capitulo cubre los formatos habituales y los parametros que evitan esos fallos.

## Formatos habituales

| Formato | Cuando usarlo | Notas |
|--------|---------------|-------|
| **CSV** | Intercambio simple, exports de sistemas legacy | Sin tipos nativos; hay que parsear |
| **Parquet** | Intermedios y datasets analiticos | Columnar, tipado, compresion |
| **Excel** | Informes y datos de negocio | Lento; mejor para humanos que para pipelines |
| **JSON / JSONL** | APIs y logs | Nested; a veces necesita `json_normalize` |
| **SQL** | Leer tablas o queries | Via SQLAlchemy / conectores |

Regla practica: usa CSV/Excel en los bordes (entrada humana, entrega a terceros) y Parquet dentro del pipeline.

## CSV

```python
import pandas as pd

orders = pd.read_csv(
    "orders.csv",
    sep=",",
    encoding="utf-8",
    usecols=["order_id", "country", "amount", "created_at"],
    dtype={"order_id": "Int64", "country": "string"},
    parse_dates=["created_at"],
    na_values=["", "NA", "N/A", "null"],
)
```

Parametros que mas importan:

- `usecols`: no cargues columnas que no vas a usar.
- `dtype`: fija tipos temprano; evita `object` accidental.
- `parse_dates` / `to_datetime`: fechas como datetime, no strings.
- `na_values`: unifica marcadores de nulo del origen.
- `nrows`: prototipa con una muestra antes de leer el fichero entero.
- `chunksize`: itera por bloques cuando el CSV no cabe comodo en memoria.

```python
# Prototipo
sample = pd.read_csv("orders.csv", nrows=5_000)

# Lectura por chunks
chunks = []
for chunk in pd.read_csv("orders.csv", chunksize=50_000):
    chunk = chunk[chunk["amount"].notna()]
    chunks.append(chunk)
orders = pd.concat(chunks, ignore_index=True)
```

Escritura:

```python
orders.to_csv("orders_clean.csv", index=False, encoding="utf-8")
```

`index=False` evita una columna `Unnamed: 0` al volver a leer.

## Parquet

```python
orders.to_parquet("orders.parquet", index=False, engine="pyarrow")
orders = pd.read_parquet(
    "orders.parquet",
    columns=["order_id", "country", "amount", "created_at"],
    engine="pyarrow",
)
```

Ventajas frente a CSV:

- Conserva dtypes (incluidas categorias y timestamps).
- Compresion y lectura columnar (solo las columnas pedidas).
- Menos errores de encoding y separadores.

Necesitas `pyarrow` (o `fastparquet`) instalado.

## Excel

```python
sales = pd.read_excel(
    "sales.xlsx",
    sheet_name="2024",
    engine="openpyxl",
    dtype={"sku": "string"},
)

# Varias hojas
book = pd.read_excel("sales.xlsx", sheet_name=None)  # dict nombre -> DataFrame
```

```python
with pd.ExcelWriter("report.xlsx", engine="openpyxl") as writer:
    summary.to_excel(writer, sheet_name="summary", index=False)
    detail.to_excel(writer, sheet_name="detail", index=False)
```

Excel no escala: para datasets grandes convierte a Parquet en cuanto puedas.

## JSON y nested data

```python
# Array de objetos
events = pd.read_json("events.json")

# JSON Lines (un objeto por linea)
events = pd.read_json("events.jsonl", lines=True)
```

Datos anidados:

```python
import json
from pathlib import Path

raw = json.loads(Path("payload.json").read_text(encoding="utf-8"))
users = pd.json_normalize(raw["users"], sep="_")
```

`json_normalize` aplana dicts anidados a columnas (`address_city`, etc.).

## SQL

```python
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://user:pass@localhost/shop")

orders = pd.read_sql(
    "SELECT order_id, country, amount, created_at FROM orders WHERE created_at >= %(start)s",
    engine,
    params={"start": "2024-01-01"},
    parse_dates=["created_at"],
)

summary.to_sql("country_summary", engine, if_exists="replace", index=False)
```

Prefiere parametros enlazados a concatenar strings SQL.

## Control de tipos tras la carga

Aunque pases `dtype`, valida siempre:

```python
print(orders.dtypes)
print(orders.isna().mean().sort_values(ascending=False).head(10))

orders["amount"] = pd.to_numeric(orders["amount"], errors="coerce")
orders["created_at"] = pd.to_datetime(orders["created_at"], errors="coerce", utc=True)
```

`errors="coerce"` convierte basura a `NaN` en lugar de romper el pipeline; luego decides si dropear o imputar.

## Esquema y contratos

Para pipelines repetibles, fija un contrato minimo:

```python
REQUIRED = ["order_id", "country", "amount", "created_at"]

missing = set(REQUIRED) - set(orders.columns)
if missing:
    raise ValueError(f"Faltan columnas: {sorted(missing)}")

if orders["order_id"].duplicated().any():
    raise ValueError("order_id duplicado")
```

Guarda el resultado limpio en Parquet con el mismo esquema que esperan los pasos siguientes.

## Errores habituales

- Leer CSV sin `index=False` al escribir y acumular indices basura.
- Confiar en la inferencia de tipos con columnas mixtas (`"12"`, `"N/A"`, `None`).
- Cargar el Excel completo cuando solo necesitas una hoja y tres columnas.
- Usar CSV como formato intermedio entre jobs (mejor Parquet).
- Ignorar encoding (`latin-1` vs `utf-8`) y corromper caracteres.
- `read_sql` con f-strings y riesgo de inyeccion.

## Buenas practicas

- Prototipa con `nrows` o un fichero muestra.
- Declara `usecols`, `dtype` y fechas en la lectura.
- Exporta intermedios a Parquet.
- Versiona rutas y nombres de fichero (`orders_2024-06.parquet`), no sobrescribas a ciegas.
- Tras leer, corre `info()`, conteo de nulos y una validacion de claves.

## Ejercicios

1. Crea un CSV de pedidos y cargalo con `dtype`, `parse_dates` y `na_values`.
2. Convierte `amount` con `to_numeric(errors="coerce")` y cuenta cuantos nulos aparecen.
3. Guarda el DataFrame limpio en Parquet y vuelve a leer solo tres columnas.
4. Exporta un resumen a Excel con dos hojas: `summary` y `sample`.
5. Escribe una funcion `load_orders(path)` que falle si faltan columnas obligatorias.

## Siguiente paso

Con datos en memoria tipados, el [capitulo 4](04-seleccion-filtrado-y-transformacion.md) trata seleccion, filtros y transformaciones vectorizadas.

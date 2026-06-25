# Manual de Pandas

Pandas es una libreria de Python para trabajar con datos tabulares en memoria. Es especialmente util para explorar datasets, limpiar informacion, transformar columnas, unir tablas, calcular agregaciones y preparar datos antes de cargarlos en una base de datos, un modelo de machine learning o un dashboard.

Pandas brilla cuando el volumen cabe razonablemente en memoria y necesitas iterar rapido. Si los datos son demasiado grandes, el trabajo deberia moverse a motores como PySpark, DuckDB, Polars, bases analiticas o pipelines distribuidos.

## Capitulos previstos

1. [Introduccion y entorno](01-introduccion-y-entorno.md)
2. [Series y DataFrames](02-series-y-dataframes.md)
3. [Lectura y escritura](03-lectura-y-escritura.md)
4. [Seleccion filtrado y transformacion](04-seleccion-filtrado-y-transformacion.md)
5. [Limpieza de datos](05-limpieza-de-datos.md)
6. [GroupBy agregaciones y joins](06-groupby-agregaciones-y-joins.md)
7. [Fechas y series temporales](07-fechas-y-series-temporales.md)
8. [Rendimiento](08-rendimiento.md)
9. [Proyecto de analisis](09-proyecto-de-analisis.md)

## Instalacion

```bash
python -m venv .venv
.venv\Scripts\activate
pip install pandas pyarrow openpyxl
```

En Linux o macOS, la activacion cambia:

```bash
source .venv/bin/activate
```

`pyarrow` es importante para trabajar bien con Parquet y tipos modernos. `openpyxl` permite leer y escribir Excel.

## Primer DataFrame

```python
import pandas as pd

df = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "country": ["ES", "PT", "ES"],
    "amount": [120.5, 80.0, 310.0],
})

print(df)
print(df.dtypes)
```

Leer un CSV:

```python
orders = pd.read_csv("orders.csv")
```

Inspeccion rapida:

```python
orders.head()
orders.info()
orders.describe()
orders.isna().sum()
```

## Flujo de trabajo recomendado

```txt
leer datos
  -> inspeccionar columnas, tipos y nulos
  -> limpiar nombres y tipos
  -> validar reglas basicas
  -> transformar
  -> agregar o unir
  -> exportar resultado
```

Ejemplo:

```python
orders = (
    pd.read_csv("orders.csv")
    .rename(columns=str.lower)
)

orders["created_at"] = pd.to_datetime(orders["created_at"], errors="coerce")
orders["amount"] = pd.to_numeric(orders["amount"], errors="coerce")

summary = (
    orders
    .dropna(subset=["created_at", "amount"])
    .groupby("country", as_index=False)
    .agg(total_amount=("amount", "sum"), orders=("order_id", "nunique"))
)

summary.to_parquet("country_summary.parquet", index=False)
```

## Buenas practicas

- Revisa `dtypes` nada mas cargar datos.
- Convierte fechas y numeros explicitamente.
- Prefiere operaciones vectorizadas a bucles fila a fila.
- Usa Parquet para datasets intermedios cuando sea posible.
- Documenta reglas de limpieza, no las escondas en una celda perdida.

## Errores comunes

- Tratar strings numericos como numeros sin convertirlos.
- Leer archivos grandes sin seleccionar columnas.
- Usar `apply` para todo.
- Ignorar zonas horarias en fechas.
- Encadenar transformaciones sin validar resultados intermedios.

## Ejercicio

1. Crea un CSV con columnas `order_id`, `country`, `amount` y `created_at`.
2. Cargalo con Pandas.
3. Convierte `amount` a numero y `created_at` a fecha.
4. Calcula ventas totales por pais.
5. Guarda el resultado en Parquet.

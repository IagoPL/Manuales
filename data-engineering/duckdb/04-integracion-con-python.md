# Integracion con Python

La API de Python es la forma mas comun de usar DuckDB en notebooks y pipelines: ejecutas SQL, intercambias DataFrames con Pandas/Polars/Arrow y materializas resultados sin levantar un servidor.

```bash
pip install duckdb pandas pyarrow
# opcional
pip install polars
```

## Conexion

```python
import duckdb

# Memoria (se pierde al cerrar)
con = duckdb.connect()

# Archivo persistente
con = duckdb.connect("analitica.duckdb")

# Solo lectura (util en procesos concurrentes de consulta)
con_ro = duckdb.connect("analitica.duckdb", read_only=True)
```

Cierra cuando termines ciclos largos:

```python
con.close()
```

O usa context manager:

```python
with duckdb.connect("analitica.duckdb") as con:
    con.execute("SELECT 1")
```

## Tres formas de consultar

### 1) `duckdb.sql` (atajo, conexion efimera por defecto)

```python
import duckdb

df = duckdb.sql("""
    SELECT pais, SUM(importe) AS total
    FROM read_csv_auto('pedidos.csv')
    GROUP BY pais
""").df()
```

### 2) `con.execute` / `con.sql` (recomendado en scripts)

```python
con = duckdb.connect("analitica.duckdb")

con.execute("""
    CREATE OR REPLACE TABLE pedidos AS
    SELECT * FROM read_csv_auto('pedidos.csv')
""")

res = con.execute("""
    SELECT pais, COUNT(*) AS n, SUM(importe) AS total
    FROM pedidos
    GROUP BY pais
    ORDER BY total DESC
""").fetchdf()

print(res)
```

### 3) Relacion orientada a metodos

```python
rel = con.sql("SELECT * FROM pedidos WHERE importe > 100")
print(rel.limit(5).df())
```

## Intercambio con Pandas

DuckDB puede **consultar un DataFrame por nombre** si esta en el namespace local, o registrarlo explicitamente.

```python
import pandas as pd
import duckdb

pedidos_df = pd.read_csv("pedidos.csv")

# Por nombre de variable (convenient en notebooks)
res = duckdb.sql("""
    SELECT pais, AVG(importe) AS ticket
    FROM pedidos_df
    GROUP BY pais
""").df()

# Registro explicito en una conexion
con = duckdb.connect()
con.register("pedidos", pedidos_df)
res2 = con.execute("SELECT COUNT(*) FROM pedidos").fetchone()
print(res2)
```

De DuckDB a Pandas:

```python
df = con.execute("SELECT * FROM pedidos").df()
# alias
df = con.execute("SELECT * FROM pedidos").fetchdf()
```

Arrow (cero-copia cuando es posible, mejor para volumen):

```python
arrow_table = con.execute("SELECT * FROM pedidos").arrow()
df = arrow_table.to_pandas()
```

## Polars

```python
import polars as pl
import duckdb

df_pl = pl.read_parquet("pedidos.parquet")
con = duckdb.connect()
con.register("pedidos_pl", df_pl)

out = con.execute("""
    SELECT pais, SUM(importe) AS total
    FROM pedidos_pl
    GROUP BY pais
""").pl()  # DataFrame Polars
```

## Parametros seguros

Nunca interpoles strings de usuario en SQL. Usa parametros:

```python
pais = "ES"
min_importe = 50.0

rows = con.execute(
    """
    SELECT pedido_id, importe
    FROM pedidos
    WHERE pais = ? AND importe >= ?
    ORDER BY importe DESC
    """,
    [pais, min_importe],
).fetchall()
```

Named parameters (estilo `$name` segun version):

```python
con.execute(
    "SELECT * FROM pedidos WHERE pais = $pais",
    {"pais": "ES"},
)
```

## Crear tablas y pipelines cortos

```python
import duckdb
from pathlib import Path

con = duckdb.connect("etl.duckdb")

con.execute("""
    CREATE OR REPLACE TABLE raw_pedidos AS
    SELECT * FROM read_csv_auto('landing/pedidos.csv')
""")

con.execute("""
    CREATE OR REPLACE TABLE stg_pedidos AS
    SELECT
        pedido_id,
        upper(trim(pais)) AS pais,
        CAST(importe AS DECIMAL(18, 2)) AS importe,
        CAST(fecha AS DATE) AS fecha
    FROM raw_pedidos
    WHERE importe IS NOT NULL AND importe >= 0
""")

con.execute("""
    COPY (
        SELECT pais, fecha, SUM(importe) AS total
        FROM stg_pedidos
        GROUP BY 1, 2
    ) TO 'marts/ventas_diarias.parquet' (FORMAT PARQUET)
""")

Path("marts").mkdir(exist_ok=True)  # asegurate antes si hace falta
```

Nota: crea directorios de salida antes de `COPY` si no existen.

## Relacion con archivos sin materializar

```python
con = duckdb.connect()

# Vista permanente en la base
con.execute("""
    CREATE OR REPLACE VIEW v_pedidos AS
    SELECT * FROM read_parquet('lake/pedidos/**/*.parquet')
""")

print(con.execute("SELECT COUNT(*) FROM v_pedidos").fetchone())
```

La vista no copia datos: cada consulta vuelve a leer Parquet (con pushdown).

## Configuracion desde Python

```python
con.execute("SET threads TO 4")
con.execute("SET memory_limit = '4GB'")
con.execute("SET enable_progress_bar = true")

print(con.execute("SELECT current_setting('threads')").fetchone())
```

Mas detalle de rendimiento en el capitulo 06.

## Testing minimo de una consulta

```python
def total_por_pais(con, pais: str) -> float:
    row = con.execute(
        "SELECT COALESCE(SUM(importe), 0) FROM pedidos WHERE pais = ?",
        [pais],
    ).fetchone()
    return float(row[0])


def test_total_es():
    con = duckdb.connect()
    con.execute("""
        CREATE TABLE pedidos AS
        SELECT * FROM (VALUES
            (1, 'ES', 10.0),
            (2, 'ES', 5.5),
            (3, 'PT', 7.0)
        ) t(pedido_id, pais, importe)
    """)
    assert total_por_pais(con, "ES") == 15.5
    con.close()
```

## Errores habituales

- Usar `duckdb.sql` suelto en servicios largos sin controlar la conexion (mejor `connect` explicito).
- Abrir la misma `.duckdb` en escritura desde Airflow/uvicorn con varios workers.
- Hacer `df = con.execute(...).df()` de resultados enormes y quedarte sin RAM.
- Concatenar f-strings con input externo en SQL (inyeccion / rotura de queries).
- Registrar DataFrames con nombres que chocan con tablas reales.
- Olvidar `read_only=True` cuando solo consultas y otro proceso escribe.

## Buenas practicas

- Una conexion por proceso/tarea; no compartas conexiones entre threads sin cuidado.
- Prefiere Arrow/Parquet para transferencias grandes frente a CSV intermedio.
- Parametriza filtros; no armes SQL a mano.
- Materializa staging en tablas o Parquet; no rehagas lecturas CSV sucias en cada paso.
- En notebooks, separa celdas de extraccion, transformacion y export.
- Para jobs concurrentes de solo lectura, `read_only=True` o consulta Parquet directo sin `.duckdb` compartida.

## Ejercicios

1. Conecta a `practica.duckdb`, crea `pedidos` desde CSV y consulta un DataFrame Pandas.
2. Registra un DataFrame Pandas inventado y haz un `JOIN` SQL con una tabla DuckDB.
3. Reescribe una consulta con f-string a version con `?` / parametros.
4. Exporta un agregado a Parquet con `COPY` desde Python.
5. Escribe un test `pytest` que cree datos en memoria y valide un total.

## Siguiente paso

Continua con [Consultas sobre data lakes](05-consultas-sobre-data-lakes.md): `httpfs`, S3 y lectura remota sin bajar todo el lake.

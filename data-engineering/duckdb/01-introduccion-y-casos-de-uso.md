# Manual de DuckDB

DuckDB es un motor analitico embebido. Corre en el mismo proceso que tu script, notebook o CLI, lee Parquet/CSV/JSON (locales o remotos) y ejecuta SQL columnar con agregaciones, joins y ventanas sin montar un cluster.

Encaja cuando quieres analitica seria sobre datasets medianos o grandes en una sola maquina: exploracion, transformaciones batch, agregaciones de data lake y prototipos que luego se mueven a Spark o a un warehouse.

## Capitulos previstos

1. [Introduccion y casos de uso](01-introduccion-y-casos-de-uso.md)
2. [SQL analitico](02-sql-analitico.md)
3. [Lectura de CSV, JSON y Parquet](03-lectura-de-csv-json-y-parquet.md)
4. [Integracion con Python](04-integracion-con-python.md)
5. [Consultas sobre data lakes](05-consultas-sobre-data-lakes.md)
6. [Rendimiento](06-rendimiento.md)
7. [Buenas practicas](07-buenas-practicas.md)

## Que es DuckDB (y que no es)

DuckDB es:

- Un motor **OLAP** (consultas analiticas).
- **Embebido**: no hay servidor que administrar para el caso tipico.
- **Columnar**: lee y procesa por columnas, ideal para `GROUP BY`, filtros y proyecciones.
- Compatible con SQL moderno (CTEs, ventanas, `UNNEST`, tipos anidados).

DuckDB no es:

- Un sustituto de PostgreSQL/MySQL para apps transaccionales con muchos escritores concurrentes.
- Un cluster distribuido como Spark: un proceso, una maquina (o un contenedor).
- Un orquestador: no sustituye Airflow; se usa *dentro* de tareas.

## DuckDB vs SQLite, Pandas y Spark

| Herramienta | Fortaleza | Limitacion tipica | Cuando preferirla |
|---|---|---|---|
| **SQLite** | OLTP embebido, filas, escritura concurrente ligera | Analitica pesada lenta | Apps, config, caches locales |
| **Pandas** | API flexible en Python, prototipos rapidos | Todo en memoria; tipos y joins caros a escala | Limpieza exploratoria pequena/mediana |
| **DuckDB** | SQL analitico rapido, lee Parquet sin cargar todo | Un solo nodo; no es cluster | Agregaciones, joins, lakes locales/remotos |
| **Spark** | Escala horizontal, pipelines masivos | Arranque y ops mas pesados | Datos que no caben en una maquina |

Regla practica:

- Dataset que cabe en RAM y logica en Python -> Pandas o Polars.
- SQL analitico sobre Parquet/CSV sin cluster -> DuckDB.
- Multi-TB, muchos nodos, streaming largo -> Spark u otro motor distribuido.
- App con escrituras frecuentes por clave -> SQLite / Postgres.

Ejemplo mental: un notebook que agrega 20 GB de Parquet de ventas por dia suele ser mas rapido y simple en DuckDB que cargar todo a Pandas o levantar Spark local.

## Instalacion

CLI (recomendado para aprender SQL):

```bash
# Windows (winget) o descarga desde duckdb.org
winget install DuckDB.cli
```

Python:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install duckdb pandas pyarrow
```

En Linux/macOS:

```bash
source .venv/bin/activate
pip install duckdb pandas pyarrow
```

Comprueba la version:

```bash
duckdb --version
```

```python
import duckdb
print(duckdb.__version__)
```

## Modos: in-memory vs archivo

```sql
-- Sesion en memoria (se pierde al cerrar)
-- duckdb (sin argumentos)
```

```sql
-- Base persistente en disco
-- duckdb analitica.duckdb
ATTACH 'analitica.duckdb' AS db;
USE db;
```

En Python:

```python
import duckdb

# Memoria
con = duckdb.connect()

# Archivo (persistente)
con = duckdb.connect("analitica.duckdb")
```

Usa memoria para exploracion. Usa archivo cuando quieras tablas materializadas, vistas y reutilizar resultados entre sesiones.

## Primer SELECT

Crea un CSV de prueba `pedidos.csv`:

```csv
pedido_id,pais,importe,fecha
1,ES,120.50,2026-01-02
2,PT,80.00,2026-01-02
3,ES,310.00,2026-01-03
4,FR,45.25,2026-01-03
5,ES,99.90,2026-01-04
```

Desde la CLI:

```bash
duckdb
```

```sql
SELECT pais, COUNT(*) AS pedidos, ROUND(SUM(importe), 2) AS total
FROM read_csv_auto('pedidos.csv')
GROUP BY pais
ORDER BY total DESC;
```

Resultado esperado: ES lidera por importe, luego PT y FR.

Equivalente en Python:

```python
import duckdb

res = duckdb.sql("""
    SELECT pais, COUNT(*) AS pedidos, ROUND(SUM(importe), 2) AS total
    FROM read_csv_auto('pedidos.csv')
    GROUP BY pais
    ORDER BY total DESC
""").df()

print(res)
```

Nota: `read_csv_auto` infiere tipos. En produccion preferiras tipado explicito (capitulo 03).

## Casos de uso reales

1. **Explorar un data lake local**: `SELECT` sobre `*.parquet` sin importar a una base.
2. **Sustituir Pandas en agregaciones**: mismo notebook, SQL en vez de `groupby` encadenados.
3. **ETL ligero**: leer CSV/JSON, limpiar, escribir Parquet particionado.
4. **Consultas ad-hoc sobre S3/GCS/Azure** con `httpfs` (capitulo 05).
5. **Validacion de calidad**: conteos, nulos, duplicados antes de un job Spark/dbt.
6. **Prototipar SQL** que luego portas a BigQuery, Snowflake o Databricks.

## Flujo de trabajo tipico

```txt
datos (CSV / JSON / Parquet / S3)
        |
        v
  DuckDB (SQL / Python API)
        |
        +--> exploracion (df / CLI)
        +--> tablas/vistas materializadas
        +--> Parquet / CSV de salida
        +--> handoff a dbt / Spark / BI
```

## Errores habituales

- Tratar DuckDB como base OLTP multi-usuario con escrituras concurrentes intensas.
- Cargar todo a Pandas "porque ya lo conozco" y perder el pushdown columnar.
- Abrir la misma base `.duckdb` en escritura desde dos procesos a la vez.
- Confiar en inferencia de tipos de CSV en pipelines diarios.
- Esperar que DuckDB escale a petabytes repartidos en un cluster.

## Buenas practicas

- Empieza con CLI o `duckdb.sql(...)` antes de abstraer en capas.
- Prefiere Parquet como formato intermedio.
- Separa exploracion (memoria) de resultados reutilizables (archivo o Parquet).
- Versiona las consultas SQL junto al codigo del pipeline.
- Mide con `EXPLAIN` / `EXPLAIN ANALYZE` cuando algo sea lento (capitulo 06).

## Ejercicios

1. Instala DuckDB (CLI + paquete Python) y comprueba la version.
2. Crea `pedidos.csv` y ejecuta el `GROUP BY` del primer SELECT en CLI.
3. Repite la misma consulta con `duckdb.sql(...).df()` en Python.
4. Abre una base `practica.duckdb`, crea una tabla `pedidos` con `CREATE TABLE ... AS SELECT ... FROM read_csv_auto(...)`, cierra y vuelve a consultar.
5. Escribe en 3 lineas cuando usarias DuckDB frente a Pandas y frente a Spark en tu proyecto actual.

## Siguiente paso

Continua con [SQL analitico](02-sql-analitico.md): CTEs, ventanas y patrones que aprovechan el motor columnar.

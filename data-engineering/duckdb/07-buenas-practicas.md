# Buenas practicas

Este capitulo resume criterios para usar DuckDB en serio: cuando encaja, como organizar SQL y archivos, seguridad, calidad de datos y limites que no debes ignorar.

## Cuando usar DuckDB

Usa DuckDB si:

- Necesitas SQL analitico en una maquina (laptop, job batch, contenedor).
- Lees Parquet/CSV/JSON locales o en object storage.
- Sustituyes agregaciones lentas de Pandas sin montar Spark.
- Validas calidad o prototipas transformaciones antes de dbt/Spark/warehouse.

No uses DuckDB como:

- OLTP principal de una app con muchos escritores concurrentes.
- Sustituto de un cluster cuando los datos o el SLA exigen distribucion real.
- Almacenamiento a largo plazo "de registro" sin backup ni layout de lake claro (mejor Parquet versionado + catalogo).

## Arquitectura de referencia

```txt
landing (CSV/JSON)
    -> staging Parquet particionado (raw limpio)
        -> transformaciones DuckDB (SQL)
            -> marts Parquet / tablas .duckdb
                -> BI, notebooks, dbt downstream, export
```

Reglas:

- **Raw** inmutable o casi; no pises ficheros historicos.
- **Staging** tipado y con nombres estables.
- **Marts** agregados o entidades listos para consumo.
- El archivo `.duckdb` es opcional: muchos pipelines son 100% Parquet in/out.

## Organizacion del proyecto

```txt
proyecto/
  sql/
    staging/
    marts/
  scripts/
    run_etl.py
  data/
    landing/
    lake/
      staging/
      marts/
  tests/
  analitica.duckdb   # opcional, gitignored
```

```python
# scripts/run_etl.py
from pathlib import Path
import duckdb

ROOT = Path(__file__).resolve().parents[1]
SQL = ROOT / "sql"

def run_sql(con, path: Path) -> None:
    con.execute(path.read_text(encoding="utf-8"))

def main() -> None:
    con = duckdb.connect(str(ROOT / "analitica.duckdb"))
    con.execute("SET memory_limit = '6GB'")
    for name in ["staging/stg_pedidos.sql", "marts/mart_pais_dia.sql"]:
        run_sql(con, SQL / name)
    con.close()

if __name__ == "__main__":
    main()
```

Versiona SQL en Git. No versiones `.duckdb` ni secretos.

## Contratos de datos

Define columnas, tipos y granularidad por capa:

```sql
-- sql/staging/stg_pedidos.sql
CREATE OR REPLACE TABLE stg_pedidos AS
SELECT
    CAST(pedido_id AS BIGINT) AS pedido_id,
    upper(trim(pais)) AS pais,
    CAST(importe AS DECIMAL(18, 2)) AS importe,
    CAST(fecha AS DATE) AS fecha
FROM read_csv(
    'data/landing/pedidos.csv',
    header = true,
    columns = {
        'pedido_id': 'VARCHAR',
        'pais': 'VARCHAR',
        'importe': 'VARCHAR',
        'fecha': 'VARCHAR'
    }
)
WHERE pedido_id IS NOT NULL;
```

Documenta en un comentario o README corto:

- Granularidad: 1 fila = 1 pedido.
- Clave: `pedido_id`.
- Particion de salida: `fecha`.

## Calidad minima en cada run

```sql
-- Filas y nulos
SELECT
    COUNT(*) AS filas,
    COUNT(DISTINCT pedido_id) AS pedidos_unicos,
    SUM(CASE WHEN importe IS NULL THEN 1 ELSE 0 END) AS nulos_importe
FROM stg_pedidos;

-- Duplicados de clave
SELECT pedido_id, COUNT(*) AS n
FROM stg_pedidos
GROUP BY 1
HAVING COUNT(*) > 1;

-- Rangos
SELECT *
FROM stg_pedidos
WHERE importe < 0 OR fecha > CURRENT_DATE;
```

Falla el job si rompes reglas (conteo de duplicados > 0, etc.). No "miro el head y ya".

## Idempotencia

Reejecutar el mismo dia no debe duplicar marts.

```sql
-- Preferible: reemplazo atomico de particion / tabla
CREATE OR REPLACE TABLE mart_pais_dia AS
SELECT fecha, pais, SUM(importe) AS total
FROM stg_pedidos
GROUP BY 1, 2;

COPY mart_pais_dia TO 'data/lake/marts/pais_dia' (
    FORMAT PARQUET,
    PARTITION_BY (fecha),
    OVERWRITE_OR_IGNORE
);
```

Evita `INSERT` acumulativo sin clave de ejecucion si el job puede repetirse.

## Concurrencia y archivos .duckdb

- Un escritor a la vez por base `.duckdb`.
- Lecturas: `read_only=True` o consulta Parquet directo.
- En Airflow/Kubernetes: cada tarea con su working dir / fichero, o sin estado local compartido.
- No montes la misma base en NFS con multiples escritores.

## Seguridad

- Credenciales S3/GCS solo por entorno, rol o secret manager.
- Parametros en SQL (`?`) frente a f-strings con input externo.
- No expongas un `.duckdb` con PII en buckets publicos.
- Minimiza columnas sensibles en marts; aplica mascarado si el consumidor no las necesita.

## SQL mantenible

- CTEs con nombres de negocio.
- Una granularidad clara por modelo.
- Nada de `SELECT *` en marts publicados.
- Comentarios solo donde el "por que" no es obvio.
- Preferir funciones nativas a UDFs Python.

```sql
-- Claro
WITH pedidos_ok AS (
    SELECT * FROM stg_pedidos WHERE importe >= 0
),
agg AS (
    SELECT pais, SUM(importe) AS total
    FROM pedidos_ok
    GROUP BY 1
)
SELECT * FROM agg WHERE total > 0;
```

## Integracion con el resto del stack

| Pieza | Rol junto a DuckDB |
|---|---|
| Airflow / cron | Orquesta el job que abre DuckDB |
| dbt | Puede venir despues; DuckDB tambien puede ser destino en algunos setups |
| Pandas/Polars | Entrada/salida pequena; no el motor del agregado grande |
| Spark | Escala cuando un nodo no basta |
| Parquet lake | Fuente de verdad analitica portable |

DuckDB no compite con Airflow: se ejecuta *dentro* de una tarea.

## Limites a respetar

- Dataset mucho mayor que disco/RAM util del nodo, con joins explosivos: evalua Spark u otro motor.
- Streaming de baja latencia continua: no es el caso de uso fuerte.
- Miles de QPS transaccionales: motor equivocado.
- Equipos que necesitan catalogo gobernado enterprise: combina lake + catalogo (Glue, Unity, Iceberg) y usa DuckDB como motor de consulta/ETL donde encaje.

## Checklist pre-produccion

- [ ] Tipos explicitos en lecturas CSV/JSON de produccion
- [ ] Salida en Parquet particionado con naming estable
- [ ] Consultas parametrizadas; secretos fuera del codigo
- [ ] Tests de calidad (duplicados, nulos, rangos)
- [ ] Job idempotente (`CREATE OR REPLACE` / overwrite de particion)
- [ ] `memory_limit` / `threads` definidos en el job
- [ ] `.duckdb` y datos locales en `.gitignore`
- [ ] `EXPLAIN` revisado en las 2-3 consultas criticas
- [ ] Documentada granularidad de cada mart

## Errores habituales

- Tratar el notebook exploratorio como pipeline de produccion sin contratos.
- Compartir una base `.duckdb` entre workers en escritura.
- Dejar inferencia `*_auto` en el cron diario.
- Publicar marts con `SELECT *` y columnas inestables.
- Guardar access keys en SQL versionado.
- Releer raw remoto enorme para cada dashboard en vez de marts.
- Ignorar small files hasta que S3 y el listado se vuelven el cuello de botella.

## Buenas practicas (resumen operativo)

- Parquet como lingua franca; CSV solo en landing.
- SQL en ficheros versionados; Python orquesta.
- Filtra y proyecta temprano; materializa lo caliente.
- Una escritura a la vez por base; prefiere lake compartido.
- Mide con `EXPLAIN ANALYZE` cuando cambie el volumen.
- Disena para reejecucion segura.
- Documenta claves, granularidad y particiones.

## Ejercicios

1. Organiza un mini-repo con `sql/staging`, `sql/marts` y un `run_etl.py` que los ejecute.
2. Anade tres checks de calidad y haz que el script salga con codigo != 0 si fallan.
3. Convierte un notebook con SQL embebido en ficheros `.sql` + script.
4. Configura `.gitignore` para `*.duckdb`, `data/landing` y credenciales.
5. Escribe un parrafo para tu equipo: "DuckDB se usa para X; no se usa para Y" alineado a tu stack.

## Cierre del manual

Has cubierto el ciclo completo: que es DuckDB, SQL analitico, lectura de archivos, Python, lakes remotos, rendimiento y operacion. El siguiente salto natural es aplicar esto a un dataset real de tu lake (un dominio, un mes de particiones) y dejar un mart Parquet consumible por BI o por un job downstream.

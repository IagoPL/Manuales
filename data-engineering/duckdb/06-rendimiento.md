# Rendimiento

DuckDB es rapido "de serie" en analitica de un solo nodo, pero el orden de magnitud depende de formato, predicados, tipos, paralelismo y si materializas o relees bruto cada vez. Este capitulo da palancas concretas y como medir.

## Modelo mental

1. **Columnar**: cuanto menos columnas leas, mejor.
2. **Vectorizado**: procesa lotes; evita UDFs fila a fila en Python.
3. **Un proceso**: threads y RAM de *esta* maquina; no hay shuffle entre nodos.
4. **Late materialization**: filtros y proyecciones deben empujarse a Parquet/CSV readers.

Si tu cuello de botella es red (S3) o disco, optimizar solo el SQL CPU no basta.

## Medir antes de opinar

```sql
EXPLAIN
SELECT pais, SUM(importe)
FROM read_parquet('lake/pedidos/**/*.parquet', hive_partitioning = true)
WHERE fecha = DATE '2026-01-02'
GROUP BY pais;

EXPLAIN ANALYZE
SELECT pais, SUM(importe)
FROM pedidos
WHERE fecha = DATE '2026-01-02'
GROUP BY pais;
```

En Python:

```python
import time
import duckdb

con = duckdb.connect()
t0 = time.perf_counter()
con.execute("""
    SELECT pais, SUM(importe)
    FROM read_parquet('pedidos.parquet')
    GROUP BY pais
""").fetchall()
print("segundos:", time.perf_counter() - t0)
```

Cambia *una* variable por prueba: formato, filtro, columnas, threads.

## Threads y memoria

```sql
SET threads TO 8;
SET memory_limit = '8GB';
SET temp_directory = 'D:/tmp/duckdb';  -- spill a disco si hace falta
```

```python
con.execute("SET threads TO 4")
con.execute("SET memory_limit = '4GB'")
```

Guias:

- `threads`: cerca del numero de cores fisicos utiles; subir sin medida no siempre ayuda (contencion, IO).
- `memory_limit`: deja margen al OS y a Pandas si conviven en el mismo proceso.
- Si hay spill excesivo a `temp_directory`, o reduces el working set o subes RAM / materializas menos ancho.

## Proyeccion y predicados

Malo:

```sql
SELECT *
FROM read_parquet('s3://bucket/eventos/**/*.parquet')
-- luego filtras en Pandas
```

Mejor:

```sql
SELECT user_id, event_type, ts
FROM read_parquet(
    's3://bucket/eventos/**/*.parquet',
    hive_partitioning = true
)
WHERE fecha = DATE '2026-01-02'
  AND event_type = 'purchase';
```

Checklist:

- Columnas explicitas en el `SELECT`.
- Filtros sobre particiones Hive primero (`fecha`, ...).
- Filtros selectivos tempranos en CTEs.

## Tipos: baratos vs caros

| Tipo | Notas de rendimiento |
|---|---|
| `INTEGER` / `BIGINT` | Ideales para ids y conteos |
| `DECIMAL(p,s)` | Correcto para dinero; mas caro que `DOUBLE` |
| `DOUBLE` | Rapido; no para dinero contable |
| `VARCHAR` | Caro en agrupaciones masivas; normaliza claves |
| `DATE` / `TIMESTAMP` | Mejor que strings de fecha |

```sql
-- Evita agrupar por string sucio
SELECT upper(trim(pais)) AS pais, SUM(importe)
FROM pedidos
GROUP BY 1;

-- Mejor: normaliza en staging una vez
```

## Joins

- Asegura tipos alineados a ambos lados (`VARCHAR` vs `INT` rompe o castiga).
- Reduce filas *antes* del join con CTEs filtradas.
- Cuidado con explosiones many-to-many: valida `COUNT(*)`.

```sql
WITH pedidos_dia AS (
    SELECT pedido_id, customer_id, importe
    FROM pedidos
    WHERE fecha = DATE '2026-01-02'
),
clientes_es AS (
    SELECT customer_id, segmento
    FROM clientes
    WHERE pais = 'ES'
)
SELECT c.segmento, SUM(p.importe) AS total
FROM pedidos_dia p
JOIN clientes_es c USING (customer_id)
GROUP BY 1;
```

## Agregaciones y ventanas

- Ventanas con `PARTITION BY` de alta cardinalidad + orden amplio pueden ser caras: acota el set primero.
- Para top-N, `QUALIFY ROW_NUMBER() ... <= N` suele ser claro y eficiente.
- Prefiere `SUM(...) FILTER (WHERE ...)` a multiples scans cuando aplica.

## Preparar datos: Parquet bien hecho

Factores que mas mueven el aguja:

1. **Parquet vs CSV**: Parquet gana en casi cualquier agregado repetido.
2. **Tamano de archivo**: evita miles de ficheros de pocos KB; apunta a decenas/centenas de MB por archivo (orden de magnitud; depende del lake).
3. **Particiones**: baja/media cardinalidad (`fecha`, `pais`), no `user_id`.
4. **Row group / compresion**: Snappy o ZSTD; no regeneres el lake entero por micro-ajustes sin medir.
5. **Estadisticas**: Parquet con min/max ayuda al skip de row groups.

```sql
COPY (
    SELECT * FROM stg_pedidos
) TO 'lake/pedidos'
(
    FORMAT PARQUET,
    PARTITION_BY (fecha),
    COMPRESSION 'ZSTD',
    OVERWRITE_OR_IGNORE
);
```

## Indexes y tablas persistentes

DuckDB soporta indexes art (y variantes segun version) para busquedas puntuales en tablas persistentes. Para scans analiticos anchos sobre Parquet, el diseno columnar + particiones suele importar mas que indexar como en OLTP.

```sql
CREATE TABLE hechos AS SELECT * FROM read_parquet('lake/pedidos/**/*.parquet');
-- Consultas repetidas sobre el mismo subset: materializa marts
CREATE TABLE mart_diario AS
SELECT fecha, pais, SUM(importe) AS total
FROM hechos
GROUP BY 1, 2;
```

Materializar un mart pequeno usado cien veces casi siempre gana a releer raw.

## Evitar el puente lento con Python

Anti-patron:

```python
df = con.execute("SELECT * FROM grandes").df()
for _, row in df.iterrows():  # muerte por mil cortes
    ...
```

Patron:

```python
# Deja el trabajo en SQL
res = con.execute("""
    SELECT pais, SUM(importe) AS total
    FROM grandes
    GROUP BY pais
""").df()  # resultado pequeno
```

Si necesitas UDF, valora si existe funcion SQL nativa. Las UDFs Python rompen el pipeline vectorizado.

## Profiling rapido de IO vs CPU

Senales:

- CPU baja + disco/red altos -> formato, globs, small files, S3.
- CPU al 100% en todos los cores -> quizas el plan es CPU-bound (joins, hashes); revisa cardinalidad y tipos.
- Un solo core al 100% -> poco paralelismo o etapa serial; revisa `threads` y el plan.

## Errores habituales

- Optimizar SQL y seguir leyendo CSV gigante cada vez.
- `SELECT *` + filtrar en Pandas "porque es mas comodo".
- Particionar por columna casi unica (millones de carpetas).
- Subir `threads` a 128 en una maquina de 8 cores y declarar victoria.
- Materializar tablas anchas innecesarias ocupando disco y cache.
- Comparar tiempos en caliente vs frio (cache OS/S3) sin control.

## Buenas practicas

- Mide con `EXPLAIN ANALYZE` y timers simples.
- Normaliza a Parquet particionado en staging.
- Proyecta columnas y filtra temprano.
- Materializa marts de consultas calientes.
- Manten ficheros Parquet de tamano razonable.
- Deja la agregacion en DuckDB; Python solo orquesta.
- Ajusta `memory_limit` y `temp_directory` en jobs batch largos.

## Ejercicios

1. Toma un CSV y el mismo contenido en Parquet; compara el tiempo de un `GROUP BY` identico.
2. Ejecuta la misma agregacion con `SELECT *` subquery vs columnas explicitas; mira el plan.
3. Prueba `SET threads TO 1` vs `4` vs `8` en un agregado local grande.
4. Crea un mart diario materializado y compara N consultas al mart vs N al raw.
5. Genera a proposito muchos Parquet diminutos y luego unifica a menos archivos; vuelve a medir.

## Siguiente paso

Cierra el manual con [Buenas practicas](07-buenas-practicas.md): checklist operativo, limites del motor y como encajar DuckDB en un stack real.

# SQL analitico

DuckDB implementa SQL analitico moderno: CTEs, ventanas, agregaciones, joins, `QUALIFY`, tipos anidados y funciones de listas/structs. Este capitulo cubre los patrones que mas se usan en pipelines y exploracion.

Asume que ya puedes abrir la CLI o `duckdb.connect()` y leer un CSV basico (capitulo 01).

## Datos de ejemplo

Usa este dataset mental (o materializalo en una tabla):

```sql
CREATE OR REPLACE TABLE ventas AS
SELECT * FROM (VALUES
    (1, 'ES', 'online',  DATE '2026-01-02', 120.50),
    (2, 'ES', 'tienda',  DATE '2026-01-02',  80.00),
    (3, 'PT', 'online',  DATE '2026-01-03',  45.00),
    (4, 'ES', 'online',  DATE '2026-01-03', 310.00),
    (5, 'FR', 'tienda',  DATE '2026-01-04',  99.90),
    (6, 'ES', 'online',  DATE '2026-01-04',  55.10),
    (7, 'PT', 'online',  DATE '2026-01-05', 200.00),
    (8, 'ES', 'tienda',  DATE '2026-01-05',  15.00)
) AS t(pedido_id, pais, canal, fecha, importe);
```

## CTEs: consultas legibles por capas

Las Common Table Expressions (`WITH`) descomponen logica compleja sin tablas temporales basura.

```sql
WITH base AS (
    SELECT pais, canal, fecha, importe
    FROM ventas
    WHERE importe > 0
),
por_pais AS (
    SELECT
        pais,
        COUNT(*) AS pedidos,
        SUM(importe) AS total
    FROM base
    GROUP BY pais
)
SELECT *
FROM por_pais
WHERE total >= 100
ORDER BY total DESC;
```

CTEs anidadas en cadena son preferibles a subconsultas profundas: cada capa tiene nombre y se puede probar sola.

CTE recursiva (jerarquias, calendarios, grafos pequenos):

```sql
WITH RECURSIVE calendario AS (
    SELECT DATE '2026-01-01' AS dia
    UNION ALL
    SELECT dia + INTERVAL 1 DAY
    FROM calendario
    WHERE dia < DATE '2026-01-07'
)
SELECT * FROM calendario;
```

## Agregaciones esenciales

```sql
SELECT
    pais,
    COUNT(*) AS pedidos,
    COUNT(DISTINCT canal) AS canales,
    SUM(importe) AS total,
    AVG(importe) AS ticket_medio,
    MIN(fecha) AS primera_venta,
    MAX(fecha) AS ultima_venta
FROM ventas
GROUP BY pais
ORDER BY total DESC;
```

Filtro sobre agregados: `HAVING`.

```sql
SELECT canal, SUM(importe) AS total
FROM ventas
GROUP BY canal
HAVING SUM(importe) > 200;
```

`FILTER` acota una agregacion sin subconsulta:

```sql
SELECT
    pais,
    SUM(importe) FILTER (WHERE canal = 'online') AS online,
    SUM(importe) FILTER (WHERE canal = 'tienda') AS tienda
FROM ventas
GROUP BY pais;
```

## Window functions

Las ventanas calculan sobre particiones sin colapsar filas.

### Ranking y top-N por grupo

```sql
SELECT
    pedido_id,
    pais,
    importe,
    ROW_NUMBER() OVER (
        PARTITION BY pais
        ORDER BY importe DESC
    ) AS rn
FROM ventas;
```

Top 2 pedidos por pais con `QUALIFY` (filtra sobre la ventana sin subquery):

```sql
SELECT pedido_id, pais, importe
FROM ventas
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY pais
    ORDER BY importe DESC
) <= 2
ORDER BY pais, importe DESC;
```

`RANK` vs `DENSE_RANK` vs `ROW_NUMBER`:

- `ROW_NUMBER`: unico aunque haya empates.
- `RANK`: empates comparten puesto; deja huecos.
- `DENSE_RANK`: empates sin huecos.

### Acumulados y moving averages

```sql
SELECT
    fecha,
    pais,
    importe,
    SUM(importe) OVER (
        PARTITION BY pais
        ORDER BY fecha, pedido_id
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS acumulado_pais
FROM ventas
ORDER BY pais, fecha;
```

Media movil de 3 filas:

```sql
SELECT
    fecha,
    importe,
    AVG(importe) OVER (
        ORDER BY fecha, pedido_id
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS media_movil_3
FROM ventas
WHERE pais = 'ES'
ORDER BY fecha;
```

### LAG / LEAD

```sql
SELECT
    fecha,
    importe,
    LAG(importe) OVER (ORDER BY fecha, pedido_id) AS importe_prev,
    importe - LAG(importe) OVER (ORDER BY fecha, pedido_id) AS delta
FROM ventas
WHERE pais = 'ES'
ORDER BY fecha;
```

## Joins

```sql
CREATE OR REPLACE TABLE paises AS
SELECT * FROM (VALUES
    ('ES', 'Espana', 'EU'),
    ('PT', 'Portugal', 'EU'),
    ('FR', 'Francia', 'EU'),
    ('US', 'Estados Unidos', 'NA')
) AS t(codigo, nombre, region);

SELECT
    v.pedido_id,
    p.nombre AS pais_nombre,
    p.region,
    v.importe
FROM ventas v
INNER JOIN paises p ON v.pais = p.codigo;
```

Tipos que usaras:

- `INNER JOIN`: solo coincidencias.
- `LEFT JOIN`: conserva izquierda; derecha puede ser NULL.
- `ANTI JOIN` / `SEMI JOIN`: existencia o ausencia sin duplicar filas.

```sql
-- Pedidos de paises no catalogados
SELECT v.*
FROM ventas v
ANTI JOIN paises p ON v.pais = p.codigo;

-- Paises con al menos un pedido
SELECT p.*
FROM paises p
SEMI JOIN ventas v ON p.codigo = v.pais;
```

Cuidado con joins muchos-a-muchos: explotan el cardinal. Valida conteos antes y despues.

## CASE, COALESCE y tipado

```sql
SELECT
    pedido_id,
    importe,
    CASE
        WHEN importe >= 200 THEN 'alto'
        WHEN importe >= 80 THEN 'medio'
        ELSE 'bajo'
    END AS tramo,
    COALESCE(canal, 'desconocido') AS canal_safe
FROM ventas;
```

Casts explicitos:

```sql
SELECT
    CAST(importe AS DECIMAL(18, 2)) AS importe_dec,
    fecha::VARCHAR AS fecha_txt
FROM ventas;
```

## Listas, UNNEST y JSON ligero

```sql
SELECT UNNEST([10, 20, 30]) AS valor;

SELECT
    pais,
    LIST(importe ORDER BY fecha) AS importes
FROM ventas
GROUP BY pais;
```

Para JSON estructurado ver capitulo 03 (`read_json`, `json_extract`).

## Vistas vs tablas

```sql
-- Vista: se recalcula en cada consulta
CREATE OR REPLACE VIEW v_ventas_es AS
SELECT * FROM ventas WHERE pais = 'ES';

-- Tabla materializada: coste de escritura, lectura rapida
CREATE OR REPLACE TABLE mart_pais AS
SELECT pais, SUM(importe) AS total
FROM ventas
GROUP BY pais;
```

Usa vistas para logica reutilizable barata. Materializa cuando el resultado se consulta mucho o es caro de recalcular.

## Errores habituales

- Usar `GROUP BY` cuando necesitas conservar filas: ahi toca ventana.
- Olvidar la particion en `PARTITION BY` y rankear el dataset entero.
- `SELECT *` en joins anchos: lees columnas que no usas (peor en Parquet remoto).
- Confundir `WHERE` (antes de agregar) con `HAVING` / `QUALIFY`.
- CTEs recursivas sin condicion de parada claras -> bucles infinitos / limites de recursion.
- Comparar floats con `=` en vez de rangos o `DECIMAL`.

## Buenas practicas

- Nombra CTEs por semantica (`base`, `filtrado`, `agregado`), no `t1`, `t2`.
- Prefiere `QUALIFY` para top-N por grupo.
- Declara tipos en casts cuando el origen es texto.
- Comprueba cardinalidad tras cada join (`COUNT(*)` antes/despues).
- Deja el `ORDER BY` final solo donde el orden importa (salida, ventanas).
- Documenta la granularidad de cada CTE (una fila por pedido, por pais-dia, etc.).

## Ejercicios

1. Materializa la tabla `ventas` y calcula ticket medio por `pais` y `canal`.
2. Con ventanas, obten el pedido de mayor importe por pais (`QUALIFY` + `ROW_NUMBER`).
3. Calcula el acumulado de importe para `ES` ordenado por fecha.
4. Haz `LEFT JOIN` con `paises` y lista pedidos cuyo pais no exista (debe salir vacio con el seed actual; inserta un pedido `US` y repite).
5. Reescribe una subquery correlacionada tuya (si tienes) como CTE + join o semi join.

## Siguiente paso

Continua con [Lectura de CSV, JSON y Parquet](03-lectura-de-csv-json-y-parquet.md): como ingerir archivos reales sin sorpresas de tipos ni encoding.

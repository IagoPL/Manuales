# Consultas sobre data lakes

DuckDB puede consultar Parquet/CSV/JSON en object storage (S3, GCS, Azure, HTTP) con la extension `httpfs`. El patron tipico: el lake permanece en el bucket; DuckDB lee solo las columnas y particiones que la consulta necesita.

## Extension httpfs

```sql
INSTALL httpfs;
LOAD httpfs;
```

En Python suele bastar:

```python
import duckdb

con = duckdb.connect()
con.execute("INSTALL httpfs; LOAD httpfs;")
```

En versiones recientes `httpfs` a menudo se carga bajo demanda al usar `s3://` o `https://`, pero instalarla explicitamente evita sorpresas en CI.

## Lectura por HTTP/HTTPS

```sql
SELECT *
FROM read_parquet('https://ejemplo.com/datos/pedidos.parquet')
LIMIT 10;
```

Util para datasets publicos o artefactos versionados en URL. Para volumen serio, prefiere S3/GCS con credenciales y particionado.

## Configurar S3

Variables tipicas (AWS):

```sql
LOAD httpfs;

SET s3_region = 'eu-west-1';
SET s3_access_key_id = 'AKIA...';
SET s3_secret_access_key = 'secreto...';
-- Si usas endpoint compatible (MinIO, LocalStack):
-- SET s3_endpoint = 'localhost:9000';
-- SET s3_url_style = 'path';
-- SET s3_use_ssl = false;
```

Mejor con secretos (DuckDB secrets):

```sql
CREATE SECRET s3_secret (
    TYPE S3,
    KEY_ID 'AKIA...',
    SECRET 'secreto...',
    REGION 'eu-west-1'
);
```

En Python, lee de entorno; no hardcodees claves:

```python
import os
import duckdb

con = duckdb.connect()
con.execute("LOAD httpfs")
con.execute(f"SET s3_region = '{os.environ['AWS_REGION']}'")
con.execute(f"SET s3_access_key_id = '{os.environ['AWS_ACCESS_KEY_ID']}'")
con.execute(f"SET s3_secret_access_key = '{os.environ['AWS_SECRET_ACCESS_KEY']}'")
```

O deja que el SDK/entorno estandar resuelva credenciales cuando aplique a tu version/setup (instance role, `AWS_PROFILE`, etc.).

## Consultar un lake particionado

Layout ejemplo:

```txt
s3://mi-lake/pedidos/
  fecha=2026-01-01/pais=ES/part-000.parquet
  fecha=2026-01-01/pais=PT/part-000.parquet
  fecha=2026-01-02/pais=ES/part-000.parquet
```

```sql
SELECT pais, SUM(importe) AS total
FROM read_parquet(
    's3://mi-lake/pedidos/**/*.parquet',
    hive_partitioning = true
)
WHERE fecha BETWEEN DATE '2026-01-01' AND DATE '2026-01-07'
  AND pais IN ('ES', 'PT')
GROUP BY pais
ORDER BY total DESC;
```

El filtro sobre particiones reduce listados GET y bytes transferidos. Sin `hive_partitioning`, pierdes ese recorte automatico por path.

## Glob y multiples prefijos

```sql
SELECT * FROM read_parquet('s3://mi-lake/pedidos/fecha=2026-01-0*/*.parquet');

SELECT * FROM read_parquet([
    's3://mi-lake/pedidos/fecha=2026-01-01/**/*.parquet',
    's3://mi-lake/pedidos/fecha=2026-01-02/**/*.parquet'
]);
```

## Escribir de vuelta al lake

```sql
COPY (
    SELECT pais, fecha, SUM(importe) AS total
    FROM read_parquet(
        's3://mi-lake/pedidos/**/*.parquet',
        hive_partitioning = true
    )
    WHERE fecha = DATE '2026-01-02'
    GROUP BY 1, 2
) TO 's3://mi-lake/marts/ventas_diarias'
(
    FORMAT PARQUET,
    PARTITION_BY (fecha),
    OVERWRITE_OR_IGNORE
);
```

Permisos IAM: ademas de `s3:GetObject` / `ListBucket`, la escritura necesita `PutObject` (y a veces `DeleteObject` si hay overwrite).

## GCS y Azure (idea general)

Patrones equivalentes con prefijos y secretos propios:

```sql
-- GCS (ejemplo conceptual; revisa docs de tu version)
-- SET s3_endpoint / credenciales interoperables, o extension/secret tipo GCS

-- Azure: tipicamente azure:// con secret TYPE AZURE
```

La idea es la misma: autenticar, listar por glob/particion, leer Parquet columnar, escribir marts.

## Vista estable sobre el lake

```sql
CREATE OR REPLACE VIEW v_pedidos_lake AS
SELECT *
FROM read_parquet(
    's3://mi-lake/pedidos/**/*.parquet',
    hive_partitioning = true,
    union_by_name = true
);

SELECT fecha, COUNT(*) 
FROM v_pedidos_lake
WHERE fecha = DATE '2026-01-02'
GROUP BY fecha;
```

`union_by_name = true` ayuda cuando el esquema del lake evoluciona anadiendo columnas.

## Pushdown: por que importa

DuckDB + Parquet en S3:

1. Lista objetos (mejor si el prefijo ya esta acotado).
2. Lee metadata/footer de Parquet.
3. Descarga solo row groups / columnas relevantes cuando el predicado lo permite.

Por eso `SELECT pais, SUM(importe)` es mucho mas barato que `SELECT *` seguido de agregar en Pandas.

Comprueba el plan:

```sql
EXPLAIN
SELECT pais, SUM(importe)
FROM read_parquet('s3://mi-lake/pedidos/**/*.parquet', hive_partitioning = true)
WHERE fecha = DATE '2026-01-02'
GROUP BY pais;
```

## Cache local (opcional)

Para iterar en desarrollo sin pagar listados/GETs repetidos, descarga un subconjunto o materializa:

```sql
CREATE OR REPLACE TABLE cache_pedidos_semana AS
SELECT *
FROM read_parquet(
    's3://mi-lake/pedidos/**/*.parquet',
    hive_partitioning = true
)
WHERE fecha >= CURRENT_DATE - INTERVAL 7 DAY;
```

O `COPY` a disco local y trabaja contra `./cache/*.parquet`.

## Errores habituales

- Poner access keys en notebooks versionados o capturas de pantalla.
- Hacer `SELECT *` sobre un prefijo enorme en S3 "para ver".
- Filtrar por una columna que no es de particion esperando que no se listen ficheros (solo ayuda de verdad con particiones/paths y estadisticas).
- Glob `**` desde la raiz del bucket: listados caros y lentos.
- Escribir miles de archivos diminutos en el mart (small files).
- Mezclar regiones endpoint/bucket y recibir errores opacos de firma o timeout.
- Olvidar `LOAD httpfs` en entornos limpios (CI, contenedor nuevo).

## Buenas practicas

- Credenciales por entorno, rol de instancia o secrets; nunca en el repo.
- Particiona el lake por columnas de filtro real (`fecha` primero).
- Acota globs al prefijo minimo necesario.
- Proyecta solo columnas usadas.
- Materializa marts agregados; no reconsultes raw para cada dashboard ad-hoc pesado.
- Usa `EXPLAIN` / conteos de archivos cuando una query remota sea lenta.
- Separa zonas: `raw/`, `staging/`, `marts/` con politicas IAM distintas.

## Ejercicios

1. `INSTALL`/`LOAD` httpfs y lee un Parquet publico por `https://` (busca un dataset de ejemplo pequeno).
2. Configura credenciales por variables de entorno y lista con un `SELECT COUNT(*)` sobre un prefijo de prueba.
3. Crea (localmente o en MinIO) un layout Hive `fecha=.../pais=...` y consulta con `hive_partitioning = true`.
4. Compara tiempo/bytes percibidos entre `SELECT *` y `SELECT pais, importe` con filtro de una sola `fecha`.
5. Escribe un mart agregado a otro prefijo con `COPY ... PARTITION_BY`.

## Siguiente paso

Continua con [Rendimiento](06-rendimiento.md): threads, memoria, planes, tipos y diseno de ficheros para que estas consultas sigan siendo rapidas.

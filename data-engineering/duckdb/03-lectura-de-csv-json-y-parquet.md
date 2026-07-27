# Lectura de CSV, JSON y Parquet

DuckDB brilla leyendo archivos directamente en SQL, sin etapa previa de "cargar a base". Este capitulo cubre `read_csv`, `read_json`, `read_parquet`, opciones de tipado, globbing y escritura.

## Principio: consulta el archivo

```sql
SELECT * FROM read_csv_auto('datos/pedidos.csv') LIMIT 5;
SELECT * FROM read_parquet('datos/pedidos.parquet') LIMIT 5;
SELECT * FROM read_json_auto('datos/eventos.json') LIMIT 5;
```

Tambien puedes usar la sintaxis de reemplazo:

```sql
SELECT * FROM 'datos/pedidos.parquet' LIMIT 5;
SELECT * FROM 'datos/*.parquet' LIMIT 5;
```

## CSV

### Auto vs explicito

`read_csv_auto` infiere delimitador, header y tipos. Util en exploracion.

```sql
SELECT * FROM read_csv_auto('pedidos.csv', sample_size = 20000);
```

En pipelines, fija opciones:

```sql
SELECT *
FROM read_csv(
    'pedidos.csv',
    header = true,
    delim = ',',
    quote = '"',
    escape = '"',
    dateformat = '%Y-%m-%d',
    timestampformat = '%Y-%m-%d %H:%M:%S',
    columns = {
        'pedido_id': 'INTEGER',
        'pais': 'VARCHAR',
        'importe': 'DECIMAL(18, 2)',
        'fecha': 'DATE'
    }
);
```

### Problemas tipicos de CSV

| Sintoma | Causa frecuente | Mitigacion |
|---|---|---|
| Numeros como `VARCHAR` | Coma decimal, miles, espacios | `decimal_separator`, limpieza, cast |
| Fechas mal parseadas | Formato local `dd/mm/yyyy` | `dateformat` explicito |
| Filas rotas | Delimitadores dentro de campos sin quote | Revisar `quote`/`escape` |
| Encoding raro | Latin-1 / Windows-1252 | `encoding = 'latin-1'` u otro |
| Columnas de mas/menos | CSV inconsistente | `ignore_errors`, `null_padding`, validar |

Ejemplo con separador europeo y encoding:

```sql
SELECT *
FROM read_csv(
    'ventas_eu.csv',
    header = true,
    delim = ';',
    decimal_separator = ',',
    encoding = 'utf-8',
    columns = {
        'importe': 'DECIMAL(18, 2)',
        'fecha': 'DATE'
    },
    dateformat = '%d/%m/%Y'
);
```

### Materializar CSV limpio

```sql
CREATE OR REPLACE TABLE pedidos AS
SELECT
    pedido_id,
    upper(trim(pais)) AS pais,
    CAST(importe AS DECIMAL(18, 2)) AS importe,
    CAST(fecha AS DATE) AS fecha
FROM read_csv_auto('pedidos.csv');
```

## JSON

### JSON Lines vs array

- **JSONL / NDJSON**: un objeto por linea. Ideal para logs y eventos.
- **Array JSON**: un unico `[ {...}, {...} ]`.

```sql
-- Auto detecta estructura
SELECT * FROM read_json_auto('eventos.jsonl');

-- Array en un archivo
SELECT * FROM read_json('eventos_array.json', format = 'array');
```

### Extraer campos

```sql
SELECT
    json_extract_string(payload, '$.user.id') AS user_id,
    json_extract(payload, '$.items') AS items,
    CAST(json_extract_string(payload, '$.amount') AS DECIMAL(18, 2)) AS amount
FROM read_json_auto('raw_events.jsonl');
```

Si `read_json_auto` ya aplana columnas:

```sql
SELECT
    event_id,
    user_id,
    event_type,
    CAST(ts AS TIMESTAMP) AS ts
FROM read_json_auto('eventos.jsonl');
```

### Listas anidadas con UNNEST

```sql
SELECT
    o.order_id,
    i.item_id,
    i.qty
FROM read_json_auto('orders.json') AS o,
     UNNEST(o.items) AS u(i);
```

## Parquet

Parquet es el formato por defecto recomendado: columnar, tipado, compresion, predicados y proyecciones eficientes.

```sql
SELECT pais, SUM(importe) AS total
FROM read_parquet('lake/pedidos/**/*.parquet')
WHERE fecha >= DATE '2026-01-01'
GROUP BY pais;
```

DuckDB puede empujar filtros y columnas al lector Parquet (no lee columnas innecesarias).

### Hive partitioning

Si el layout es `.../fecha=2026-01-02/pais=ES/part.parquet`:

```sql
SELECT *
FROM read_parquet(
    'lake/pedidos/**/*.parquet',
    hive_partitioning = true
)
WHERE fecha = DATE '2026-01-02' AND pais = 'ES';
```

Las columnas de particion aparecen en el resultado y se usan para no abrir ficheros irrelevantes.

### Schema y evolucion

```sql
-- Union de archivos con esquemas parecidos
SELECT * FROM read_parquet('lake/pedidos/*.parquet', union_by_name = true);
```

`union_by_name = true` alinea por nombre de columna (no por posicion). Util cuando anadiste columnas nuevas en ficheros recientes.

Describir esquema:

```sql
DESCRIBE SELECT * FROM read_parquet('lake/pedidos/part-0.parquet');
```

## Globbing y union de fuentes

```sql
SELECT * FROM read_csv_auto('landing/2026-01-*.csv');
SELECT * FROM read_parquet(['a.parquet', 'b.parquet']);

SELECT *, 'csv' AS origen FROM read_csv_auto('a.csv')
UNION ALL BY NAME
SELECT *, 'parquet' AS origen FROM read_parquet('b.parquet');
```

## Escritura

```sql
COPY (
    SELECT pais, SUM(importe) AS total
    FROM pedidos
    GROUP BY pais
) TO 'salida/resumen_pais.parquet' (FORMAT PARQUET);

COPY pedidos TO 'salida/pedidos.csv' (HEADER, DELIMITER ',');

-- Particionado
COPY pedidos TO 'lake/pedidos' (
    FORMAT PARQUET,
    PARTITION_BY (fecha, pais),
    OVERWRITE_OR_IGNORE
);
```

Desde SQL tambien:

```sql
CREATE OR REPLACE TABLE tmp AS SELECT * FROM read_csv_auto('pedidos.csv');
COPY tmp TO 'pedidos.parquet' (FORMAT PARQUET);
```

## Perfil rapido de un archivo

```sql
SUMMARIZE SELECT * FROM read_parquet('pedidos.parquet');

SELECT
    COUNT(*) AS filas,
    COUNT(DISTINCT pais) AS paises,
    SUM(CASE WHEN importe IS NULL THEN 1 ELSE 0 END) AS nulos_importe
FROM read_csv_auto('pedidos.csv');
```

## Errores habituales

- Dejar `read_csv_auto` en produccion sin `columns` ni formatos de fecha.
- Mezclar CSV con distinta cantidad de columnas sin validar.
- Leer JSON como texto y parsear a mano cuando `read_json` basta.
- Escribir miles de Parquet minusculos (un archivo por fila o por micro-lote).
- Ignorar `hive_partitioning` y filtrar solo en SQL tras abrir todo.
- Asumir que el orden de columnas en Parquet viejo y nuevo coincide (`union_by_name`).

## Buenas practicas

- Exploracion: `*_auto`. Produccion: opciones y tipos explicitos.
- Normaliza a Parquet en cuanto el CSV/JSON este limpio.
- Particiona por columnas de filtro frecuente (`fecha`, `pais`), no por alta cardinalidad (`pedido_id`).
- Valida filas, nulos y rangos justo despues de leer.
- Usa `SUMMARIZE` / `DESCRIBE` antes de disenar el modelo.
- Preferir JSONL frente a un unico array gigante.

## Ejercicios

1. Lee un CSV con `read_csv_auto` y vuelve a leerlo con `columns` explicitas; compara `DESCRIBE`.
2. Convierte ese CSV a Parquet con `COPY` y mide (mentalmente o con timer) un `GROUP BY` sobre ambos.
3. Crea un JSONL de eventos con un campo anidado y extrae `user_id` e `amount`.
4. Escribe Parquet particionado por `fecha` y consulta solo un dia con `hive_partitioning = true`.
5. Fuerza un CSV con una fila mal formada y prueba `ignore_errors = true`; luego arregla el archivo en vez de silenciar el error.

## Siguiente paso

Continua con [Integracion con Python](04-integracion-con-python.md): API de conexiones, DataFrames, registro de tablas y patrones notebook/pipeline.

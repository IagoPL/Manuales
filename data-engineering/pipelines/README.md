# Pipelines de datos

Un pipeline de datos es una secuencia de pasos que mueve datos desde una o varias fuentes hasta un destino, aplicando validaciones, transformaciones y controles de calidad.

## Conceptos clave

- **Origen:** sistema desde el que se extraen datos.
- **Destino:** sistema donde se almacenan o consumen los datos.
- **Ingesta:** captura de datos desde la fuente.
- **Transformación:** limpieza, enriquecimiento o modelado.
- **Orquestación:** coordinación de tareas y dependencias.
- **Calidad de datos:** validaciones para detectar errores.
- **Observabilidad:** logs, métricas y alertas.
- **Idempotencia:** capacidad de repetir una ejecución sin duplicar o corromper datos.

## Tipos de pipelines

### Batch

Procesa datos por lotes en intervalos definidos.

Ejemplos:

- Carga diaria de ventas.
- Agregación nocturna de métricas.
- Procesamiento de archivos CSV recibidos por SFTP.

### Streaming

Procesa eventos de forma continua o casi en tiempo real.

Ejemplos:

- Clickstream de una web.
- Eventos IoT.
- Logs de aplicaciones.

### Híbridos

Combinan cargas batch con procesamiento incremental.

## Diseño básico

Una estructura frecuente:

```txt
origen -> ingesta -> validación -> transformación -> destino -> monitorización
```

Capas recomendadas:

- **Raw:** datos tal como llegan.
- **Staging:** datos limpios y tipados.
- **Curated:** datos listos para consumo.
- **Serving:** tablas o vistas optimizadas para usuarios finales.

## Ejemplos prácticos

### Pipeline de archivos

```txt
CSV en carpeta -> NiFi -> validación -> Spark -> Parquet -> Snowflake
```

Controles mínimos:

- Validar que el archivo existe.
- Comprobar columnas obligatorias.
- Registrar fecha de carga.
- Guardar errores en una zona separada.

### Pipeline con Spark

```python
df = spark.read.option("header", True).csv("/raw/ventas.csv")

df_limpio = df.dropna(subset=["id", "fecha", "importe"])

df_limpio.write.mode("overwrite").parquet("/curated/ventas")
```

## Buenas prácticas

- Diseña pipelines idempotentes.
- Guarda datos crudos antes de transformarlos.
- Registra métricas de filas leídas, rechazadas y escritas.
- Separa configuración de código.
- Versiona transformaciones importantes.
- Añade alertas para fallos y retrasos.
- Documenta origen, destino, frecuencia y propietario.

## Errores comunes

- Sobrescribir datos sin backup o control.
- No distinguir entre errores técnicos y errores de calidad.
- No registrar qué versión del pipeline generó un dataset.
- Depender de rutas o credenciales hardcodeadas.
- No preparar reintentos ni reprocesos.

## Chuleta rápida

```txt
Raw: datos originales
Staging: datos limpios
Curated: datos transformados
Serving: datos listos para consumo
```

```txt
Métricas mínimas:
- filas leídas
- filas válidas
- filas rechazadas
- duración
- fecha de ejecución
```

## Recursos relacionados

- [Apache NiFi](../nifi/01-introduccion.md)
- [Apache Spark](../spark/README.md)
- [Databricks](../databricks/01-databricks.md)
- [Snowflake](../snowflake/README.md)

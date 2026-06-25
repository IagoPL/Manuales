# Structured Streaming

Structured Streaming permite procesar datos continuos usando la API de DataFrames y SQL de Spark. Es útil para eventos, logs, métricas y flujos que llegan de forma incremental.

## Conceptos clave

- **Stream:** fuente continua de datos.
- **Micro-batch:** pequeños lotes procesados periódicamente.
- **Trigger:** frecuencia de procesamiento.
- **Checkpoint:** estado persistente para tolerancia a fallos.
- **Watermark:** límite temporal para gestionar eventos tardíos.
- **Sink:** destino del resultado.

## Lectura de streaming

```python
stream_df = (
    spark.readStream
    .format("json")
    .schema(schema)
    .load("/data/events")
)
```

## Transformación

```python
from pyspark.sql.functions import col

errores = stream_df.filter(col("level") == "ERROR")
```

## Escritura de streaming

```python
query = (
    errores.writeStream
    .format("parquet")
    .option("path", "/data/output/errors")
    .option("checkpointLocation", "/data/checkpoints/errors")
    .start()
)
```

## Ventanas temporales

```python
from pyspark.sql.functions import window

conteo = (
    stream_df
    .groupBy(window(col("timestamp"), "5 minutes"), col("event_type"))
    .count()
)
```

## Buenas prácticas

- Define schemas explícitos.
- Usa checkpoint en rutas estables.
- Controla eventos tardíos con watermark cuando agregues por tiempo.
- Monitoriza latencia y throughput.
- Separa rutas de entrada, salida y checkpoints.
- Diseña sinks idempotentes cuando sea posible.

## Errores comunes

- Ejecutar streaming sin checkpoint.
- Cambiar schema sin plan de migración.
- No controlar duplicados.
- Usar rutas temporales para checkpoints.
- No dimensionar recursos según volumen de eventos.

## Chuleta rápida

```txt
readStream = leer flujo
writeStream = escribir flujo
checkpoint = recuperación
trigger = frecuencia
watermark = eventos tardíos
sink = destino
```

## Recursos relacionados

- [Arquitectura y RDDs](02-arquitectura-y-rdds.md)
- [Datos estructurados y SQL](05-datos-estructurados-y-sql.md)
- [Pipelines de datos](../pipelines/01-introduccion.md)

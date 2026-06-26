# Streaming

Structured Streaming permite procesar datos continuos con una API parecida a DataFrames.

## Lectura streaming

```python
events = (
    spark.readStream
    .format("json")
    .schema(schema)
    .load("/data/events")
)
```

## Transformacion

```python
summary = (
    events
    .withWatermark("event_time", "10 minutes")
    .groupBy(F.window("event_time", "5 minutes"), "event_type")
    .count()
)
```

## Escritura

```python
query = (
    summary.writeStream
    .format("parquet")
    .option("checkpointLocation", "/checkpoints/events")
    .outputMode("append")
    .start("/data/output")
)
```

## Checkpoints

El checkpoint guarda estado y offsets. Es obligatorio para recuperacion fiable.

## Output modes

- `append`
- `update`
- `complete`

## Buenas practicas

- Define checkpoint estable.
- Usa watermark para datos tardios.
- Controla tamaño de estado.
- Monitoriza input rate y processing time.
- No mezcles streaming con logica no idempotente sin cuidado.

# Observabilidad y troubleshooting

Spark se diagnostica con Spark UI, logs, metricas y analisis de planes.

## Spark UI

Revisa:

- Jobs.
- Stages.
- Tasks.
- SQL plans.
- Storage.
- Executors.

## Sintomas comunes

- Una task tarda muchisimo: skew.
- Muchos archivos pequeños: escritura mal particionada.
- Driver sin memoria: `collect()` o resultados enormes.
- Executors fallan: memoria, dependencias o datos problematicos.

## Planes

```python
df.explain(True)
```

Busca:

- `Exchange`
- `SortMergeJoin`
- scans completos.

## Logs

Incluye:

- Fecha procesada.
- Rutas de entrada/salida.
- Conteos.
- Duracion por fase.
- Parametros.

## Buenas practicas

- Guarda metricas por ejecucion.
- Revisa Spark UI en jobs lentos.
- Mide shuffle read/write.
- Detecta skew temprano.
- Centraliza logs.
- Documenta runbooks.


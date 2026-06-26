# Observabilidad y buenas practicas

Airflow debe mostrar claramente que se ejecuto, que fallo, cuanto tardo y que datos fueron afectados.

## Que observar

- DAG runs fallidos.
- Tasks fallidas.
- Duracion por task.
- Retries.
- Scheduler heartbeat.
- Workers disponibles.
- Cola de tareas.
- Tiempo de parseo de DAGs.
- Sensors bloqueados.

## Logs

Cada task tiene logs. Configura almacenamiento remoto si los workers son efimeros.

Opciones:

- S3.
- GCS.
- Azure Blob.
- Elasticsearch/OpenSearch.

## Alertas

Configura alertas por:

- Fallo de DAG critico.
- SLA incumplido.
- Scheduler sin heartbeat.
- Cola creciendo.
- Metadata DB con problemas.

## SLAs

Un SLA no es solo "fallo". Puede ser "este pipeline debe acabar antes de las 08:00".

## Pools

Pools limitan concurrencia hacia sistemas externos.

```txt
warehouse_pool: 4 slots
api_pool: 2 slots
```

Evitan saturar APIs o bases de datos.

## Retries

```python
retries=3
retry_delay=timedelta(minutes=5)
```

No todos los errores deben reintentarse. Valida datos malos no se arregla con retries.

## Buenas practicas

- Tareas idempotentes.
- Timeouts definidos.
- Pools para sistemas limitados.
- Logs con contexto de fecha y particion.
- Alertas accionables.
- DAGs pequeños y comprensibles.
- Evitar trabajo pesado en parseo.

## Errores comunes

- Reintentar errores de calidad de datos.
- No limpiar XComs o historico.
- No limitar concurrencia.
- Sensors ocupando workers.
- DAGs enormes con dependencias dificiles de leer.

# PySpark en produccion

PySpark en produccion requiere empaquetado, configuracion, recursos, logging, retries y contratos de datos.

## Entornos

Puede ejecutarse en:

- Databricks.
- EMR.
- Glue.
- Kubernetes.
- Spark standalone.
- YARN.

## Parametros

```bash
spark-submit \
  --master yarn \
  --deploy-mode cluster \
  --conf spark.sql.shuffle.partitions=400 \
  job.py
```

## Configuracion

No hardcodees rutas, secretos ni fechas.

Usa:

- Argumentos.
- Variables de entorno.
- Secret managers.
- Config por entorno.

## Idempotencia

Un job debe poder reintentarse.

Estrategias:

- Escribir a ruta temporal y hacer commit.
- Sobrescribir particion concreta.
- Usar MERGE.
- Registrar ejecuciones.

## Buenas practicas

- Versiona jobs.
- Controla dependencias Python.
- Parametriza fechas.
- Logs con contexto.
- Alertas ante fallos.
- Prueba con datos realistas antes de produccion.


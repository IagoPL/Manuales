# Manual de Apache Airflow

Apache Airflow es una plataforma para orquestar workflows. No procesa datos por si mismo como Spark ni almacena datos como PostgreSQL o Snowflake; coordina tareas, dependencias, horarios, reintentos, alertas y ejecuciones.

Su unidad principal es el DAG, un grafo aciclico dirigido que describe que tareas existen y en que orden deben ejecutarse.

## Capitulos previstos

1. [Introduccion y arquitectura](01-introduccion-y-arquitectura.md)
2. [DAGs tareas y operadores](02-dags-tareas-y-operadores.md)
3. [Scheduling](03-scheduling.md)
4. [XComs variables y conexiones](04-xcoms-variables-y-conexiones.md)
5. [Sensors y deferrable operators](05-sensors-y-deferrable-operators.md)
6. [Testing de DAGs](06-testing-de-dags.md)
7. [Despliegue](07-despliegue.md)
8. [Observabilidad y buenas practicas](08-observabilidad-y-buenas-practicas.md)
9. [Arquitectura interna](09-arquitectura-interna.md)
10. [DAGs dinamicos y TaskFlow avanzado](10-dags-dinamicos-y-taskflow-avanzado.md)
11. [Airflow en produccion](11-airflow-en-produccion.md)
12. [Patrones de pipelines de datos](12-patrones-de-pipelines-de-datos.md)
13. [CI/CD para DAGs](13-ci-cd-para-dags.md)
14. [Proyecto final](14-proyecto-final.md)

## Componentes principales

- **DAG:** definicion del workflow.
- **Task:** unidad de trabajo.
- **Operator:** plantilla para crear tareas.
- **Scheduler:** decide que tareas deben ejecutarse y cuando.
- **Executor:** define como se ejecutan las tareas.
- **Worker:** proceso que ejecuta tareas en ciertos executors.
- **Metadata database:** base donde Airflow guarda estado, historico y configuracion.
- **Webserver:** interfaz para ver DAGs, logs y ejecuciones.

## Arquitectura conceptual

```txt
DAG files
   |
   v
Scheduler -> Metadata DB <- Webserver
   |
   v
Executor -> Workers -> sistemas externos
```

Airflow suele llamar a otros sistemas: Spark, dbt, APIs, scripts Python, comandos Bash, Snowflake, BigQuery, Kubernetes o servicios cloud.

## Primer DAG

```python
from datetime import datetime

from airflow.decorators import dag, task


@dag(
    dag_id="hello_airflow",
    start_date=datetime(2026, 1, 1),
    schedule="@daily",
    catchup=False,
    tags=["learning"],
)
def hello_airflow():
    @task
    def extract():
        return {"rows": 100}

    @task
    def transform(payload: dict):
        return payload["rows"] * 2

    @task
    def load(total_rows: int):
        print(f"Rows processed: {total_rows}")

    load(transform(extract()))


hello_airflow()
```

## Cuando usar Airflow

- Pipelines batch con dependencias claras.
- Procesos diarios, horarios o bajo demanda.
- Coordinacion entre varios sistemas.
- Reintentos y alertas ante fallos.
- Auditoria de ejecuciones.

## Cuando no usar Airflow

- Procesamiento en tiempo real de baja latencia.
- Tareas que deberian vivir dentro de una aplicacion transaccional.
- Logica de negocio que no es orquestacion.
- Procesos muy simples que basta ejecutar con cron.

## Buenas practicas

- Mantener los DAGs declarativos y legibles.
- Evitar trabajo pesado en tiempo de parseo del DAG.
- Hacer tareas idempotentes.
- Definir `retries`, `retry_delay` y alertas.
- No pasar datos grandes por XCom.
- Versionar conexiones y variables fuera del codigo cuando contengan secretos.

## Errores comunes

- Confundir Airflow con un motor de procesamiento.
- Hacer llamadas a APIs o bases de datos al importar el archivo del DAG.
- Crear DAGs enormes y dificiles de depurar.
- Depender de orden implicito en vez de dependencias explicitas.
- Usar `catchup=True` sin entender que ejecutara periodos pasados.

## Ejercicio

Disena un DAG para cargar ventas diarias:

1. Extraer archivo CSV desde una carpeta.
2. Validar columnas obligatorias.
3. Cargar datos en una tabla `raw`.
4. Ejecutar transformacion a una tabla `marts`.
5. Enviar alerta si falla la validacion.

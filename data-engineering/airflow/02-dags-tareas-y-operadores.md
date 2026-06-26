# DAGs, tareas y operadores

Un DAG describe dependencias. Una task ejecuta una unidad de trabajo. Un operator define que tipo de trabajo se hace.

## DAG

```python
from datetime import datetime
from airflow import DAG

with DAG(
    dag_id="daily_sales",
    start_date=datetime(2026, 1, 1),
    schedule="@daily",
    catchup=False,
    tags=["sales"],
) as dag:
    ...
```

El DAG debe ser declarativo: definir estructura, no ejecutar trabajo pesado al importarse.

## TaskFlow API

```python
from airflow.decorators import dag, task

@dag(schedule="@daily", start_date=datetime(2026, 1, 1), catchup=False)
def sales_pipeline():
    @task
    def extract():
        return {"rows": 100}

    @task
    def transform(payload):
        return payload["rows"] * 2

    transform(extract())

sales_pipeline()
```

## Operadores clasicos

Ejemplos:

- `BashOperator`
- `PythonOperator`
- `DockerOperator`
- `KubernetesPodOperator`
- operadores de proveedores cloud o bases de datos.

## Dependencias

```python
extract >> transform >> load
```

Varias ramas:

```python
extract >> [validate, profile] >> load
```

## Idempotencia

Una tarea debe poder reintentarse sin romper datos.

Ejemplos:

- Escribir particion por fecha reemplazable.
- Usar upsert.
- Marcar ejecuciones con `logical_date`.
- Evitar nombres de archivos aleatorios sin control.

## Buenas practicas

- Tareas pequenas y observables.
- Dependencias explicitas.
- Nada pesado en parseo del DAG.
- Parametros por fecha de ejecucion.
- Reintentos y timeouts.
- Logs claros por task.

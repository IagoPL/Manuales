# Testing de DAGs

Los DAGs son codigo. Deben probarse para evitar errores de importacion, dependencias rotas y fallos logicos antes de llegar al scheduler.

## Test de importacion

```python
from airflow.models import DagBag

def test_dags_import_without_errors():
    dag_bag = DagBag(dag_folder="dags", include_examples=False)
    assert dag_bag.import_errors == {}
```

## Validar DAG esperado

```python
def test_daily_sales_has_tasks():
    dag_bag = DagBag(dag_folder="dags", include_examples=False)
    dag = dag_bag.get_dag("daily_sales")

    assert dag is not None
    assert {"extract", "transform", "load"} <= set(dag.task_ids)
```

## Dependencias

```python
def test_dependencies():
    dag = DagBag("dags").get_dag("daily_sales")
    assert dag.get_task("load").upstream_task_ids == {"transform"}
```

## Test de funciones puras

Extrae logica de negocio a funciones testeables fuera de Airflow.

```python
def normalize_row(row):
    return {"amount": float(row["amount"])}
```

Test:

```python
def test_normalize_row():
    assert normalize_row({"amount": "10.5"})["amount"] == 10.5
```

## Tests de integracion

Para operadores que llaman a bases, APIs o cloud, usa entornos controlados, mocks o contenedores.

## CI

La pipeline debe ejecutar:

```txt
lint -> unit tests -> DAG import tests -> package/deploy
```

## Buenas practicas

- Testea importacion de todos los DAGs.
- Saca logica compleja fuera del archivo DAG.
- Valida dependencias importantes.
- No dependas de conexiones reales en tests unitarios.
- Ejecuta tests en pull requests.

# DAGs dinamicos y TaskFlow avanzado

Airflow permite generar tareas dinamicamente, pero hay que hacerlo de forma determinista y legible.

## Dynamic task mapping

```python
@task
def list_files():
    return ["sales_1.csv", "sales_2.csv"]

@task
def process_file(file_name: str):
    print(file_name)

process_file.expand(file_name=list_files())
```

Airflow crea una task por elemento.

## Cuando usarlo

- Procesar archivos independientes.
- Ejecutar tareas por particion.
- Lanzar validaciones por tabla.

## Cuando evitarlo

- Miles de tasks sin necesidad.
- Flujos que deberian ejecutarse en Spark/dbt.
- Generacion no determinista en parseo.

## Task groups

```python
from airflow.utils.task_group import TaskGroup

with TaskGroup("quality") as quality:
    check_schema()
    check_nulls()
```

Agrupan visualmente tareas relacionadas.

## Parametrizacion

```python
@dag(params={"full_refresh": False})
def pipeline():
    ...
```

## Buenas practicas

- Generacion dinamica determinista.
- No crear tareas infinitas o excesivas.
- Usar TaskGroups para legibilidad.
- Mantener logica compleja fuera del archivo DAG.
- Documentar parametros de ejecucion.


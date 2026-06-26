# XComs, variables y conexiones

Airflow necesita pasar metadatos entre tareas y guardar configuracion. Para eso existen XComs, Variables y Connections.

## XComs

XCom permite pasar pequenos valores entre tareas.

```python
@task
def extract():
    return {"file": "sales_2026_06_26.csv"}

@task
def load(payload):
    print(payload["file"])
```

No uses XCom para datasets grandes.

## Que guardar en XCom

Adecuado:

- Ruta de archivo.
- Conteo de filas.
- Estado pequeno.
- ID de job externo.

No adecuado:

- DataFrames grandes.
- CSV completo.
- Payloads masivos.

## Variables

Variables guardan configuracion simple.

```python
from airflow.models import Variable

bucket = Variable.get("sales_bucket")
```

Evita llenar DAGs de `Variable.get` en tiempo de parseo si afecta rendimiento.

## Connections

Connections guardan credenciales y endpoints.

```python
conn_id="postgres_warehouse"
```

Los operadores usan `conn_id` para recuperar host, usuario, password y extras.

## Secret backends

En produccion, integra secretos con:

- AWS Secrets Manager.
- HashiCorp Vault.
- GCP Secret Manager.
- Azure Key Vault.

## Parametros

Puedes parametrizar ejecuciones:

```python
@dag(params={"full_refresh": False})
def pipeline():
    ...
```

## Buenas practicas

- XCom solo para metadatos pequenos.
- Connections para credenciales.
- Secret backend para produccion.
- Variables para configuracion no sensible.
- Evita secretos en codigo.
- Documenta variables requeridas por DAG.

# Testing y buenas practicas

Los pipelines PySpark deben probarse como software: funciones puras, transformaciones, schemas y casos borde.

## SparkSession de test

```python
import pytest
from pyspark.sql import SparkSession

@pytest.fixture(scope="session")
def spark():
    return (
        SparkSession.builder
        .master("local[2]")
        .appName("tests")
        .getOrCreate()
    )
```

## Test de transformacion

```python
def test_filter_valid_orders(spark):
    df = spark.createDataFrame([(1, 10.0), (2, -5.0)], ["id", "amount"])
    result = filter_valid_orders(df)
    assert result.count() == 1
```

## Comparar resultados

Para resultados pequeños:

```python
rows = [row.asDict() for row in result.collect()]
assert rows == [{"id": 1, "amount": 10.0}]
```

## Buenas practicas

- Extrae transformaciones a funciones.
- Testea schemas.
- Usa datasets pequeños.
- Evita depender de orden salvo que ordenes.
- Prueba nulos, duplicados y datos invalidos.
- Ejecuta tests en CI.

# Buenas practicas y proyecto

Este capitulo consolida criterios para escribir Python mantenible.

## Estilo

- Nombres de variables y funciones en `snake_case`.
- Clases en `PascalCase`.
- Constantes en `UPPER_CASE`.
- Funciones cortas y con responsabilidad clara.

```python
MAX_RETRIES = 3


def calculate_total(items: list[float]) -> float:
    return sum(items)
```

## Tipado gradual

```python
def get_user_email(user: dict[str, str]) -> str:
    return user["email"]
```

Para proyectos grandes, considera `mypy` o `pyright`.

## Logging

Evita usar `print` para diagnostico en aplicaciones reales:

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Proceso iniciado")
```

## Configuracion

Lee configuracion desde variables de entorno:

```python
import os

database_url = os.environ["DATABASE_URL"]
```

## Proyecto final

Crea una CLI sencilla para procesar pedidos:

```txt
orders.csv -> validacion -> resumen por pais -> output.json
```

Requisitos:

1. Leer CSV.
2. Validar columnas obligatorias.
3. Rechazar filas con importes invalidos.
4. Calcular total por pais.
5. Guardar JSON.
6. Incluir tests unitarios.
7. Registrar errores con `logging`.

## Estructura sugerida

```txt
orders-cli/
  src/
    orders/
      __init__.py
      reader.py
      validator.py
      summary.py
      writer.py
      cli.py
  tests/
    test_validator.py
    test_summary.py
  pyproject.toml
```

## Checklist

- El proyecto se ejecuta desde terminal.
- No hay rutas absolutas.
- Hay tests para casos validos e invalidos.
- Los errores tienen mensajes claros.
- El codigo esta dividido por responsabilidad.

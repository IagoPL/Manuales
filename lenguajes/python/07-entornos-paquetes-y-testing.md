# Entornos paquetes y testing

Un proyecto Python serio necesita aislamiento de dependencias, estructura clara y pruebas automatizadas.

## Entornos virtuales

```bash
python -m venv .venv
.venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install requests pytest
```

Guardar dependencias:

```bash
pip freeze > requirements.txt
```

Instalar desde archivo:

```bash
pip install -r requirements.txt
```

## Estructura simple

```txt
project/
  src/
    app/
      __init__.py
      services.py
  tests/
    test_services.py
  pyproject.toml
```

## Testing con pytest

Funcion:

```python
def add(a: int, b: int) -> int:
    return a + b
```

Test:

```python
from app.services import add


def test_add():
    assert add(2, 3) == 5
```

Ejecutar:

```bash
pytest
```

## pyproject.toml

Archivo moderno para configurar herramientas:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.ruff]
line-length = 100
```

## Buenas practicas

- Un entorno virtual por proyecto.
- No subas `.venv` al repositorio.
- Versiona dependencias.
- Escribe tests pequeños y claros.
- Automatiza formato y lint.

## Errores comunes

- Instalar paquetes globalmente sin control.
- Mezclar dependencias de varios proyectos.
- Escribir tests que dependen del orden de ejecucion.
- No probar errores y casos limite.

## Ejercicio

Crea un modulo `prices.py` con una funcion `apply_discount(price, percent)` y tests para descuento normal, descuento cero y porcentaje invalido.

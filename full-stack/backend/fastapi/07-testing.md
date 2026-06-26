# Testing

FastAPI facilita pruebas con `TestClient` y sobrescritura de dependencias.

## TestClient

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
```

## Sobrescribir dependencias

```python
def fake_current_user():
    return User(id=1, roles=["admin"])

app.dependency_overrides[get_current_user] = fake_current_user
```

## Test de validacion

```python
def test_invalid_product():
    response = client.post("/products", json={"name": "", "price": -1})
    assert response.status_code == 422
```

## Base de datos de test

Opciones:

- SQLite para tests simples.
- PostgreSQL con Testcontainers para integracion real.
- Transaccion rollback por test.

## Buenas practicas

- Testea endpoints y servicios.
- Sobrescribe dependencias externas.
- Cubre 401, 403, 404 y 422.
- Usa fixtures.
- Ejecuta tests en CI.

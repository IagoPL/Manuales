# Testing

Django incluye herramientas de testing para modelos, vistas, APIs y permisos.

## Test de modelo

```python
class ProductTests(TestCase):
    def test_product_str(self):
        product = Product.objects.create(name="Keyboard", sku="KB", price=10)
        self.assertEqual(str(product), "Keyboard")
```

## Test de vista

```python
def test_product_list(client):
    response = client.get("/products/")
    assert response.status_code == 200
```

## DRF APIClient

```python
client = APIClient()
response = client.get("/api/products/")
assert response.status_code == 200
```

## Factories

Usa factory_boy o fixtures para crear datos.

## Buenas practicas

- Testea modelos y endpoints.
- Cubre permisos.
- Usa factories.
- Evita tests dependientes del orden.
- Ejecuta tests en CI.

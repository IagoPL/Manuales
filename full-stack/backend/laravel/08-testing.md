# Testing

Laravel incluye PHPUnit/Pest, factories, testing HTTP y helpers de base de datos.

## Test HTTP

```php
public function test_health(): void
{
    $this->get('/health')->assertOk();
}
```

## Factory

```php
$product = Product::factory()->create();
```

## Test API

```php
$this->postJson('/api/products', [
    'name' => 'Keyboard',
    'price' => 49.99,
])->assertCreated();
```

## Base de datos

```php
use RefreshDatabase;
```

## Buenas practicas

- Tests de features para endpoints.
- Unit tests para servicios.
- Factories.
- Cubrir validación y permisos.
- Ejecutar en CI.

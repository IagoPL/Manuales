# Arquitectura de aplicaciones Laravel

Laravel permite empezar rápido, pero en proyectos grandes conviene separar responsabilidades.

## Estructura

```txt
app/
  Http/
    Controllers/
    Requests/
    Resources/
  Models/
  Services/
  Actions/
  Policies/
```

## Actions

```php
class CreateOrder
{
    public function handle(array $data): Order
    {
        return DB::transaction(fn () => Order::create($data));
    }
}
```

## Services

Usa servicios para integraciones y casos complejos.

## Buenas practicas

- Controladores finos.
- Form Requests.
- Resources.
- Policies.
- Actions para casos de uso.
- No meter todo en modelos.

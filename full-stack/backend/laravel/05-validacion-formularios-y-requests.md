# Validación, formularios y requests

Laravel permite validar directamente en controladores o mediante Form Requests.

## Validación simple

```php
$validated = $request->validate([
    'name' => ['required', 'string', 'max:120'],
    'price' => ['required', 'numeric', 'min:0'],
]);
```

## Form Request

```php
class StoreProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
```

## Uso

```php
public function store(StoreProductRequest $request)
{
    Product::create($request->validated());
}
```

## Autorización en request

```php
public function authorize(): bool
{
    return $this->user()->can('create', Product::class);
}
```

## Buenas practicas

- Form Requests para endpoints importantes.
- Mensajes claros.
- Validar entrada y permisos.
- Reglas de negocio en servicios.
- No confiar en validación frontend.

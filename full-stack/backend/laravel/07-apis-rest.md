# APIs REST

Laravel permite construir APIs REST con resources, Form Requests, policies y paginación.

## API Resource

```php
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
        ];
    }
}
```

## Respuesta

```php
return new ProductResource($product);
```

## Colección paginada

```php
return ProductResource::collection(Product::paginate(50));
```

## Errores

Usa formato consistente para APIs públicas.

## Buenas practicas

- Resources para salida.
- Form Requests para entrada.
- Paginación.
- Policies.
- Versionado si hay cambios incompatibles.

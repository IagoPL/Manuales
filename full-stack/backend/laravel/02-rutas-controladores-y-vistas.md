# Rutas, controladores y vistas

Laravel organiza la entrada HTTP mediante rutas, controladores y, si aplica, vistas Blade.

## Ruta básica

```php
Route::get('/health', function () {
    return ['status' => 'ok'];
});
```

## Controlador

```php
class ProductController extends Controller
{
    public function show(int $id): JsonResponse
    {
        return response()->json(Product::findOrFail($id));
    }
}
```

## Ruta a controlador

```php
Route::get('/products/{id}', [ProductController::class, 'show']);
```

## Resource controllers

```php
Route::apiResource('products', ProductController::class);
```

## Vistas Blade

```php
return view('products.index', ['products' => $products]);
```

## Buenas practicas

- Controladores finos.
- Rutas por dominio.
- Usar resource controllers cuando encaje.
- No mezclar lógica compleja en vistas.
- Separar API y web si el proyecto crece.

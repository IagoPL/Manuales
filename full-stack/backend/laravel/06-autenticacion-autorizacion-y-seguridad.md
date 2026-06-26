# Autenticación, autorización y seguridad

Laravel incluye autenticación, policies, gates, CSRF, hashing y herramientas como Sanctum.

## Sanctum

Para APIs y SPA:

```bash
php artisan install:api
```

## Middleware auth

```php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

## Policies

```php
class ProductPolicy
{
    public function update(User $user, Product $product): bool
    {
        return $user->is_admin;
    }
}
```

## Gates

```php
Gate::define('view-admin', fn (User $user) => $user->is_admin);
```

## Buenas practicas

- Hash de contraseñas con herramientas de Laravel.
- CSRF en web.
- Policies para recursos.
- No guardar secretos en repo.
- HTTPS en producción.
- Validar permisos en backend.

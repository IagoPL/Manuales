# Seguridad avanzada

Laravel trae muchas protecciones, pero hay que configurarlas correctamente.

## CSRF

Laravel protege formularios web con CSRF.

## XSS

Blade escapa por defecto:

```blade
{{ $name }}
```

Evita `{!! !!}` salvo contenido confiable.

## Mass assignment

Define `$fillable` o `$guarded`.

## Rate limiting

```php
RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60));
```

## Buenas practicas

- `APP_DEBUG=false`.
- Validación backend.
- Policies.
- Rate limiting.
- Secrets fuera del repo.
- Dependencias actualizadas.

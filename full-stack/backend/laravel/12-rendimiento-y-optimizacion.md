# Rendimiento y optimización

Laravel rinde bien si cuidas consultas, cache, colas y configuración de producción.

## N+1

```php
Order::with('user')->get();
```

## Cache

```php
Cache::remember('featured-products', 300, fn () => Product::featured()->get());
```

## Paginación

```php
Product::query()->paginate(50);
```

## Optimización

```bash
php artisan optimize
```

## Buenas practicas

- Eager loading.
- Índices en DB.
- Cache con invalidación.
- Queues para tareas lentas.
- `APP_DEBUG=false`.
- Medir antes de optimizar.

# Eloquent ORM

Eloquent es el ORM de Laravel. Permite trabajar con modelos, relaciones, scopes y consultas expresivas.

## Modelo

```php
class Product extends Model
{
    protected $fillable = ['name', 'sku', 'price', 'stock'];
}
```

## Consulta

```php
$products = Product::query()
    ->where('stock', '>', 0)
    ->orderBy('name')
    ->get();
```

## Relaciones

```php
class Order extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

## Eager loading

```php
Order::with('user')->get();
```

Evita N+1 queries.

## Scopes

```php
public function scopeActive($query)
{
    return $query->where('active', true);
}
```

## Buenas practicas

- Define `$fillable`.
- Usa eager loading.
- Evita queries en bucles.
- Usa casts.
- Revisa SQL en consultas críticas.

# Migraciones, seeders y factories

Las migraciones versionan el esquema. Seeders y factories crean datos para desarrollo y tests.

## Migración

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('sku')->unique();
    $table->string('name');
    $table->decimal('price', 12, 2);
    $table->unsignedInteger('stock')->default(0);
    $table->timestamps();
});
```

## Ejecutar

```bash
php artisan migrate
```

## Factory

```php
Product::factory()->count(10)->create();
```

## Seeder

```php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()->count(20)->create();
    }
}
```

## Buenas practicas

- Migraciones pequeñas.
- Índices y constraints.
- Factories para tests.
- No editar migraciones ya aplicadas en equipo.
- Probar rollback cuando aplique.

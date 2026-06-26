# Modelos y ORM

El ORM de Django permite definir modelos, relaciones, consultas y migraciones.

## Modelo

```python
class Product(models.Model):
    name = models.CharField(max_length=120)
    sku = models.CharField(max_length=80, unique=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
```

## Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

## Consultas

```python
Product.objects.filter(stock__gt=0).order_by("name")
```

## Relaciones

```python
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
```

## select_related y prefetch_related

```python
Order.objects.select_related("customer")
Product.objects.prefetch_related("categories")
```

Evitan N+1 queries.

## Buenas practicas

- Modela constraints.
- Usa migraciones.
- Evita queries en bucles.
- Revisa SQL con `queryset.query`.
- Usa `DecimalField` para dinero.

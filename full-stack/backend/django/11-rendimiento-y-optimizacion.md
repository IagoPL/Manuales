# Rendimiento y optimización

El rendimiento en Django suele depender del ORM, queries, caché, templates y configuración de despliegue.

## N+1 queries

```python
Order.objects.select_related("customer")
```

```python
Product.objects.prefetch_related("categories")
```

## only y defer

```python
Product.objects.only("id", "name", "price")
```

## Cache

```python
cache.set("products:featured", data, timeout=300)
```

## Paginación

No devuelvas colecciones enormes.

## Buenas practicas

- Medir queries.
- Usar select_related/prefetch_related.
- Cache con invalidación.
- Índices en base de datos.
- Evitar lógica pesada en templates.

# Django REST Framework

DRF es la librería más usada para construir APIs con Django.

## Serializer

```python
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "sku", "price", "stock"]
```

## ViewSet

```python
class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

## Router

```python
router = DefaultRouter()
router.register("products", ProductViewSet)

urlpatterns = router.urls
```

## Permisos

```python
permission_classes = [IsAuthenticated]
```

## Paginacion

```python
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
}
```

## Buenas practicas

- Serializers separados para lectura y escritura.
- Querysets optimizados.
- Permisos explícitos.
- Paginación por defecto.
- Tests de endpoints.

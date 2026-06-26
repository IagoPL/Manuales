# APIs profesionales con DRF

Una API DRF profesional necesita serializers claros, permisos, filtros, paginación, errores y documentación.

## Serializers separados

```python
class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "sku", "price"]
```

## Filtros

```python
class ProductViewSet(ModelViewSet):
    filterset_fields = ["category"]
    search_fields = ["name", "sku"]
```

## Errores

Define formato consistente si la API será consumida por clientes externos.

## OpenAPI

Usa drf-spectacular o similar para documentar contratos.

## Buenas practicas

- Versionado cuando haya cambios incompatibles.
- Paginación.
- Permisos por acción.
- Serializers específicos.
- Documentación OpenAPI.

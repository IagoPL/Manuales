# Vistas, URLs y templates

Django puede servir HTML tradicional o APIs. Entender vistas y URLs ayuda incluso cuando usas DRF.

## Function-based view

```python
def product_list(request):
    products = Product.objects.all()
    return render(request, "products/list.html", {"products": products})
```

## Class-based view

```python
class ProductListView(ListView):
    model = Product
    template_name = "products/list.html"
```

## URLs

```python
urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
]
```

## Templates

```html
{% for product in products %}
  <p>{{ product.name }}</p>
{% endfor %}
```

## Buenas practicas

- URLs con nombres.
- Vistas finas.
- Querysets optimizados.
- Templates sin logica compleja.
- Separar HTML y API si el proyecto crece.

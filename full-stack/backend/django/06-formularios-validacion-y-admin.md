# Formularios, validación y admin

Django incluye formularios, validación y un admin muy potente para gestión interna.

## Form

```python
class ProductForm(forms.Form):
    name = forms.CharField(max_length=120)
    price = forms.DecimalField(min_value=0)
```

## ModelForm

```python
class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "sku", "price", "stock"]
```

## Validación de modelo

```python
def clean(self):
    if self.price < 0:
        raise ValidationError("Price must be positive")
```

## Admin

```python
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "price", "stock"]
    search_fields = ["name", "sku"]
```

## Buenas practicas

- Usa validación en serializers/forms y modelos cuando aplique.
- Personaliza admin para operación real.
- No des permisos admin amplios sin necesidad.
- Audita cambios sensibles.

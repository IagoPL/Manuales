# Autenticación, permisos y seguridad

Django trae autenticación, sesiones, permisos, CSRF y protecciones de seguridad por defecto.

## Login requerido

```python
@login_required
def dashboard(request):
    return render(request, "dashboard.html")
```

## Permisos

```python
@permission_required("products.change_product")
def edit_product(request, pk):
    ...
```

## DRF permissions

```python
permission_classes = [IsAuthenticated]
```

## Seguridad en settings

```python
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## CSRF

Django protege formularios con CSRF. No lo desactives sin entender el riesgo.

## Buenas practicas

- `DEBUG=False` en producción.
- HTTPS.
- Cookies seguras.
- Permisos por recurso.
- Secretos fuera del repo.
- Dependencias actualizadas.

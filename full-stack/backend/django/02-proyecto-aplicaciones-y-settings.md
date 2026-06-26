# Proyecto, aplicaciones y settings

Django organiza un proyecto en aplicaciones. El proyecto contiene configuración global; las apps contienen funcionalidad reutilizable.

## Crear proyecto

```bash
django-admin startproject config .
python manage.py startapp products
```

## Estructura

```txt
config/
  settings.py
  urls.py
  asgi.py
  wsgi.py
products/
  models.py
  views.py
  urls.py
  tests.py
manage.py
```

## settings

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "products",
]
```

## Variables de entorno

No guardes secretos en settings.

```python
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG") == "1"
```

## URLs

```python
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/products/", include("products.urls")),
]
```

## Buenas practicas

- Una app por dominio.
- Settings por entorno.
- Secretos fuera del repo.
- `DEBUG=False` en produccion.
- URLs organizadas por app.

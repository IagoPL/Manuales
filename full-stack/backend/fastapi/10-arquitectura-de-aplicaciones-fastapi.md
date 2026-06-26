# Arquitectura de aplicaciones FastAPI

Una aplicacion FastAPI profesional separa rutas, modelos, servicios, repositorios, configuracion y errores.

## Estructura

```txt
app/
  main.py
  core/
    config.py
    security.py
  api/
    routers/
      products.py
  products/
    models.py
    schemas.py
    service.py
    repository.py
  shared/
    errors.py
```

## Routers

```python
api_router = APIRouter()
api_router.include_router(products.router, prefix="/products", tags=["products"])
```

## Servicios

Los servicios contienen casos de uso; los endpoints traducen HTTP.

## Repositorios

Los repositorios encapsulan persistencia.

## Buenas practicas

- Rutas finas.
- Servicios testeables.
- Repositorios para DB.
- Config centralizada.
- Errores consistentes.

# Dependencias

El sistema de dependencias de FastAPI permite reutilizar autenticacion, sesiones de base de datos, configuracion y servicios.

## Dependencia simple

```python
from fastapi import Depends

def get_current_locale() -> str:
    return "es"

@app.get("/hello")
def hello(locale: str = Depends(get_current_locale)):
    return {"locale": locale}
```

## Dependencia con yield

Util para recursos que deben cerrarse.

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Dependencias compartidas en router

```python
router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(require_admin)],
)
```

## Inyeccion de servicios

```python
def get_product_service(db: Session = Depends(get_db)):
    return ProductService(ProductRepository(db))
```

## Buenas practicas

- Usa dependencias para infraestructura transversal.
- No abuses de dependencias anidadas dificiles de seguir.
- Usa `yield` para cerrar recursos.
- Sobrescribe dependencias en tests.
- Mantén endpoints limpios.

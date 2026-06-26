# Documentacion OpenAPI

FastAPI genera OpenAPI automaticamente a partir de rutas, tipos y modelos Pydantic.

## Swagger UI

```txt
/docs
```

## ReDoc

```txt
/redoc
```

## Metadata

```python
app = FastAPI(
    title="Shop API",
    version="1.0.0",
    description="API de tienda online",
)
```

## Tags

```python
router = APIRouter(prefix="/products", tags=["products"])
```

## Respuestas documentadas

```python
@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    responses={404: {"description": "Product not found"}},
)
def get_product(product_id: int):
    ...
```

## Buenas practicas

- Usa modelos de respuesta.
- Agrupa por tags.
- Documenta errores comunes.
- Versiona la API.
- Revisa el esquema en CI si hay clientes generados.

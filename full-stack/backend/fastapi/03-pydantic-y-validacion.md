# Pydantic y validacion

FastAPI se apoya en Pydantic para validar entradas, serializar salidas y generar OpenAPI.

## Modelo de entrada

```python
from pydantic import BaseModel, Field

class CreateProductRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    price: float = Field(ge=0)
```

## Modelo de salida

```python
class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
```

## Validadores

```python
from pydantic import field_validator

class CreateUserRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()
```

## Modelos separados

No uses el mismo modelo para todo.

```txt
CreateProductRequest
UpdateProductRequest
ProductResponse
ProductInDb
```

## Validacion de negocio

Pydantic valida forma y tipos. Reglas de negocio como "SKU unico" deben vivir en servicios o casos de uso.

## Buenas practicas

- Separa modelos de entrada y salida.
- Usa constraints en campos.
- No expongas campos internos.
- Valida negocio fuera de Pydantic.
- Mantén modelos pequeños y legibles.

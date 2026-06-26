# Rutas, parametros y respuestas

FastAPI define endpoints con decoradores. Cada endpoint debe expresar claramente metodo HTTP, ruta, parametros, entrada y salida.

## Endpoint basico

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

## Parametros de ruta

```python
@app.get("/products/{product_id}")
def get_product(product_id: int):
    return {"id": product_id}
```

FastAPI valida y convierte tipos automaticamente.

## Query params

```python
@app.get("/products")
def list_products(search: str | None = None, page: int = 1):
    return {"search": search, "page": page}
```

## Codigos de estado

```python
from fastapi import status

@app.post("/products", status_code=status.HTTP_201_CREATED)
def create_product():
    return {"created": True}
```

## Response model

```python
from pydantic import BaseModel

class ProductResponse(BaseModel):
    id: int
    name: str

@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int):
    return {"id": product_id, "name": "Keyboard", "internal": "hidden"}
```

`response_model` filtra y documenta la respuesta.

## Errores HTTP

```python
from fastapi import HTTPException

if product is None:
    raise HTTPException(status_code=404, detail="Product not found")
```

## Buenas practicas

- Usa metodos HTTP correctamente.
- Define `response_model`.
- Devuelve codigos de estado coherentes.
- No mezcles logica de negocio compleja en endpoints.
- Usa routers por dominio.

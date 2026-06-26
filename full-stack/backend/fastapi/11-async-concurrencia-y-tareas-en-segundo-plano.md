# Async, concurrencia y tareas en segundo plano

FastAPI soporta endpoints sync y async. Elegir bien evita bloquear el event loop.

## Async endpoint

```python
@app.get("/external")
async def external():
    data = await client.get("https://api.example.com")
    return data.json()
```

## Sync endpoint

```python
@app.get("/cpu")
def cpu_work():
    return calculate()
```

## Regla practica

- Usa `async` con I/O async real.
- No uses librerias bloqueantes dentro de `async`.
- CPU intensivo debe ir a workers externos o procesos.

## BackgroundTasks

```python
from fastapi import BackgroundTasks

def send_email(email: str):
    ...

@app.post("/orders")
def create_order(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email, "user@example.com")
    return {"ok": True}
```

Para trabajos importantes, usa cola externa como Celery, RQ o un broker.

## Buenas practicas

- No bloquees event loop.
- Usa clientes HTTP async si el endpoint es async.
- BackgroundTasks solo para tareas ligeras.
- Usa colas para procesos criticos.
- Define timeouts.

# Despliegue

FastAPI se despliega normalmente con ASGI, usando Uvicorn o Gunicorn con workers Uvicorn.

## Ejecucion local

```bash
uvicorn app.main:app --reload
```

## Produccion

```bash
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --workers 4
```

## Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Health check

```python
@app.get("/health")
def health():
    return {"status": "ok"}
```

## Configuracion

Usa variables de entorno y `pydantic-settings`.

## Buenas practicas

- No uses `--reload` en produccion.
- Configura workers segun CPU y workload.
- Expón health checks.
- Logs a stdout.
- Secrets fuera del codigo.
- Ejecuta migraciones de forma controlada.

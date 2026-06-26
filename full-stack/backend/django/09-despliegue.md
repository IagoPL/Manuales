# Despliegue

Desplegar Django implica servidor WSGI/ASGI, static files, base de datos, configuración segura y migraciones.

## Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## Static files

```bash
python manage.py collectstatic
```

## Migraciones

```bash
python manage.py migrate
```

## Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## Checklist

- `DEBUG=False`.
- `ALLOWED_HOSTS` configurado.
- Secretos en entorno.
- Static files servidos.
- Migraciones controladas.
- Logs a stdout.

# Seguridad avanzada

La seguridad de FastAPI combina autenticacion, autorizacion, validacion, CORS, rate limiting y gestion de secretos.

## CORS

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

No uses `*` sin entender el riesgo.

## Rate limiting

Implementa en gateway, proxy o middleware dedicado.

## Headers

Configura headers de seguridad en proxy o middleware.

## Secrets

No guardes secretos en repo. Usa variables de entorno o secret manager.

## Autorizacion por recurso

No basta con rol global:

```python
if order.user_id != current_user.id:
    raise HTTPException(status_code=403)
```

## Buenas practicas

- HTTPS.
- CORS restrictivo.
- Permisos por recurso.
- Validacion de entrada.
- Rate limiting en endpoints sensibles.
- Rotacion de secretos.

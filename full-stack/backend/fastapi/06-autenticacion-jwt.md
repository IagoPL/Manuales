# Autenticacion JWT

JWT permite APIs stateless, pero no elimina la necesidad de validar firma, expiracion, permisos y revocacion segun el caso.

## OAuth2 password bearer

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
```

## Obtener usuario actual

```python
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = decode_token(token)
    user = find_user(payload["sub"])
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
```

## Proteger endpoint

```python
@app.get("/me")
def me(user: User = Depends(get_current_user)):
    return user
```

## Claims importantes

- `sub`: sujeto.
- `exp`: expiracion.
- `iat`: emitido en.
- `iss`: issuer.
- `aud`: audience.

## Roles y permisos

```python
def require_admin(user: User = Depends(get_current_user)):
    if "admin" not in user.roles:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user
```

## Buenas practicas

- Usa HTTPS.
- Valida expiracion, issuer y audience.
- No metas datos sensibles en JWT.
- Usa refresh tokens con cuidado.
- Comprueba permisos en servidor, no solo en frontend.

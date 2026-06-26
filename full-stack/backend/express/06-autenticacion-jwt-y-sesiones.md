# Autenticación JWT y sesiones

Express puede usar JWT, sesiones con cookies o proveedores externos. La decisión depende del tipo de cliente y seguridad requerida.

## Middleware JWT

```js
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.replace('Bearer ', '')

  if (!token) return res.status(401).json({ code: 'UNAUTHORIZED' })

  req.user = verifyToken(token)
  next()
}
```

## Proteger ruta

```js
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user)
})
```

## Sesiones

Para apps web, sesiones con cookies `HttpOnly`, `Secure` y `SameSite` suelen ser seguras.

## Autorización

```js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user?.roles?.includes(role)) return res.status(403).json({ code: 'FORBIDDEN' })
    next()
  }
}
```

## Buenas practicas

- HTTPS.
- Validar expiración y firma.
- No guardar secretos en JWT.
- Cookies seguras si usas sesiones.
- Permisos por recurso.

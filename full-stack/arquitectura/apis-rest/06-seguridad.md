# Seguridad

Una API REST expone capacidades del sistema. La seguridad no se anade al final: forma parte del contrato.

## Autenticacion

La API debe saber quien llama.

Opciones habituales:

- Cookies de sesion.
- JWT.
- OAuth 2.0 / OpenID Connect.
- API keys para integraciones servidor a servidor.

## Autorizacion

La autenticacion no basta. Tambien hay que validar que puede hacer la identidad.

```txt
Usuario autenticado
  -> puede leer sus pedidos
  -> no puede leer pedidos de otro usuario
  -> admin puede gestionar pedidos
```

## Validacion de entrada

Valida tipos, longitudes, rangos, formatos, campos permitidos y reglas de negocio. No confies en validaciones del frontend.

## Protecciones basicas

- HTTPS obligatorio.
- CORS configurado de forma explicita.
- Rate limiting.
- Limites de tamano de payload.
- Sanitizacion de logs.
- Proteccion contra mass assignment.
- Gestion segura de secretos.

## Datos sensibles

No devuelvas:

- Password hashes.
- Tokens.
- Secretos.
- Campos internos.
- Datos personales innecesarios.

## Errores de seguridad comunes

- `GET /users/{id}` sin comprobar propietario.
- Permitir `role=admin` en payload de actualizacion.
- Logs con tokens.
- CORS abierto sin necesidad.
- JWT sin expiracion ni rotacion.

## Checklist

- Cada endpoint tiene politica de permisos.
- Los tokens no se exponen en logs.
- Los payloads tienen limite.
- Los campos modificables estan controlados.
- Los errores no revelan informacion sensible.

# Seguridad en Next.js

Next.js mezcla cliente y servidor, por eso hay que distinguir muy bien que codigo se ejecuta donde.

## Secretos

No expongas secretos con `NEXT_PUBLIC_`.

```txt
DATABASE_URL=privado
NEXT_PUBLIC_SITE_URL=publico
```

## Server Actions

Valida siempre:

- Autenticacion.
- Autorizacion.
- Datos de entrada.
- Rate limiting si aplica.

## Cookies

Usa cookies seguras:

```txt
HttpOnly
Secure
SameSite
```

## Headers

Configura:

- Content Security Policy.
- X-Frame-Options o frame-ancestors.
- Referrer-Policy.
- Permissions-Policy.

## SSRF

No permitas que usuarios controlen URLs que tu servidor consulta sin validar.

## Buenas practicas

- Separa variables publicas y privadas.
- Comprueba permisos en servidor.
- Sanitiza HTML si usas contenido enriquecido.
- Protege endpoints route handlers.
- Audita dependencias.


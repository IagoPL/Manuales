# Seguridad en Angular

La seguridad en Angular combina buenas prácticas del framework con decisiones correctas de arquitectura, autenticación, autorización y comunicación con backend.

## Conceptos clave

- **XSS:** ejecución de scripts maliciosos en el navegador.
- **CSRF:** envío de peticiones no deseadas desde otro sitio.
- **Autenticación:** comprobar quién es el usuario.
- **Autorización:** comprobar qué puede hacer el usuario.
- **JWT:** token firmado usado en muchas APIs.
- **Guards:** mecanismos para proteger rutas.
- **Interceptor:** capa para modificar peticiones y respuestas HTTP.

## Protección contra XSS

Angular escapa valores interpolados por defecto.

```html
<p>{{ comentarioUsuario }}</p>
```

Evita insertar HTML dinámico si no es imprescindible.

```html
<!-- Usar con cuidado -->
<div [innerHTML]="contenidoHtml"></div>
```

## Guards de rutas

Los guards ayudan a bloquear rutas desde el cliente, aunque la autorización real también debe validarse en backend.

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

## Interceptors

Un interceptor puede añadir tokens a las peticiones.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq);
};
```

## Buenas prácticas

- Valida permisos en backend, no solo en frontend.
- No guardes secretos en el código cliente.
- Usa HTTPS en entornos reales.
- Centraliza autenticación y gestión de sesión.
- Gestiona expiración de tokens.
- Evita exponer mensajes internos de error al usuario.
- Revisa dependencias del proyecto con frecuencia.

## Errores comunes

- Confiar solo en guards para proteger datos.
- Guardar información sensible en localStorage sin evaluar riesgos.
- Insertar HTML dinámico sin control.
- Mostrar errores técnicos al usuario final.
- No gestionar expiración de sesión.

## Chuleta rápida

```txt
Guard = protege rutas en cliente
Backend = valida permisos reales
Interceptor = añade cabeceras
HTTPS = comunicación segura
No secrets = nada sensible en frontend
```

## Recursos relacionados

- [Enrutamiento](05-enrutamiento.md)
- [Comunicación con el servidor](07-comunicacion-con-servidor.md)
- [Arquitectura full stack](../../arquitectura/README.md)

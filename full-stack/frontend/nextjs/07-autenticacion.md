# Autenticacion

La autenticacion en Next.js puede hacerse con cookies, sesiones, OAuth, JWT o proveedores como Auth.js. La decision afecta seguridad, renderizado y cache.

## Cookies y servidor

En Server Components puedes leer cookies:

```tsx
import { cookies } from "next/headers"

export default function Page() {
  const token = cookies().get("session")
  ...
}
```

Leer cookies vuelve la ruta dinamica.

## Middleware

```tsx
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  if (!session) return NextResponse.redirect(new URL("/login", request.url))
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

## Sesiones

Para apps web, cookies httpOnly suelen ser preferibles a guardar tokens en localStorage.

Propiedades recomendadas:

```txt
HttpOnly
Secure
SameSite=Lax o Strict segun caso
```

## Autorizacion

No basta con proteger rutas. Las mutaciones deben comprobar permisos en servidor.

```tsx
if (!user.roles.includes("admin")) {
  throw new Error("Forbidden")
}
```

## Buenas practicas

- Usa cookies httpOnly para sesiones web.
- No guardes secretos en el cliente.
- Protege rutas y mutaciones.
- Invalida cache privada correctamente.
- Modela roles/permisos en backend o servidor.
- Prueba expiracion y logout.

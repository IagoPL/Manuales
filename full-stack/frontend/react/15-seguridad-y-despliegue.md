# Seguridad y despliegue en React

Una aplicación React se ejecuta en el navegador, por lo que no debe contener secretos ni confiar solo en validaciones del cliente. El despliegue consiste en compilar la aplicación y publicar archivos estáticos.

## Conceptos clave

- **Build:** generación de archivos listos para producción.
- **SPA:** aplicación de una sola página.
- **Variables de entorno:** configuración inyectada durante build.
- **XSS:** ejecución de código malicioso en el navegador.
- **Autenticación:** identificación del usuario.
- **Autorización:** control de permisos.

## Seguridad básica

React escapa valores interpolados por defecto.

```jsx
function Comentario({ texto }) {
  return <p>{texto}</p>;
}
```

Evita usar HTML dinámico salvo que sea imprescindible.

```jsx
<div dangerouslySetInnerHTML={{ __html: html }} />
```

## Variables de entorno

Las variables expuestas al frontend no son secretas. Úsalas para configuración pública, como URL de API.

```txt
VITE_API_URL=https://api.example.com
```

## Build y despliegue

```bash
npm run build
```

El resultado suele generarse en una carpeta como `dist/` o `build/`, según la herramienta usada.

## Rutas en SPA

Si usas React Router, el servidor debe redirigir rutas internas a `index.html`.

```txt
/perfil -> index.html -> React Router -> Perfil
```

## Buenas prácticas

- No guardes secretos en el frontend.
- Valida permisos reales en backend.
- Usa HTTPS.
- Gestiona expiración de sesión.
- Configura fallback para rutas SPA.
- Revisa dependencias y vulnerabilidades.
- Automatiza build y despliegue.

## Errores comunes

- Poner claves privadas en variables de entorno frontend.
- Confiar solo en ocultar botones para proteger acciones.
- Publicar sin probar recarga en rutas internas.
- Mostrar errores técnicos al usuario final.
- No diferenciar configuración de desarrollo y producción.

## Chuleta rápida

```txt
npm run build = build producción
dist/build = salida publicable
SPA fallback = index.html
Frontend env = no secreto
Backend = permisos reales
```

## Recursos relacionados

- [Navegación](07-navegacion.md)
- [Integración con APIs](08-integracion-con-apis.md)
- [Arquitectura full stack](../../arquitectura/README.md)

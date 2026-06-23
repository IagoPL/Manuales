# Despliegue y arquitectura de aplicaciones Angular

El despliegue de Angular consiste en compilar la aplicación, publicar archivos estáticos y conectarla correctamente con APIs, dominios, variables de entorno y configuración de servidor.

## Conceptos clave

- **Build:** proceso de compilación.
- **Dist:** carpeta con archivos listos para publicar.
- **SPA:** aplicación de una sola página.
- **Servidor estático:** servidor que entrega HTML, CSS y JavaScript.
- **Environment:** configuración por entorno.
- **CI/CD:** automatización de pruebas, build y despliegue.

## Build de producción

```bash
ng build --configuration production
```

El resultado se genera normalmente en `dist/`.

## Configuración por entorno

Usa archivos de configuración para diferenciar desarrollo y producción.

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};
```

Evita hardcodear URLs de API directamente en servicios.

## Publicación como SPA

En una SPA, el servidor debe redirigir rutas internas a `index.html`.

Ejemplo conceptual:

```txt
/productos/12 -> index.html -> Angular Router -> ProductoDetalleComponent
```

## Checklist de despliegue

- Ejecutar build de producción.
- Revisar variables de entorno.
- Probar rutas internas con recarga.
- Configurar HTTPS.
- Revisar tamaño de bundle.
- Configurar cabeceras de caché.
- Probar integración con API real.

## Arquitectura recomendada

```txt
Angular app
  -> servicios HTTP
  -> API backend
  -> base de datos
```

Separa responsabilidades:

- Componentes: presentación e interacción.
- Servicios: comunicación y lógica reutilizable.
- Guards: protección de rutas.
- Interceptors: gestión transversal de peticiones.
- Models/interfaces: contratos de datos.

## Buenas prácticas

- Automatiza build y despliegue.
- Usa rutas lazy para secciones grandes.
- No subas archivos con secretos.
- Mantén configuración por entorno.
- Documenta el proceso de despliegue.
- Añade pruebas antes del build final.

## Errores comunes

- Publicar sin configurar fallback a `index.html`.
- Usar URLs de desarrollo en producción.
- No probar rutas internas tras refrescar navegador.
- Ignorar errores de build.
- No versionar cambios de configuración.

## Chuleta rápida

```bash
ng build --configuration production
```

```txt
dist/ = archivos publicables
index.html = entrada SPA
environment = configuración
CI/CD = automatización
```

## Recursos relacionados

- [Enrutamiento](05-enrutamiento.md)
- [Rendimiento y optimización](10-rendimiento-y-optimizacion.md)
- [Seguridad](11-seguridad.md)

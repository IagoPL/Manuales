# Arquitectura full stack

La arquitectura full stack define cómo se organizan frontend, backend, base de datos, servicios externos, despliegue, seguridad y observabilidad dentro de una aplicación.

## Conceptos clave

- **Frontend:** interfaz que usa la persona usuaria.
- **Backend:** lógica de negocio, APIs, autenticación y acceso a datos.
- **Base de datos:** persistencia de información.
- **API:** contrato de comunicación entre cliente y servidor.
- **Autenticación:** verificación de identidad.
- **Autorización:** control de permisos.
- **Despliegue:** publicación de la aplicación en un entorno.
- **Observabilidad:** logs, métricas y trazas.

## Arquitectura básica

```txt
Navegador
  -> Frontend
  -> API backend
  -> Base de datos
```

Esta arquitectura es suficiente para muchas aplicaciones CRUD, dashboards internos y proyectos de portfolio.

## Capas habituales

### Presentación

Componentes, rutas, formularios, estado de interfaz y validaciones visuales.

### Aplicación

Casos de uso, servicios, controladores y coordinación de operaciones.

### Dominio

Reglas de negocio y entidades principales.

### Infraestructura

Base de datos, proveedores externos, sistema de archivos, colas, logs y clientes HTTP.

## Ejemplos prácticos

### Flujo de login

```txt
Formulario -> API /login -> validación -> token/session -> almacenamiento seguro -> rutas protegidas
```

### Flujo CRUD

```txt
Lista -> formulario -> validación frontend -> API -> validación backend -> base de datos -> respuesta
```

### Estructura orientativa de backend

```txt
src/
├── controllers/
├── services/
├── repositories/
├── models/
├── middlewares/
└── config/
```

## Buenas prácticas

- Mantén reglas críticas en backend, aunque también valides en frontend.
- Usa DTOs o contratos claros entre frontend y backend.
- Separa lógica de negocio de controladores.
- Centraliza gestión de errores.
- No expongas secretos en el cliente.
- Documenta endpoints y códigos de respuesta.
- Añade logs útiles para diagnosticar fallos.

## Errores comunes

- Poner toda la lógica en componentes frontend.
- Mezclar acceso a datos directamente en controladores.
- No validar datos en backend.
- Guardar tokens inseguros sin estrategia clara.
- Diseñar APIs sin criterios de paginación, filtros o errores.

## Chuleta rápida

```txt
Frontend: UI y experiencia
Backend: reglas y APIs
DB: persistencia
Auth: identidad y permisos
Logs: diagnóstico
Deploy: publicación
```

## Recursos relacionados

- [Angular](../frontend/angular/README.md)
- [React](../frontend/react/README.md)
- [PHP](../backend/php/tienda-online-con-php.md)
- [SQL](../../bases-de-datos/sql/README.md)

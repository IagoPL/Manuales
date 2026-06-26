# Proyecto final

El proyecto final consiste en disenar y construir una API REST profesional para una plataforma de cursos.

## Recursos principales

- Users.
- Courses.
- Lessons.
- Enrollments.
- Payments.
- Certificates.

## Endpoints minimos

```txt
GET    /courses
POST   /courses
GET    /courses/{courseId}
PATCH  /courses/{courseId}
POST   /courses/{courseId}/publish

POST   /enrollments
GET    /users/{userId}/enrollments

POST   /payments
GET    /payments/{paymentId}

POST   /certificates/{certificateId}/issue
```

## Requisitos

- Paginacion en listas.
- Filtros por estado, autor y categoria.
- Errores estructurados.
- Autenticacion.
- Autorizacion por rol.
- OpenAPI completo.
- Rate limiting en endpoints sensibles.
- Correlation id en errores.
- Tests de contrato.

## Ejemplo de error

```json
{
  "type": "business_error",
  "code": "course_not_published",
  "message": "The course must be published before enrollment.",
  "traceId": "req_123"
}
```

## Entregable

El resultado debe incluir:

- Documento OpenAPI.
- Guia de estilos aplicada.
- Coleccion de pruebas.
- Tabla de permisos por endpoint.
- Checklist de compatibilidad.

## Criterio de calidad

La API debe poder ser consumida por un frontend sin preguntar al backend que significa cada respuesta. Eso es una buena senal de contrato claro.

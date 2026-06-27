# Proyecto final

El proyecto final consiste en modelar una plataforma de cursos con DDD.

## Contextos

```txt
Catalog
  cursos, lecciones, publicacion

Learning
  matriculas, progreso, finalizacion

Billing
  pagos, facturas, reembolsos

Identity
  usuarios, roles, permisos
```

## Objetivo

Construir un backend modular donde cada contexto tenga lenguaje, modelo y casos de uso propios.

## Reglas de ejemplo

- Un curso no se puede publicar sin lecciones.
- Un alumno no puede matricularse en un curso no publicado.
- Una matricula completada genera certificado.
- Un pago confirmado activa la matricula.
- Una factura pagada no puede modificarse.

## Entregables

- Context map.
- Glosario de lenguaje ubicuo.
- Agregados principales.
- Casos de uso.
- Eventos de dominio.
- Tests de dominio.

## Eventos minimos

```txt
CoursePublished
StudentEnrolled
PaymentCaptured
EnrollmentCompleted
CertificateIssued
```

## Criterio de calidad

El codigo debe poder leerse como una explicacion del negocio. Si una regla importante solo existe en un controlador, SQL o comentario, el modelo todavia no esta suficientemente trabajado.

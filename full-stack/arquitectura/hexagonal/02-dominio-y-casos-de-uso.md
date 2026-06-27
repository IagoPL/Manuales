# Dominio y casos de uso

El centro de la arquitectura hexagonal son las reglas de negocio y las acciones que la aplicacion permite ejecutar.

## Dominio

El dominio contiene conceptos del negocio:

```txt
Order
Money
Invoice
Course
Enrollment
```

Debe ser independiente de frameworks, controladores, ORM y proveedores externos.

## Casos de uso

Un caso de uso representa una intencion:

```txt
ConfirmOrder
PublishCourse
CancelEnrollment
CapturePayment
```

No es simplemente un metodo CRUD. Debe expresar algo que el sistema permite hacer.

## Entrada del caso de uso

Usa comandos o DTOs internos:

```txt
ConfirmOrderCommand
  orderId
  requestedBy
```

Evita pasar objetos HTTP, modelos de ORM o eventos externos directamente al caso de uso.

## Salida del caso de uso

Puede devolver:

- Resultado de operacion.
- DTO de lectura.
- Identificador creado.
- Nada, si la accion solo produce efecto.
- Error de dominio o aplicacion.

## Dependencias

El caso de uso puede depender de puertos:

```txt
OrderRepository
PaymentGateway
EventPublisher
Clock
```

No debe depender de implementaciones concretas.

## Checklist

- Los casos de uso tienen nombres de negocio.
- El dominio no importa tecnologia.
- La entrada esta desacoplada del transporte.
- Las dependencias externas son puertos.
- Las reglas criticas viven en dominio o aplicacion, no en adaptadores.

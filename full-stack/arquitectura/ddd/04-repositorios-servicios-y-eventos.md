# Repositorios servicios y eventos

Estos patrones ayudan a conectar el modelo de dominio con persistencia, operaciones que no pertenecen a una sola entidad y comunicacion con otros procesos.

## Repositorios

Un repositorio representa una coleccion de agregados.

```txt
OrderRepository
  findById(orderId)
  save(order)
```

No deberia exponer detalles de SQL, ORM o indices. Su lenguaje debe ser del dominio.

## Repositorios no son DAOs genericos

Evita:

```txt
findAll()
findByAnyField()
updatePartial(data)
```

Prefiere operaciones necesarias para casos de uso reales:

```txt
findPendingPayment(orderId)
findConfirmedOrdersForCustomer(customerId)
```

## Servicios de dominio

Un servicio de dominio contiene una regla que no encaja naturalmente en una entidad o value object.

Ejemplo:

```txt
PricingPolicy.calculatePrice(course, student, coupon)
```

No debe convertirse en un cajon para cualquier logica. Si una regla pertenece a una entidad, dejala ahi.

## Servicios de aplicacion

Orquestan casos de uso:

```txt
ConfirmOrderUseCase
  load order
  call order.confirm()
  save order
  publish events
```

No son lo mismo que servicios de dominio.

## Eventos de dominio

Representan algo relevante que ya ocurrio:

```txt
OrderConfirmed
InvoicePaid
CoursePublished
UserRegistered
```

Sirven para desacoplar reacciones:

```txt
OrderConfirmed
  -> send email
  -> update analytics
  -> reserve stock
```

## Checklist

- Los repositorios trabajan con agregados.
- Los servicios de dominio expresan reglas reales.
- Los casos de uso orquestan, no esconden reglas.
- Los eventos se nombran en pasado.
- Los eventos no sustituyen invariantes que deben cumplirse en la transaccion.

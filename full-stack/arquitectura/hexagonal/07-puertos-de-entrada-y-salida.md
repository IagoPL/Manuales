# Puertos de entrada y salida

Separar puertos de entrada y salida ayuda a entender que ofrece la aplicacion y que necesita del exterior.

## Puertos de entrada

Representan capacidades:

```txt
ConfirmOrder
CreateInvoice
EnrollStudent
PublishCourse
```

En algunos lenguajes pueden ser interfaces. En otros basta con clases de caso de uso bien definidas.

## Puertos de salida

Representan dependencias:

```txt
OrderRepository
PaymentGateway
EmailSender
EventPublisher
```

La aplicacion depende del contrato, no de la implementacion.

## Donde definirlos

Los puertos deben vivir cerca de quien los necesita.

```txt
orders/application/OrderRepository
orders/application/ConfirmOrderUseCase
```

Evita una carpeta global de interfaces sin contexto.

## Granularidad

No crees puertos enormes:

```txt
DatabaseService
  findUser
  saveOrder
  updateInvoice
  deleteCourse
```

Prefiere contratos por contexto y necesidad.

## Checklist

- Los puertos tienen lenguaje del caso de uso.
- Los puertos de salida son pequenos.
- No hay interfaces genericas innecesarias.
- Las implementaciones viven fuera del nucleo.
- Los adaptadores se pueden sustituir en tests.

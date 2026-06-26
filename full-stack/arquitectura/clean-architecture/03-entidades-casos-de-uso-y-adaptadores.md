# Entidades casos de uso y adaptadores

Estos tres conceptos forman el nucleo operativo de Clean Architecture. Las entidades protegen reglas, los casos de uso expresan acciones y los adaptadores conectan el sistema con el exterior.

## Entidades

Una entidad representa algo importante para el negocio y mantiene sus invariantes.

```txt
Order
  id
  customerId
  lines
  status
  total
```

Una entidad no deberia ser una bolsa de getters y setters. Debe impedir estados invalidos.

```txt
Order.confirm()
  - no se puede confirmar si no tiene lineas
  - no se puede confirmar si ya esta cancelado
  - recalcula el total antes de confirmar
```

## Casos de uso

Un caso de uso representa una accion completa que aporta valor.

Ejemplos:

- CreateOrder.
- ConfirmOrder.
- CancelSubscription.
- GenerateMonthlyInvoice.
- PublishArticle.

Un caso de uso suele validar la intencion, cargar entidades, ejecutar reglas, persistir cambios y publicar eventos o devolver una respuesta.

## Puertos

Un puerto es un contrato que el caso de uso necesita.

```txt
interface OrderRepository
  findById(id)
  save(order)
```

El caso de uso depende del puerto. La base de datos concreta implementa ese puerto.

## Adaptadores

Los adaptadores traducen entre el mundo externo y el mundo interno.

```txt
HTTP request -> DTO -> caso de uso -> response
SQL row -> entidad
Evento Kafka -> comando interno
```

Hay adaptadores de entrada y de salida:

- Entrada: controladores, consumers, jobs, CLI.
- Salida: repositorios, gateways, clientes HTTP, colas, filesystem.

## Flujo completo

```txt
Cliente HTTP
  -> Controller
  -> CreateOrderCommand
  -> CreateOrderUseCase
  -> Order
  -> OrderRepository
  -> SqlOrderRepository
  -> PostgreSQL
```

## Errores habituales

- Llamar entidad a cualquier tabla.
- Poner validaciones criticas solo en DTOs.
- Crear un caso de uso por cada metodo CRUD sin pensar en intenciones reales.
- Hacer que los adaptadores devuelvan objetos de librerias externas hacia dentro.
- Crear interfaces genericas para todo sin necesidad.

## Ejercicio

Toma una funcionalidad CRUD existente y renombrala como intencion de negocio. Por ejemplo, cambia `updateUser` por `ChangeUserEmail`, `DeactivateUser` o `AcceptInvitation`. Despues identifica entidad, caso de uso, puertos y adaptadores.

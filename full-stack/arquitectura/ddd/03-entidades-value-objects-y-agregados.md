# Entidades value objects y agregados

DDD tactico ofrece patrones para modelar reglas de negocio sin convertir todo en tablas, DTOs o clases anemicas.

## Entidades

Una entidad tiene identidad y ciclo de vida.

```txt
User
Order
Course
Invoice
```

Dos pedidos con los mismos datos no son el mismo pedido si tienen IDs distintos.

## Value objects

Un value object se define por sus valores, no por identidad.

```txt
Money(amount, currency)
EmailAddress(value)
DateRange(start, end)
Address(street, city, country)
```

Son utiles para encapsular validaciones:

```txt
EmailAddress
  - debe tener formato valido
  - se normaliza en minusculas
```

## Agregados

Un agregado es un grupo de objetos que se modifica como una unidad consistente.

```txt
Order
  OrderLine[]
  ShippingAddress
  PaymentStatus
```

El agregado tiene una raiz. Desde fuera se modifica a traves de esa raiz.

```txt
order.addLine(product, quantity)
order.confirm()
order.cancel(reason)
```

## Invariantes

Una invariante es una regla que siempre debe cumplirse.

Ejemplos:

- Un pedido confirmado debe tener al menos una linea.
- Una factura pagada no puede modificarse.
- Un curso publicado debe tener titulo y al menos una leccion.
- Una reserva no puede superar el aforo disponible.

## Tamano del agregado

Agregados demasiado grandes generan bloqueos, transacciones pesadas y modelos dificiles de entender.

Regla practica:

- Agrega lo que necesite consistencia inmediata.
- Comunica lo demas con eventos.
- Evita cargar colecciones enormes dentro de la raiz.

## Checklist

- Las entidades protegen reglas, no solo almacenan datos.
- Los value objects eliminan strings y numeros ambiguos.
- Los agregados tienen limites claros.
- Las invariantes viven cerca del modelo que protegen.
- No se modifican objetos internos saltandose la raiz del agregado.

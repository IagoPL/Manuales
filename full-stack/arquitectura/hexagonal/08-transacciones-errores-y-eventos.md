# Transacciones errores y eventos

La arquitectura hexagonal debe definir donde se manejan transacciones, errores y eventos para evitar comportamientos ambiguos.

## Transacciones

Suelen gestionarse alrededor del caso de uso:

```txt
transaction
  load aggregate
  execute business rule
  save aggregate
  store events
```

No metas transacciones dentro de entidades.

## Errores

Separa tipos:

- Dominio: regla violada.
- Aplicacion: caso de uso no puede completarse.
- Infraestructura: base de datos, red, proveedor externo.
- Entrada: request invalida o mensaje mal formado.

Cada adaptador decide como traducirlos.

## Eventos

Los eventos de dominio pueden registrarse durante la modificacion del agregado y publicarse despues de guardar.

```txt
order.confirm()
order.pullEvents() -> [OrderConfirmed]
```

## Outbox

Para integraciones serias, guarda eventos en la misma transaccion que el agregado:

```txt
save order
save outbox event
commit
publish later
```

## Reintentos

Los adaptadores de salida deben decidir:

- Que errores son reintentables.
- Cuantos reintentos.
- Que timeout usar.
- Cuando mandar a dead-letter.

## Checklist

- Las transacciones rodean casos de uso.
- Los errores internos no se filtran al exterior.
- Los eventos se publican de forma fiable.
- Los adaptadores controlan reintentos.
- Las reglas de dominio no dependen de infraestructura.

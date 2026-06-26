# Transacciones y consistencia

MongoDB soporta operaciones atomicas por documento y transacciones multi-documento. La clave es no abusar de transacciones si el modelo puede resolverlo con documentos bien diseñados.

## Atomicidad por documento

Una actualizacion de un documento es atomica.

```javascript
db.productos.updateOne(
  { _id: productId, stock: { $gt: 0 } },
  { $inc: { stock: -1 } }
)
```

## Transaccion

```javascript
const session = client.startSession()

await session.withTransaction(async () => {
  await orders.insertOne(order, { session })
  await products.updateOne(
    { _id: productId },
    { $inc: { stock: -1 } },
    { session }
  )
})
```

## Read concern y write concern

Write concern define confirmacion de escritura.

```javascript
{ writeConcern: { w: "majority" } }
```

Read concern define visibilidad de lecturas.

## Consistencia eventual

Lecturas desde secundarias pueden ir con retraso. Decide si el caso permite datos ligeramente antiguos.

## Buenas practicas

- Diseña documentos para evitar transacciones innecesarias.
- Usa `majority` en datos criticos.
- Maneja reintentos de transaccion.
- Evita transacciones largas.
- No leas de secundarias si necesitas lectura inmediata tras escritura.

# Patrones de modelado

MongoDB se modela segun acceso. La pregunta no es solo que entidades existen, sino como se leen y escriben.

## Embedding

Guardar datos relacionados dentro del documento.

```javascript
{
  _id: "order-1",
  customer_id: "customer-1",
  lines: [
    { sku: "A1", quantity: 2 }
  ]
}
```

Bueno cuando se lee como unidad.

## Referencing

Guardar referencias entre documentos.

```javascript
{
  _id: "order-1",
  customer_id: ObjectId("...")
}
```

Bueno para relaciones grandes o reutilizadas.

## Bucket pattern

Agrupa eventos por ventana.

Util para series temporales o logs.

## Outlier pattern

Separa casos excepcionales para evitar documentos gigantes.

## Buenas practicas

- Embebe cuando se lee junto.
- Referencia cuando crece sin limite.
- Evita arrays infinitos.
- Diseña indices con las consultas.
- Documenta decisiones de modelado.

# Modelado de documentos

En MongoDB se modela pensando en como se accede a los datos. La pregunta principal es: que necesita leer o escribir la aplicacion en una sola operacion.

## Documento

```javascript
{
  _id: ObjectId("..."),
  nombre: "Ana",
  email: "ana@example.com",
  direccion: {
    ciudad: "Madrid",
    codigo_postal: "28001"
  },
  tags: ["vip", "newsletter"]
}
```

## Embebido

Embebe datos que se leen siempre juntos y no crecen sin limite.

```javascript
{
  _id: ObjectId("..."),
  cliente: "Ana",
  lineas: [
    { sku: "TEC-001", cantidad: 1, precio: 49.99 },
    { sku: "RAT-002", cantidad: 2, precio: 19.99 }
  ]
}
```

## Referencias

Referencia cuando los datos crecen mucho, se comparten o cambian de forma independiente.

```javascript
{
  _id: ObjectId("..."),
  cliente_id: ObjectId("..."),
  total: 89.97
}
```

## Validacion de esquema

```javascript
db.createCollection("clientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "email"],
      properties: {
        nombre: { bsonType: "string" },
        email: { bsonType: "string" }
      }
    }
  }
})
```

## Buenas practicas

- Modela segun consultas reales.
- Embebe cuando el documento se consume junto.
- Referencia cuando hay crecimiento ilimitado.
- Evita arrays gigantes.
- Guarda campos derivados solo con estrategia de sincronizacion.

## Errores comunes

- Modelar como si fuera SQL.
- Duplicar datos sin plan de actualizacion.
- Crear documentos demasiado grandes.
- No validar campos criticos.
- No pensar en indices desde el modelado.

# CRUD y consultas

MongoDB permite insertar, consultar, actualizar y eliminar documentos con una sintaxis basada en objetos.

## Insertar

```javascript
db.productos.insertOne({
  nombre: "Teclado",
  precio: 49.99,
  stock: 20
})
```

Insertar varios:

```javascript
db.productos.insertMany([
  { nombre: "Raton", precio: 19.99, stock: 50 },
  { nombre: "Monitor", precio: 199.99, stock: 8 }
])
```

## Consultar

```javascript
db.productos.find({ stock: { $gt: 0 } })
db.productos.findOne({ nombre: "Teclado" })
```

Proyeccion:

```javascript
db.productos.find(
  { stock: { $gt: 0 } },
  { nombre: 1, precio: 1, _id: 0 }
)
```

## Actualizar

```javascript
db.productos.updateOne(
  { nombre: "Teclado" },
  { $set: { stock: 25 } }
)
```

Operadores utiles:

```javascript
db.productos.updateOne(
  { nombre: "Teclado" },
  { $inc: { stock: -1 } }
)
```

## Eliminar

```javascript
db.productos.deleteOne({ nombre: "Teclado" })
db.productos.deleteMany({ stock: 0 })
```

## Ordenar y limitar

```javascript
db.productos
  .find({ stock: { $gt: 0 } })
  .sort({ precio: 1 })
  .limit(10)
```

## Buenas practicas

- Usa filtros selectivos.
- Usa proyeccion para no traer campos innecesarios.
- Prefiere operadores atomicos como `$inc`.
- Revisa `matchedCount` y `modifiedCount`.
- Evita updates masivos sin filtro claro.

## Errores comunes

- Usar `deleteMany({})` sin querer.
- Traer documentos completos cuando solo necesitas dos campos.
- No controlar resultados de escritura.
- Actualizar arrays sin entender operadores posicionales.
- Consultar campos no indexados en colecciones grandes.

# MongoDB

MongoDB es una base de datos NoSQL orientada a documentos. En lugar de almacenar datos en tablas relacionales, utiliza documentos similares a JSON dentro de colecciones.

## Conceptos clave

- **Documento:** unidad principal de información, representada en formato BSON.
- **Colección:** conjunto de documentos.
- **Base de datos:** contenedor de colecciones.
- **ObjectId:** identificador único generado habitualmente por MongoDB.
- **Índice:** estructura que acelera consultas.
- **Agregación:** pipeline de operaciones para transformar y resumir documentos.

## Instalación o configuración

Ejemplo con Docker:

```bash
docker run --name mongodb-dev \
  -p 27017:27017 \
  -d mongo:7
```

Conexión con shell:

```bash
mongosh "mongodb://localhost:27017"
```

## Uso básico

### Crear o seleccionar una base de datos

```javascript
use tienda
```

### Insertar documentos

```javascript
db.productos.insertOne({
  nombre: "Teclado",
  precio: 49.99,
  stock: 20,
  categorias: ["perifericos", "oficina"]
})
```

### Consultar documentos

```javascript
db.productos.find({ stock: { $gt: 0 } })
```

### Actualizar documentos

```javascript
db.productos.updateOne(
  { nombre: "Teclado" },
  { $set: { stock: 25 } }
)
```

### Eliminar documentos

```javascript
db.productos.deleteOne({ nombre: "Teclado" })
```

## Ejemplos prácticos

### Índices

```javascript
db.productos.createIndex({ nombre: 1 })
db.productos.createIndex({ precio: 1, stock: -1 })
```

### Agregación básica

```javascript
db.productos.aggregate([
  { $match: { stock: { $gt: 0 } } },
  { $group: { _id: "$categoria", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])
```

### Modelado embebido

```javascript
{
  cliente: "Ana",
  direccion: {
    ciudad: "Madrid",
    codigoPostal: "28001"
  }
}
```

## Buenas prácticas

- Diseña documentos según los patrones de consulta.
- Embebe datos cuando se lean siempre juntos.
- Referencia datos cuando crezcan mucho o se compartan entre muchas entidades.
- Crea índices para consultas frecuentes.
- Evita documentos demasiado grandes o arrays sin límite.
- Valida esquemas cuando la consistencia sea importante.

## Errores comunes

- Modelar MongoDB como si fuera una base relacional.
- No crear índices y depender de escaneos completos.
- Usar arrays que crecen indefinidamente.
- Duplicar datos sin estrategia de sincronización.
- No revisar el plan de ejecución de consultas lentas.

## Chuleta rápida

```javascript
show dbs
use tienda
show collections
db.productos.find()
db.productos.insertOne({...})
db.productos.updateOne(filtro, cambio)
db.productos.deleteOne(filtro)
db.productos.createIndex({ campo: 1 })
```

## Recursos relacionados

- [SQL](../sql/README.md)
- [Pipelines de datos](../../data-engineering/pipelines/README.md)
- [Docker](../../herramientas/docker/01-introduccion.md)

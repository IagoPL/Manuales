# MongoDB

MongoDB es una base de datos NoSQL orientada a documentos. Guarda datos en documentos BSON dentro de colecciones, lo que permite modelos flexibles y consultas sobre estructuras anidadas.

La clave para usar MongoDB bien es modelar segun patrones de lectura y escritura, no copiar directamente un modelo relacional.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Modelado de documentos](02-modelado-de-documentos.md)
3. [CRUD y consultas](03-crud-y-consultas.md)
4. [Indices y planes de ejecucion](04-indices-y-planes-de-ejecucion.md)
5. [Aggregation pipeline](05-aggregation-pipeline.md)
6. [Replicacion y sharding](06-replicacion-y-sharding.md)
7. [Seguridad, backup y buenas practicas](07-seguridad-backup-y-buenas-practicas.md)

## Instalacion con Docker

```bash
docker run --name mongodb-dev \
  -p 27017:27017 \
  -d mongo:7
```

Conexion:

```bash
mongosh "mongodb://localhost:27017"
```

## Primeros comandos

```javascript
use tienda

db.productos.insertOne({
  nombre: "Teclado",
  precio: 49.99,
  stock: 20,
  categorias: ["perifericos", "oficina"]
})

db.productos.find({ stock: { $gt: 0 } })
```

## Cuando usar MongoDB

- Datos con estructura flexible.
- Documentos que se leen y escriben como unidad.
- Catalogos, perfiles, eventos, configuraciones y contenido.
- Aplicaciones que necesitan iterar rapido en el modelo.

## Cuando tener cuidado

- Relaciones complejas con joins frecuentes.
- Transacciones grandes entre muchas entidades.
- Informes SQL intensivos.
- Datos que requieren integridad referencial fuerte.

## Recursos relacionados

- [SQL](../sql/01-introduccion.md)
- [PostgreSQL](../postgresql/01-introduccion-e-instalacion.md)
- [Pipelines de datos](../../data-engineering/pipelines/01-introduccion.md)
- [Docker](../../herramientas/docker/01-introduccion.md)

# Aggregation pipeline

Aggregation pipeline permite transformar documentos mediante etapas. Es una de las herramientas mas potentes de MongoDB para analisis, reporting ligero y reshaping de datos.

## Pipeline basico

```javascript
db.pedidos.aggregate([
  { $match: { estado: "pagado" } },
  { $group: { _id: "$cliente_id", total: { $sum: "$total" } } },
  { $sort: { total: -1 } }
])
```

## Etapas comunes

- `$match`: filtra.
- `$project`: selecciona o calcula campos.
- `$group`: agrega.
- `$sort`: ordena.
- `$limit`: limita.
- `$unwind`: expande arrays.
- `$lookup`: relaciona con otra coleccion.

## Project

```javascript
db.productos.aggregate([
  {
    $project: {
      nombre: 1,
      precio_con_iva: { $multiply: ["$precio", 1.21] }
    }
  }
])
```

## Unwind

```javascript
db.pedidos.aggregate([
  { $unwind: "$lineas" },
  { $group: { _id: "$lineas.sku", unidades: { $sum: "$lineas.cantidad" } } }
])
```

## Lookup

```javascript
db.pedidos.aggregate([
  {
    $lookup: {
      from: "clientes",
      localField: "cliente_id",
      foreignField: "_id",
      as: "cliente"
    }
  }
])
```

## Buenas practicas

- Pon `$match` pronto para reducir datos.
- Usa indices para filtros iniciales.
- Proyecta solo campos necesarios.
- Evita pipelines enormes para logica de aplicacion.
- Mide coste con explain.

## Errores comunes

- Usar `$lookup` como si MongoDB fuera relacional.
- Ordenar demasiados documentos sin indice.
- Hacer `$unwind` de arrays gigantes.
- No limitar resultados intermedios.
- Ejecutar pipelines analiticos pesados en la base operacional.

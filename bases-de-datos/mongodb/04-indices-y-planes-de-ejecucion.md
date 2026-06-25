# Indices y planes de ejecucion

Los indices en MongoDB aceleran consultas y ordenaciones. Sin indices, una consulta puede escanear toda la coleccion.

## Crear indices

```javascript
db.productos.createIndex({ nombre: 1 })
db.productos.createIndex({ precio: 1, stock: -1 })
```

## Indice unico

```javascript
db.clientes.createIndex({ email: 1 }, { unique: true })
```

## Indices compuestos

El orden importa:

```javascript
db.pedidos.createIndex({ cliente_id: 1, creado_en: -1 })
```

Sirve para:

```javascript
db.pedidos.find({ cliente_id: ObjectId("...") }).sort({ creado_en: -1 })
```

## Explain

```javascript
db.productos.find({ nombre: "Teclado" }).explain("executionStats")
```

Revisa:

- `COLLSCAN`: escaneo completo.
- `IXSCAN`: uso de indice.
- Documentos examinados.
- Documentos devueltos.
- Tiempo de ejecucion.

## Indices TTL

```javascript
db.sesiones.createIndex({ expira_en: 1 }, { expireAfterSeconds: 0 })
```

Util para sesiones, tokens o datos temporales.

## Buenas practicas

- Crea indices segun consultas frecuentes.
- Usa indices compuestos para filtro + ordenacion.
- Evita indices que no se usan.
- Mide con `explain`.
- Vigila coste en escrituras.

## Errores comunes

- Crear un indice por cada campo.
- No indexar campos usados en filtros habituales.
- Ignorar `COLLSCAN`.
- Crear arrays sin pensar en multikey indexes.
- No revisar memoria usada por indices.

# Replicacion y sharding

MongoDB escala disponibilidad con replica sets y escala horizontal con sharding. Son conceptos operativos importantes antes de llevar MongoDB a produccion.

## Replica set

Un replica set contiene un primary y varios secondaries.

```txt
primary -> secondary
        -> secondary
```

El primary recibe escrituras. Los secondaries replican cambios y pueden ser promovidos si el primary cae.

## Write concern

Write concern define cuantas confirmaciones exige una escritura.

```javascript
db.pedidos.insertOne(
  { total: 100 },
  { writeConcern: { w: "majority" } }
)
```

## Read preference

Permite elegir desde donde leer:

- `primary`
- `primaryPreferred`
- `secondary`
- `secondaryPreferred`
- `nearest`

Lee desde secondaries solo si aceptas posible retraso.

## Sharding

Sharding reparte datos entre shards.

```txt
app -> mongos -> shard 1
              -> shard 2
              -> shard 3
```

La shard key es critica. Una mala shard key crea hotspots o consultas dispersas.

## Elegir shard key

Debe:

- Tener alta cardinalidad.
- Distribuir escrituras.
- Aparecer en consultas frecuentes.
- Evitar crecimiento monotono que concentre carga.

## Buenas practicas

- Usa replica sets para alta disponibilidad.
- Prueba failover.
- Define write concern segun criticidad.
- Shardea solo cuando haya necesidad real.
- Disena la shard key con patrones de acceso.

## Errores comunes

- Confundir replica con backup.
- Leer de secondary esperando consistencia inmediata.
- Elegir shard key solo por comodidad.
- Shardear demasiado pronto.
- No monitorizar lag de replicacion.

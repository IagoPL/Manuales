# Indices y planes de ejecucion

Los indices aceleran lecturas, filtros y joins, pero tambien ocupan espacio y hacen mas lentas las escrituras. No son decoracion: deben responder a consultas reales.

## Crear indices

```sql
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_estado_creado ON pedidos(estado, creado_en DESC);
```

## Indices unicos

```sql
CREATE UNIQUE INDEX idx_clientes_email ON clientes(email);
```

Un indice unico tambien protege la integridad.

## Indices parciales

```sql
CREATE INDEX idx_pedidos_pendientes
ON pedidos(creado_en)
WHERE estado = 'pendiente';
```

Son utiles cuando una consulta filtra siempre por una condicion concreta.

## EXPLAIN

```sql
EXPLAIN ANALYZE
SELECT *
FROM pedidos
WHERE cliente_id = 10
ORDER BY creado_en DESC;
```

Busca:

- `Seq Scan`: lectura completa de tabla.
- `Index Scan`: uso de indice.
- `Bitmap Index Scan`: combinacion eficiente para muchos registros.
- `Sort`: ordenacion explicita.
- `Nested Loop`, `Hash Join`, `Merge Join`: estrategias de join.

## Indices compuestos

El orden importa:

```sql
CREATE INDEX idx_pedidos_cliente_fecha ON pedidos(cliente_id, creado_en DESC);
```

Sirve bien para:

```sql
WHERE cliente_id = 10
ORDER BY creado_en DESC
```

## Buenas practicas

- Crea indices basados en consultas frecuentes.
- Mide con `EXPLAIN ANALYZE`.
- Evita duplicar indices equivalentes.
- Revisa indices no usados.
- Usa indices parciales para subconjuntos pequenos.

## Errores comunes

- Indexar todas las columnas.
- No indexar foreign keys usadas en joins.
- Usar funciones en filtros sin indice funcional.
- Ignorar el coste de escritura.
- Interpretar `EXPLAIN` sin datos reales.

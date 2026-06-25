# Indices y EXPLAIN

Los indices aceleran lecturas, joins y ordenaciones, pero tambien consumen espacio y ralentizan escrituras. En MySQL hay que medir con `EXPLAIN`.

## Crear indices

```sql
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_estado_creado ON pedidos(estado, creado_en);
```

## Indices unicos

```sql
CREATE UNIQUE INDEX idx_clientes_email ON clientes(email);
```

## Indices compuestos

El orden de columnas importa:

```sql
CREATE INDEX idx_pedidos_cliente_estado_fecha
ON pedidos(cliente_id, estado, creado_en);
```

Sirve para consultas como:

```sql
SELECT *
FROM pedidos
WHERE cliente_id = 10
  AND estado = 'pagado'
ORDER BY creado_en DESC;
```

## EXPLAIN

```sql
EXPLAIN
SELECT *
FROM pedidos
WHERE cliente_id = 10;
```

Fijate en:

- `type`: acceso usado.
- `possible_keys`: indices candidatos.
- `key`: indice elegido.
- `rows`: filas estimadas.
- `Extra`: ordenaciones, filtros y temporary tables.

## Buenas practicas

- Indexa columnas usadas en joins.
- Crea indices para consultas frecuentes, no por intuicion.
- Evita indices duplicados.
- Usa indices compuestos segun filtros reales.
- Revisa `EXPLAIN` con datos representativos.

## Errores comunes

- Indexar todas las columnas.
- No indexar foreign keys.
- Usar funciones sobre columnas filtradas.
- No revisar queries con `Using temporary` o `Using filesort`.
- Olvidar el coste en INSERT/UPDATE/DELETE.

# JSONB y busqueda

PostgreSQL permite guardar documentos JSON con `JSONB`. Es util para metadatos flexibles, eventos y atributos variables, pero no sustituye al modelado relacional cuando los datos son estables y consultados con frecuencia.

## Crear tabla con JSONB

```sql
CREATE TABLE eventos (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  payload JSONB NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Insertar documentos

```sql
INSERT INTO eventos (tipo, payload)
VALUES ('compra', '{"cliente_id": 10, "importe": 29.99, "moneda": "EUR"}');
```

## Consultar JSONB

```sql
SELECT payload->>'moneda' AS moneda
FROM eventos
WHERE payload->>'cliente_id' = '10';
```

Operadores utiles:

- `->`: obtiene valor JSON.
- `->>`: obtiene texto.
- `@>`: contiene.
- `?`: existe clave.

```sql
SELECT *
FROM eventos
WHERE payload @> '{"moneda": "EUR"}';
```

## Indices GIN

```sql
CREATE INDEX idx_eventos_payload_gin
ON eventos USING gin(payload);
```

Para una clave concreta:

```sql
CREATE INDEX idx_eventos_cliente
ON eventos ((payload->>'cliente_id'));
```

## Busqueda de texto

```sql
SELECT to_tsvector('spanish', 'PostgreSQL permite busqueda de texto')
       @@ plainto_tsquery('spanish', 'busqueda texto');
```

## Buenas practicas

- Usa columnas normales para campos obligatorios y muy consultados.
- Usa JSONB para atributos variables.
- Indexa solo consultas reales.
- Valida estructura en la aplicacion o con checks.
- Evita documentos gigantes si consultas partes pequenas.

## Errores comunes

- Guardar todo en JSONB por evitar modelar.
- Comparar numeros como texto sin cuidado.
- No crear indices para filtros frecuentes.
- Mezclar estructuras distintas sin campo `tipo`.
- Usar JSONB para relaciones claras entre entidades.

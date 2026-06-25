# Indices y planes de ejecucion

SQL Server usa indices y estadisticas para decidir como ejecutar una consulta. Un buen indice puede cambiar una consulta de segundos a milisegundos.

## Clustered y nonclustered

Un indice clustered define el orden fisico/logico principal de la tabla.

```sql
ALTER TABLE dbo.Pedidos
ADD CONSTRAINT PK_Pedidos PRIMARY KEY CLUSTERED (Id);
```

Indice nonclustered:

```sql
CREATE NONCLUSTERED INDEX IX_Pedidos_Cliente_CreadoEn
ON dbo.Pedidos (ClienteId, CreadoEn DESC)
INCLUDE (Total, Estado);
```

## INCLUDE

`INCLUDE` anade columnas al indice sin usarlas como clave. Sirve para cubrir consultas.

```sql
CREATE INDEX IX_Pedidos_Estado
ON dbo.Pedidos (Estado)
INCLUDE (Total, CreadoEn);
```

## Plan de ejecucion

Revisa:

- Table Scan.
- Index Scan.
- Index Seek.
- Key Lookup.
- Hash Match.
- Nested Loops.
- Sort.

`Index Seek` suele ser buena senal, pero no siempre. Mide con datos reales.

## Estadisticas

SQL Server usa estadisticas para estimar filas. Si estan desactualizadas, el plan puede ser malo.

```sql
UPDATE STATISTICS dbo.Pedidos;
```

## Buenas practicas

- Crea indices para consultas frecuentes.
- Usa `INCLUDE` para cubrir lecturas comunes.
- Evita indices duplicados.
- Revisa fragmentacion y estadisticas.
- Mide antes y despues.

## Errores comunes

- Crear indices en todas las columnas.
- Ignorar Key Lookups costosos.
- No indexar foreign keys usadas en joins.
- Olvidar que los indices ralentizan escrituras.
- No revisar planes despues de cambios de volumen.

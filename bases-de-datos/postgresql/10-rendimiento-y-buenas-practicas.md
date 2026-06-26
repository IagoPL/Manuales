# Rendimiento y buenas practicas

El rendimiento en PostgreSQL depende del modelo, consultas, indices, configuracion y volumen real. Antes de tocar parametros globales, mide.

## Medir primero

Herramientas utiles:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM pedidos
WHERE cliente_id = 10;
```

Extensiones:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Permite ver consultas frecuentes y costosas.

## Consultas

Buenas practicas:

- Evita `SELECT *`.
- Pagina con filtros estables.
- No hagas funciones costosas sobre columnas filtradas sin indice funcional.
- Usa joins por claves indexadas.
- Revisa cardinalidad y granularidad antes de agregar.

## Indices

Un buen indice responde a una consulta concreta:

```sql
CREATE INDEX idx_pedidos_cliente_estado_fecha
ON pedidos(cliente_id, estado, creado_en DESC);
```

Revisa indices no usados antes de crear mas.

## Escrituras

Para cargas grandes:

- Usa `COPY` cuando sea posible.
- Inserta por lotes.
- Evita indices innecesarios durante cargas masivas controladas.
- Procesa por ventanas.

## Particionado

El particionado ayuda cuando una tabla es muy grande y las consultas filtran por rango o clave.

```sql
CREATE TABLE eventos (
  id BIGINT,
  creado_en DATE NOT NULL,
  payload JSONB
) PARTITION BY RANGE (creado_en);
```

No particiones por moda; particionar tambien aumenta complejidad operativa.

## Buenas practicas generales

- Modela correctamente antes de optimizar.
- Usa constraints para proteger datos.
- Monitoriza queries lentas.
- Mantiene transacciones cortas.
- Configura backups y prueba restore.
- Separa usuarios por responsabilidad.

## Errores comunes

- Optimizar sin medir.
- Crear indices al azar.
- Mantener conexiones abiertas sin pool.
- Ignorar `VACUUM` y estadisticas.
- Usar la base como cola sin diseno de concurrencia.

## Checklist final

- Consultas criticas medidas con `EXPLAIN`.
- Indices revisados.
- Backups probados.
- Usuarios con minimo privilegio.
- Logs y metricas activos.
- Plan claro de crecimiento de datos.

## Recursos relacionados

- [Arquitectura interna](11-arquitectura-interna.md)
- [Vacuum autovacuum y bloat](14-vacuum-autovacuum-y-bloat.md)
- [Proyecto final](16-proyecto-final.md)

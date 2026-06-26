# Particionado y tablas grandes

Cuando una tabla crece mucho, el primer paso no es particionar. Primero revisa modelo, indices, consultas y retencion.

## Problemas de tablas grandes

- Consultas lentas.
- Indices enormes.
- Backups pesados.
- Deletes masivos costosos.
- Alter table lentos.

## Particionado

MySQL permite dividir una tabla en particiones.

Ejemplo por rango:

```sql
CREATE TABLE eventos (
  id BIGINT NOT NULL,
  creado_en DATE NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  payload JSON,
  PRIMARY KEY (id, creado_en)
)
PARTITION BY RANGE COLUMNS (creado_en) (
  PARTITION p202601 VALUES LESS THAN ('2026-02-01'),
  PARTITION p202602 VALUES LESS THAN ('2026-03-01')
);
```

## Partition pruning

El optimizador puede leer solo particiones relevantes si el filtro coincide.

```sql
SELECT *
FROM eventos
WHERE creado_en >= '2026-02-01'
  AND creado_en < '2026-03-01';
```

## Retencion

Particionado ayuda a borrar historico:

```sql
ALTER TABLE eventos DROP PARTITION p202601;
```

Es mucho mas eficiente que borrar millones de filas una a una.

## Alternativas

Antes de particionar:

- Archivar datos antiguos.
- Crear indices adecuados.
- Usar tablas historicas.
- Mejorar paginacion.
- Separar OLTP de analitica.

## Online schema changes

Cambios en tablas grandes pueden bloquear o tardar mucho.

Herramientas habituales:

- `pt-online-schema-change`
- `gh-ost`
- capacidades online de MySQL/InnoDB segun version.

## Buenas practicas

- Particiona por un criterio usado en filtros.
- Mantén estrategia de creacion y borrado de particiones.
- Prueba cambios de esquema en copias realistas.
- Evita deletes masivos sin plan.
- No uses particionado para tapar consultas mal indexadas.


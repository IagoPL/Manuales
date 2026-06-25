# Funciones, vistas y materialized views

PostgreSQL permite encapsular consultas y logica cerca de los datos. Conviene usarlo con criterio: aporta consistencia, pero demasiada logica en base de datos puede complicar despliegues.

## Vistas

Una vista guarda una consulta reutilizable:

```sql
CREATE VIEW ventas_por_cliente AS
SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS total
FROM pedidos
WHERE estado = 'pagado'
GROUP BY cliente_id;
```

Uso:

```sql
SELECT * FROM ventas_por_cliente WHERE total > 1000;
```

## Materialized views

Una materialized view guarda el resultado fisicamente:

```sql
CREATE MATERIALIZED VIEW ventas_diarias AS
SELECT date_trunc('day', creado_en) AS dia, SUM(total) AS total
FROM pedidos
GROUP BY 1;
```

Refrescar:

```sql
REFRESH MATERIALIZED VIEW ventas_diarias;
```

Con indice unico puede refrescarse concurrentemente:

```sql
CREATE UNIQUE INDEX idx_ventas_diarias_dia ON ventas_diarias(dia);
REFRESH MATERIALIZED VIEW CONCURRENTLY ventas_diarias;
```

## Funciones SQL

```sql
CREATE FUNCTION total_cliente(p_cliente_id BIGINT)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(total), 0)
  FROM pedidos
  WHERE cliente_id = p_cliente_id
    AND estado = 'pagado';
$$ LANGUAGE sql STABLE;
```

## PL/pgSQL

```sql
CREATE FUNCTION marcar_pagado(p_pedido_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE pedidos
  SET estado = 'pagado'
  WHERE id = p_pedido_id;
END;
$$ LANGUAGE plpgsql;
```

## Buenas practicas

- Usa vistas para simplificar consultas repetidas.
- Usa materialized views para resultados caros y poco cambiantes.
- Documenta funciones que implementen reglas de negocio.
- Versiona cambios en funciones y vistas.
- Mide el coste de refresco.

## Errores comunes

- Usar materialized views sin plan de refresco.
- Meter toda la aplicacion en funciones.
- Cambiar una vista sin revisar consumidores.
- No controlar permisos sobre vistas.
- Confundir vista normal con cache de resultados.

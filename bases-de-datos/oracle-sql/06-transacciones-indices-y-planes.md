# Transacciones, indices y planes

Oracle es transaccional y usa undo para ofrecer consistencia de lectura. Leer planes de ejecucion es esencial para diagnosticar rendimiento.

## Transacciones

```sql
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;
```

Cancelar:

```sql
ROLLBACK;
```

## Bloqueo de filas

```sql
SELECT *
FROM tareas
WHERE estado = 'PENDIENTE'
FOR UPDATE SKIP LOCKED;
```

`SKIP LOCKED` es util para workers concurrentes.

## Indices

```sql
CREATE INDEX idx_pedidos_cliente_fecha
ON pedidos(cliente_id, fecha);
```

Indice unico:

```sql
CREATE UNIQUE INDEX idx_clientes_email
ON clientes(email);
```

## Explain plan

```sql
EXPLAIN PLAN FOR
SELECT *
FROM pedidos
WHERE cliente_id = 10;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

## Estadisticas

El optimizador necesita estadisticas actualizadas:

```sql
BEGIN
  DBMS_STATS.GATHER_TABLE_STATS(
    ownname => USER,
    tabname => 'PEDIDOS'
  );
END;
/
```

## Buenas practicas

- Manten transacciones cortas.
- Crea indices para consultas reales.
- Revisa planes con datos representativos.
- Actualiza estadisticas cuando proceda.
- Usa bind variables desde aplicaciones.

## Errores comunes

- No hacer `COMMIT` o `ROLLBACK`.
- Crear indices duplicados.
- Ignorar full table scans en tablas grandes.
- Usar literales en vez de bind variables.
- No revisar waits y bloqueos.

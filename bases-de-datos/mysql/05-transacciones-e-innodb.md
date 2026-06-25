# Transacciones e InnoDB

InnoDB es el motor transaccional principal de MySQL. Permite ACID, bloqueos por fila, foreign keys y recuperacion ante fallos.

## Transaccion basica

```sql
START TRANSACTION;

UPDATE cuentas
SET saldo = saldo - 100
WHERE id = 1;

UPDATE cuentas
SET saldo = saldo + 100
WHERE id = 2;

COMMIT;
```

Cancelar:

```sql
ROLLBACK;
```

## Aislamiento

MySQL suele usar `REPEATABLE READ` por defecto en InnoDB.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
```

Niveles:

- `READ UNCOMMITTED`
- `READ COMMITTED`
- `REPEATABLE READ`
- `SERIALIZABLE`

## Bloqueos

```sql
SELECT *
FROM tareas
WHERE estado = 'pendiente'
ORDER BY id
LIMIT 10
FOR UPDATE;
```

Usa transacciones cortas para reducir esperas.

## Deadlocks

InnoDB detecta deadlocks y cancela una transaccion. La aplicacion debe poder reintentar.

Reduce deadlocks:

- Actualizando tablas en el mismo orden.
- Usando indices adecuados.
- Manteniendo transacciones pequenas.
- Evitando interacciones externas dentro de transacciones.

## Buenas practicas

- Usa InnoDB para tablas transaccionales.
- Manten transacciones cortas.
- Controla errores y reintentos.
- No mezcles DDL critico con operaciones largas sin plan.
- Revisa bloqueos cuando haya latencia.

## Errores comunes

- Dejar transacciones abiertas.
- Usar autocommit sin entenderlo.
- Procesar lotes enormes en una sola transaccion.
- No manejar deadlocks.
- Confundir bloqueo por fila con ausencia de contencion.

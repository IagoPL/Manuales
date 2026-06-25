# Transacciones y concurrencia

Una transaccion agrupa operaciones que deben completarse juntas. PostgreSQL garantiza propiedades ACID: atomicidad, consistencia, aislamiento y durabilidad.

## Transaccion basica

```sql
BEGIN;

UPDATE cuentas
SET saldo = saldo - 100
WHERE id = 1;

UPDATE cuentas
SET saldo = saldo + 100
WHERE id = 2;

COMMIT;
```

Si algo falla:

```sql
ROLLBACK;
```

## Aislamiento

PostgreSQL usa MVCC, lo que permite que lectores y escritores convivan mejor.

Niveles habituales:

- `READ COMMITTED`: por defecto.
- `REPEATABLE READ`: vista estable durante la transaccion.
- `SERIALIZABLE`: mayor aislamiento, posible necesidad de reintentos.

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

## Bloqueos

Al modificar filas, PostgreSQL bloquea esas filas:

```sql
SELECT *
FROM tareas
WHERE estado = 'pendiente'
FOR UPDATE SKIP LOCKED
LIMIT 10;
```

`SKIP LOCKED` es util para colas de trabajo con varios workers.

## Deadlocks

Un deadlock ocurre cuando dos transacciones esperan recursos bloqueados entre si. PostgreSQL detecta el problema y cancela una transaccion.

Reducelo:

- Actualizando tablas siempre en el mismo orden.
- Manteniendo transacciones cortas.
- Evitando esperar interacciones de usuario dentro de una transaccion.

## Buenas practicas

- Haz transacciones pequenas.
- Reintenta operaciones que fallen por serializacion.
- Usa constraints para proteger reglas criticas.
- Bloquea filas explicitamente cuando haga falta.
- No mezcles operaciones externas lentas dentro de una transaccion.

## Errores comunes

- Dejar transacciones abiertas.
- Procesar lotes enormes en una sola transaccion.
- Leer-modificar-escribir sin proteccion ante concurrencia.
- Confundir bloqueo de fila con bloqueo de tabla.
- Ignorar deadlocks en logs.

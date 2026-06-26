# Garantias de entrega y orden

Kafka ofrece piezas para construir sistemas fiables, pero las garantias finales dependen de configuracion, consumidores y sistemas externos.

## Orden

Kafka garantiza orden dentro de una partition.

Si necesitas orden por pedido:

```txt
key = order_id
```

Todos los eventos del mismo pedido iran a la misma partition.

## At most once

Puede perder eventos si confirmas antes de procesar.

```txt
commit offset -> procesar -> fallo
```

El evento queda marcado como leido aunque no se haya procesado.

## At least once

Puede duplicar eventos, pero evita perdida si el consumidor es idempotente.

```txt
procesar -> fallo antes de commit -> reprocesar
```

Es el modelo practico mas habitual.

## Exactly once

Kafka soporta transacciones e idempotent producers para escenarios Kafka-to-Kafka.

Limitacion importante: si escribes en una base externa, necesitas coordinar idempotencia o transacciones fuera de Kafka.

## Productor idempotente

```txt
enable.idempotence=true
acks=all
retries>0
```

Ayuda a evitar duplicados por reintentos del producer.

## Transacciones

Permiten producir en varios partitions/topics y confirmar offsets de consumo como una unidad dentro de Kafka.

Util para:

```txt
consume topic A -> transform -> produce topic B
```

## Consumidor idempotente

Patron:

```txt
1. Leer event_id.
2. Comprobar si ya fue procesado.
3. Si no, ejecutar efecto.
4. Guardar event_id procesado.
5. Commit offset.
```

## Duplicados

Asume duplicados cuando:

- Hay reintentos.
- El consumer cae despues de procesar y antes de commit.
- Se reprocesan offsets.
- Hay errores de red.

## Perdida de eventos

Riesgos:

- `acks=0`.
- `acks=1` y fallo del leader antes de replicar.
- `min.insync.replicas` mal configurado.
- Retencion demasiado corta.
- Consumidores que hacen commit antes de persistir.

## Buenas practicas

- Usa keys para ordenar por entidad.
- No prometas orden global.
- Diseña consumidores idempotentes.
- Usa `acks=all` en eventos importantes.
- Ajusta `min.insync.replicas`.
- Documenta semantica real: at-least-once, exactly-once Kafka-to-Kafka, etc.


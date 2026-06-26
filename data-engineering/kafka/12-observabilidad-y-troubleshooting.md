# Observabilidad y troubleshooting

Kafka debe observarse desde broker, topic, producer y consumer. Mirar solo CPU o solo lag no basta.

## Metricas de broker

Vigila:

- Under replicated partitions.
- Offline partitions.
- Request latency.
- Disk usage.
- Network throughput.
- Controller changes.
- ISR shrink/expand rate.

## Metricas de topic

- Bytes in/out.
- Messages in.
- Retention.
- Partition count.
- Produce/fetch latency.

## Metricas de consumer group

- Lag total.
- Lag por partition.
- Rebalances.
- Tiempo de procesamiento.
- Errores de deserializacion.

## Lag

Mucho lag puede significar:

- Consumidores lentos.
- Pocas partitions.
- Pocos consumers.
- Errores en procesamiento.
- Broker saturado.
- Evento demasiado grande.

## Comandos utiles

Listar grupos:

```bash
kafka-consumer-groups --bootstrap-server localhost:9092 --list
```

Describir grupo:

```bash
kafka-consumer-groups --bootstrap-server localhost:9092 \
  --describe --group billing-service
```

Listar topics:

```bash
kafka-topics --bootstrap-server localhost:9092 --list
```

Describir topic:

```bash
kafka-topics --bootstrap-server localhost:9092 \
  --describe --topic orders.created
```

## Errores frecuentes

- `NotLeaderOrFollower`: metadata desactualizada o cambio de leader.
- `UnknownTopicOrPartition`: topic inexistente o metadata no propagada.
- `SerializationException`: payload no compatible.
- `CommitFailedException`: rebalance durante procesamiento.
- Lag creciente: consumidores no siguen ritmo.

## Runbook de lag

1. Ver grupo y partitions afectadas.
2. Revisar logs de consumidores.
3. Medir tiempo por evento.
4. Revisar errores de downstream.
5. Comprobar si hay rebalances frecuentes.
6. Escalar consumers si hay partitions libres.
7. Ajustar batching o paralelismo si procede.

## Runbook de broker

1. Revisar under-replicated partitions.
2. Revisar disco.
3. Revisar red.
4. Revisar logs del broker.
5. Confirmar ISR.
6. Evitar reinicios simultaneos.

## Buenas practicas

- Define alertas antes de incidentes.
- Monitoriza lag por consumer group critico.
- Propaga correlation ids.
- Centraliza logs de producers y consumers.
- Documenta owners de topics.
- Ten runbooks para lag, broker caido y schema roto.


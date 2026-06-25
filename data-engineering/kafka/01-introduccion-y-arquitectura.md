# Manual de Kafka

Apache Kafka es una plataforma distribuida de streaming de eventos. Se usa para publicar, almacenar y consumir flujos de datos entre sistemas de forma desacoplada.

Kafka no es simplemente una cola. Su modelo gira alrededor de logs distribuidos, topics particionados, offsets y consumidores que deciden desde donde leer.

## Capitulos previstos

1. [Introduccion y arquitectura](01-introduccion-y-arquitectura.md)
2. [Topics partitions y brokers](02-topics-partitions-y-brokers.md)
3. [Producers y consumers](03-producers-y-consumers.md)
4. [Consumer groups y offsets](04-consumer-groups-y-offsets.md)
5. [Serializacion y schemas](05-serializacion-y-schemas.md)
6. [Kafka Streams](06-kafka-streams.md)
7. [Operaciones y seguridad](07-operaciones-y-seguridad.md)
8. [Patrones de eventos](08-patrones-de-eventos.md)

## Componentes principales

- **Broker:** servidor Kafka que almacena particiones y atiende lecturas/escrituras.
- **Topic:** categoria logica de eventos.
- **Partition:** fragmento ordenado de un topic.
- **Producer:** aplicacion que publica eventos.
- **Consumer:** aplicacion que lee eventos.
- **Consumer group:** conjunto de consumidores que reparte particiones.
- **Offset:** posicion de lectura dentro de una particion.
- **Replication factor:** numero de copias de cada particion.

## Arquitectura conceptual

```txt
Producers -> Topic A (partitions) -> Consumers
                 |
                 v
              Brokers
```

Kafka conserva eventos durante un periodo o hasta alcanzar cierto tamano. Un consumidor puede leer eventos nuevos o reprocesar desde un offset anterior si la retencion lo permite.

## Ejemplo de evento

```json
{
  "event_id": "evt_001",
  "event_type": "order_created",
  "occurred_at": "2026-06-25T10:30:00Z",
  "payload": {
    "order_id": "ord_123",
    "customer_id": "cus_456",
    "amount": 89.9
  }
}
```

## Casos de uso

- Integracion entre microservicios.
- Ingesta de eventos de aplicaciones.
- Streaming hacia data lakes o warehouses.
- Auditoria y trazabilidad de eventos.
- Procesamiento en tiempo casi real.

## Buenas practicas

- Modela topics por eventos de negocio, no por tablas sin pensar.
- Define claves de particion estables.
- Usa schemas para contratos entre productores y consumidores.
- Disena consumidores idempotentes.
- Monitoriza lag, errores y throughput.
- Ajusta retencion segun necesidad de reprocesamiento.

## Errores comunes

- Usar Kafka como base de datos principal.
- Crear demasiados topics sin criterio.
- No definir clave de evento.
- Romper compatibilidad de schemas.
- Ignorar el lag de consumidores.
- Asumir orden global entre particiones.

## Ejercicio

Disena un flujo de eventos para pedidos:

1. Define topics para pedidos creados y pedidos cancelados.
2. Decide la clave de particion.
3. Define campos obligatorios del evento.
4. Explica que consumidores leerian esos eventos.
5. Indica que metricas monitorizarias.

# Arquitectura interna del log

Kafka esta construido alrededor de logs particionados. Un log es una secuencia append-only de registros ordenados por offset.

## Log segmentado

Cada partition se guarda como varios segmentos en disco.

```txt
orders.created-0/
  00000000000000000000.log
  00000000000000000000.index
  00000000000000001000.log
  00000000000000001000.index
```

Cuando un segmento alcanza cierto tamano o tiempo, Kafka abre otro.

## Append-only

Kafka escribe al final del log. Esto favorece I/O secuencial.

```mermaid
flowchart LR
  A["offset 0"] --> B["offset 1"]
  B --> C["offset 2"]
  C --> D["new writes append here"]
```

## Indices

Kafka mantiene indices para localizar offsets dentro de segmentos sin recorrer todo el archivo.

## Page cache

Kafka se apoya mucho en la page cache del sistema operativo. Por eso memoria del host, disco y patrones de lectura importan tanto.

No todo "uso de memoria" implica problema: parte puede ser cache util del SO.

## Zero-copy

Kafka puede transferir datos desde disco a red de forma eficiente reduciendo copias entre espacio kernel y user space.

Esto ayuda mucho cuando consumidores leen eventos ya almacenados.

## Retencion

La retencion elimina segmentos completos cuando cumplen condiciones.

```txt
retention.ms
retention.bytes
```

Kafka no borra evento por evento en el caso normal; borra segmentos.

## Compaction

Con `cleanup.policy=compact`, Kafka conserva la ultima version por key.

```txt
key=user-1 value=A
key=user-1 value=B
```

Tras compactacion, puede conservarse solo `B` para esa key.

## ISR

ISR significa in-sync replicas: replicas suficientemente al dia con el leader.

Si una replica se queda atras, sale del ISR. Esto afecta disponibilidad de escrituras con `acks=all`.

## Controller y metadata

El cluster necesita coordinar metadata:

- Brokers activos.
- Leaders de partitions.
- Configuracion de topics.
- Estado de replicas.

En Kafka moderno, esta coordinacion puede hacerse con KRaft en vez de ZooKeeper.

## Buenas practicas

- Usa discos rapidos y monitoriza I/O.
- Ajusta retencion segun reprocesamiento real.
- Entiende compaction antes de usarla.
- Monitoriza under-replicated partitions.
- Evita eventos gigantes.
- Dimensiona page cache y disco con margen.


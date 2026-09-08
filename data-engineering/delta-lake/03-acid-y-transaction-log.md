# ACID y transaction log

El transaction log es el núcleo de Delta Lake: cada commit produce una **versión** y un **snapshot** serializable. Los lectores no listan el directorio a ciegas; reconstruyen el estado a partir de `_delta_log`.

Documentación: [control de concurrencia](https://docs.delta.io/latest/concurrency-control.html), [compatibilidad / table features](https://docs.delta.io/latest/versioning.html), [protocolo](https://github.com/delta-io/delta/blob/master/PROTOCOL.md).

## Escritor A, escritor B, lector

Imagina `/data/events`:

1. El **lector** abre la tabla y fija el snapshot 12. Durante su job, A y B commitean 13 y 14. El lector **sigue viendo 12**: aislamiento de snapshot. No ve un mezclado de ficheros de 13 y 14.
2. El **escritor A** lee el snapshot 12, escribe data files nuevos (aún no visibles) y, al commitear, comprueba que nadie ha invalidado su supuesto. Si no hay conflicto, el log pasa a 13.
3. El **escritor B** hizo lo mismo sobre 12. Al validar, el log ya está en 13. Si B solo **añade** ficheros (append ciego) suele poder commitear 14. Si B **reescribe** ficheros que A ya tocó (`UPDATE`/`DELETE`/`MERGE` sobre el mismo conjunto), el commit **falla** con una excepción de modificación concurrente: la tabla no queda a medias.

Eso es **optimistic concurrency control**: se trabaja contra un snapshot, se preparan ficheros y se valida al final. No hay un lock de fila estilo OLTP.

## Las cuatro letras, en esta tabla

**Atomicidad.** Un commit entra entero o no entra. El lector nunca ve “la mitad del MERGE”. Los data files huérfanos de un job que murió antes del commit no forman parte de ningún snapshot.

**Consistencia.** El protocolo rechaza writes que rompen el esquema (capítulo 2), y el snapshot es un conjunto coherente de Add/Remove. Constraints (`CHECK`) son una table feature aparte: solo aplican si están activas y el writer las entiende.

**Aislamiento.** Lecturas ven un snapshot fijo. Escrituras concurrentes se serializan en el log. El aislamiento efectivo es el que documenta Delta para Spark (serializable entre esas operaciones), no “cualquier motor, cualquier storage”.

**Durabilidad.** El commit es durable cuando el storage ha persistido el JSON del log (y los data files que referencia). Si el object store o el log store no cumplen los requisitos de atomicidad/listado que pide la guía de almacenamiento vigente, esas garantías se degradan. No inventes consistencia de S3/ADLS: sigue la [documentación de storage](https://docs.delta.io/latest/delta-storage.html) de tu versión.

## Commits, versiones, snapshots

Cada fichero `0000000000000000000N.json` es el commit *N*. Describe acciones: añadir ficheros, quitar ficheros del snapshot, cambiar metadata, protocol, etc. El snapshot *N* se obtiene rejugando el log (o partiendo de un checkpoint) hasta *N*.

Los **checkpoints** (Parquet en `_delta_log`) compactan prefijos del log para que un lector no abra diez mil JSON. Son un detalle de implementación del protocolo, no un backup.

`DESCRIBE HISTORY` lista commits (capítulo 5). Leer `VERSION AS OF` materializa el snapshot. No son lo mismo.

## No edites `_delta_log`

`_delta_log` es parte interna del protocolo.

No hagas:

- editar o reescribir JSON de commits;
- borrar un `0000….json` “porque falló un job”;
- mezclar a mano Parquet de otra tabla en el directorio;
- copiar solo los data files sin el log (o al revés) y tratarlo como la misma tabla.

Para inspección pedagógica: `list` del directorio y `DESCRIBE HISTORY`. La reparación de una tabla corrupta es un incidente: restaura desde backup o desde un snapshot que **aún** exista, no parchees el log.

## Conflictos (qué choca con qué)

|  | INSERT/append | UPDATE / DELETE / MERGE | Compactación (`dataChange = false`) |
| --- | --- | --- | --- |
| INSERT/append | no chocan | pueden chocar | no chocan |
| UPDATE / DELETE / MERGE | pueden chocar | pueden chocar | pueden chocar |
| Compactación | no chocan | pueden chocar | pueden chocar |

“Pueden” depende de si operan sobre **los mismos ficheros**. Particionar por la columna del `WHERE` y **poner esa columna en la condición** reduce solapes. Particionar por cardinalidad altísima para “evitar conflictos” crea otro problema (capítulo 6).

Si dos streams usan el **mismo** `checkpointLocation` a la vez, puedes ver `ConcurrentTransactionException`. Un checkpoint de streaming no se comparte.

## Protocolo: reader, writer, table features

Cada tabla declara un **read protocol** y un **write protocol**. Desde Delta Lake 2.3 las **table features** afinan qué capacidades hay (CDF, deletion vectors, column mapping, clustering, …) en lugar de un número opaco solo.

- Un **reader** que no entiende una feature de lectura **no puede** leer la tabla.
- Un **writer** que no entiende una feature de escritura **no puede** escribirla.
- Activar una feature puede **subir** esos requisitos. Los clientes viejos (otro motor, otro job, un Trino desactualizado) dejan de ser compatibles.

No actives deletion vectors, column mapping, clustering u otras features “porque sí”. Elige la mínima que necesitas. `ALTER TABLE … SET TBLPROPERTIES ('delta.minReaderVersion' = …)` existe; usarlo a ciegas es una forma fácil de romper lectores.

Delta es **compatible hacia atrás** en el sentido habitual: un cliente nuevo lee tablas viejas. **No** es gratis hacia adelante: la tabla nueva puede exigir un cliente nuevo.

## Storage y commits

Delta se usa sobre S3, ADLS, GCS, HDFS y filesystems locales. El commit necesita que el motor pueda publicar el siguiente JSON del log de forma segura cuando hay varios writers. En algunos despliegues históricos eso implicaba un **LogStore** coordinado; la guía vigente de tu release es la fuente, no recetas de blogs de 2019. Este manual no configura un cloud concreto.

Siguiente: [MERGE, updates y deletes](04-merge-updates-y-deletes.md).

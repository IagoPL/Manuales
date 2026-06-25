# Batch, incremental y streaming

La forma de procesar datos depende de la latencia necesaria, el volumen, el coste y la capacidad de la fuente.

## Batch

Un pipeline batch procesa datos por lotes en momentos concretos.

Ejemplos:

- Cierre diario de ventas.
- Importacion nocturna de ficheros.
- Recalculo semanal de metricas.
- Carga historica de una tabla completa.

Ventajas:

- Mas sencillo de razonar.
- Facil de reprocesar.
- Bueno para grandes volumenes agregados.
- Coste mas predecible.

Riesgos:

- Mayor latencia.
- Ventanas de carga largas.
- Fallos tardios si la validacion ocurre al final.

## Incremental

Un pipeline incremental procesa solo datos nuevos o modificados.

Estrategias habituales:

- Columna `updated_at`.
- Id numerico creciente.
- Particiones por fecha.
- Change Data Capture.
- Ficheros nuevos por carpeta.
- Watermarks guardados por ejecucion.

Ejemplo:

```sql
select *
from ventas
where updated_at > :last_watermark
  and updated_at <= :current_watermark;
```

El watermark debe persistirse cuando la carga termina correctamente. Si se guarda antes de escribir el destino, puedes perder datos en caso de fallo.

## Streaming

Un pipeline streaming procesa eventos de forma continua o casi continua.

Ejemplos:

- Clickstream.
- Logs de aplicaciones.
- Eventos de pagos.
- Sensores IoT.
- Cambios de inventario.

Ventajas:

- Baja latencia.
- Reaccion rapida ante eventos.
- Bueno para alertas, fraude y experiencias en tiempo real.

Riesgos:

- Mayor complejidad operativa.
- Duplicados y eventos tardios.
- Gestion de estado.
- Orden parcial de eventos.

## Microbatch

Microbatch procesa pequenos lotes con mucha frecuencia. Es un punto intermedio entre batch y streaming.

Ejemplo:

```txt
cada 5 minutos -> leer eventos nuevos -> validar -> escribir tabla incremental
```

Es util cuando necesitas frescura razonable sin asumir toda la complejidad de un sistema streaming puro.

## Eventos tardios

En sistemas reales, los eventos no siempre llegan en orden.

Un evento puede tener:

- **Event time:** momento real en el que ocurrio.
- **Ingestion time:** momento en el que llego al sistema.
- **Processing time:** momento en el que fue procesado.

Para reporting y analitica suele importar `event time`. Para operacion tecnica puede importar `ingestion time`.

## Comparativa rapida

| Tipo | Latencia | Complejidad | Reproceso | Caso tipico |
| --- | --- | --- | --- | --- |
| Batch | Alta | Baja | Sencillo | Cierre diario |
| Incremental | Media | Media | Por ventana | Tablas actualizadas |
| Microbatch | Baja-media | Media | Por lote | Sincronizacion frecuente |
| Streaming | Baja | Alta | Con offsets/eventos | Eventos en tiempo real |

## Regla practica

Empieza con el modelo mas simple que cumpla la latencia real del negocio. Si un dashboard puede actualizarse cada hora, no construyas streaming solo porque suena mas moderno.

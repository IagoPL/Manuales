# Observabilidad y operacion

Una arquitectura hexagonal bien aplicada tambien facilita diagnosticar produccion porque los bordes estan claros.

## Que medir

- Duracion de casos de uso.
- Errores por tipo.
- Latencia de adaptadores de salida.
- Fallos de publicacion de eventos.
- Reintentos.
- Timeouts.

## Logs por borde

Adaptadores de entrada:

```txt
request received
command created
response returned
```

Adaptadores de salida:

```txt
external call started
external call failed
retry scheduled
```

## Correlation id

El adaptador de entrada captura o crea un correlation id y lo pasa al caso de uso o contexto de ejecucion.

Ese ID debe llegar a logs, eventos y llamadas externas.

## Health checks

Los adaptadores de salida criticos pueden aportar checks:

- Base de datos.
- Broker.
- Proveedor de pagos.
- Cache.

## Checklist

- Los casos de uso criticos tienen metricas.
- Los adaptadores externos miden latencia.
- Los eventos incluyen correlation id.
- Los logs no contienen secretos.
- Los health checks reflejan dependencias reales.

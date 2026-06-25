# Colas, back pressure y errores

Las colas son una de las partes mas importantes de NiFi. Permiten desacoplar fases, absorber picos y ver donde se atasca el flujo.

## Connections como colas

Cada connection almacena FlowFiles entre componentes.

En una connection puedes revisar:

- Numero de FlowFiles.
- Tamano acumulado.
- FlowFiles en espera.
- Edad de los datos.
- Relaciones que alimentan la cola.
- Priorizadores.

Una cola creciente indica que la fase siguiente no consume al ritmo necesario.

## Back pressure

Back pressure pausa el componente anterior cuando la cola alcanza un limite.

Limites comunes:

```txt
Object threshold: 10,000 FlowFiles
Data size threshold: 1 GB
```

No existe un valor universal. Depende del tamano de los FlowFiles, disco disponible y criticidad del flujo.

## Priorizadores

Los prioritizers deciden que FlowFiles salen primero.

Ejemplos:

- First in, first out.
- Prioridad por atributo.
- Mas antiguo primero.
- Mas reciente primero.

Usalos cuando el orden importa o cuando quieres dar preferencia a eventos urgentes.

## Penalization y yield

NiFi usa dos mecanismos importantes:

- **Penalization:** retrasa un FlowFile concreto tras un problema.
- **Yield:** pausa temporalmente un processor cuando no puede avanzar.

Esto evita bucles agresivos que consumen CPU sin progreso real.

## Estrategias de error

Separa errores por tipo:

```txt
success -> siguiente fase
retry -> cola de reintentos
failure -> cuarentena o dead letter
```

No envies todos los fallos a la misma ruta si requieren acciones diferentes.

## Retry controlado

Un reintento debe tener limite.

Patron:

```txt
failure temporal
  -> UpdateAttribute retry_count + 1
  -> RouteOnAttribute retry_count < 3
      -> esperar y reintentar
      -> dead letter
```

Si una API externa esta caida durante horas, reintentar sin control solo acumula ruido.

## Dead letter

Una ruta dead letter conserva FlowFiles que no pueden procesarse.

Debe guardar:

- Contenido original.
- Atributos relevantes.
- Motivo del error.
- Processor que fallo.
- Fecha.
- Numero de reintentos.

La dead letter no es un vertedero invisible. Debe revisarse y tener retencion definida.

## Cuarentena de datos

Para errores de calidad, usa una cuarentena separada.

Ejemplo:

```txt
ValidateRecord
  -> valid -> publish
  -> invalid -> quarantine/dataset=ventas/date=2026-06-25
```

La cuarentena ayuda a corregir datos sin bloquear todo el pipeline, siempre que el negocio acepte publicar datos parciales.

## Expiracion de FlowFiles

Las connections pueden tener expiracion.

Usala con cuidado:

- Es util para datos que pierden valor con el tiempo.
- Es peligrosa si no hay auditoria.
- No debe ocultar errores recurrentes.

## Checklist

- Las colas tienen back pressure.
- Hay rutas separadas para retry y fallo definitivo.
- Los reintentos tienen limite.
- Los errores conservan contexto.
- La dead letter tiene propietario.
- Las colas criticas tienen alertas.
- No se auto-terminan failures sin justificacion.

# Calidad, idempotencia y reprocesos

Un pipeline serio asume que algo fallara: la fuente cambiara, llegaran duplicados, un fichero estara incompleto o una ejecucion se quedara a medias.

## Calidad de datos

Los controles de calidad detectan datos invalidos antes de que contaminen capas posteriores.

Validaciones frecuentes:

- Columnas obligatorias.
- Tipos correctos.
- Rangos validos.
- Valores permitidos.
- Claves no nulas.
- Duplicados.
- Integridad referencial.
- Volumen esperado.
- Frescura del dato.

Ejemplo:

```txt
regla: importe >= 0
accion si falla: enviar fila a cuarentena
severidad: error
```

## Cuarentena

La cuarentena es una zona donde se guardan registros rechazados con el motivo del fallo.

Debe incluir:

- Payload original o fila rechazada.
- Regla incumplida.
- Fecha de ejecucion.
- Identificador del pipeline.
- Version del codigo o del flujo.
- Mensaje de error.

No descartes datos silenciosamente. Lo que hoy parece basura puede ser necesario para depurar una incidencia.

## Idempotencia

Un pipeline es idempotente si puedes ejecutarlo varias veces con la misma entrada y obtener el mismo resultado final.

Tecnicas habituales:

- Usar claves naturales o ids de evento.
- Escribir por particion y reemplazar solo esa particion.
- Hacer `merge` en vez de `append` ciego.
- Deduplicar antes de publicar.
- Registrar lotes procesados.
- Usar nombres de salida deterministas.

Ejemplo conceptual:

```txt
entrada: ventas del 2026-06-24
salida: curated.ventas partition fecha=2026-06-24
reproceso: reemplaza solo esa particion
```

## Reintentos

No todos los fallos son iguales:

- **Transitorios:** timeout, red, API temporalmente caida.
- **De datos:** campo obligatorio vacio, tipo inesperado.
- **De contrato:** columna eliminada o semantica cambiada.
- **De capacidad:** falta de memoria, disco o cuota.

Los fallos transitorios pueden reintentarse. Los fallos de datos deben aislarse o bloquear la publicacion segun criticidad.

## Reprocesos

Un reproceso debe ser una operacion normal, no una aventura.

Define:

- Que unidad se reprocesa: dia, hora, particion, lote, offset o id.
- Donde esta la entrada original.
- Como se borra o reemplaza la salida.
- Como se evitan duplicados.
- Que downstream debe recalcularse.
- Como se informa al consumidor.

## Publicacion atomica

Evita que los consumidores lean datos a medio escribir.

Estrategias:

- Escribir en tabla temporal y renombrar.
- Escribir particion completa y publicar marcador de exito.
- Usar transacciones si el destino lo soporta.
- Separar zona interna de zona publicada.

## Checklist

- Los errores de datos quedan guardados con causa.
- La ejecucion registra version, ventana y parametros.
- Repetir una ejecucion no duplica datos.
- Existe un procedimiento claro de reproceso.
- Los consumidores no ven resultados parciales.
- Hay reglas para decidir si se publica con rechazos o se bloquea.

# Observabilidad y operacion

Un pipeline sin observabilidad puede fallar durante dias sin que nadie se entere. Operar bien significa saber que paso, cuando paso y que hacer despues.

## Metricas minimas

Todo pipeline deberia registrar:

- Hora de inicio.
- Hora de fin.
- Duracion.
- Estado.
- Ventana procesada.
- Filas leidas.
- Filas validas.
- Filas rechazadas.
- Filas escritas.
- Tamano procesado.
- Version del codigo.

Ejemplo:

```json
{
  "pipeline": "ventas_incremental",
  "status": "success",
  "window_start": "2026-06-24T00:00:00Z",
  "window_end": "2026-06-25T00:00:00Z",
  "read_rows": 10234,
  "written_rows": 10210,
  "rejected_rows": 24
}
```

## Logs

Los logs deben ayudar a diagnosticar, no solo llenar disco.

Incluye:

- Identificador de ejecucion.
- Fuente y destino.
- Ventana procesada.
- Mensajes de error con contexto.
- Numero de reintentos.
- Ruta o tabla afectada.

Evita:

- Credenciales.
- Datos personales innecesarios.
- Payloads enormes.
- Mensajes genericos como "error inesperado" sin detalle.

## Alertas

No alertes por todo. Una alerta util requiere accion.

Alertas recomendadas:

- Fallo de ejecucion.
- SLA incumplido.
- Volumen anormal.
- Porcentaje alto de rechazos.
- Dataset sin actualizar.
- Cambio de esquema no esperado.
- Cola o lag creciendo.

## Runbook

Un runbook explica que hacer cuando algo falla.

Debe responder:

- Como identificar la ejecucion fallida.
- Donde consultar logs.
- Como revisar datos rechazados.
- Como relanzar una ventana.
- Cuando escalar al equipo propietario.
- Que consumidores pueden verse afectados.

Ejemplo de estructura:

```txt
Incidencia: ventas_incremental falla por timeout de API
Impacto: dashboard comercial no actualiza la ultima hora
Accion: reintentar ejecucion desde Airflow
Escalado: equipo de ventas si falla 3 veces seguidas
```

## SLAs y SLOs

Define expectativas medibles:

- Disponibilidad antes de cierta hora.
- Frescura maxima permitida.
- Porcentaje de ejecuciones correctas.
- Tiempo maximo de recuperacion.
- Porcentaje maximo de filas rechazadas.

Un SLA sin medicion es solo una intencion.

## Dashboards

Un dashboard operativo puede mostrar:

- Ultima ejecucion por pipeline.
- Duracion historica.
- Tendencia de filas procesadas.
- Rechazos por regla.
- Fallos por origen.
- Datasets retrasados.
- Coste por job si aplica.

## Senales de madurez

- Los fallos se detectan antes que los usuarios.
- Los reprocesos estan documentados.
- Las metricas permiten comparar ejecuciones.
- El lineage indica impactos aguas abajo.
- Las alertas tienen propietario.
- Los datasets tienen definicion de frescura.

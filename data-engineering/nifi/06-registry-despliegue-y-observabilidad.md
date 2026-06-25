# Registry, despliegue y observabilidad

NiFi Registry permite versionar flujos y promover cambios entre entornos con mas control. Junto con parametros y observabilidad, convierte NiFi en una pieza operable en produccion.

## NiFi Registry

NiFi Registry guarda versiones de process groups.

Permite:

- Versionar cambios.
- Comparar versiones.
- Revertir.
- Promocionar flujos.
- Revisar historial.

Flujo recomendado:

```txt
dev -> commit en Registry -> test -> import/update en prod
```

## Versionado de process groups

Versiona grupos con una responsabilidad clara. Si versionas todo el canvas como una unica unidad, cada cambio pequeno afectara a demasiadas piezas.

Buenas practicas:

- Un grupo versionado por pipeline o dominio.
- Mensajes de cambio claros.
- Cambios pequenos y revisables.
- Parametros fuera del flujo versionado cuando dependan del entorno.

## Promocion entre entornos

Para mover un flujo de dev a prod:

1. Versiona el process group en Registry.
2. Revisa cambios.
3. Asegura que los parameter contexts existen en destino.
4. Valida controller services.
5. Despliega en entorno de pruebas.
6. Arranca de forma controlada.
7. Observa colas y errores.

## Despliegue seguro

Antes de cambiar produccion:

- Deten entradas si el cambio afecta a ingesta.
- Deja drenar colas si es necesario.
- Haz snapshot/version del flujo anterior.
- Verifica parametros.
- Revisa relaciones nuevas.
- Comprueba permisos y controller services.
- Define plan de rollback.

## Observabilidad en NiFi

NiFi ofrece varias fuentes de observabilidad:

- Estado de processors.
- Colas.
- Bulletins.
- Logs.
- Provenance.
- Estado del cluster.
- Metricas expuestas por la plataforma.

## Data Provenance

Data Provenance muestra el historial de un FlowFile:

- Donde se creo.
- Que processors lo tocaron.
- Que atributos cambiaron.
- A donde se envio.
- En que momento ocurrio cada evento.

Es una herramienta clave para depurar y auditar.

## Bulletins

Los bulletins son avisos visibles en la interfaz. Suelen indicar errores de processors, problemas de configuracion o fallos de servicios.

No sustituyen a una estrategia de alertas externa, pero ayudan a operar desde el canvas.

## Alertas recomendadas

- Cola por encima de umbral.
- Processor con errores repetidos.
- Disco de repositorios alto.
- Nodo desconectado.
- Controller service caido.
- Flujo sin procesar datos cuando deberia.
- Dead letter creciendo.

## Backups

En produccion, conserva:

- Configuracion de NiFi.
- Flujos versionados.
- Parameter contexts.
- Certificados.
- Configuracion de seguridad.
- Plantillas o exportaciones si aun se usan.

Registry no reemplaza todos los backups del entorno.

## Checklist operativo

- Flujos versionados en Registry.
- Parametros separados por entorno.
- Controller services validados.
- Alertas de colas, errores y disco.
- Provenance con retencion adecuada.
- Runbook de despliegue y rollback.
- Backups probados.
- Cambios documentados.

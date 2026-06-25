# Optimizacion y administracion de NiFi

Optimizar NiFi significa equilibrar rendimiento, estabilidad y operabilidad. No se trata solo de subir concurrencia: tambien hay que controlar colas, repositorios, back pressure, tiempos de ejecucion y dependencias externas.

## Donde se consume rendimiento

Los cuellos de botella suelen aparecer en:

- Procesadores que esperan red o APIs externas.
- Escrituras lentas a disco, base de datos o Kafka.
- Transformaciones pesadas sobre contenido grande.
- Colas sin back pressure.
- Reintentos excesivos.
- Repositorios mal dimensionados.
- Cluster con nodos desequilibrados.

Mide antes de cambiar parametros globales.

## Concurrent tasks

Cada processor puede ejecutar varias tareas concurrentes. Aumentarlas puede mejorar throughput si el processor esta limitado por I/O, pero puede empeorar el sistema si el destino no soporta mas carga.

Buenas practicas:

- Sube concurrencia gradualmente.
- Observa CPU, memoria, disco y latencia del destino.
- No aumentes todo a la vez.
- Ajusta primero los processors que realmente bloquean el flujo.

## Run schedule

El run schedule controla cada cuanto se dispara un processor.

Ejemplos:

- `0 sec`: intenta ejecutar continuamente.
- `5 sec`: ejecuta cada cinco segundos.
- `1 min`: util para polling menos agresivo.

Un processor que consulta una API externa no deberia ejecutarse sin pausa si la API tiene limites.

## Back pressure

Back pressure evita que un flujo produzca mas datos de los que la siguiente fase puede consumir.

Se configura en las connections:

- Por numero de FlowFiles.
- Por tamano total en cola.

Sin back pressure, un destino lento puede llenar repositorios y afectar a todo el cluster.

## Repositorios

NiFi usa varios repositorios internos:

- **FlowFile Repository:** estado de FlowFiles.
- **Content Repository:** contenido real.
- **Provenance Repository:** historial de eventos.
- **Database Repository:** estado interno en versiones modernas.

Recomendaciones:

- Usar discos rapidos para repositorios criticos.
- Separar content y provenance si el volumen es alto.
- Configurar retencion de provenance segun necesidades reales.
- Monitorizar uso de disco.

## Cluster

En cluster, varios nodos ejecutan el mismo flujo.

Ten en cuenta:

- Algunos processors deben ejecutarse solo en el primary node.
- Las colas pertenecen a nodos concretos.
- El balanceo de carga entre nodos puede ayudar en flujos distribuidos.
- Un nodo lento puede acumular cola aunque otros esten sanos.

## Seguridad

En produccion, NiFi debe operar con seguridad activada.

Aspectos basicos:

- HTTPS.
- Autenticacion.
- Autorizacion por politicas.
- Certificados correctamente gestionados.
- Credenciales como parametros sensibles.
- Acceso minimo necesario.
- Auditoria de cambios.

## Mantenimiento

Tareas habituales:

- Revisar colas acumuladas.
- Limpiar datos obsoletos.
- Revisar provenance y retencion.
- Actualizar processors y extensiones.
- Versionar cambios en Registry.
- Validar backups de configuracion.
- Revisar logs y uso de disco.

## Problemas frecuentes

| Sintoma | Posible causa | Accion |
| --- | --- | --- |
| Cola crece sin parar | Destino lento | Revisar back pressure y throughput |
| CPU alta | Transformacion costosa | Reducir concurrencia o mover a Spark |
| Disco lleno | Content/provenance acumulado | Ajustar retencion y revisar colas |
| Muchos retries | Dependencia externa inestable | Separar retry y failure |
| Cluster desequilibrado | Flujo no balanceado | Revisar load balancing |

## Checklist de produccion

- Seguridad activada.
- Repositorios dimensionados.
- Back pressure configurado.
- Retencion de provenance definida.
- Flujos versionados.
- Parametros separados por entorno.
- Alertas de disco, colas y errores.
- Runbook de parada, arranque y recuperacion.

## Recursos relacionados

- [Colas, back pressure y errores](05-colas-back-pressure-y-errores.md)
- [Registry, despliegue y observabilidad](06-registry-despliegue-y-observabilidad.md)
- [Pipelines de datos](../pipelines/01-introduccion.md)

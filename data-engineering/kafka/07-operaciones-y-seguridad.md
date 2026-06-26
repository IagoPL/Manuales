# Operaciones y seguridad

Kafka es infraestructura critica cuando conecta servicios y datos. Operarlo bien exige seguridad, observabilidad, backups de configuracion y disciplina de cambios.

## Seguridad en capas

Capas habituales:

- Red privada.
- TLS.
- Autenticacion.
- Autorizacion.
- Auditoria.
- Gestion de secretos.

## TLS

TLS cifra comunicacion entre clientes y brokers.

Sin TLS, eventos y credenciales pueden viajar en claro dentro de la red.

## Autenticacion

Mecanismos comunes:

- SASL/SCRAM.
- mTLS.
- OAuth/OIDC en plataformas compatibles.

Ejemplo conceptual:

```txt
sasl.mechanism=SCRAM-SHA-512
security.protocol=SASL_SSL
```

## ACLs

Las ACLs controlan quien puede leer, escribir o administrar recursos.

Ejemplo conceptual:

```txt
User:billing-service puede READ orders.created
User:orders-service puede WRITE orders.created
```

Principio: minimo privilegio.

## Configuracion de topics

Parametros importantes:

- `retention.ms`
- `retention.bytes`
- `cleanup.policy`
- `min.insync.replicas`
- `replication.factor`
- `partitions`

## min.insync.replicas

Con `acks=all`, este valor define cuantas replicas sincronizadas deben confirmar.

Ejemplo:

```txt
replication.factor=3
min.insync.replicas=2
acks=all
```

Permite tolerar la perdida de un broker sin aceptar escrituras inseguras.

## Retencion

Kafka borra eventos segun tiempo o tamano:

```txt
retention.ms=604800000
retention.bytes=10737418240
```

La retencion debe cubrir el tiempo maximo de reprocesamiento esperado.

## Log compaction

`cleanup.policy=compact` conserva el ultimo valor por key.

Util para:

- Estados actuales.
- CDC.
- Tablas compactadas.

No es igual que retencion historica completa.

## Operaciones de riesgo

- Reducir retencion sin revisar consumidores.
- Borrar topics manualmente.
- Cambiar partitions sin analizar orden.
- Desactivar ACLs temporalmente.
- Hacer rolling restart sin health checks.

## Buenas practicas

- Gestiona topics como codigo cuando sea posible.
- Revisa ACLs en pull request.
- Usa TLS y autenticacion en entornos compartidos.
- Define owners para topics.
- Monitoriza lag, ISR, under-replicated partitions y errores.
- Documenta runbooks de incidentes.

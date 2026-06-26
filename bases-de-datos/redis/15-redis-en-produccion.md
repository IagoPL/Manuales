# Redis en produccion

Llevar Redis a produccion no consiste solo en levantar un contenedor. Hay que decidir persistencia, seguridad, limites de memoria, topologia, backups y operacion.

## Preguntas de diseno

Antes de desplegar:

- Redis sera cache o fuente de verdad?
- Cuanta perdida de datos es aceptable?
- Que latencia objetivo hay?
- Que memoria maxima se permite?
- Como se hara failover?
- Como se haran backups?
- Quien puede acceder?

## Configuracion base

Ejemplo orientativo:

```conf
bind 0.0.0.0
protected-mode yes
port 6379
requirepass cambia-esto
maxmemory 2gb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
```

No uses contrasenas de ejemplo ni expongas Redis a Internet.

## Red

Redis debe estar en red privada:

```txt
Aplicacion -> Redis
Internet -> no permitido
```

Usa firewall, security groups, redes privadas o NetworkPolicies segun plataforma.

## Docker Compose

```yaml
services:
  redis:
    image: redis:7
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf:ro
    restart: unless-stopped

volumes:
  redis_data:
```

En produccion real, evita publicar el puerto si solo lo usa la red interna.

## Healthcheck

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 3s
  retries: 5
```

Si usas auth:

```yaml
test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
```

## Kubernetes

Usa Redis en Kubernetes solo si tienes claro almacenamiento, backups y failover.

Piezas tipicas:

- StatefulSet.
- PersistentVolume.
- Secret para credenciales.
- Service interno.
- PodDisruptionBudget.
- Probes.

## Seguridad

Minimos:

- Red privada.
- ACL o password.
- TLS si la red no es confiable.
- Sin comandos peligrosos para usuarios de aplicacion.
- Logs y auditoria de acceso.

Ejemplo ACL conceptual:

```bash
ACL SETUSER app on >password ~app:* +get +set +del +expire +incr
```

## Persistencia

Para cache pura, puedes desactivar persistencia si aceptas perder datos.

Para sesiones, colas ligeras o locks, piensa cuidadosamente:

- RDB puede perder cambios desde el ultimo snapshot.
- AOF everysec puede perder hasta alrededor de un segundo.
- AOF always es mas seguro pero mas costoso.

## Backups

No copies archivos sin entender el modo de persistencia.

Practica:

- Snapshot controlado.
- Copia a almacenamiento externo.
- Restore en entorno aislado.
- Validacion automatica.

## Despliegues

Evita reinicios simultaneos de primario y replicas.

Checklist:

- Existe backup reciente?
- Las replicas estan sincronizadas?
- La aplicacion soporta reconexion?
- Los timeouts son razonables?
- Hay ventana de mantenimiento si aplica?

## Buenas practicas

- Define `maxmemory` siempre.
- No expongas Redis publicamente.
- Usa Redis gestionado si no quieres operar Sentinel/Cluster.
- Documenta RPO y RTO.
- Prueba failover, backup y restore.


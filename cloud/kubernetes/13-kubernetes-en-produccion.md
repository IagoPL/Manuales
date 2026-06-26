# Kubernetes en produccion

Kubernetes en produccion requiere gobierno, seguridad, observabilidad y procesos. No basta con aplicar YAML.

## Checklist

- Cluster gestionado o control plane HA.
- Backups de etcd si aplica.
- RBAC.
- NetworkPolicies.
- Ingress con TLS.
- Observabilidad.
- Escaneo de imagenes.
- Requests/limits.
- Probes.
- Estrategia de despliegue.

## Seguridad

- Minimo privilegio.
- Workloads no root.
- Secrets gestionados.
- Imagenes firmadas o escaneadas.
- Politicas de admision.

## Coste

Controla:

- Requests sobredimensionados.
- Nodos infrautilizados.
- Logs excesivos.
- Storage abandonado.

## Operacion

Runbooks:

- Pods en CrashLoopBackOff.
- Nodo NotReady.
- Ingress no responde.
- Certificado expirado.
- Despliegue roto.

## Buenas practicas

- Staging parecido a produccion.
- Actualizaciones planificadas.
- Backups probados.
- Observabilidad desde el dia uno.
- Ownership claro por namespace/app.


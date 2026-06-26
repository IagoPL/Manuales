# Autoscaling y resiliencia

Escalar no solo significa añadir replicas. Tambien implica tolerar fallos, limitar interrupciones y proteger dependencias.

## HPA

Horizontal Pod Autoscaler escala replicas segun metricas.

```txt
CPU, memoria o metricas custom
```

## Cluster autoscaler

Añade o quita nodos segun Pods pendientes y uso.

## PodDisruptionBudget

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: web
```

Evita que mantenimientos voluntarios tumben demasiadas replicas.

## Anti-affinity

Distribuye replicas entre nodos.

## Buenas practicas

- Minimo 2 replicas para servicios importantes.
- PDB para workloads criticos.
- Requests realistas para autoscaling.
- No escalar apps que dependen de una DB saturada sin revisar DB.
- Probar fallos de nodo en staging.


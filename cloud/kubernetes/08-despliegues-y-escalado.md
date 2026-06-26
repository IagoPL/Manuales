# Despliegues y escalado

Kubernetes permite desplegar nuevas versiones, escalar replicas y revertir cambios, pero necesita configuracion cuidadosa.

## Rolling update

Deployment usa rolling updates por defecto.

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

## Escalar replicas

```bash
kubectl scale deployment web --replicas=5
```

## Rollback

```bash
kubectl rollout undo deployment/web
```

## Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## Buenas practicas

- Usa probes antes de recibir trafico.
- Define recursos.
- Usa replicas minimas para disponibilidad.
- Revisa rollout status.
- Ten rollback probado.
- No escales sin medir cuello de botella.

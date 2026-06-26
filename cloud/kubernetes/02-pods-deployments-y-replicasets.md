# Pods, Deployments y ReplicaSets

Un Pod es la unidad minima ejecutable en Kubernetes. Normalmente no se crea a mano: se gestiona mediante Deployments, Jobs, CronJobs o StatefulSets.

## Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
```

Un Pod puede contener uno o varios contenedores que comparten red y volumenes.

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
```

El Deployment mantiene el estado deseado.

## ReplicaSet

El Deployment crea ReplicaSets. El ReplicaSet garantiza numero de Pods, pero normalmente no lo gestionas directamente.

## Rollout

```bash
kubectl rollout status deployment/web
kubectl rollout history deployment/web
kubectl rollout undo deployment/web
```

## Comandos utiles

```bash
kubectl get pods
kubectl describe pod <pod>
kubectl logs <pod>
kubectl get deploy
```

## Buenas practicas

- Usa Deployments para apps stateless.
- Define labels consistentes.
- No edites Pods generados directamente.
- Usa imagenes versionadas, no `latest`.
- Configura probes y recursos.

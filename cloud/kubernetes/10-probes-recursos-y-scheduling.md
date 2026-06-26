# Probes, recursos y scheduling

Los Pods deben declarar salud y recursos. Sin esto, Kubernetes no puede tomar buenas decisiones.

## Liveness probe

Detecta si reiniciar contenedor.

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 20
```

## Readiness probe

Decide si enviar trafico.

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
```

## Recursos

```yaml
resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

`requests` afectan scheduling. `limits` limitan consumo.

## Scheduling

Kubernetes ubica Pods segun:

- Recursos pedidos.
- Node selectors.
- Affinity/anti-affinity.
- Taints y tolerations.

## Buenas practicas

- Define requests siempre.
- Usa readiness para evitar trafico prematuro.
- No uses liveness demasiado agresiva.
- Separa health de dependencias externas cuando aplique.
- Revisa OOMKilled y throttling.


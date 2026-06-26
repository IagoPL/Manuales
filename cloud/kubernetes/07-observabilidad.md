# Observabilidad

Observar Kubernetes implica mirar cluster, nodos, Pods, aplicaciones, logs, eventos y metricas.

## Comandos base

```bash
kubectl get pods
kubectl describe pod <pod>
kubectl logs <pod>
kubectl top pods
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Logs

Los contenedores deben escribir logs a stdout/stderr. Una plataforma de logs los recoge.

Opciones:

- Loki.
- Elasticsearch/OpenSearch.
- Datadog.
- Cloud logging.

## Metricas

Prometheus + Grafana es una combinacion habitual.

Metricas:

- CPU/memoria por Pod.
- Restarts.
- Pending Pods.
- Latencia de app.
- Errores 5xx.
- Saturacion de nodos.

## Tracing

OpenTelemetry permite seguir peticiones entre servicios.

## Buenas practicas

- Define dashboards por servicio.
- Alertas accionables.
- Health checks reales.
- Logs estructurados.
- Correlation IDs.
- Revisar eventos del cluster ante fallos.

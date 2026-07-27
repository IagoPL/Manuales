# Observabilidad

Sin telemetria en el edge, un 502 es un misterio. Traefik expone access logs, metricas Prometheus, tracing (OpenTelemetry) y una API/dashboard para inspeccionar routers y services en vivo. Activa lo minimo util en lab y endurece el acceso en produccion.

## Capas

| Senal | Para que |
|-------|----------|
| **Access log** | Quien, que ruta, status, latencia, router/service |
| **Metricas** | RPS, latencias, conexiones, certificados |
| **Tracing** | Seguir una request across Traefik y backends |
| **API / dashboard** | Estado de routers, middlewares, error pages |
| **Logs de proceso** | ACME, providers, fallos de config |

## Access log

Static:

```yaml
accessLog:
  filePath: /var/log/traefik/access.log
  format: json
  bufferingSize: 100
  filters:
    statusCodes:
      - "400-499"
      - "500-599"
    retryAttempts: true
    minDuration: 500ms
```

Sin `filePath`, sale por stdout (conveniente en Docker/K8s).

Campos utiles en JSON: `RouterName`, `ServiceName`, `DownstreamStatus`, `Duration`, `RequestHost`, `RequestPath`, `ClientAddr`.

Ejemplo Compose:

```yaml
services:
  traefik:
    command:
      - --accesslog=true
      - --accesslog.format=json
      - --log.level=INFO
```

Filtrar en local:

```bash
docker compose logs -f traefik | jq -R 'fromjson? | select(.DownstreamStatus >= 500)'
```

Reducir ruido: filtra health checks con middleware o con `filters` / omit headers sensibles:

```yaml
accessLog:
  format: json
  fields:
    headers:
      defaultMode: drop
      names:
        User-Agent: keep
        X-Request-Id: keep
        Authorization: redact
```

## Metricas Prometheus

```yaml
metrics:
  prometheus:
    entryPoint: metrics
    addEntryPointsLabels: true
    addRoutersLabels: true
    addServicesLabels: true

entryPoints:
  metrics:
    address: ":8082"
```

Flags equivalentes:

```bash
--metrics.prometheus=true
--metrics.prometheus.entrypoint=metrics
--entrypoints.metrics.address=:8082
```

Scraping:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: traefik
    static_configs:
      - targets: ["traefik:8082"]
```

En Kubernetes, anota el Service o usa ServiceMonitor (Prometheus Operator):

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: traefik
  namespace: traefik
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: traefik
  endpoints:
    - port: metrics
      interval: 30s
```

Metricas que suelen alertarse:

| Metrica | Uso |
|---------|-----|
| `traefik_service_request_duration_seconds` | Latencia por service |
| `traefik_service_requests_total` | RPS / error rate (por code) |
| `traefik_entrypoint_open_connections` | Concurrencia |
| `traefik_tls_certs_not_after` | Caducidad de certificados |

Ejemplo de regla (alerta error ratio):

```yaml
groups:
  - name: traefik
    rules:
      - alert: TraefikHigh5xx
        expr: |
          sum(rate(traefik_service_requests_total{code=~"5.."}[5m]))
            /
          sum(rate(traefik_service_requests_total[5m])) > 0.05
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Traefik 5xx > 5% (10m)"
```

## Tracing con OpenTelemetry

```yaml
tracing:
  serviceName: traefik
  sampleRate: 0.1
  otlp:
    http:
      endpoint: http://otel-collector:4318/v1/traces
```

O Jaeger legacy (segun version):

```yaml
tracing:
  jaeger:
    samplingType: const
    samplingParam: 1.0
    localAgentHostPort: jaeger:6831
```

Propaga el context a backends que entiendan W3C Trace Context. Correlaciona access log y traza con un `X-Request-Id` (middleware `plugin` o cabecera generada en el cliente).

## API y dashboard

Lab:

```yaml
api:
  dashboard: true
  insecure: true
```

Produccion: desactiva `insecure` y publica el dashboard con router + auth:

```yaml
api:
  dashboard: true
  insecure: false

# dynamic
http:
  routers:
    dashboard:
      rule: "Host(`traefik.example.com`) && (PathPrefix(`/api`) || PathPrefix(`/dashboard`))"
      entryPoints: ["websecure"]
      service: api@internal
      middlewares: ["auth-admin"]
      tls:
        certResolver: le
  middlewares:
    auth-admin:
      basicAuth:
        usersFile: /etc/traefik/users.htpasswd
```

```bash
curl -u admin:S3cret https://traefik.example.com/api/http/routers
```

## Healthchecks internos

Endpoint ping (static):

```yaml
ping:
  entryPoint: ping

entryPoints:
  ping:
    address: ":8081"
```

```bash
curl -s http://127.0.0.1:8081/ping
# OK
```

En K8s, usalo en `readinessProbe`/`livenessProbe` del Deployment.

## Correlacion practica ante un 502

```txt
1. Access log: RouterName / ServiceName / status / duration
2. API: el service tiene servers? health check failing?
3. Metricas: sube traefik_service_requests_total{code="502"}?
4. Logs provider: IP del contenedor / endpoints vacios
5. Desde la red de Traefik: wget/curl al backend:port
```

```bash
curl -s http://127.0.0.1:8080/api/http/services | jq '.[] | select(.name|test("whoami"))'
docker compose exec traefik wget -qO- http://whoami:80/ || true
```

## Errores habituales

- Metricas en el mismo entrypoint publico sin firewall: scrapea cualquiera.
- Access log en texto plano sin rotacion: disco lleno.
- Dashboard `insecure` en LoadBalancer cloud.
- `sampleRate: 1.0` en produccion con mucho RPS: coste de tracing disparado.
- Labels de Prometheus con cardinalidad alta (path crudo como label): no lo hagas; Traefik etiqueta por router/service, no por URL completa.

## Ejercicios

1. Activa access log JSON y genera un 404; localiza `RouterName` vacio o ausente.
2. Expone `:8082` metrics, scrapea con Prometheus y grafica `rate(traefik_service_requests_total[1m])`.
3. Publica el dashboard con BasicAuth y cert TLS; verifica que `:8080` insecure esta cerrado.
4. Simula un backend caido, observa 502 en logs y en metricas, y confirma con la API que el service no tiene servers sanos.

## Siguiente paso

En el [capitulo 7](07-buenas-practicas.md) cierras con checklist de produccion, seguridad del socket y patrones de config.

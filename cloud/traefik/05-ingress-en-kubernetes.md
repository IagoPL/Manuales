# Ingress en Kubernetes

En Kubernetes, Traefik actua como Ingress controller: observa Ingress estandar y/o CRDs propias (`IngressRoute`, `Middleware`, `TraefikService`) y programa routers hacia Services del cluster. Sustituye o convive con otros controllers segun el `ingressClassName`.

## Como encaja

```txt
Cliente -> Service LoadBalancer/NodePort (Traefik)
              -> IngressRoute / Ingress
                   -> Service ClusterIP
                        -> Pods
```

Dos APIs utiles:

| API | Cuando |
|-----|--------|
| **Ingress** (`networking.k8s.io`) | Portabilidad entre controllers |
| **IngressRoute** (CRD Traefik) | Middlewares, TCP/UDP, TLS options, weighted |

## Instalacion con Helm

```bash
helm repo add traefik https://traefik.github.io/charts
helm repo update
kubectl create namespace traefik
helm install traefik traefik/traefik \
  --namespace traefik \
  --set ports.websecure.tls.enabled=true \
  --set providers.kubernetesIngress.publishedService.enabled=true
```

Comprobar:

```bash
kubectl -n traefik get pods,svc
kubectl -n traefik logs deploy/traefik --tail=100
```

El chart crea CRDs (`IngressRoute`, `Middleware`, `TLSOption`, ...). Lista:

```bash
kubectl get crd | grep traefik
```

## Ingress clasico

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: whoami
  namespace: demo
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  ingressClassName: traefik
  rules:
    - host: whoami.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: whoami
                port:
                  number: 80
  tls:
    - hosts:
        - whoami.example.com
      secretName: whoami-tls
```

`secretName` apunta a un Secret `kubernetes.io/tls`. Si usas cert-manager, el Certificate rellena ese Secret y Traefik lo consume.

App de ejemplo:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whoami
  namespace: demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: whoami
  template:
    metadata:
      labels:
        app: whoami
    spec:
      containers:
        - name: whoami
          image: traefik/whoami:v1.10
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: whoami
  namespace: demo
spec:
  selector:
    app: whoami
  ports:
    - port: 80
      targetPort: 80
```

```bash
kubectl create namespace demo
kubectl apply -f whoami.yaml -f ingress.yaml
curl -k --resolve whoami.example.com:443:$(kubectl -n traefik get svc traefik -o jsonpath='{.status.loadBalancer.ingress[0].ip}') https://whoami.example.com/
```

## IngressRoute (CRD)

Mas expresivo: middlewares nativos, prioridades, TCP.

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: strip-api
  namespace: demo
spec:
  stripPrefix:
    prefixes:
      - /api
---
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: rate-limit
  namespace: demo
spec:
  rateLimit:
    average: 100
    burst: 50
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: whoami
  namespace: demo
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`whoami.example.com`) && PathPrefix(`/api`)
      kind: Rule
      priority: 20
      middlewares:
        - name: rate-limit
        - name: strip-api
      services:
        - name: whoami
          port: 80
    - match: Host(`whoami.example.com`)
      kind: Rule
      services:
        - name: whoami
          port: 80
  tls:
    secretName: whoami-tls
```

Referenciar Middleware de otro namespace:

```yaml
middlewares:
  - name: sec-headers
    namespace: traefik-system
```

(requiere permitir cross-namespace en la config del chart / provider).

## TLS con cert-manager

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: whoami
  namespace: demo
spec:
  secretName: whoami-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - whoami.example.com
```

Alternativa: ACME integrado de Traefik en el chart (`additionalArguments` / values `certificatesResolvers`). En muchos clusters cert-manager ya es el estandar; no mezcles dos emisores para el mismo dominio sin coordinar.

## TraefikService (canary)

```yaml
apiVersion: traefik.io/v1alpha1
kind: TraefikService
metadata:
  name: whoami-canary
  namespace: demo
spec:
  weighted:
    services:
      - name: whoami
        weight: 90
        port: 80
      - name: whoami-next
        weight: 10
        port: 80
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: whoami-canary
  namespace: demo
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`whoami.example.com`)
      kind: Rule
      services:
        - name: whoami-canary
          kind: TraefikService
  tls:
    secretName: whoami-tls
```

## RBAC y permisos

Traefik necesita list/watch de Services, Endpoints/EndpointSlices, Ingresses y CRDs. El chart Helm lo crea. Si instalas a mano y faltan permisos, los routers no aparecen y los logs muestran `forbidden`.

```bash
kubectl -n traefik auth can-i list ingressroutes.traefik.io --as=system:serviceaccount:traefik:traefik
```

## Entrypoints y Service del controller

Values tipicos:

```yaml
# values.yaml
ports:
  web:
    port: 80
    expose:
      default: true
  websecure:
    port: 443
    expose:
      default: true
    tls:
      enabled: true
service:
  type: LoadBalancer
```

En bare metal, usa MetalLB o `NodePort` + DNS a nodos.

## Errores habituales

- `ingressClassName` distinto del que publica Traefik: el Ingress se crea pero nadie lo atiende.
- Middleware en otro namespace sin permitir referencias cross-namespace.
- Service sin Endpoints (selector mal): 404/502 en el edge.
- Mezclar anotaciones de nginx-ingress con Traefik (no son portables).
- Olvidar CRDs al instalar manifiestos a mano (`IngressRoute` unknown).

## Ejercicios

1. Instala el chart, despliega whoami + Ingress con `ingressClassName: traefik` y valida con curl/`--resolve`.
2. Sustituye el Ingress por IngressRoute con stripPrefix y rateLimit.
3. Crea un TraefikService weighted 90/10 y mide el reparto por hostname de whoami.
4. Emite un cert con cert-manager, referencia `secretName` en IngressRoute y verifica la cadena con openssl.

## Siguiente paso

En el [capitulo 6](06-observabilidad.md) activas access logs, metricas Prometheus y tracing.

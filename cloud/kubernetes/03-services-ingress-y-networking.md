# Services, Ingress y networking

Los Pods son efimeros. Un Service ofrece una identidad estable para llegar a ellos. Ingress publica HTTP/HTTPS hacia dentro del cluster.

## Service ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
```

Disponible dentro del cluster como `web`.

## Tipos de Service

- `ClusterIP`: interno.
- `NodePort`: expone puerto en nodos.
- `LoadBalancer`: crea balanceador externo si el proveedor lo soporta.

## Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 80
```

Necesitas un Ingress Controller como Nginx, Traefik o el del proveedor cloud.

## DNS interno

```txt
service.namespace.svc.cluster.local
```

Normalmente basta con `service` dentro del mismo namespace.

## NetworkPolicies

Permiten restringir trafico entre Pods si el CNI lo soporta.

## Buenas practicas

- Usa Services para comunicar workloads.
- Usa Ingress para HTTP externo.
- Configura TLS.
- No expongas Pods directamente.
- Aplica NetworkPolicies en entornos sensibles.

# Namespaces, RBAC y seguridad

Kubernetes debe operarse con aislamiento, permisos minimos y politicas claras.

## Namespaces

```bash
kubectl create namespace staging
```

Separan recursos logicamente:

```txt
dev
staging
prod
monitoring
```

No son una frontera de seguridad completa por si solos.

## RBAC

Role:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: staging
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
```

RoleBinding:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: read-pods
  namespace: staging
subjects:
  - kind: User
    name: developer
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## SecurityContext

```yaml
securityContext:
  runAsNonRoot: true
  allowPrivilegeEscalation: false
```

## Buenas practicas

- Minimo privilegio.
- Namespaces por entorno o dominio.
- No ejecutar contenedores como root.
- Limitar capabilities.
- Escanear imagenes.
- Proteger acceso a Secrets.

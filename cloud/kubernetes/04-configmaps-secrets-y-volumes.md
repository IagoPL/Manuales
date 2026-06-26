# ConfigMaps, Secrets y Volumes

La configuracion y los datos persistentes no deben vivir dentro de la imagen del contenedor.

## ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_MODE: production
```

Uso:

```yaml
envFrom:
  - configMapRef:
      name: app-config
```

## Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  DB_PASSWORD: change-me
```

Los Secrets no sustituyen un gestor de secretos robusto. Revisa cifrado en etcd y permisos.

## Volumes

```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: app-data
```

## PersistentVolumeClaim

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Buenas practicas

- Configuracion no sensible en ConfigMaps.
- Secretos en Secrets o secret manager.
- No hornear config de entorno en imagen.
- Monta volumenes solo cuando haga falta.
- Define backup para datos persistentes.

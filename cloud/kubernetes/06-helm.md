# Helm

Helm empaqueta manifiestos Kubernetes como charts parametrizables.

## Chart

Estructura:

```txt
my-chart/
  Chart.yaml
  values.yaml
  templates/
    deployment.yaml
    service.yaml
```

## Instalar

```bash
helm install web ./my-chart
```

Actualizar:

```bash
helm upgrade web ./my-chart
```

## values.yaml

```yaml
image:
  repository: nginx
  tag: "1.27"
replicaCount: 3
```

Plantilla:

```yaml
image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

## Rollback

```bash
helm history web
helm rollback web 1
```

## Buenas practicas

- Mantén charts simples.
- Versiona `values` por entorno.
- No guardes secretos planos en values.
- Usa `helm template` para revisar salida.
- Evita plantillas demasiado inteligentes.

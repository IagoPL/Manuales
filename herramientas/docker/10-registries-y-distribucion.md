# Registries y distribucion de imagenes

Un registry almacena imagenes Docker para compartirlas entre equipos, CI y servidores. Docker Hub, GitHub Container Registry y registries cloud cumplen ese papel.

## Nombre de imagen

```txt
registry/namespace/image:tag
```

Ejemplos:

```txt
nginx:alpine
ghcr.io/iagopl/app:1.0.0
registry.example.com/backend/api:2026.06.25
```

## Tags

Un tag identifica una version o variante:

```bash
docker build -t app:dev .
docker tag app:dev ghcr.io/iagopl/app:dev
```

Evita depender de `latest` en despliegues productivos.

## Login

```bash
docker login ghcr.io
```

## Push y pull

```bash
docker push ghcr.io/iagopl/app:1.0.0
docker pull ghcr.io/iagopl/app:1.0.0
```

## Digest

Los tags pueden moverse. El digest identifica contenido exacto:

```txt
image@sha256:...
```

En entornos muy controlados, desplegar por digest mejora reproducibilidad.

## Versionado recomendado

```txt
app:1.4.2
app:1.4
app:main-<sha>
app:2026.06.25
```

La estrategia depende del flujo de release.

## Buenas practicas

- Usa tags inmutables para releases.
- Publica imagenes desde CI, no desde portatiles.
- Escanea vulnerabilidades.
- Firma o verifica imagenes si el entorno lo requiere.
- Limpia tags antiguos.

## Errores comunes

- Desplegar `latest`.
- Sobrescribir tags de release.
- Publicar imagenes con secretos.
- No controlar permisos del registry.
- No saber que commit genero una imagen.

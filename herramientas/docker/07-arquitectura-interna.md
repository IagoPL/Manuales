# Arquitectura interna

Docker esta formado por varias piezas. Entenderlas ayuda a diagnosticar problemas y a no tratar los contenedores como magia.

## Componentes

```mermaid
flowchart TD
  A["Usuario"] --> B["Docker CLI"]
  B --> C["Docker daemon / dockerd"]
  C --> D["containerd"]
  D --> E["runc"]
  E --> F["Proceso del contenedor"]
  C --> G["Images"]
  C --> H["Networks"]
  C --> I["Volumes"]
  G --> J["Registry"]
```

## Docker CLI

Es el cliente que ejecutas:

```bash
docker build
docker run
docker ps
docker logs
```

La CLI habla con el daemon mediante una API. Puede hablar con un daemon local o remoto.

## Docker daemon

`dockerd` gestiona:

- Builds.
- Imagenes.
- Contenedores.
- Redes.
- Volumenes.
- Comunicacion con registries.

Cuando haces `docker run`, no "corres Docker"; pides al daemon que cree un contenedor.

## containerd y runc

Docker delega parte del trabajo en componentes de bajo nivel:

- **containerd:** gestiona ciclo de vida de contenedores.
- **runc:** crea el contenedor usando primitivas del kernel.

`runc` es quien aplica namespaces, cgroups y montaje de filesystem.

## Flujo de docker run

```mermaid
sequenceDiagram
  participant U as Usuario
  participant CLI as Docker CLI
  participant D as Docker daemon
  participant R as Registry
  participant C as containerd/runc

  U->>CLI: docker run nginx
  CLI->>D: peticion API
  D->>R: busca imagen si no existe localmente
  R-->>D: descarga capas
  D->>C: crea contenedor
  C-->>D: proceso arrancado
  D-->>CLI: id del contenedor
```

## Imagen vs contenedor

```txt
imagen = plantilla inmutable
contenedor = proceso + capa escribible + configuracion de ejecucion
```

Puedes crear muchos contenedores desde la misma imagen.

## Buenas practicas

- Entiende si un fallo viene del build, del daemon o del proceso.
- Usa `docker inspect` para ver configuracion real.
- Revisa `docker info` cuando haya problemas del entorno.
- No confundas imagen con contenedor.

## Errores comunes

- Pensar que Docker es una VM.
- Modificar un contenedor manualmente y esperar que la imagen cambie.
- No distinguir problemas de red Docker y problemas de aplicacion.
- Ignorar el daemon cuando la CLI falla.

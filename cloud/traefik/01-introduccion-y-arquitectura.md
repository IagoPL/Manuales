# Traefik: introduccion y arquitectura

Traefik es un reverse proxy y load balancer dinamico. Descubre backends solo (Docker, Kubernetes, Consul, ficheros) y reconfigura routers sin reiniciar. Encaja cuando el inventario de servicios cambia a menudo: contenedores que suben y bajan, Ingress en un cluster, o varios dominios con TLS automatico.

## Capitulos

1. [Introduccion y arquitectura](01-introduccion-y-arquitectura.md)
2. [Routers, services y middlewares](02-routers-services-y-middlewares.md)
3. [Docker provider](03-docker-provider.md)
4. [TLS automatico](04-tls-automatico.md)
5. [Ingress en Kubernetes](05-ingress-en-kubernetes.md)
6. [Observabilidad](06-observabilidad.md)
7. [Buenas practicas](07-buenas-practicas.md)

## Que problema resuelve

Sin un edge dinamico:

- Cada contenedor nuevo exige editar a mano `nginx.conf` o `haproxy.cfg` y recargar.
- TLS por dominio se gestiona fuera del proxy (certbot cron, secretos sueltos).
- En Kubernetes, el Ingress controller debe mapear reglas a pods que nacen y mueren.

Con Traefik:

```txt
Cliente
  |
  v
EntryPoint :80 / :443
  |
  v
Router (Host/Path/Headers) --> Middlewares --> Service --> backends
  ^
  |
Providers (Docker labels, K8s CRDs, file, Consul...)
```

El plano de control son los **providers**: leen el entorno y construyen la config dinamica. El plano de datos son **entrypoints**, **routers**, **middlewares** y **services**.

## Conceptos clave

| Concepto | Rol |
|----------|-----|
| **Static config** | Arranque: entrypoints, providers, API, logs, certificados ACME |
| **Dynamic config** | En caliente: routers, services, middlewares, TLS options |
| **EntryPoint** | Puerto/protocolo donde escucha Traefik (`web`, `websecure`) |
| **Router** | Regla que decide si una peticion entra (Host, Path, Method...) |
| **Service** | Como alcanzar backends (load balance, servers, health check) |
| **Middleware** | Transformacion entre router y service (auth, headers, rate limit) |
| **Provider** | Fuente de config dinamica (docker, kubernetes, file...) |

## Static vs dynamic

Static (fichero `traefik.yml` / `traefik.toml` o flags CLI): se lee al arrancar. Cambiar entrypoints o providers implica reinicio.

Dynamic: routers y middlewares. Llega por providers y se aplica sin downtime.

Ejemplo static minimo (`traefik.yml`):

```yaml
api:
  dashboard: true
  insecure: true   # solo lab; en prod protege o desactiva

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    filename: /etc/traefik/dynamic.yml
    watch: true

log:
  level: INFO
```

Equivalente en TOML:

```toml
[api]
  dashboard = true
  insecure = true

[entryPoints.web]
  address = ":80"

[entryPoints.websecure]
  address = ":443"

[providers.docker]
  endpoint = "unix:///var/run/docker.sock"
  exposedByDefault = false

[providers.file]
  filename = "/etc/traefik/dynamic.yml"
  watch = true

[log]
  level = "INFO"
```

## Flujo de una peticion

1. Llega al **entryPoint** (`web` o `websecure`).
2. Traefik evalua **routers** del entrypoint (prioridad, reglas).
3. Aplica la cadena de **middlewares** del router.
4. Reenvia al **service**, que elige un servidor backend.
5. La respuesta vuelve por la misma cadena.

Si ningun router coincide: 404. Si el service no tiene servidores sanos: 502/503 segun el caso.

## Arranque local con Docker

`docker-compose.yml`:

```yaml
services:
  traefik:
    image: traefik:v3.3
    command:
      - --api.insecure=true
      - --providers.docker=true
      - --providers.docker.exposedByDefault=false
      - --entrypoints.web.address=:80
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
```

Levantar y comprobar dashboard / API:

```bash
docker compose up -d
curl -s http://127.0.0.1:8080/api/overview | head
curl -I http://127.0.0.1:8080/dashboard/
```

El socket Docker en modo lectura basta para descubrir contenedores. No publiques `:8080` a internet sin auth.

## Providers habituales

| Provider | Cuando usarlo |
|----------|---------------|
| **docker** | Compose / Swarm; labels en servicios |
| **kubernetesCRD** / **kubernetesIngress** | Clusters; IngressRoute o Ingress clasico |
| **file** | Reglas compartidas, middlewares globales, backends externos |
| **consulCatalog** / **nomad** | Service discovery fuera de K8s |

Puedes combinar varios a la vez. Los nombres de routers/services deben ser unicos en el conjunto agregado.

## Traefik frente a Nginx / Caddy / HAProxy

| Herramienta | Punto fuerte |
|-------------|--------------|
| **Traefik** | Discovery + TLS ACME + labels/CRDs |
| **Nginx** | Static, cache, config explicita y madura |
| **Caddy** | TLS automatico con config corta |
| **HAProxy** | Balanceo L4/L7 muy afinado |

Elige Traefik cuando el mapa de servicios es dinamico. Si tienes pocos vhosts estables y mucho static/cache, Nginx suele ser mas simple.

## Errores habituales

- Mezclar opciones static en el fichero dynamic (o al reves): Traefik las ignora o falla al arrancar.
- `exposedByDefault: true` en Docker: publica contenedores sin labels a proposito.
- Dashboard `insecure` expuesto en `:8080` hacia la red publica.
- Olvidar que entrypoints se definen en static: un router con `entryPoints: ["websecure"]` sin ese entrypoint no recibe trafico.
- Versionar `acme.json` con permisos abiertos (debe ser `600`).

## Ejercicios

1. Levanta Traefik con el compose de arriba y confirma `/api/overview` y el dashboard.
2. Anade un `providers.file` con un router Host(`whoami.localhost`) apuntando a un servicio externo y verifica con `curl -H 'Host: whoami.localhost'`.
3. Cambia `log.level` a `DEBUG`, reproduce una 404 y localiza en logs que no hubo match de router.
4. Compara el mismo arranque con `traefik.yml` montado vs flags `--` en `command`.

## Siguiente paso

En el [capitulo 2](02-routers-services-y-middlewares.md) defines reglas de enrutado, backends y middlewares con config file y labels.

# Docker provider

El provider Docker observa el socket, lee labels de contenedores y genera routers/services automaticamente. Es el camino habitual con Compose: cada servicio declara como quiere publicarse y Traefik reacciona al `up`/`down` sin tocar un fichero central de rutas.

## Activar el provider

Static (`traefik.yml` o flags):

```yaml
providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: proxy
    watch: true
```

| Opcion | Efecto |
|--------|--------|
| `exposedByDefault: false` | Solo contenedores con `traefik.enable=true` |
| `network` | Red Docker por defecto para resolver IPs |
| `endpoint` | Socket local o TCP hacia el daemon |

Monta el socket en solo lectura:

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:ro
```

## Stack minimo

```yaml
# docker-compose.yml
services:
  traefik:
    image: traefik:v3.3
    command:
      - --providers.docker=true
      - --providers.docker.exposedByDefault=false
      - --providers.docker.network=proxy
      - --entrypoints.web.address=:80
      - --api.insecure=true
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - proxy

  whoami:
    image: traefik/whoami:v1.10
    labels:
      - traefik.enable=true
      - traefik.http.routers.whoami.rule=Host(`whoami.localhost`)
      - traefik.http.routers.whoami.entrypoints=web
      - traefik.http.services.whoami.loadbalancer.server.port=80
    networks:
      - proxy

networks:
  proxy:
    name: proxy
```

```bash
docker compose up -d
curl -H 'Host: whoami.localhost' http://127.0.0.1/
docker compose logs traefik --tail 50
```

## Mapa de labels

Patron general:

```txt
traefik.http.routers.<nombre>.<campo>
traefik.http.services.<nombre>.loadbalancer.<campo>
traefik.http.middlewares.<nombre>.<tipo>.<campo>
```

Ejemplos concretos:

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.app.rule=Host(`app.example.com`) && PathPrefix(`/`)
  - traefik.http.routers.app.entrypoints=websecure
  - traefik.http.routers.app.tls=true
  - traefik.http.routers.app.tls.certresolver=le
  - traefik.http.routers.app.middlewares=app-compress,app-headers
  - traefik.http.routers.app.service=app
  - traefik.http.services.app.loadbalancer.server.port=3000
  - traefik.http.middlewares.app-compress.compress=true
  - traefik.http.middlewares.app-headers.headers.stsSeconds=31536000
  - traefik.http.middlewares.app-headers.headers.frameDeny=true
```

Si el contenedor expone un solo puerto, Traefik puede inferirlo. Con varios puertos, `loadbalancer.server.port` es obligatorio.

## Varios routers en un servicio

API y front en el mismo contenedor:

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.app-web.rule=Host(`app.example.com`)
  - traefik.http.routers.app-web.entrypoints=websecure
  - traefik.http.routers.app-web.tls.certresolver=le
  - traefik.http.routers.app-web.service=app
  - traefik.http.routers.app-api.rule=Host(`app.example.com`) && PathPrefix(`/api`)
  - traefik.http.routers.app-api.entrypoints=websecure
  - traefik.http.routers.app-api.tls.certresolver=le
  - traefik.http.routers.app-api.middlewares=strip-api
  - traefik.http.routers.app-api.service=app
  - traefik.http.routers.app-api.priority=100
  - traefik.http.middlewares.strip-api.stripprefix.prefixes=/api
  - traefik.http.services.app.loadbalancer.server.port=8080
```

## Middlewares compartidos (file + docker)

Define middlewares globales en file provider y referencialos desde labels con el sufijo `@file`:

`dynamic/middlewares.yml`:

```yaml
http:
  middlewares:
    sec-headers:
      headers:
        stsSeconds: 31536000
        contentTypeNosniff: true
        frameDeny: true
    auth-admin:
      basicAuth:
        usersFile: /etc/traefik/users.htpasswd
```

Label:

```yaml
- traefik.http.routers.admin.middlewares=sec-headers@file,auth-admin@file
```

Asi no duplicas headers en cada servicio.

## Redes Docker

Traefik debe compartir red con el backend para alcanzar su IP. Patrones:

1. **Red dedicada `proxy`**: solo Traefik y servicios publicados.
2. El backend puede estar en `proxy` + `internal` si tambien habla con DB.

```yaml
services:
  api:
    networks:
      - proxy
      - internal
    labels:
      - traefik.docker.network=proxy

  db:
    networks:
      - internal
    # sin traefik.enable

networks:
  proxy:
  internal:
```

`traefik.docker.network` evita que Traefik elija la IP de una red donde el no esta.

## Swarm

En Swarm, labels van en el servicio (no en el contenedor de tarea) y el provider cambia:

```yaml
providers:
  swarm:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
```

Constraint tipico para Traefik en managers (si usas socket):

```yaml
deploy:
  placement:
    constraints:
      - node.role == manager
  labels:
    - traefik.enable=true
    - traefik.http.routers.whoami.rule=Host(`whoami.example.com`)
    - traefik.http.services.whoami.loadbalancer.server.port=80
```

## Inspeccionar lo que Traefik ve

```bash
curl -s http://127.0.0.1:8080/api/http/routers | jq '.[].name'
curl -s http://127.0.0.1:8080/api/http/services | jq '.[].name'
docker inspect -f '{{json .Config.Labels}}' $(docker compose ps -q whoami) | jq
```

Si el router no aparece: `traefik.enable`, red compartida, o typo en labels.

## Errores habituales

- Contenedor en otra red: Traefik registra el router pero el service apunta a IP inalcanzable (504/Bad Gateway).
- Varios puertos expuestos sin `server.port`.
- `exposedByDefault: true` y un contenedor de debug queda publico.
- Labels en `deploy.labels` en Compose no-Swarm (o al reves): el provider no las lee.
- Referencia `middleware@file` sin tener el file provider cargado.

## Ejercicios

1. Publica `whoami` con Host `whoami.localhost` y verifica con curl.
2. Anade un segundo servicio con PathPrefix `/api` y stripPrefix; confirma el path en la respuesta whoami.
3. Mueve whoami a una red distinta sin `traefik.docker.network` y observa el fallo; corrigelo.
4. Extrae `sec-headers` a un file provider y enlazalo con `@file` desde labels.

## Siguiente paso

En el [capitulo 4](04-tls-automatico.md) anades certificados Let's Encrypt con `certResolver` y challenge HTTP o DNS.

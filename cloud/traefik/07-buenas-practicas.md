# Buenas practicas

Guia operativa para mantener Traefik predecible en produccion: superficie de ataque pequena, config reproducible y fallos detectables antes que el usuario.

## Separar static y dynamic

| Static (arranque) | Dynamic (caliente) |
|-------------------|--------------------|
| Entrypoints, providers, ACME resolver, log, metrics, API | Routers, services, middlewares, tls certificates/options |

Versiona ambos en git. Secretos (tokens DNS, htpasswd, `acme.json`) fuera del repo: volume, Secret de K8s o montaje desde vault.

Estructura tipica Compose:

```txt
traefik/
  traefik.yml          # static
  dynamic/
    middlewares.yml
    tls-options.yml
  letsencrypt/
    acme.json          # gitignore + chmod 600
  docker-compose.yml
```

```yaml
# traefik.yml
providers:
  docker:
    exposedByDefault: false
    network: proxy
  file:
    directory: /etc/traefik/dynamic
    watch: true
```

## Exposicion minima

- `exposedByDefault: false` siempre en Docker/Swarm.
- Dashboard solo con auth + TLS, nunca `api.insecure` en redes publicas.
- Socket Docker `:ro`. Mejor: socket proxy (p. ej. Tecnativa/docker-socket-proxy) que solo permita `GET` de containers/networks/services.
- Entrypoint de metrics/ping en red interna o protegido.

Ejemplo socket proxy (idea):

```yaml
services:
  socket-proxy:
    image: tecnativa/docker-socket-proxy:0.3
    environment:
      CONTAINERS: 1
      NETWORKS: 1
      SERVICES: 1
      TASKS: 1
      POST: 0
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - proxy

  traefik:
    environment:
      - DOCKER_HOST=tcp://socket-proxy:2375
    command:
      - --providers.docker.endpoint=tcp://socket-proxy:2375
```

## TLS

- Persistencia de `acme.json` y backups cifrados.
- Staging LE en labs; produccion solo cuando DNS y challenges estan validados.
- `tls.options` con `minVersion: VersionTLS12` y `sniStrict: true`.
- Redirect HTTP->HTTPS en entrypoint, no middleware ad-hoc que rompa ACME.
- Un solo emisor por dominio (cert-manager **o** ACME de Traefik).

```yaml
tls:
  options:
    default:
      minVersion: VersionTLS12
      sniStrict: true
```

## Middlewares reutilizables

Centraliza headers, auth y rate limit en file/CRD y referencia con `@file` / nombre+namespace. Evita copiar 15 labels identicos en cada servicio.

Cadena tipica en edge publico:

```txt
compress -> sec-headers -> rate-limit -> (auth?) -> stripPrefix?
```

Rate limit por IP en el edge; auth en rutas admin; stripPrefix solo cuando el backend no espera el prefijo.

## Nombres y prioridades

- Nombres de routers/services unicos entre providers (`app@docker` vs `app@file`).
- `priority` explicita cuando hay PathPrefix + catch-all.
- Un Host / dominio documentado por equipo; evita dos stacks Compose compitiendo por el mismo Host.

## Redes y blast radius

- Red `proxy` solo para Traefik y servicios publicados.
- Bases de datos en red interna sin labels Traefik.
- En K8s: NetworkPolicies que limiten quien habla al Service de Traefik y desde Traefik a namespaces de apps.

## Recursos y timeouts

```yaml
# static / entryPoints
entryPoints:
  websecure:
    address: ":443"
    transport:
      respondingTimeouts:
        readTimeout: 60s
        writeTimeout: 60s
        idleTimeout: 180s
```

Ajusta `serversTransports` para backends lentos (uploads, SSE) en lugar de subir timeouts globales sin medida.

En Docker Compose, limita CPU/memoria de Traefik:

```yaml
deploy:
  resources:
    limits:
      cpus: "1.0"
      memory: 512M
```

## Observabilidad minima en prod

1. Access log JSON a stdout (plataforma de logs).
2. Metricas Prometheus + alertas 5xx y caducidad TLS.
3. `/ping` en readiness.
4. Dashboard autenticado o deshabilitado.

## Checklist pre-produccion

```txt
[ ] exposedByDefault=false
[ ] api.insecure=false; dashboard con auth o off
[ ] Socket Docker ro o proxy restringido
[ ] acme.json 600 + volumen + backup
[ ] DNS correcto antes de emitir certs prod
[ ] Redirect HTTP->HTTPS en entrypoint
[ ] tls.options min TLS1.2
[ ] Middlewares de headers y rate limit en edge publico
[ ] Access log + metrics + ping
[ ] Redes: solo backends publicados en la red de Traefik
[ ] Config en git; secretos fuera
[ ] Prueba de fallo de backend (502 esperado) y de renovacion ACME
```

## Patron Compose de referencia

```yaml
services:
  traefik:
    image: traefik:v3.3
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
      - ./dynamic:/etc/traefik/dynamic:ro
      - ./letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - proxy

  app:
    image: ghcr.io/example/app:1.2.3
    labels:
      - traefik.enable=true
      - traefik.http.routers.app.rule=Host(`app.example.com`)
      - traefik.http.routers.app.entrypoints=websecure
      - traefik.http.routers.app.tls.certresolver=le
      - traefik.http.routers.app.middlewares=sec-headers@file,rate-limit@file
      - traefik.http.services.app.loadbalancer.server.port=8080
    networks:
      - proxy
      - internal

networks:
  proxy:
  internal:
```

## Errores que se pagan caros

- Dashboard abierto en el LoadBalancer.
- `acme.json` en el repo git.
- Dos Traefik en la misma red publicando el mismo Host (routers duplicados, certs a medias).
- Labels Swarm en Compose clasico (o al reves) y "no se publica nada".
- Subir Traefik sin pinning de version (`:latest`) en prod.

## Ejercicios

1. Aplica el checklist a tu stack actual y anota gaps.
2. Introduce docker-socket-proxy (o equivalente) y verifica que Traefik sigue descubriendo contenedores.
3. Mueve headers/rate-limit a `dynamic/` y deja labels solo con rule/entrypoint/tls/middleware refs.
4. Rompe a proposito el backend, confirma alerta 5xx y entrada de access log; documenta el runbook en 5 lineas.

## Cierre del manual

Con los siete capitulos tienes el ciclo completo: arquitectura, routing, Docker, TLS, Kubernetes, telemetria y operacion. El siguiente salto natural es automatizar el despliegue (CI que valide manifiestos / `docker compose config`) y unificar middlewares entre entornos lab y prod con el mismo directorio `dynamic/`.

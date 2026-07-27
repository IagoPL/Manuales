# Routers, services y middlewares

El plano dinamico de Traefik se reduce a tres piezas: el **router** decide si la peticion entra, los **middlewares** la transforman, y el **service** elige a que backend enviarla. Dominar estas tres capas evita reglas opacas y cadenas de labels imposibles de depurar.

## Anatomia de una regla

```txt
Request
  -> Router (rule + entryPoints + priority + tls?)
       -> Middleware A -> Middleware B
            -> Service (loadBalancer / weighted / mirroring)
                 -> server1:port
                 -> server2:port
```

Todo esto puede vivir en un fichero dynamic, en labels Docker o en CRDs de Kubernetes. La semantica es la misma.

## Router

Campos que importan:

| Campo | Uso |
|-------|-----|
| `rule` | Expresion: `Host`, `Path`, `PathPrefix`, `Method`, `Headers`, `Query`, operadores `&&` `\|\|` `!` |
| `entryPoints` | Lista de entrypoints que atienden este router |
| `service` | Nombre del service destino |
| `middlewares` | Lista ordenada |
| `priority` | Mayor gana cuando varias reglas coinciden |
| `tls` | Activa TLS en ese router (y opcionalmente certResolver) |

Ejemplo en fichero dynamic (`dynamic.yml`):

```yaml
http:
  routers:
    api:
      rule: "Host(`api.example.com`) && PathPrefix(`/v1`)"
      entryPoints:
        - websecure
      middlewares:
        - strip-v1
        - rate-limit
      service: api-svc
      tls:
        certResolver: le
      priority: 100

    api-catch:
      rule: "Host(`api.example.com`)"
      entryPoints:
        - websecure
      service: api-docs
      tls:
        certResolver: le
      priority: 10
```

Sin `priority`, Traefik usa la longitud de la regla como heuristica. Hazla explicita cuando mezcles `PathPrefix` y catch-all del mismo Host.

Reglas utiles:

```txt
Host(`app.example.com`)
Host(`a.example.com`) || Host(`b.example.com`)
Host(`app.example.com`) && PathPrefix(`/api`)
Host(`app.example.com`) && Method(`GET`, `HEAD`)
Host(`app.example.com`) && Headers(`X-Tenant`, `acme`)
```

## Service

El service describe **como** llegar a los backends, no el matching HTTP.

```yaml
http:
  services:
    api-svc:
      loadBalancer:
        servers:
          - url: "http://10.0.1.10:8080"
          - url: "http://10.0.1.11:8080"
        healthCheck:
          path: /healthz
          interval: 10s
          timeout: 3s
        passHostHeader: true
        sticky:
          cookie:
            name: lb
            secure: true
            httpOnly: true
```

Variantes:

- **loadBalancer**: round-robin (sticky opcional).
- **weighted**: varios services con peso (canary).
- **mirroring**: trafico espejo a un service secundario sin afectar la respuesta principal.
- **failover**: primario + fallback.

Canary con weighted:

```yaml
http:
  services:
    api-canary:
      weighted:
        services:
          - name: api-stable
            weight: 90
          - name: api-next
            weight: 10
```

## Middlewares

Se declaran una vez y se reutilizan por nombre. El orden en el router importa: el primero de la lista se aplica primero.

```yaml
http:
  middlewares:
    strip-v1:
      stripPrefix:
        prefixes:
          - /v1

    rate-limit:
      rateLimit:
        average: 100
        burst: 50
        period: 1s

    compress:
      compress: {}

    secure-headers:
      headers:
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        contentTypeNosniff: true
        frameDeny: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"

    basic-auth:
      basicAuth:
        users:
          - "admin:$apr1$r31....$..."   # htpasswd

    redirect-https:
      redirectScheme:
        scheme: https
        permanent: true

    retry:
      retry:
        attempts: 3
        initialInterval: 100ms
```

Encadenar en el router:

```yaml
middlewares:
  - redirect-https   # si aplica en entrypoint web
  - compress
  - secure-headers
  - rate-limit
  - strip-v1
```

Para auth con fichero de usuarios:

```bash
htpasswd -nbB admin 'S3cret!' | sed -e 's/\$/\$\$/g'
```

En Docker Compose hay que doblar `$` (`$$`) para que Compose no interpole. En fichero YAML puro, una sola barra de escape segun el generador de hash.

## Redirect HTTP -> HTTPS en el entrypoint

Preferible a un middleware por router cuando quieres forzar HTTPS global:

```yaml
# traefik.yml (static)
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
  websecure:
    address: ":443"
```

## ServersTransport (timeouts y TLS al backend)

Cuando el backend usa HTTPS interno o necesitas afinar timeouts:

```yaml
http:
  serversTransports:
    backend-tls:
      insecureSkipVerify: false
      rootCAs:
        - /certs/ca.pem
      forwardingTimeouts:
        dialTimeout: 10s
        responseHeaderTimeout: 60s

  services:
    api-svc:
      loadBalancer:
        serversTransport: backend-tls
        servers:
          - url: "https://api.internal:8443"
```

## Ejemplo completo file provider

`dynamic.yml`:

```yaml
http:
  middlewares:
    strip-api:
      stripPrefix:
        prefixes: ["/api"]
    limit:
      rateLimit:
        average: 50
        burst: 20

  routers:
    whoami:
      rule: "Host(`whoami.localhost`)"
      entryPoints: ["web"]
      middlewares: ["limit"]
      service: whoami

    api:
      rule: "Host(`whoami.localhost`) && PathPrefix(`/api`)"
      entryPoints: ["web"]
      middlewares: ["limit", "strip-api"]
      service: whoami
      priority: 20

  services:
    whoami:
      loadBalancer:
        servers:
          - url: "http://whoami:80"
```

Prueba:

```bash
curl -H 'Host: whoami.localhost' http://127.0.0.1/
curl -H 'Host: whoami.localhost' http://127.0.0.1/api/foo
# el backend recibe /foo tras stripPrefix
```

## Errores habituales

- `PathPrefix(`/api`)` sin `stripPrefix`: el backend recibe `/api/...` y responde 404.
- Misma prioridad / misma longitud de regla: comportamiento poco predecible; fija `priority`.
- Middleware referenciado con typo: el router queda inutilizado (revisa logs y dashboard).
- `passHostHeader: false` cuando la app virtualiza por Host: la app ve el hostname interno.
- BasicAuth con hash mal escapado en Compose: auth siempre falla.

## Ejercicios

1. Monta un file provider con dos routers del mismo Host (uno con PathPrefix y otro catch-all) y demuestra el efecto de `priority`.
2. Anade `stripPrefix` y comprueba con logs del backend que path llega.
3. Configura `rateLimit` bajo, satura con un bucle `curl` y observa 429.
4. Monta un service `weighted` 80/20 entre dos whoami y cuenta respuestas distintas (cabecera `Hostname`).

## Siguiente paso

En el [capitulo 3](03-docker-provider.md) expresas routers y services con labels en Docker Compose.

# TLS automatico

Traefik puede obtener y renovar certificados Let's Encrypt (ACME) sin certbot. Declaras un **certificate resolver**, marcas routers con `tls.certResolver`, y Traefik pide el cert en el primer hit (o al detectar el dominio) y lo guarda en un almacenamiento persistente.

## Certificate resolver (static)

HTTP-01 (puerto 80 publico, DNS apuntando al edge):

```yaml
# traefik.yml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  le:
    acme:
      email: ops@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    exposedByDefault: false
```

TLS-ALPN-01 (challenge en 443, util si 80 esta cerrado):

```yaml
certificatesResolvers:
  le:
    acme:
      email: ops@example.com
      storage: /letsencrypt/acme.json
      tlsChallenge: {}
```

DNS-01 (wildcards `*.example.com`, o hosts sin HTTP publico):

```yaml
certificatesResolvers:
  le:
    acme:
      email: ops@example.com
      storage: /letsencrypt/acme.json
      dnsChallenge:
        provider: cloudflare
        resolvers:
          - "1.1.1.1:53"
          - "8.8.8.8:53"
```

El provider DNS exige variables de entorno del proveedor (token API). Ejemplo Cloudflare:

```bash
export CF_DNS_API_TOKEN="..."
```

## Persistencia de acme.json

Sin volumen, pierdes certs en cada recreate y golpeas rate limits de Let's Encrypt.

```yaml
services:
  traefik:
    image: traefik:v3.3
    environment:
      - CF_DNS_API_TOKEN  # si usas dnsChallenge
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
```

Permisos:

```bash
mkdir -p letsencrypt
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
```

Traefik se niega a usar `acme.json` si los permisos son demasiado abiertos.

## Activar TLS en un router (Docker labels)

```yaml
services:
  app:
    image: traefik/whoami:v1.10
    labels:
      - traefik.enable=true
      - traefik.http.routers.app.rule=Host(`app.example.com`)
      - traefik.http.routers.app.entrypoints=websecure
      - traefik.http.routers.app.tls=true
      - traefik.http.routers.app.tls.certresolver=le
      - traefik.http.services.app.loadbalancer.server.port=80
```

Equivalente en file provider:

```yaml
http:
  routers:
    app:
      rule: "Host(`app.example.com`)"
      entryPoints: ["websecure"]
      service: app
      tls:
        certResolver: le
```

## Wildcard con DNS-01

```yaml
# labels
- traefik.http.routers.app.rule=Host(`app.example.com`) || Host(`api.example.com`)
- traefik.http.routers.app.tls.certresolver=le
- traefik.http.routers.app.tls.domains[0].main=example.com
- traefik.http.routers.app.tls.domains[0].sans=*.example.com
```

En YAML file:

```yaml
tls:
  certResolver: le
  domains:
    - main: example.com
      sans:
        - "*.example.com"
```

## Staging de Let's Encrypt

Durante pruebas usa el entorno staging para no agotar el rate limit de produccion:

```yaml
certificatesResolvers:
  le:
    acme:
      email: ops@example.com
      storage: /letsencrypt/acme.json
      caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      httpChallenge:
        entryPoint: web
```

Los navegadores no confiaran en staging (esperado). Cuando la validacion funcione, quita `caServer`, borra `acme.json` de staging y regenera en prod.

## Certificados propios (sin ACME)

Monta PEM y declaralos en dynamic:

```yaml
tls:
  certificates:
    - certFile: /certs/app.crt
      keyFile: /certs/app.key
  stores:
    default:
      defaultCertificate:
        certFile: /certs/default.crt
        keyFile: /certs/default.key
```

Opciones TLS (min version, ciphers) via `tls.options`:

```yaml
tls:
  options:
    modern:
      minVersion: VersionTLS12
      sniStrict: true

http:
  routers:
    app:
      rule: "Host(`app.example.com`)"
      entryPoints: ["websecure"]
      service: app
      tls:
        options: modern
        certResolver: le
```

## Redirect y HSTS

Redirect en entrypoint `web` (capitulo 2) + middleware HSTS en routers HTTPS:

```yaml
http:
  middlewares:
    hsts:
      headers:
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
```

No actives `stsPreload` hasta que todos los subdominios sirvan HTTPS correcto.

## Checklist de puesta en marcha

```txt
1. DNS A/AAAA del dominio -> IP publica de Traefik
2. Puertos 80 y/o 443 abiertos segun challenge
3. acme.json con chmod 600 y volumen persistente
4. email valido en el resolver
5. Router en entrypoint websecure + certResolver
6. Probar primero con caServer staging
```

Verificacion:

```bash
curl -vI https://app.example.com/
openssl s_client -connect app.example.com:443 -servername app.example.com </dev/null 2>/dev/null | openssl x509 -noout -dates -subject
```

## Errores habituales

- DNS aun no apunta al servidor: ACME falla; Traefik reintenta y llena logs.
- HTTP-01 con redirect global en `web` mal configurado que rompe `/.well-known/acme-challenge/` (el redirect nativo de entryPoint suele exceptuar el challenge; un middleware redirect casero puede no).
- `acme.json` sin persistir o con permisos `644`.
- Pedir demasiados certs de prueba en produccion (rate limit LE).
- `Host(`app.localhost`)` con ACME publico: Let's Encrypt no emite para localhost.
- Firewall cloud que solo abre 443: usa `tlsChallenge` o `dnsChallenge`.

## Ejercicios

1. Configura resolver staging + HTTP-01, publica un whoami con dominio real de lab y comprueba el cert (aviso de CA staging).
2. Fuerza un fallo de DNS, lee el log ACME, corrige el registro y verifica renovacion/emision.
3. Monta DNS-01 con un provider que tengas (Cloudflare, Route53, etc.) y emite un wildcard.
4. Anade `tls.options` con `minVersion: VersionTLS12` y comprueba con `openssl s_client -tls1_1` que el handshake falla.

## Siguiente paso

En el [capitulo 5](05-ingress-en-kubernetes.md) instalas Traefik como Ingress controller y defines IngressRoute.

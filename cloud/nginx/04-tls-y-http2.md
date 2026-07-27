# TLS y HTTP/2

TLS cifra el trafico entre cliente y Nginx. HTTP/2 multiplexa peticiones sobre una conexion TLS y mejora latencia percibida. En la mayoria de despliegues, Nginx termina TLS y habla HTTP claro con backends locales.

## Flujo TLS

```txt
Cliente --TLS--> Nginx:443  --HTTP--> 127.0.0.1:3000
                  |
                  +-- certificado + clave privada
```

El certificado acredita el dominio; la clave privada debe quedar solo en el servidor (permisos 600, root).

## Certificado de prueba (lab)

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/lab.key \
  -out /etc/nginx/ssl/lab.crt \
  -subj "/CN=app.local"
sudo chmod 600 /etc/nginx/ssl/lab.key
```

Solo para laboratorio: el navegador marcara el cert como no confiable.

## Server block HTTPS

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name app.example.com;

    ssl_certificate     /etc/nginx/ssl/lab.crt;
    ssl_certificate_key /etc/nginx/ssl/lab.key;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

En Nginx >= 1.25.1, `http2` es directiva independiente (`http2 on`). En versiones anteriores se usaba `listen 443 ssl http2;`.

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -Ik https://127.0.0.1/ -H 'Host: app.example.com' --resolve app.example.com:443:127.0.0.1
```

## Let's Encrypt con Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.com
```

Certbot crea/ajusta server blocks y programa renovacion. Comprueba:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

Rutas tipicas:

```txt
/etc/letsencrypt/live/app.example.com/fullchain.pem
/etc/letsencrypt/live/app.example.com/privkey.pem
```

```nginx
ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
```

Tras renovar, Certbot suele ejecutar `nginx -t` + reload. Si renuevas a mano:

```bash
sudo certbot renew
sudo nginx -t && sudo systemctl reload nginx
```

## Challenge HTTP-01

Certbot debe alcanzar `http://app.example.com/.well-known/acme-challenge/...`. No bloquees ese path:

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
    default_type text/plain;
}
```

Si solo tienes el server de redirect 301 a HTTPS, deja el challenge en el server :80 antes del `return`.

## Parametros TLS recomendados

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
resolver_timeout 5s;

add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

- Desactiva TLSv1.0/1.1.
- HSTS solo cuando todo el dominio ya esta en HTTPS (incluye subdominios si usas `includeSubDomains`).
- OCSP stapling reduce latencia de validacion del cliente.

## Redireccion y canonical host

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name www.example.com;
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name example.com;
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    # locations...
}
```

## HTTP/2 y HTTP/3

HTTP/2 (sobre TLS) esta estable en Nginx estable. HTTP/3 (QUIC) requiere build con soporte y puertos UDP 443; valora complejidad operativa antes de activarlo.

Comprobar ALPN/HTTP2:

```bash
curl -sI --http2 https://example.com | head -n 1
# HTTP/2 200
```

## Diffie-Hellman (legacy)

Algunos guides anaden `ssl_dhparam`. Con TLS 1.3 y ciphers modernas suele no ser necesario. Si lo usas:

```bash
sudo openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

```nginx
ssl_dhparam /etc/nginx/ssl/dhparam.pem;
```

## Checklist de puesta en marcha

```txt
DNS A/AAAA -> IP del servidor
Puerto 80 y 443 abiertos
nginx -t OK
Certbot o cert propio instalado
Redirect 80 -> 443
curl -Ik https://dominio
Renovacion dry-run OK
```

## Buenas practicas

- TLS solo en Nginx; backends en HTTP local.
- `X-Forwarded-Proto $scheme` para que la app genere URLs https.
- Permisos 600 en claves; propietario root.
- HSTS cuando el corte HTTP->HTTPS sea definitivo.
- Monitoriza caducidad de certificados (alerta < 15 dias).

## Errores habituales

- Certificado para un CN distinto del `server_name` (aviso en el navegador).
- Firewall sin 443: HTTPS timeout.
- Redirect 80->443 que rompe ACME HTTP-01.
- Mezclar `listen ... http2` (sintaxis vieja) con `http2 on` segun version.
- Olvidar `reload` tras renovar a mano: sigue sirviendo el cert viejo en memoria.

## Ejercicios

1. Genera un cert autofirmado, monta un server `:443 ssl` y verifica con `curl -Ik` (aceptando `-k`).
2. Anade redirect `return 301 https://$host$request_uri` en el server `:80` y comprueba la cadena con `curl -I`.
3. Si tienes dominio publico, emite un cert con Certbot y ejecuta `certbot renew --dry-run`.
4. Activa HSTS y comprueba el header con `curl -Is https://tu-dominio | grep -i strict`.

## Siguiente paso

En el [capitulo 5](05-load-balancing.md) repartiras trafico entre varios backends con `upstream`, metodos de balanceo y health checks pasivos.

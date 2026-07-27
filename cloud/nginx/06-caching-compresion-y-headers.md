# Caching, compresion y headers

Tres palancas de rendimiento y control en el borde: cachear respuestas, comprimir cuerpos y fijar cabeceras HTTP (cache del navegador y seguridad).

## Mapa mental

```txt
Peticion
  |-> hit en proxy_cache? -> servir desde disco/memoria
  |-> miss -> backend -> guardar en cache (si cacheable)
  |-> gzip/brotli si el cliente lo acepta
  +-> anadir/editar headers de respuesta
```

## Compresion gzip

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        application/json
        application/javascript
        application/xml
        application/xml+rss
        image/svg+xml;
}
```

No comprimas JPEG/PNG/MP4 ya comprimidos: gastas CPU sin ganar tamano.

Comprobar:

```bash
curl -H 'Accept-Encoding: gzip' -H 'Host: app.local' -I http://127.0.0.1/app.js
# Content-Encoding: gzip
# Vary: Accept-Encoding
```

Brotli suele ir como modulo dinamico (`ngx_brotli`) o build custom:

```nginx
brotli on;
brotli_comp_level 5;
brotli_types text/plain text/css application/json application/javascript;
```

Si el paquete de tu distro no lo trae, gzip es el baseline correcto.

## Cache de navegador (expires)

```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff2)$ {
    root /var/www/app;
    expires 7d;
    add_header Cache-Control "public";
    access_log off;
    try_files $uri =404;
}

location = /index.html {
    root /var/www/app;
    add_header Cache-Control "no-cache";
}
```

`expires` genera `Expires` y `Cache-Control`. Para HTML dinamico o SPA entrypoint, preferir `no-cache` (revalidar siempre).

## Proxy cache

Cachea respuestas del backend en disco:

```nginx
# en http {}
proxy_cache_path /var/cache/nginx/api
    levels=1:2
    keys_zone=api_cache:20m
    max_size=2g
    inactive=60m
    use_temp_path=off;

# en server {}
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_cache api_cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_background_update on;
        proxy_cache_lock on;
        add_header X-Cache-Status $upstream_cache_status always;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo mkdir -p /var/cache/nginx/api
sudo chown www-data:www-data /var/cache/nginx/api   # o nginx:nginx en RHEL
sudo nginx -t && sudo systemctl reload nginx
curl -I -H 'Host: api.example.com' http://127.0.0.1/items
# X-Cache-Status: MISS  (primera)
curl -I -H 'Host: api.example.com' http://127.0.0.1/items
# X-Cache-Status: HIT
```

Valores de `$upstream_cache_status`: `HIT`, `MISS`, `BYPASS`, `EXPIRED`, `STALE`, `UPDATING`, `REVALIDATED`.

## Que no cachear

```nginx
set $skip_cache 0;
if ($request_method = POST) { set $skip_cache 1; }
if ($http_authorization != "") { set $skip_cache 1; }
if ($http_cookie ~* "session|auth") { set $skip_cache 1; }

location / {
    proxy_cache api_cache;
    proxy_cache_bypass $skip_cache;
    proxy_no_cache $skip_cache;
    proxy_pass http://127.0.0.1:8080;
}
```

Nunca cachees respuestas autenticadas o personalizadas sin una clave que incluya usuario (y aun asi suele ser mala idea en el borde).

## Clave de cache

Por defecto incluye scheme, host, request_uri. Personalizar:

```nginx
proxy_cache_key "$scheme$request_method$host$request_uri";
```

Si variaciones por `Accept-Language`, incluye esa variable en la clave o no cachees.

## Headers de seguridad

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; frame-ancestors 'self';" always;
```

Con HTTPS:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

`always` asegura el header tambien en respuestas de error.

CSP hay que afinarla por aplicacion: una politica demasiado estricta rompe scripts inline o CDNs.

## Headers de la app vs Nginx

Si el backend ya envia `Cache-Control`, decide quien manda:

```nginx
proxy_hide_header Cache-Control;
add_header Cache-Control "public, max-age=60" always;
```

O respeta al backend y no anadas `expires` conflictivos.

## ETag y validacion

Para estaticos, Nginx puede generar ETag. Con `etag on;` (default en muchas builds) el cliente revalida con `If-None-Match` y recibe `304`.

```nginx
location /assets/ {
    root /var/www;
    etag on;
    expires 1h;
}
```

## Ejemplo conjunto

```nginx
proxy_cache_path /var/cache/nginx/web keys_zone=web:10m max_size=1g inactive=24h;

server {
    listen 80;
    server_name www.example.com;
    root /var/www/example;

    gzip on;
    gzip_types text/css application/javascript application/json;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_cache web;
        proxy_cache_valid 200 5m;
        add_header X-Cache-Status $upstream_cache_status always;
        proxy_set_header Host $host;
    }

    location / {
        try_files $uri /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

## Buenas practicas

- Mide hit ratio (`X-Cache-Status`) antes de subir TTLs.
- Comprime solo tipos text/json/svg.
- Separar politicas de cache: assets inmutables vs HTML vs API.
- Cabeceras de seguridad con `always`.
- No cachear por defecto respuestas con `Set-Cookie` o `Authorization`.

## Errores habituales

- Cachear HTML de SPA un ano: usuarios atrapados en version vieja.
- `gzip_comp_level 9` en todo: CPU al pico, ganancia minima vs 4–5.
- Proxy cache de endpoints autenticados sin bypass.
- Olvidar `chown` en `/var/cache/nginx` -> errores en `error.log`.
- Duplicar `add_header` en `location` y perder headers heredados del `server` (en Nginx, `add_header` en un nivel reemplaza la herencia).

## Ejercicios

1. Activa gzip y verifica `Content-Encoding` en un JS > 1 KB.
2. Configura `proxy_cache` con `X-Cache-Status` y demuestra MISS seguido de HIT.
3. Anade bypass para `Authorization` y confirma `BYPASS` con `curl -H 'Authorization: Bearer x'`.
4. Pon `Cache-Control: no-cache` en `/index.html` y `immutable` en `/assets/`; valida con `curl -I`.

## Siguiente paso

En el [capitulo 7](07-logs-seguridad-y-hardening.md) cerraras el manual con logs estructurados, rate limiting, restriccion de metodos y endurecimiento del servidor.

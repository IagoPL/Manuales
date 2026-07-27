# Reverse proxy

Un reverse proxy recibe el trafico externo y lo reenvia a uno o mas backends. El cliente solo habla con Nginx; las apps escuchan en localhost o en una red privada.

## Por que usarlo

```txt
Internet -> :443 Nginx
              |-- /        -> 127.0.0.1:3000  (frontend SSR / API)
              |-- /api/    -> 127.0.0.1:8080  (API)
              +-- /static/ -> disco
```

Ventajas: un solo punto TLS, routing por path/host, ocultar puertos internos, centralizar logs y limites.

## proxy_pass basico

Backend de ejemplo (cualquier app en 3000):

```bash
# ejemplo minimo: responder en 3000 (python)
python3 -m http.server 3000 --bind 127.0.0.1
```

Config Nginx:

```nginx
server {
    listen 80;
    server_name app.local;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -H 'Host: app.local' http://127.0.0.1/
```

## Barra final en proxy_pass

Comportamiento distinto segun la URI en `proxy_pass`:

| location | proxy_pass | Peticion | Upstream recibe |
|----------|------------|----------|-----------------|
| `/api/` | `http://127.0.0.1:8080/` | `/api/users` | `/users` |
| `/api/` | `http://127.0.0.1:8080` | `/api/users` | `/api/users` |
| `/api` | `http://127.0.0.1:8080` | `/api/users` | `/api/users` |

Si la app espera rutas sin el prefijo `/api`, usa URI con barra en `proxy_pass` para recortar el location.

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
}
```

## Cabeceras reenviadas

Sin `Host` y `X-Forwarded-*`, el backend ve `Host: 127.0.0.1:8080` y genera URLs o redirects incorrectos.

```nginx
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host  $host;
```

La app debe confiar en estos headers solo desde Nginx (no exponer el puerto del backend a internet).

## WebSockets

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host       $host;
    proxy_read_timeout 86400;
}
```

Sin `Upgrade`/`Connection`, el handshake WebSocket falla.

## Timeouts y buffers

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;

    proxy_connect_timeout 5s;
    proxy_send_timeout    60s;
    proxy_read_timeout    60s;

    proxy_buffering on;
    proxy_buffer_size 8k;
    proxy_buffers 16 8k;
}
```

- `connect`: tiempo para abrir TCP al backend.
- `read`/`send`: inactividad durante la transferencia.
- Sube `proxy_read_timeout` en uploads largos o SSE; baja `connect` para fallar rapido si el backend esta muerto.

## Errores del upstream

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_intercept_errors on;
    error_page 502 503 504 /50x.html;
}

location = /50x.html {
    root /var/www/errors;
    internal;
}
```

Pagina amigable cuando el backend no responde. `internal` evita que alguien pida `/50x.html` directamente como atajo.

## Varios hosts

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        include /etc/nginx/proxy_params;  # si la distro lo aporta
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Ejemplo: static + API

```nginx
server {
    listen 80;
    server_name shop.local;
    root /var/www/shop;

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Comprobar el proxy

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -v -H 'Host: app.local' http://127.0.0.1/api/health
sudo tail -f /var/log/nginx/access.log
```

Si ves `502 Bad Gateway`, el backend no escucha o el firewall local bloquea. Revisa:

```bash
ss -tlnp | grep 3000
sudo tail -n 50 /var/log/nginx/error.log
```

## Buenas practicas

- Backends solo en `127.0.0.1` o red privada; nunca publicar el puerto de la app.
- Siempre reenviar `Host` y `X-Forwarded-Proto`.
- Timeouts explicitos; no depender de defaults eternos.
- Un `location` por prefijo claro (`/api/`, `/ws/`).
- Paginas `error_page` para 502/504 en produccion.

## Errores habituales

- Barra final mal puesta en `proxy_pass` (rutas 404 en el backend).
- Olvidar headers: redirects absolutos a `http://127.0.0.1`.
- WebSockets sin `Upgrade`/`Connection`.
- `proxy_pass http://backend` sin que `backend` este definido como `upstream` o IP.
- 502 por app caida y no mirar `error.log` (`connect() failed`).

## Ejercicios

1. Levanta un servidor en `127.0.0.1:3000` y proxea `/` desde Nginx; verifica con `curl` el header `X-Forwarded-For` en logs del backend (o un echo server).
2. Configura `/api/` con y sin barra en `proxy_pass` y documenta que path llega al upstream.
3. Para el backend y confirma `502`; anade `error_page` y una pagina estatica de mantenimiento.
4. Anade un location `/ws/` con headers de Upgrade (aunque no tengas WS real, valida `nginx -t` y la config).

## Siguiente paso

En el [capitulo 4](04-tls-y-http2.md) anadiras certificados, redireccion HTTP->HTTPS, HTTP/2 y renovacion con Let's Encrypt.

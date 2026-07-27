# Logs, seguridad y hardening

En produccion Nginx es el borde: registra quien entra, limita abuso, oculta versiones y reduce superficie de ataque. Este capitulo cierra el manual con operacion y endurecimiento.

## Formatos de log

Formato combinado tipico (ya suele venir definido):

```nginx
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent"';
```

Formato con timings y upstream (util en proxy):

```nginx
log_format json_analytics escape=json
  '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"method":"$request_method",'
    '"uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_addr":"$upstream_addr",'
    '"upstream_time":"$upstream_response_time",'
    '"cache":"$upstream_cache_status",'
    '"host":"$host",'
    '"ua":"$http_user_agent"'
  '}';

access_log /var/log/nginx/access.json json_analytics;
error_log  /var/log/nginx/error.log warn;
```

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo tail -f /var/log/nginx/access.json
```

Niveles de `error_log`: `debug`, `info`, `notice`, `warn`, `error`, `crit`. En prod suele bastar `warn` o `error`.

## Rotacion

Con `logrotate` (Debian/Ubuntu suelen traer `/etc/logrotate.d/nginx`):

```txt
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /run/nginx.pid ]; then
            kill -USR1 $(cat /run/nginx.pid)
        fi
    endscript
}
```

`USR1` reabre logs sin downtime. Sin eso, Nginx sigue escribiendo al inode viejo tras rotar.

## Ocultar version y tokens

```nginx
http {
    server_tokens off;
}
```

Evita `Server: nginx/1.24.0` en respuestas. No es seguridad fuerte, pero reduce fingerprinting trivial.

## Restringir metodos

```nginx
location / {
    limit_except GET HEAD POST {
        deny all;
    }
    proxy_pass http://127.0.0.1:3000;
}
```

O denegar TRACE/TRACK de forma global con `if` (usar con cuidado) o en el WAF/firewall.

## Rate limiting

```nginx
# en http {}
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    listen 443 ssl;
    http2 on;
    server_name app.example.com;

    location /login {
        limit_req zone=login burst=3 nodelay;
        limit_req_status 429;
        proxy_pass http://127.0.0.1:3000;
    }

    location /api/ {
        limit_req zone=api burst=60 nodelay;
        limit_conn addr 20;
        proxy_pass http://127.0.0.1:8080/;
    }
}
```

- `rate=5r/m`: media de 5 peticiones por minuto por IP.
- `burst`: cola/pico permitido.
- `nodelay`: no suaviza el burst; excedentes fallan al momento.
- `limit_conn`: conexiones simultaneas por IP.

Detras de Cloudflare/ALB, la IP real no es `$remote_addr`. Usa `real_ip`:

```nginx
set_real_ip_from 10.0.0.0/8;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
```

Ajusta `set_real_ip_from` a las redes del proxy de confianza.

## Allow / deny

```nginx
location /admin/ {
    allow 10.0.0.0/8;
    allow 203.0.113.10;
    deny all;
    proxy_pass http://127.0.0.1:8080;
}
```

Para basic auth:

```bash
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd ops
sudo chmod 640 /etc/nginx/.htpasswd
sudo chown root:www-data /etc/nginx/.htpasswd
```

```nginx
location /admin/ {
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://127.0.0.1:8080;
}
```

## Tamano de cuerpos y buffers

```nginx
client_max_body_size 10m;
client_body_timeout 15s;
client_header_timeout 15s;
large_client_header_buffers 4 16k;
```

Limita uploads enormes y slowloris basico. APIs de ficheros grandes suben `client_max_body_size` solo en ese `location`.

## TLS y headers (repaso de hardening)

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
server_tokens off;

add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "no-referrer" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

HSTS `preload` solo si entiendes el compromiso (inclusion en lista de navegadores).

## Desactivar sites y locaciones peligrosas

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}
```

`444` cierra la conexion sin respuesta: util para peticiones al IP crudo o Host desconocido.

```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

location ~* \.(php|aspx|jsp)$ {
    # si no sirves esos runtimes:
    return 404;
}
```

## Permisos y usuario

```bash
# config solo root escribe
sudo chown -R root:root /etc/nginx
sudo find /etc/nginx -type f -exec chmod 644 {} \;
sudo chmod 600 /etc/nginx/ssl/*.key 2>/dev/null || true
sudo chmod 640 /etc/nginx/.htpasswd
```

Workers corren como `www-data`/`nginx`. No ejecutes la app como root ni compartas la clave TLS con ese usuario si puedes evitarlo (el master lee la clave al arrancar).

## Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # 80 + 443
sudo ufw enable
sudo ufw status
```

Backends solo en localhost:

```bash
ss -tlnp | grep -E ':3000|:8080'
# debe mostrar 127.0.0.1, no 0.0.0.0
```

## Checklist de hardening

```txt
[ ] server_tokens off
[ ] TLS 1.2+ only, redirect HTTP->HTTPS
[ ] default_server que no sirva el site real
[ ] rate limit en login y APIs publicas
[ ] client_max_body_size acotado
[ ] .git / .env denegados
[ ] logs rotados + retencion definida
[ ] backends en 127.0.0.1 o red privada
[ ] nginx -t en CI antes de desplegar config
[ ] certificados monitorizados (caducidad)
```

## Ejemplo de server endurecido (esqueleto)

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    server_tokens off;
    client_max_body_size 5m;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    access_log /var/log/nginx/app.access.json json_analytics;
    error_log  /var/log/nginx/app.error.log warn;

    location /api/ {
        limit_req zone=api burst=40 nodelay;
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /var/www/app;
        try_files $uri /index.html;
    }

    location ~ /\. {
        deny all;
    }
}
```

## Buenas practicas

- Logs JSON a un colector (Fluent Bit, Vector, Loki); no solo disco local.
- Rate limits distintos por ruta critica (`/login`, `/api`).
- `default_server` de rechazo + servers con `server_name` explicitos.
- Revisar `error.log` tras cada deploy.
- Config en git + `nginx -t` en pipeline.

## Errores habituales

- Rate limit por `$remote_addr` detras de CDN sin `real_ip` (todas las peticiones comparten una IP).
- `client_max_body_size` default 1m y uploads fallan con `413`.
- Dejar el site default de la distro como catch-all publico.
- Basic auth con `.htpasswd` world-readable.
- Debug logging en prod (`error_log ... debug`) llenando disco.

## Ejercicios

1. Define un `log_format` con `$request_time` y `$upstream_response_time`; genera trafico y lee una linea.
2. Pon `limit_req` a `1r/s` en un location de prueba y observa `429` con un bucle `curl`.
3. Configura un `default_server` con `return 444` y un server nombrado; compara `curl` al IP vs al Host correcto.
4. Activa `server_tokens off` y verifica con `curl -I` que no aparece la version.

## Cierre del manual

Con estos siete capitulos tienes el ciclo habitual de Nginx en el borde:

```txt
instalar -> static -> reverse proxy -> TLS/HTTP2
        -> load balancing -> cache/gzip/headers -> logs/hardening
```

Siguiente lectura recomendada en el repo: [Traefik](../traefik/01-introduccion-y-arquitectura.md) si trabajas discovery dinamico con Docker/Kubernetes, o [Docker Compose](../docker-compose/01-introduccion-y-casos-de-uso.md) para montar Nginx junto a tus apps en local.

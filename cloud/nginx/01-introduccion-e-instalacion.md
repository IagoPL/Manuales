# Nginx: introduccion e instalacion

Nginx es un servidor web y proxy inverso de alto rendimiento. Atiende peticiones HTTP/HTTPS, sirve archivos estaticos, termina TLS, reparte carga entre backends y aplica cache, compresion y cabeceras de seguridad. En produccion suele ser el punto de entrada delante de aplicaciones (Node, Python, Java, contenedores).

## Capitulos

1. [Introduccion e instalacion](01-introduccion-e-instalacion.md)
2. [Servir archivos estaticos](02-servir-archivos-estaticos.md)
3. [Reverse proxy](03-reverse-proxy.md)
4. [TLS y HTTP/2](04-tls-y-http2.md)
5. [Load balancing](05-load-balancing.md)
6. [Caching, compresion y headers](06-caching-compresion-y-headers.md)
7. [Logs, seguridad y hardening](07-logs-seguridad-y-hardening.md)

## Que problema resuelve

Sin un reverse proxy dedicado:

- La app escucha en internet con TLS y routing a medias.
- Varios servicios comparten un solo puerto 443 sin reglas claras.
- No hay un sitio unico para rate limit, logs de acceso y cabeceras de seguridad.

Con Nginx:

```txt
Cliente -> Nginx (TLS, routing, static, cache)
              |
              +--> /assets  -> archivos en disco
              +--> /api     -> app:3000
              +--> /admin   -> app:8080
```

## Conceptos clave

| Concepto | Descripcion |
|----------|-------------|
| **Worker** | Proceso que atiende conexiones (evento-driven) |
| **server block** | Virtual host (`server { ... }`) |
| **location** | Regla de ruta dentro de un server |
| **upstream** | Grupo de backends para proxy o balanceo |
| **nginx.conf** | Config principal; incluye sites en `conf.d/` o `sites-enabled/` |
| **reload** | Recarga config sin cortar conexiones activas |

## Arquitectura de procesos

```txt
master (root)  -> lee config, gestiona workers
worker x N     -> atiende peticiones (usuario www-data/nginx)
```

El master no sirve trafico. Los workers son no bloqueantes: una conexion lenta no paraliza al resto.

## Instalacion

### Debian / Ubuntu

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
```

### RHEL / Rocky / Alma

```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

### Verificar

```bash
nginx -v
sudo systemctl status nginx
curl -I http://127.0.0.1
```

Respuesta esperada: `HTTP/1.1 200 OK` (o 404 si no hay index, pero el demonio responde).

## Layout de ficheros

Debian/Ubuntu:

```txt
/etc/nginx/nginx.conf          # config global
/etc/nginx/sites-available/    # definiciones de sites
/etc/nginx/sites-enabled/      # symlinks activos
/etc/nginx/conf.d/             # includes extras *.conf
/var/www/html/                 # document root por defecto
/var/log/nginx/access.log
/var/log/nginx/error.log
```

RHEL suele usar solo `conf.d/` sin `sites-available`.

## Primer server block

Crea `/etc/nginx/sites-available/demo.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name demo.local;

    root /var/www/demo;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/demo.access.log;
    error_log  /var/log/nginx/demo.error.log;
}
```

Contenido y activacion:

```bash
sudo mkdir -p /var/www/demo
echo '<h1>Nginx OK</h1>' | sudo tee /var/www/demo/index.html
sudo ln -s /etc/nginx/sites-available/demo.conf /etc/nginx/sites-enabled/demo.conf
sudo nginx -t
sudo systemctl reload nginx
```

Prueba:

```bash
curl -H 'Host: demo.local' http://127.0.0.1/
```

## Ciclo de vida de la config

```txt
editar .conf -> nginx -t -> systemctl reload nginx -> verificar con curl
```

Comandos esenciales:

```bash
sudo nginx -t                    # sintaxis + rutas de ficheros
sudo systemctl reload nginx      # aplica sin downtime
sudo systemctl restart nginx     # reinicio completo (corta conexiones)
sudo nginx -s reload             # equivalente al reload via senal
```

Nunca edites en caliente y asumas que esta bien: un fallo de sintaxis con `restart` puede dejar Nginx caido. Con `reload`, si `nginx -t` fallo antes, el master no aplica el cambio.

## Estructura tipica de nginx.conf

```nginx
user www-data;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout 65;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

Directivas globales (`user`, `worker_processes`) van fuera de `http`. Lo relativo a HTTP (gzip, proxy, server) va dentro.

## Nginx vs alternativas

| Herramienta | Enfoque |
|-------------|---------|
| **Nginx** | Proxy/static clasico, config declarativa, muy extendido |
| **Caddy** | TLS automatico por defecto, config mas corta |
| **Traefik** | Dinamico con Docker/K8s, labels y discovery |
| **HAProxy** | Balanceo L4/L7 muy afinado; menos "servidor de ficheros" |

## Buenas practicas iniciales

- Un fichero por site en `sites-available`; activa solo con symlink.
- Siempre `nginx -t` antes de `reload`.
- Separa `access_log`/`error_log` por site cuando depures.
- No uses el server default de la distro en produccion sin revisarlo.
- Versiona la config en git (sin certificados ni secretos).

## Errores habituales

- Editar `sites-available` sin crear el symlink en `sites-enabled`.
- Olvidar `nginx -t` y hacer `restart` con config rota.
- `server_name` incorrecto: cae al server default y sirves el site equivocado.
- Permisos: Nginx no puede leer `/var/www` (usuario `www-data` / `nginx`).
- Puerto 80 ocupado por Apache u otro proceso (`ss -tlnp | grep :80`).

## Ejercicios

1. Instala Nginx, crea un site `demo.local` con un `index.html` propio y verificalo con `curl -H 'Host: demo.local'`.
2. Introduce un error de sintaxis a proposito, ejecuta `nginx -t` y comprueba que el mensaje indica fichero y linea.
3. Anade un segundo server block en el mismo puerto 80 con otro `server_name` y demuestra que el `Host` decide cual responde.
4. Compara `systemctl reload nginx` vs `restart` midiendo si una peticion larga se corta (usa `curl` + `sleep` en un CGI/simple endpoint si tienes uno).

## Siguiente paso

En el [capitulo 2](02-servir-archivos-estaticos.md) configuraras document roots, `try_files`, alias, MIME types y buenas practicas para SPA y assets.

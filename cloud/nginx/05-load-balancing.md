# Load balancing

Cuando una sola instancia de aplicacion no basta, Nginx reparte peticiones entre varios backends definidos en un bloque `upstream`. Actua como balanceador L7 HTTP (y tambien como proxy TCP/UDP en stream, fuera del foco de este capitulo).

## Topologia

```txt
                +--> 10.0.1.11:8080
Cliente -> Nginx +--> 10.0.1.12:8080
                +--> 10.0.1.13:8080
```

Nginx elige un miembro del upstream por cada peticion (o por sesion, si hay sticky).

## Upstream basico

```nginx
upstream api_backends {
    least_conn;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
    server 10.0.1.13:8080;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_backends;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Metodos de balanceo

| Metodo | Directivas | Uso |
|--------|------------|-----|
| **Round-robin** | (default) | Trafico homogeneo |
| **Least connections** | `least_conn;` | Backends con peticiones largas desiguales |
| **IP hash** | `ip_hash;` | Afinidad por IP cliente (sesiones en memoria) |
| **Hash** | `hash $request_uri consistent;` | Cache o shards por clave |
| **Pesos** | `server ... weight=3;` | Capacidad distinta entre nodos |

```nginx
upstream api_backends {
    server 10.0.1.11:8080 weight=3;
    server 10.0.1.12:8080 weight=1;
    server 10.0.1.13:8080 weight=1;
}
```

Con peso 3, el primer servidor recibe ~3/5 del trafico round-robin.

## Afinidad de sesion

Si la app guarda sesion en memoria local y no tienes store compartido:

```nginx
upstream app_backends {
    ip_hash;
    server 10.0.1.11:3000;
    server 10.0.1.12:3000;
}
```

Mejor a largo plazo: sesion en Redis/DB y round-robin/least_conn sin sticky.

## Health checks pasivos

Nginx open source marca un servidor como temporalmente down tras errores:

```nginx
upstream api_backends {
    server 10.0.1.11:8080 max_fails=3 fail_timeout=30s;
    server 10.0.1.12:8080 max_fails=3 fail_timeout=30s;
    server 10.0.1.13:8080 max_fails=3 fail_timeout=30s;
}
```

Tras `max_fails` fallos en `fail_timeout`, deja de enviarle trafico durante ese intervalo.

Marcar mantenimiento:

```nginx
server 10.0.1.11:8080 down;
server 10.0.1.12:8080;
```

O backup (solo si los demas fallan):

```nginx
server 10.0.1.13:8080 backup;
```

Los active health checks periodicos son parte de Nginx Plus u otros proyectos (OpenResty, modules). En OSS, combina pasivos + monitoreo externo.

## Timeouts y reintentos

```nginx
upstream api_backends {
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_backends;
        proxy_next_upstream error timeout http_502 http_503;
        proxy_next_upstream_tries 2;
        proxy_connect_timeout 3s;
        proxy_read_timeout 30s;
    }
}
```

`proxy_next_upstream` reintenta en otro servidor ante ciertos fallos. No reintentes metodos no idempotentes a ciegas (`POST`) si el backend pudo haber aplicado el cambio.

## Keepalive al upstream

```nginx
upstream api_backends {
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
    keepalive 32;
}

server {
    location / {
        proxy_pass http://api_backends;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

Reutiliza conexiones TCP a los backends y reduce latencia bajo carga.

## Ejemplo de laboratorio local

Tres backends con puertos distintos en la misma maquina:

```bash
python3 -m http.server 8081 --bind 127.0.0.1 &
python3 -m http.server 8082 --bind 127.0.0.1 &
python3 -m http.server 8083 --bind 127.0.0.1 &
```

```nginx
upstream local_lab {
    least_conn;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}

server {
    listen 80;
    server_name lb.local;

    location / {
        proxy_pass http://local_lab;
        proxy_set_header Host $host;
        add_header X-Upstream $upstream_addr always;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
for i in 1 2 3 4 5 6; do curl -sI -H 'Host: lb.local' http://127.0.0.1/ | grep -i x-upstream; done
```

`$upstream_addr` muestra a que backend fue cada peticion.

## Observabilidad del balanceo

Variables utiles en el log:

```nginx
log_format upstream_timing '$remote_addr $request '
    'upstream=$upstream_addr '
    'status=$status '
    'ut=$upstream_response_time '
    'rt=$request_time';

access_log /var/log/nginx/api.access.log upstream_timing;
```

## Buenas practicas

- Health checks pasivos con `max_fails` / `fail_timeout` realistas.
- Keepalive al upstream en APIs con muchas peticiones cortas.
- Evita sticky salvo que no haya sesion compartida.
- Capacidad distinta -> `weight`.
- Despliegues: marca `down` o retira del upstream antes de parar el proceso.

## Errores habituales

- `proxy_pass http://api_backends/;` con URI: puede romper el balanceo/rutas (usa `http://api_backends` sin path salvo que sepas el efecto).
- Un solo servidor en upstream "por si acaso" sin monitorear 502.
- `ip_hash` detras de otro proxy sin usar la IP real (`X-Forwarded-For` / `real_ip`).
- Reintentar `POST` con `proxy_next_upstream` y duplicar efectos.
- Olvidar `proxy_http_version 1.1` + `Connection ""` al activar keepalive.

## Ejercicios

1. Define un upstream con tres `127.0.0.1:puerto` y observa `$upstream_addr` en 10 peticiones round-robin.
2. Cambia a `least_conn` y a pesos `weight=5` / `weight=1`; compara la distribucion.
3. Para un backend (`kill`) y verifica que tras `max_fails` el trafico deja de ir a ese puerto.
4. Activa keepalive y mide (aprox.) tiempos con `curl -w '%{time_connect}\n'` en bucle.

## Siguiente paso

En el [capitulo 6](06-caching-compresion-y-headers.md) activaras cache de proxy, gzip/brotli, `expires` y cabeceras de seguridad.

# Servir archivos estaticos

Nginx destaca sirviendo HTML, CSS, JS, imagenes y descargas desde disco. Usa `sendfile`, cache de descriptores y workers event-driven: para assets es mas eficiente que pasar por un runtime de aplicacion.

## Flujo de una peticion estatica

```txt
GET /css/app.css
  -> elige server (server_name + listen)
  -> elige location
  -> resuelve fichero (root/alias + URI)
  -> comprueba permisos
  -> responde 200 + cuerpo (o 404/403)
```

## root vs alias

`root` concatena la URI al directorio:

```nginx
server {
    listen 80;
    server_name static.local;
    root /var/www/static;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Peticion `/img/logo.png` -> fichero `/var/www/static/img/logo.png`.

`alias` sustituye el prefijo del location:

```nginx
location /media/ {
    alias /data/uploads/;
}
```

`/media/foto.jpg` -> `/data/uploads/foto.jpg` (no `/data/uploads/media/foto.jpg`).

Regla practica: con `alias`, la barra final del location y del path deben coincidir.

## try_files y SPA

Para sitios multi-pagina:

```nginx
location / {
    try_files $uri $uri/ =404;
}
```

Para SPA (React, Vue, Angular) que enruta en el cliente:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Orden: fichero real -> directorio -> fallback a `index.html`. Sin el fallback, un refresh en `/dashboard` devolveria 404.

## index y autoindex

```nginx
server {
    listen 80;
    server_name files.local;
    root /var/www/files;

    index index.html index.htm;

    location /public/ {
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
```

`autoindex` lista directorios sin `index`. Util en intranets; desactivalo en internet publico.

## Tipos MIME y descargas

Nginx usa `/etc/nginx/mime.types`. Para forzar descarga:

```nginx
location /downloads/ {
    root /var/www;
    add_header Content-Disposition 'attachment';
    types { }
    default_type application/octet-stream;
}
```

Para un tipo custom:

```nginx
location ~* \.wasm$ {
    root /var/www/static;
    default_type application/wasm;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## Cache de navegador en assets versionados

```nginx
location /assets/ {
    root /var/www/app;
    access_log off;
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}

location = /index.html {
    root /var/www/app;
    add_header Cache-Control "no-cache";
}
```

Assets con hash en el nombre (`app.a1b2c3.js`) pueden cachearse un ano. El HTML no: debe revalidarse para apuntar a los hashes nuevos.

## Denegar ficheros sensibles

```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

location ~* \.(env|git|bak|sql)$ {
    deny all;
}
```

Bloquea `.git`, `.env` y backups si alguien los deja bajo el document root.

## Ejemplo completo

```nginx
server {
    listen 80;
    server_name www.example.com;
    root /var/www/example;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location /downloads/ {
        alias /data/releases/;
        autoindex off;
        add_header Content-Disposition 'attachment';
    }

    location ~ /\. {
        deny all;
    }
}
```

Despliegue:

```bash
sudo mkdir -p /var/www/example/assets /data/releases
echo '<!doctype html><title>App</title><div id="root"></div>' | sudo tee /var/www/example/index.html
sudo nginx -t && sudo systemctl reload nginx
curl -I http://127.0.0.1/assets/app.js -H 'Host: www.example.com'
```

## Permisos

```bash
sudo chown -R root:www-data /var/www/example
sudo find /var/www/example -type d -exec chmod 755 {} \;
sudo find /var/www/example -type f -exec chmod 644 {} \;
```

El worker debe poder atravesar directorios (`x`) y leer ficheros (`r`). No hace falta que sea dueno de los ficheros.

## Buenas practicas

- Sirve estaticos desde Nginx; deja a la app solo la API dinamica.
- Separar `/assets` (cache agresiva) de HTML (revalidacion).
- Preferir `try_files` a rewrite complejos para SPA.
- Desactivar `autoindex` en produccion publica.
- Document root fuera de home de usuarios cuando sea posible.

## Errores habituales

- Confundir `root` y `alias` (404 con path duplicado o incompleto).
- SPA sin fallback a `index.html` (404 al refrescar rutas).
- `alias /data/uploads` sin barra final junto a `location /media/`.
- Permisos 700 en directorios: Nginx recibe 403.
- Exponer `.git` o `.env` bajo `root`.

## Ejercicios

1. Monta un site con `root` y comprueba con `curl -I` que un CSS existente devuelve `200` y uno inexistente `404`.
2. Configura una SPA con `try_files ... /index.html` y verifica que `/ruta/inventada` sirve el HTML (no 404).
3. Crea un `location /media/` con `alias` y demuestra la diferencia si quitas la barra final.
4. Anade denegacion de `/\.` y confirma que `GET /.env` responde `403`.

## Siguiente paso

En el [capitulo 3](03-reverse-proxy.md) pondras Nginx delante de una aplicacion con `proxy_pass`, cabeceras `X-Forwarded-*` y timeouts.

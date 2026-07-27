# Servicios, redes y volumenes

Un fichero Compose describe **servicios** (procesos), **redes** (como se descubren) y **volumenes** (que datos sobreviven al contenedor). Dominar estos tres bloques evita el 80% de los problemas de "no conecta" o "perdi los datos".

## Servicio: image vs build

### Imagen publicada

```yaml
services:
  redis:
    image: redis:7.4-alpine
    command: ["redis-server", "--appendonly", "yes"]
    restart: unless-stopped
```

### Build local

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      args:
        NODE_ENV: development
    image: mi-org/api:dev
    ports:
      - "3000:3000"
```

- `context`: directorio enviado al daemon como contexto de build.
- `image`: etiqueta resultante; sin ella Compose genera un nombre derivado del proyecto.
- Tras cambiar el Dockerfile: `docker compose up -d --build`.

Puedes combinar ambos: Compose construye y etiqueta con `image`. Util para reutilizar la misma imagen en CI.

### Puertos

```yaml
ports:
  - "3000:3000"          # host:contenedor (TCP)
  - "127.0.0.1:5432:5432"  # solo localhost del host
  - "8080:80/tcp"
```

Publicar `0.0.0.0:5432:5432` expone Postgres a toda la red local. En desarrollo suele bastar `127.0.0.1:5432:5432`.

Los servicios que solo deben hablar entre si **no necesitan** `ports`: se alcanzan por DNS interno.

## Redes

Por defecto Compose crea una red bridge `<proyecto>_default` y conecta todos los servicios. El DNS interno resuelve el **nombre del servicio**.

```txt
Contenedor api  --DNS-->  db:5432
Contenedor api  --DNS-->  redis:6379
```

### Red custom

```yaml
services:
  proxy:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
    networks:
      - frontend
  api:
    image: mi-org/api:dev
    networks:
      - frontend
      - backend
  db:
    image: postgres:16-alpine
    networks:
      - backend

networks:
  frontend:
  backend:
```

El proxy no alcanza `db` directamente (no esta en `backend`). La API hace de frontera. Util cuando quieres aislar datos de servicios expuestos.

### Alias DNS

```yaml
services:
  db:
    image: postgres:16-alpine
    networks:
      backend:
        aliases:
          - postgres
          - database
```

Desde otro servicio en `backend` puedes usar `postgres:5432` o `database:5432` ademas de `db:5432`.

### Red externa

Unir el stack a una red ya creada (otro Compose, Traefik, etc.):

```bash
docker network create edge
```

```yaml
services:
  web:
    image: nginx:1.27-alpine
    networks:
      - edge

networks:
  edge:
    external: true
```

Sin `external: true`, Compose intentaria crear `edge` como red del proyecto y fallaria si ya existe con otro nombre completo.

## Volumenes

### Volumen nombrado (persistencia)

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

`pgdata` vive en el area de Docker (`/var/lib/docker/volumes/...` en Linux). Sobrevive a `docker compose down`. Se borra con `docker compose down -v` o `docker volume rm`.

### Bind mount (codigo en desarrollo)

```yaml
services:
  api:
    build: ./api
    volumes:
      - ./api:/app
      - /app/node_modules
    working_dir: /app
    command: npm run dev
```

- `./api:/app`: el codigo del host se refleja dentro del contenedor (hot reload).
- `/app/node_modules`: volumen anonimo que evita que el `node_modules` del host (quiza de otro OS) pise el del contenedor.

### tmpfs (datos volatiles en RAM)

```yaml
services:
  api:
    image: mi-org/api:dev
    tmpfs:
      - /tmp
      - /var/cache/app:size=64m
```

Util para caches temporales sin ensuciar capas ni el host.

### Solo lectura

```yaml
services:
  web:
    image: nginx:1.27-alpine
    volumes:
      - ./html:/usr/share/nginx/html:ro
```

El contenedor no puede escribir en ese mount. Reduce el impacto de un proceso comprometido.

## Ejemplo completo: API + Postgres

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: demo/api:local
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
    volumes:
      - ./src:/app/src:ro
    depends_on:
      - db
    networks:
      - appnet

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - appnet
    # sin ports: solo accesible desde la red Compose

networks:
  appnet:

volumes:
  pgdata:
```

Arranque y comprobacion de DNS:

```bash
docker compose up -d --build
docker compose exec api sh -c "getent hosts db || nslookup db"
docker compose exec api sh -c "wget -qO- http://db:5432 || true"
```

Postgres no habla HTTP; el DNS debe resolver `db` a una IP privada. Para probar el puerto:

```bash
docker compose exec api sh -c "nc -zv db 5432"
```

## Restart policies

```yaml
services:
  api:
    image: demo/api:local
    restart: unless-stopped
```

| Politica | Comportamiento |
|----------|----------------|
| `no` | No reinicia (default) |
| `always` | Siempre, incluso tras reboot del daemon |
| `unless-stopped` | Como always, salvo si lo paraste a mano |
| `on-failure` | Solo si exit != 0; opcional `on-failure:5` |

En desarrollo local `unless-stopped` o `no` suele bastar. En un VPS con un solo nodo, `unless-stopped` es habitual.

## Recursos y limites (opcional)

```yaml
services:
  api:
    image: demo/api:local
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          memory: 256M
```

En Compose V2 sin Swarm, `deploy.resources` se aplica en Docker Engine reciente al usar `docker compose up`. Verifica con:

```bash
docker compose config
docker stats
```

Si tu engine ignora limites, usa `mem_limit` / `cpus` en la forma larga legacy solo si lo documentas para tu version.

## Inspeccion util

```bash
docker compose ps
docker network ls | grep $(basename "$PWD")
docker volume ls | grep $(basename "$PWD")
docker compose exec api printenv
docker inspect $(docker compose ps -q db) --format '{{json .NetworkSettings.Networks}}'
```

## Errores habituales

- Publicar el puerto de la DB a `0.0.0.0` y descubrir Postgres desde otra maquina de la oficina.
- Usar bind mount de `./` entero y pisar artefactos generados en la imagen (`node_modules`, `.venv`).
- Esperar que `localhost` dentro del contenedor sea el host: para hablar con un servicio hermano usa el **nombre del servicio**, no `localhost`.
- Declarar `volumes: pgdata:` a nivel servicio sin el bloque top-level `volumes:` (Compose lo trata como bind relativo raro o falla segun sintaxis).
- Dos servicios con el mismo `ports: "5432:5432"` en el mismo host: conflicto de bind.
- Olvidar `external: true` al referenciar una red de Traefik u otro stack.

## Buenas practicas

- Redes explicitas cuando haya frontera de seguridad (frontend/backend).
- Persistencia de DB siempre en volumen nombrado, nunca solo en la capa writable del contenedor.
- Bind mounts para codigo fuente; volumenes nombrados para datos.
- Tags de imagen concretos (`postgres:16.4-alpine`), no `:latest`.
- No publiques puertos internos salvo que necesites un cliente en el host (psql, redis-cli).

## Ejercicios

1. Monta un stack con dos redes (`frontend`, `backend`). Pon Nginx solo en frontend y Postgres solo en backend. Demuestra con `docker compose exec` que Nginx no resuelve `db` y la API (en ambas redes) si.
2. Anade un volumen nombrado a Postgres, inserta un dato, haz `docker compose down` (sin `-v`), vuelve a `up` y verifica que el dato sigue.
3. Cambia el bind de la API a `:ro` y demuestra que un `touch /app/src/x` dentro del contenedor falla.
4. Publica Postgres solo en `127.0.0.1:5432` y conecta desde el host con `psql` o `docker run --rm -it --network host postgres:16-alpine psql ...`.

## Siguiente paso

En [Variables de entorno](03-variables-de-entorno.md) separas config de secretos, usas `.env` para interpolacion y evitas filtrar passwords al repositorio.

# Healthchecks y dependencias

`depends_on` controla el **orden de arranque**, no la **disponibilidad**. Postgres puede estar "up" (contenedor en marcha) y aun rechazar conexiones mientras aplica init. Sin healthcheck, tu API falla al boot y a veces no se recupera.

## El problema clasico

```yaml
services:
  api:
    image: mi-org/api:dev
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
```

Secuencia real:

```txt
1. Compose crea db y api
2. db arranca el proceso postgres (estado: running)
3. api arranca al momento (depends_on satisfecho)
4. api conecta a db:5432 -> connection refused
5. postgres termina de aceptar conexiones 2s despues
```

## depends_on con condition

```yaml
services:
  api:
    image: mi-org/api:dev
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s
  redis:
    image: redis:7.4-alpine
```

Condiciones:

| Condicion | Significado |
|-----------|-------------|
| `service_started` | Contenedor arrancado (default clasico) |
| `service_healthy` | Healthcheck en estado healthy |
| `service_completed_successfully` | Contenedor one-shot termino con exit 0 (migraciones, seeds) |

## Anatomia de un healthcheck

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U app -d app"]
  interval: 5s        # entre comprobaciones
  timeout: 5s         # si el test no vuelve, falla
  retries: 10         # fallos seguidos -> unhealthy
  start_period: 10s   # gracia inicial: fallos no cuentan igual
  start_interval: 2s  # (Compose/Engine reciente) intervalo durante start_period
```

Formas de `test`:

```yaml
# Ejecutable + args (ENTRYPOINT style)
test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/health"]

# Shell (pipes, variables)
test: ["CMD-SHELL", "curl -f http://127.0.0.1:3000/health || exit 1"]

# Desactivar healthcheck de la imagen
test: ["NONE"]
```

El healthcheck corre **dentro** del contenedor. `localhost` es el propio servicio, no el host.

## Ejemplos por tecnologia

### PostgreSQL

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-app} -d ${POSTGRES_DB:-app}"]
  interval: 5s
  timeout: 3s
  retries: 10
  start_period: 15s
```

### Redis

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 5s
  timeout: 3s
  retries: 5
```

Si Redis tiene password:

```yaml
healthcheck:
  test: ["CMD-SHELL", "redis-cli -a $$REDIS_PASSWORD ping | grep -q PONG"]
```

`$$` escapa el `$` para que Compose no interpole y el shell del contenedor vea `$REDIS_PASSWORD`.

### API HTTP

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/healthz || exit 1"]
  interval: 10s
  timeout: 3s
  retries: 5
  start_period: 20s
```

Alpine a menudo tiene `wget` y no `curl`. Imagenes `distroless` o scratch **no** tienen shell ni wget: el healthcheck debe vivir en un sidecar, en el orquestador, o usa una imagen que incluya un binario de health.

### MySQL / MariaDB

```yaml
healthcheck:
  test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
  interval: 10s
  timeout: 5s
  retries: 10
  start_period: 30s
```

(Imagen oficial `mysql` reciente incluye `healthcheck.sh`.)

## Migraciones como servicio one-shot

```yaml
services:
  migrate:
    build: ./api
    command: ["npm", "run", "migrate"]
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  api:
    build: ./api
    command: ["npm", "run", "start"]
    depends_on:
      migrate:
        condition: service_completed_successfully
      db:
        condition: service_healthy
```

Flujo:

```txt
db (healthy) -> migrate (exit 0) -> api
```

Si `migrate` falla, `api` no arranca. Revisa logs:

```bash
docker compose logs migrate
docker compose ps -a
```

## Inspeccionar salud

```bash
docker compose ps
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q db)
docker inspect --format='{{json .State.Health}}' $(docker compose ps -q db) | jq
```

Estados: `starting`, `healthy`, `unhealthy`.

```bash
docker compose up -d --wait
```

`--wait` (Compose V2 reciente) bloquea hasta que los servicios con healthcheck esten healthy o el timeout expire. Ideal en CI:

```bash
docker compose up -d --wait --wait-timeout 120
./scripts/integration-tests.sh
docker compose down -v
```

## Retry en la aplicacion

El healthcheck reduce races; no los elimina del todo (particiones de red, restart de DB). La app deberia:

- Reintentar conexion al pool con backoff.
- Exponer `/healthz` (liveness) y `/readyz` (dependencias listas).
- No crashear el proceso en el primer `ECONNREFUSED` al boot si usas un supervisor; o si crashea, confiar en `restart: unless-stopped`.

Compose no sustituye resiliencia en codigo.

## Ejemplo completo

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  redis:
    image: redis:7.4-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
      REDIS_URL: redis://redis:6379
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/healthz || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  pgdata:
```

```bash
docker compose up -d --wait
curl -sf http://127.0.0.1:3000/healthz
```

## Errores habituales

- `depends_on: [db]` sin `condition` y asumir que la DB acepta queries.
- Healthcheck con `curl` en imagen Alpine minima sin curl instalado -> siempre unhealthy.
- Probar `http://db:5432/health` desde el healthcheck de la API: el healthcheck de **api** debe mirar **su propio** puerto; la dependencia se expresa con `depends_on`.
- `interval` demasiado agresivo (1s) en CI compartido: ruido y falsos unhealthy.
- Olvidar `start_period` en apps lentas (JVM, migraciones embebidas): marcadas unhealthy antes de escuchar.
- `service_completed_successfully` en un servicio con `restart: always`: nunca "completa".

## Buenas practicas

- Todo datastore con `service_healthy` antes de apps que lo necesitan.
- Endpoints de health baratos (no golpees la DB en cada liveness si no hace falta; separa readiness).
- En CI: `up -d --wait` + tests + `down -v`.
- Logs del healthcheck visibles en `docker inspect` cuando algo queda en `starting` eterno.
- Documenta en el README cuanto tarda el stack en ponerse healthy la primera vez (pull + init DB).

## Ejercicios

1. Reproduce el race: API con `depends_on` simple que haga exit 1 si no conecta; luego anade `service_healthy` y comprueba que deja de fallar.
2. Implementa un healthcheck HTTP en tu API (`/healthz`) y verifica `docker compose ps` muestra healthy.
3. Anade un servicio `migrate` one-shot y encadena `api` con `service_completed_successfully`.
4. Rompe a proposito el healthcheck de Redis (comando invalido), ejecuta `up --wait` y observa el timeout/falla.

## Siguiente paso

En [Perfiles y overrides](05-perfiles-y-overrides.md) activas herramientas solo cuando las necesitas (adminer, mailhog) y separas config de desarrollo sin ramificar el YAML principal.

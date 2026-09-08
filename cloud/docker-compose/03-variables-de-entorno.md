# Variables de entorno

La configuracion de un stack cambia entre maquinas y entornos; el codigo no deberia. Compose ofrece tres capas que conviene no mezclar: **interpolacion del YAML**, **variables dentro del contenedor** y **ficheros env_file**.

## Tres mecanismos distintos

| Mecanismo | Quien lo consume | Uso tipico |
|-----------|------------------|------------|
| `.env` + `${VAR}` | Compose al parsear el YAML | Puertos, tags, nombres de proyecto |
| `environment:` | Proceso del contenedor | `DATABASE_URL`, `NODE_ENV` |
| `env_file:` | Proceso del contenedor | Listas largas de vars sin ensuciar el YAML |

Un valor en `.env` **no** entra solo al contenedor. Solo alimenta la interpolacion `${...}` del compose file, salvo que lo reenvies explicitamente.

## Interpolacion en el YAML

`.env` en el mismo directorio que el compose file:

```dotenv
COMPOSE_PROJECT_NAME=tienda
API_PORT=3000
POSTGRES_IMAGE=postgres:16.4-alpine
POSTGRES_PASSWORD=dev-only-change-me
```

```yaml
services:
  db:
    image: ${POSTGRES_IMAGE}
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  api:
    image: mi-org/api:dev
    ports:
      - "${API_PORT}:3000"
    environment:
      DATABASE_URL: postgres://app:${POSTGRES_PASSWORD}@db:5432/app
```

Renderiza el resultado:

```bash
docker compose config
```

Veras los valores sustituidos. Si falta una variable requerida:

```yaml
image: ${POSTGRES_IMAGE:?definir POSTGRES_IMAGE en .env}
```

Compose aborta con un mensaje claro en lugar de crear un servicio con imagen vacia.

### Valores por defecto

```yaml
ports:
  - "${API_PORT:-3000}:3000"
environment:
  LOG_LEVEL: ${LOG_LEVEL:-info}
```

`${VAR:-default}` usa `default` si `VAR` esta unset o vacia. `${VAR-default}` solo si esta unset.

## environment: formas corta y larga

```yaml
services:
  api:
    environment:
      NODE_ENV: development
      PORT: "3000"
      DATABASE_URL: postgres://app:${POSTGRES_PASSWORD}@db:5432/app
```

Forma lista (pasa variables del shell del host si no asignas valor):

```yaml
environment:
  - NODE_ENV=development
  - DATABASE_URL
```

`- DATABASE_URL` sin `=` toma el valor del entorno donde ejecutas `docker compose` (o del `.env` de interpolacion si Compose lo exporta al proceso). Es fragil en CI: prefiera la forma `KEY: value` explicita.

## env_file

```yaml
services:
  api:
    env_file:
      - ./config/api.env
      - ./config/api.local.env
    environment:
      NODE_ENV: development
```

`api.env`:

```dotenv
LOG_LEVEL=debug
FEATURE_FLAGS=checkout,search
REDIS_URL=redis://redis:6379
```

Orden de precedencia (de menor a mayor, el ultimo gana):

```txt
env_file (en orden de lista)
  -> environment: en el YAML
  -> variables pasadas al contenedor en runtime
```

En la practica: `environment:` pisa a `env_file`. Usa `env_file` para defaults y `environment` para overrides puntuales.

## .env vs env_file: decision rapida

```txt
Necesitas sustituir ${PUERTO} en el YAML?
  -> .env (interpolacion)

Necesita la app leer FOO dentro del proceso?
  -> environment: o env_file:
```

Patron recomendado:

```txt
.env              # interpolacion Compose (gitignored)
.env.example      # documentacion versionada
config/api.env    # vars no secretas de la app (opcional, versionado)
secrets/.env.api  # secretos locales (gitignored) montados via env_file
```

## No versionar secretos

`.gitignore`:

```txt
.env
.env.*
!.env.example
*.pem
secrets/
```

`.env.example`:

```dotenv
COMPOSE_PROJECT_NAME=tienda
API_PORT=3000
POSTGRES_IMAGE=postgres:16.4-alpine
POSTGRES_PASSWORD=cambiar
JWT_SECRET=cambiar
```

Cada desarrollador copia:

```bash
cp .env.example .env
# edita .env con valores locales
```

## Secrets de Compose (para datos sensibles)

Para ficheros de secreto (mejor que meter passwords en claro en `environment` cuando el daemon lo soporta):

```yaml
services:
  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

La imagen oficial de Postgres entiende `POSTGRES_PASSWORD_FILE`. No todas las imagenes tienen equivalente: en ese caso usa `environment` en local y un gestor de secretos en produccion.

```bash
mkdir -p secrets
echo -n 'dev-password' > secrets/db_password.txt
```

Anade `secrets/` al `.gitignore`.

## Variables built-in de Compose

| Variable | Efecto |
|----------|--------|
| `COMPOSE_PROJECT_NAME` | Nombre del proyecto (alternativa a `-p`) |
| `COMPOSE_FILE` | Lista de ficheros separados por `:` (`;` en Windows) |
| `COMPOSE_PROFILES` | Perfiles activos por defecto |
| `COMPOSE_ENV_FILES` | Rutas de ficheros `.env` alternativos |

Ejemplo:

```bash
export COMPOSE_PROJECT_NAME=tienda-dev
export COMPOSE_PROFILES=tools
docker compose up -d
```

## Pasar un .env distinto

```bash
docker compose --env-file .env.staging config
docker compose --env-file .env.staging up -d
```

`--env-file` controla la interpolacion del YAML. No sustituye automaticamente los `env_file:` de cada servicio.

## Ejemplo practico

```yaml
services:
  api:
    build: ./api
    ports:
      - "${API_PORT:-3000}:3000"
    env_file:
      - ./config/api.env
    environment:
      DATABASE_URL: postgres://app:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-app}
      REDIS_URL: redis://redis:6379
      NODE_ENV: ${NODE_ENV:-development}
    depends_on:
      - db
      - redis

  db:
    image: ${POSTGRES_IMAGE:-postgres:16-alpine}
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD requerida}
      POSTGRES_DB: ${POSTGRES_DB:-app}
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7.4-alpine

volumes:
  pgdata:
```

Validacion:

```bash
docker compose config --quiet && echo OK
docker compose run --rm api printenv DATABASE_URL
```

## Errores habituales

- Poner secretos en `environment:` dentro del YAML versionado ("solo es desarrollo") y filtrarlos al remoto.
- Creer que `.env` inyecta todas las claves al contenedor sin declararlas en `environment` / `env_file`.
- Comillas raras: en `.env` de Compose, `PASSWORD=foo bar` puede partir el valor; usa `PASSWORD=foo bar` con cuidado o evita espacios.
- Mezclar sintaxis shell (`export FOO=1`) dentro de `.env` de Compose: no es un script bash.
- `${VAR}` sin default ni `:?` y un typo en el nombre: imagen `""` o URL rota dificil de depurar. Usa `:?` en vars criticas.
- Windows: rutas y `COMPOSE_FILE` con `;` como separador, no `:`.

## Buenas practicas

- `.env.example` siempre actualizado; el onboarding empieza por `cp .env.example .env`.
- Secretos criticos con `${VAR:?mensaje}` para fallar rapido.
- Una sola fuente de verdad para passwords: interpolas en el YAML y reutilizas en `DATABASE_URL`.
- No imprimas `docker compose config` en logs de CI si contiene secretos (el render los muestra en claro).
- Distingue config publica (`NODE_ENV`, `LOG_LEVEL`) de secretos (`JWT_SECRET`, passwords).

## Ejercicios

1. Crea `.env` / `.env.example` y un compose que falle con mensaje claro si falta `POSTGRES_PASSWORD` (`:?`).
2. Anade `env_file` y un `environment:` que pise `LOG_LEVEL`; verifica con `docker compose run --rm api printenv LOG_LEVEL`.
3. Usa `docker compose --env-file .env.other config` y demuestra que el puerto publicado cambia.
4. Mueve la password de Postgres a un secret file y arranca con `POSTGRES_PASSWORD_FILE` (imagen oficial).

## Siguiente paso

En [Healthchecks y dependencias](04-healthchecks-y-dependencias.md) evitas el race tipico: la API arranca antes de que Postgres acepte conexiones.

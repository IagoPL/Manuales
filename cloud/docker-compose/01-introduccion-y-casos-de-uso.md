# Introduccion y casos de uso

Docker Compose orquesta varios contenedores con un unico fichero YAML. En lugar de lanzar `docker run` a mano (puertos, redes, volumenes, variables), defines el stack una vez y lo levantas con `docker compose up`.

Este manual usa **Compose V2**: el comando es `docker compose` (plugin del CLI de Docker), no el binario legacy `docker-compose`.

## Capitulos

1. [Introduccion y casos de uso](01-introduccion-y-casos-de-uso.md)
2. [Servicios, redes y volumenes](02-servicios-redes-y-volumenes.md)
3. [Variables de entorno](03-variables-de-entorno.md)
4. [Healthchecks y dependencias](04-healthchecks-y-dependencias.md)
5. [Perfiles y overrides](05-perfiles-y-overrides.md)
6. [Stacks de desarrollo](06-stacks-de-desarrollo.md)
7. [Buenas practicas](07-buenas-practicas.md)

## Que problema resuelve

Sin Compose, un entorno tipico (API + Postgres + Redis) exige varios `docker run`, nombres de red inventados y flags faciles de olvidar:

```bash
docker network create appnet
docker run -d --name db --network appnet -e POSTGRES_PASSWORD=secret postgres:16
docker run -d --name redis --network appnet redis:7
docker run -d --name api --network appnet -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:secret@db:5432/app \
  -e REDIS_URL=redis://redis:6379 \
  mi-api:dev
```

Con Compose:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
  redis:
    image: redis:7
  api:
    image: mi-api:dev
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/app
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis
```

```bash
docker compose up -d
```

Compose crea el project name (por defecto el nombre del directorio), una red bridge compartida y resuelve DNS entre servicios por el nombre del servicio (`db`, `redis`, `api`).

## Compose V2 vs docker-compose V1

| Aspecto | Compose V2 | docker-compose V1 |
|---------|------------|-------------------|
| Comando | `docker compose` | `docker-compose` |
| Instalacion | Plugin del Docker CLI | Binario Python separado |
| Estado | Actual y soportado | Obsoleto |
| Fichero | `compose.yaml` o `docker-compose.yml` | Igual |
| Clave `version:` | Ignorada / innecesaria | Obligatoria en versiones antiguas |

Comprueba la instalacion:

```bash
docker compose version
```

Si falla, instala el plugin segun tu distro o actualiza Docker Desktop. En este manual todos los ejemplos usan `docker compose`.

## Anatomia de un proyecto

Layout tipico:

```txt
mi-proyecto/
|-- compose.yaml          # stack principal (o docker-compose.yml)
|-- .env                  # variables para interpolacion (no secretos de prod)
|-- .env.example          # plantilla versionada sin secretos
|-- Dockerfile            # build de la app
`-- app/                  # codigo fuente
```

Nombres de fichero reconocidos (en orden de preferencia Compose): `compose.yaml`, `compose.yml`, `docker-compose.yaml`, `docker-compose.yml`.

## Primer stack en 2 minutos

Crea un directorio y un `compose.yaml`:

```bash
mkdir compose-demo && cd compose-demo
```

```yaml
services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
```

Levanta, prueba y limpia:

```bash
docker compose up -d
curl -I http://127.0.0.1:8080
docker compose ps
docker compose logs web
docker compose down
```

`up -d` arranca en segundo plano. `down` detiene y elimina contenedores y la red del proyecto; los volumenes nombrados solo se borran con `down -v`.

## Modelo mental

```txt
compose.yaml
    |
    v
docker compose up
    |
    +--> crea red <proyecto>_default
    +--> crea volumenes declarados
    +--> build / pull imagenes
    +--> arranca contenedores (1 por servicio, salvo scale)
    +--> DNS interno: nombre-servicio -> IP del contenedor
```

El **project name** agrupa recursos. Por defecto es el nombre del directorio; puedes fijarlo:

```bash
docker compose -p tienda up -d
```

Los recursos quedan etiquetados (`com.docker.compose.project=tienda`) y no chocan con otro stack en el mismo host.

## Casos de uso reales

### 1. Desarrollo local de una app con dependencias

API + base de datos + cola + mailcatcher. El equipo comparte el mismo `compose.yaml` y evita "en mi maquina funciona" por versiones distintas de Postgres o Redis.

### 2. Smoke tests y CI

En un job de GitHub Actions levantas el stack, esperas healthchecks y lanzas tests de integracion. Al terminar, `docker compose down -v` deja el runner limpio.

### 3. Demos y workshops

Un unico `compose up` muestra el producto completo (frontend, API, DB) sin instalar runtimes en el host.

### 4. Sidecars de observabilidad en local

Anadir Prometheus, Grafana o Mailhog solo en desarrollo con [perfiles](05-perfiles-y-overrides.md), sin ensuciar el stack minimo.

### Cuando NO es la herramienta adecuada

| Escenario | Mejor opcion |
|-----------|--------------|
| Un solo contenedor puntual | `docker run` |
| Orquestacion multi-nodo, rolling updates, autoscaling | Kubernetes / Nomad |
| Produccion con HA serio | Orquestador + IaC; Compose solo en un nodo (Compose Swarm esta deprecado en la practica) |
| Secrets rotativos empresariales | Vault / secrets del orquestador, no `.env` en disco |

Compose brilla en **un host**: laptop, CI, VPS pequena. No sustituye un cluster.

## Comandos del dia a dia

```bash
docker compose up -d              # arrancar
docker compose up -d --build      # rebuild imagenes locales
docker compose ps                 # estado
docker compose logs -f api        # logs de un servicio
docker compose exec api sh        # shell en contenedor en marcha
docker compose run --rm api npm test   # one-shot sin dejar contenedor
docker compose stop               # parar sin borrar
docker compose start              # reanudar
docker compose restart api
docker compose down               # parar y borrar contenedores + red
docker compose down -v            # ademas borra volumenes nombrados
docker compose config             # renderiza YAML final (interpolacion resuelta)
docker compose config --quiet     # valida sin imprimir (exit != 0 si hay error)
```

`docker compose config` es tu aliado: muestra el fichero efectivo tras merges de overrides y sustitucion de variables. Si algo "no cuadra", miralo ahi primero.

## Conceptos clave

| Concepto | Significado |
|----------|-------------|
| **Servicio** | Unidad logica en el YAML; suele mapear a un contenedor |
| **Proyecto** | Namespace de recursos (redes, volumenes, contenedores) |
| **Red** | Bridge donde los servicios se descubren por nombre |
| **Volumen** | Persistencia fuera del ciclo de vida del contenedor |
| **Build** | Contexto Dockerfile asociado a un servicio |
| **Override** | Ficheros extra que Compose fusiona (`compose.override.yaml`) |

## Errores habituales

- Usar `docker-compose` (V1) en docs nuevas y chocar con entornos que solo tienen el plugin V2.
- Dejar `version: "3.9"` pensando que activa features; en Compose V2 se ignora. Mejor omitirla.
- Confundir el nombre del servicio (`db`) con el hostname del contenedor generado (`proyecto-db-1`): dentro de la red Compose, el DNS correcto es el **nombre del servicio**.
- Ejecutar `compose` desde otro directorio sin `-f` y creer que "no encuentra" el fichero.
- `down -v` en un entorno con datos de desarrollo que queriamos conservar.

## Buenas practicas

- Un `compose.yaml` versionado en git; secretos fuera (`.env` en `.gitignore`, ver [capitulo 3](03-variables-de-entorno.md)).
- Nombres de servicio cortos y estables (`api`, `db`, `redis`): son hostnames.
- Documenta en el README del repo: `docker compose up -d` y puertos expuestos.
- Prefiere imagenes con tag fijo (`postgres:16.4`) frente a `:latest` en stacks compartidos.
- Valida siempre con `docker compose config` antes de depurar "comportamientos raros".

## Ejercicios

1. Crea un `compose.yaml` con Nginx en el puerto 8080, levantalo y responde con el status HTTP de `curl -I`.
2. Cambia el project name con `-p demo` y comprueba con `docker ps --format '{{.Names}}'` que los contenedores llevan el prefijo `demo-`.
3. Ejecuta `docker compose config` y localiza la red por defecto que Compose inyecta.
4. Para el stack con `stop`, vuelve a arrancarlo con `start` y compara con `down` + `up` (estado de contenedores nuevos vs reutilizados).

## Siguiente paso

En [Servicios, redes y volumenes](02-servicios-redes-y-volumenes.md) defines builds, bind mounts, volumenes nombrados y redes custom para que los servicios hablen entre si de forma predecible.

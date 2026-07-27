# Stacks de desarrollo

Un stack de desarrollo tipico: API + base de datos + cache (+ UI de admin opcional). El objetivo es `docker compose up` y tener un entorno listo.

## Ejemplo: API + Postgres + Redis

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
      REDIS_URL: redis://redis:6379/0
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./:/app
    command: npm run dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  adminer:
    image: adminer:4
    profiles: ["tools"]
    ports:
      - "8080:8080"

volumes:
  pgdata:
```

## Flujo diario

```bash
docker compose up -d db redis
docker compose up api
docker compose --profile tools up -d adminer
docker compose logs -f api
docker compose down          # para contenedores
docker compose down -v       # + borra volumenes (destruye datos)
```

## Seed y migraciones

```bash
docker compose exec api npm run migrate
docker compose exec api npm run seed
```

## Errores habituales

- Publicar puertos de DB a `0.0.0.0` en un portatil en redes no confiables sin firewall.
- Usar `latest` en imagenes de datos sin pin.
- Olvidar volumen nombrado y perder datos en cada `down`.

## Buenas practicas

- Misma major version de Postgres que staging/prod.
- Healthcheck en DB antes de migrar.
- README con 5 comandos: up, logs, migrate, seed, down.

## Ejercicio

1. Levanta el stack minimo API+DB (aunque la API sea un `nginx` de prueba).
2. Anade healthcheck y `depends_on` con condicion.
3. Entra con `exec` y verifica conectividad DNS `db` / `redis`.

## Siguiente paso

Continua con [Buenas practicas](07-buenas-practicas.md).

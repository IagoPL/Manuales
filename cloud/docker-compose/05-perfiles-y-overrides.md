# Perfiles y overrides

Compose permite activar servicios opcionales con **profiles** y sobrescribir config local con archivos de override sin tocar el YAML base del equipo.

## Profiles

```yaml
services:
  api:
    image: myapi:dev
    ports: ["3000:3000"]

  adminer:
    image: adminer:4
    profiles: ["tools"]
    ports: ["8080:8080"]
    depends_on: [db]

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
```

```bash
docker compose up -d                 # sin adminer
docker compose --profile tools up -d # con adminer
```

Util para debug UIs, seeders, profilers o dependencias pesadas.

## Overrides

`docker-compose.override.yml` se fusiona automaticamente con `docker-compose.yml` en desarrollo:

```yaml
# docker-compose.override.yml (local, no siempre en git)
services:
  api:
    volumes:
      - ./:/app
    command: npm run dev
    environment:
      LOG_LEVEL: debug
```

En CI/prod, evita overrides accidentales:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Multiples ficheros

```bash
docker compose -f compose.yml -f compose.staging.yml config
```

`config` renderiza el YAML final: valida merges antes de aplicar.

## Errores habituales

- Meter secretos en el YAML base versionado.
- Confiar en override local que nadie mas tiene (documenta perfiles).
- Nombrar mal el override (`compose.override.yml` no se auto-carga; el nombre clasico es `docker-compose.override.yml` junto a `docker-compose.yml`).

## Buenas practicas

- Base minima reproducible; perfiles para extras.
- `compose config` en CI.
- Overrides locales en `.gitignore` si contienen paths personales; ofrece `.override.example`.

## Ejercicio

1. Anade un servicio `mailhog` con profile `tools`.
2. Crea un override que monte el codigo fuente en caliente.
3. Ejecuta `docker compose config` y revisa el merge.

## Siguiente paso

Continua con [Stacks de desarrollo](06-stacks-de-desarrollo.md).

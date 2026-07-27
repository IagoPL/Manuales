# Buenas practicas con Docker Compose

Compose brilla en desarrollo y en stacks pequenos de produccion. Estas practicas evitan el "en mi compose funciona".

## Versiona el contrato, no los secretos

- `compose.yml` / `docker-compose.yml` en git.
- `.env` con secretos en `.gitignore`; ofrece `.env.example`.
- No pegues passwords en el YAML.

## Fija versiones de imagen

```yaml
image: postgres:16.4-alpine
```

Evita `latest` en servicios con estado.

## Redes y privilegios

- Un servicio = un proposito.
- No uses `network_mode: host` salvo necesidad real.
- `read_only: true` + tmpfs cuando el proceso lo permita.
- Drop de capabilities en prod.

## Recursos y logs

```yaml
deploy:
  resources:
    limits:
      memory: 512M
```

(En Compose clasico no-swarm, limita con flags del daemon o usa alternatives documentadas.)

Centraliza logs; evita `docker compose logs` como unica observabilidad en prod.

## Prod vs dev

| Dev | Prod |
|-----|------|
| Bind mounts | Imagen inmutable |
| Hot reload | `restart: unless-stopped` |
| Ports amplios | Solo publica el reverse proxy |
| Profiles tools | Sin adminer/debug |

## Comandos de higiene

```bash
docker compose config
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
docker compose down --remove-orphans
```

## Errores habituales

- Un unico compose gigante para todo el monorepo sin perfiles.
- Datos importantes solo en contenedor writable sin volumen.
- Copiar compose de internet sin leer volumes/ports.

## Buenas practicas

- Documenta el stack en el README.
- Healthchecks en dependencias criticas.
- CI que valide `docker compose config` y un smoke `up` cuando sea viable.
- Para orquestacion grande, mira Kubernetes/Nomad; Compose no sustituye un cluster.

## Ejercicio

1. Audita un compose propio: imagenes pinnadas, `.env.example`, healthchecks.
2. Separa un servicio de debug en profile `tools`.
3. Genera un `compose.prod.yml` sin bind mounts y con restart policy.

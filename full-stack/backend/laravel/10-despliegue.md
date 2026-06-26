# Despliegue

Desplegar Laravel requiere configurar entorno, dependencias, cache, migraciones, colas y servidor web.

## Comandos

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

## Servidor

Laravel suele desplegarse con Nginx + PHP-FPM o plataformas gestionadas.

## Variables

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=...
```

## Colas

Workers gestionados con Supervisor, systemd o plataforma.

## Buenas practicas

- `APP_DEBUG=false`.
- Config cache.
- Migraciones controladas.
- Workers supervisados.
- Logs centralizados.
- Backups.

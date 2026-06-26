# Observabilidad y errores

Laravel debe exponer logs, errores, métricas, health checks y estado de colas.

## Logs

Configura canales en `config/logging.php`.

## Errores

Usa Sentry, Bugsnag u otra herramienta si el proyecto lo requiere.

## Health

Crea endpoint de health que compruebe app y dependencias críticas.

## Queues

Monitoriza:

- Jobs pendientes.
- Jobs fallidos.
- Tiempo de espera.
- Workers vivos.

## Buenas practicas

- Logs estructurados.
- Alertas por errores.
- Monitorizar colas.
- Health checks.
- No exponer detalles técnicos al usuario.

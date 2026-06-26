# Queues, jobs y eventos

Laravel permite ejecutar trabajos en segundo plano y publicar eventos de dominio.

## Job

```php
class SendOrderEmail implements ShouldQueue
{
    public function handle(): void
    {
        // enviar email
    }
}
```

Despachar:

```php
SendOrderEmail::dispatch($order);
```

## Configurar cola

```env
QUEUE_CONNECTION=redis
```

Worker:

```bash
php artisan queue:work
```

## Eventos

```php
event(new OrderCreated($order));
```

## Buenas practicas

- Jobs idempotentes.
- Reintentos y backoff.
- Dead letter o failed jobs.
- Monitorizar workers.
- No hacer tareas lentas en request.

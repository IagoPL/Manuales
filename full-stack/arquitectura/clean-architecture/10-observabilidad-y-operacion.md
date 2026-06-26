# Observabilidad y operacion

La arquitectura tambien debe permitir operar el sistema en produccion. Un diseno elegante que no se puede diagnosticar falla cuando mas importa.

## Que observar

- Casos de uso ejecutados.
- Errores de negocio.
- Errores tecnicos.
- Duracion de operaciones.
- Integraciones externas.
- Eventos publicados.
- Reintentos y fallos definitivos.

## Logs

Los logs deben aparecer en los bordes y en los flujos de aplicacion relevantes.

Evita loguear desde cada entidad. El dominio debe ser simple y predecible.

```txt
CreateOrderUseCase started
PaymentGateway timeout
OrderCreated event published
```

## Metricas

Metricas utiles:

- `orders_created_total`
- `checkout_duration_ms`
- `payment_failures_total`
- `use_case_errors_total`
- `repository_query_duration_ms`

## Trazas

Una traza permite seguir una peticion entre capas:

```txt
HTTP request
  -> controller
  -> use case
  -> repository
  -> database
  -> event bus
```

## Errores

Separa errores de dominio, aplicacion, infraestructura y presentacion. Asi puedes traducirlos bien a HTTP, logs, metricas y alertas.

## Checklist

- Cada caso de uso critico se puede rastrear.
- Los errores de dominio no se pierden como errores genericos.
- Las integraciones externas tienen timeout y medicion.
- Los eventos incluyen correlation id.
- Los logs no exponen secretos ni datos sensibles.

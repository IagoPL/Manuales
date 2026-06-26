# Buenas practicas

Las buenas APIs se reconocen porque son predecibles. Cada endpoint parece pertenecer al mismo sistema.

## Consistencia

Mantiene criterios comunes para:

- Nombres.
- Fechas.
- IDs.
- Errores.
- Paginacion.
- Filtros.
- Autenticacion.
- Versionado.

## Fechas

Usa formatos estandar:

```txt
2026-06-27T10:30:00Z
```

Aclara zona horaria, precision y significado.

## IDs

Evita exponer IDs secuenciales cuando puedan revelar volumen o facilitar enumeracion. Considera UUID, ULID o IDs opacos segun contexto.

## Idempotencia

Para operaciones sensibles como pagos o creacion de recursos importantes, usa claves de idempotencia.

```txt
Idempotency-Key: order-create-abc123
```

## Contratos estables

No cambies nombres de campos sin plan. Para los clientes, un campo es una promesa.

## Operaciones asincronas

Si una operacion tarda:

```txt
POST /exports
202 Accepted
Location: /exports/{id}
```

Despues:

```txt
GET /exports/{id}
```

## Checklist general

- Los endpoints siguen una convencion comun.
- Toda lista tiene paginacion.
- Los errores son estructurados.
- Las operaciones criticas son idempotentes.
- Hay documentacion OpenAPI.
- Hay trazabilidad por request.
- Hay politica de deprecacion.

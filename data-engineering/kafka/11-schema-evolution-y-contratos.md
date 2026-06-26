# Schema evolution y contratos

Los eventos son contratos entre equipos. Si un productor cambia un evento sin compatibilidad, puede romper consumidores que ni siquiera conoce.

## Contrato de evento

Un contrato define:

- Nombre del evento.
- Topic.
- Key.
- Schema.
- Semantica de campos.
- Compatibilidad.
- Owner.

## Cambios seguros

Suelen ser seguros:

- Añadir campo opcional.
- Añadir campo con default.
- Ampliar enum solo si consumidores toleran valores nuevos.
- Añadir headers no obligatorios.

## Cambios peligrosos

Suelen romper:

- Borrar campos.
- Renombrar campos.
- Cambiar tipo.
- Cambiar significado sin cambiar nombre.
- Cambiar key de particion.

## Versionado semantico

Ejemplo:

```txt
OrderCreated v1
OrderCreated v2
```

No abuses de topics nuevos por cada version menor. Pero si el significado cambia mucho, separar puede ser mas claro.

## Compatibilidad en CI

Una pipeline madura valida:

1. Schema nuevo contra versiones anteriores.
2. Ejemplos de payload.
3. Consumers contract tests.
4. Documentacion actualizada.

## Schema Registry

Un Schema Registry permite bloquear cambios incompatibles antes de que lleguen a produccion.

Modos:

- Backward.
- Forward.
- Full.
- None.

## Contratos con JSON

Si usas JSON, puedes usar JSON Schema.

Ejemplo simple:

```json
{
  "type": "object",
  "required": ["event_id", "event_type", "occurred_at", "payload"],
  "properties": {
    "event_id": { "type": "string" },
    "event_type": { "type": "string" },
    "occurred_at": { "type": "string", "format": "date-time" }
  }
}
```

## Documentacion minima

Cada topic deberia tener:

- Owner.
- Productores.
- Consumidores conocidos.
- Retencion.
- Schema.
- Ejemplos.
- SLA o criticidad.

## Buenas practicas

- Trata eventos como API publica.
- Evita cambios silenciosos.
- Automatiza validacion de schemas.
- Mantén ejemplos reales.
- Comunica deprecaciones.
- Define politica de compatibilidad por dominio.


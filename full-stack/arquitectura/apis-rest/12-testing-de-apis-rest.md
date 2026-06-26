# Testing de APIs REST

Probar una API REST implica validar contrato, comportamiento, seguridad y compatibilidad.

## Tipos de tests

- Unitarios: validadores, mappers, casos de uso.
- Integracion: endpoint con base de datos o dependencias reales.
- Contract tests: OpenAPI y consumidores.
- E2E: flujos completos.
- Seguridad: permisos, auth, rate limit.

## Tests de contrato

Comprueban que la API responde como promete OpenAPI.

```txt
GET /orders/{id}
  expected 200
  body matches Order schema
```

## Tests de errores

No pruebes solo el camino feliz.

Casos importantes:

- Token ausente.
- Token invalido.
- Permiso insuficiente.
- Recurso inexistente.
- Payload invalido.
- Conflicto de estado.
- Rate limit.

## Tests de compatibilidad

Compara el contrato actual con el contrato publicado.

Debe fallar si:

- Se elimina un campo.
- Cambia un tipo.
- Desaparece un endpoint.
- Cambia un codigo de error estable.

## Datos de prueba

Usa builders o fixtures claros:

```txt
givenConfirmedOrder()
givenUserWithoutPermission()
givenExpiredToken()
```

## Checklist

- Los endpoints principales tienen tests.
- Los errores estan cubiertos.
- Los permisos se prueban.
- OpenAPI se valida.
- Los cambios incompatibles fallan en CI.

# Documentacion OpenAPI

OpenAPI convierte la API en un contrato legible por personas y herramientas. No deberia ser decoracion; debe representar el comportamiento real.

## Que documentar

- Endpoints.
- Metodos.
- Parametros.
- Request bodies.
- Response bodies.
- Codigos de estado.
- Errores.
- Autenticacion.
- Ejemplos.

## Ejemplo minimo

```yaml
paths:
  /orders:
    post:
      summary: Create order
      requestBody:
        required: true
      responses:
        "201":
          description: Order created
        "422":
          description: Validation error
```

## Schemas

Define modelos reutilizables:

```yaml
components:
  schemas:
    Order:
      type: object
      required:
        - id
        - status
      properties:
        id:
          type: string
        status:
          type: string
          enum: [draft, confirmed, cancelled]
```

## Documentar errores

Los errores tambien son contrato.

```yaml
ErrorResponse:
  type: object
  properties:
    type:
      type: string
    code:
      type: string
    message:
      type: string
    traceId:
      type: string
```

## Usos de OpenAPI

- Generar clientes.
- Validar contratos en CI.
- Crear mocks.
- Publicar documentacion.
- Revisar cambios incompatibles.

## Checklist

- La documentacion se actualiza con el codigo.
- Los ejemplos son reales.
- Los errores estan documentados.
- Los schemas no exponen campos internos.
- El contrato se valida en CI.

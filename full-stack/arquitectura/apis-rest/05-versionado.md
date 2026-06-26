# Versionado

Versionar una API no consiste solo en poner `/v1`. Consiste en permitir que el contrato evolucione sin romper clientes de forma innecesaria.

## Cambios compatibles

Normalmente son compatibles:

- Anadir campos opcionales.
- Anadir endpoints.
- Anadir valores nuevos si el cliente los tolera.
- Ampliar filtros opcionales.
- Mejorar mensajes de error sin cambiar codigos.

## Cambios incompatibles

- Eliminar campos.
- Cambiar tipos.
- Cambiar significado de un campo.
- Cambiar codigos de error estables.
- Hacer obligatorio algo que antes era opcional.
- Alterar paginacion o orden por defecto de forma visible.

## Versionado por URL

```txt
/v1/orders
/v2/orders
```

Es simple y visible. Es el enfoque mas comun.

## Versionado por header

```txt
Accept: application/vnd.company.orders.v2+json
```

Es mas flexible, pero menos visible para equipos junior y herramientas basicas.

## Deprecacion

Cuando retires una version:

1. Anuncia fecha.
2. Documenta alternativa.
3. Mide clientes afectados.
4. Devuelve headers de deprecacion.
5. Mantiene soporte durante una ventana razonable.

```txt
Deprecation: true
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
```

## Regla practica

Versiona cuando el contrato externo cambia de forma incompatible. No crees una version nueva por cada cambio interno.

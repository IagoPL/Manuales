# Paginacion filtros y ordenacion

Las listas son una de las fuentes mas comunes de problemas de rendimiento y experiencia. Una API profesional define paginacion, filtros y ordenacion desde el principio.

## Paginacion offset

```txt
GET /orders?page=2&pageSize=25
GET /orders?offset=25&limit=25
```

Ventajas:

- Simple.
- Facil de entender.
- Buena para paneles administrativos pequenos.

Problemas:

- Puede ser lenta en tablas grandes.
- Puede duplicar o saltar resultados si los datos cambian.

## Paginacion por cursor

```txt
GET /orders?limit=25&cursor=eyJpZCI6MTIzfQ
```

Ventajas:

- Mejor para grandes volumenes.
- Mas estable con datos cambiantes.
- Ideal para feeds, logs y actividad.

## Respuesta recomendada

```json
{
  "data": [],
  "pagination": {
    "limit": 25,
    "nextCursor": "abc123",
    "hasMore": true
  }
}
```

## Filtros

```txt
GET /orders?status=confirmed&customerId=42
GET /orders?createdFrom=2026-01-01&createdTo=2026-01-31
```

Define filtros permitidos. No aceptes cualquier campo interno de base de datos sin control.

## Ordenacion

```txt
GET /orders?sort=-createdAt
GET /orders?sort=customerName,-total
```

El signo `-` puede indicar descendente.

## Checklist

- Toda lista tiene limite maximo.
- Los filtros estan documentados.
- La ordenacion es estable.
- Las listas grandes usan cursor.
- Los parametros invalidos devuelven errores claros.

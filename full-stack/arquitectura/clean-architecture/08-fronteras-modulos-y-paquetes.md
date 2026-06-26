# Fronteras modulos y paquetes

Una frontera arquitectonica marca que puede conocer una parte del sistema y que no.

## Frontera por modulo

```txt
modules/
  billing/
  identity/
  catalog/
  orders/
```

Cada modulo deberia tener lenguaje, casos de uso y reglas propias.

## Frontera por capa

```txt
orders/
  domain/
  application/
  infrastructure/
  presentation/
```

Esta estructura ayuda a ver dependencias dentro de un modulo.

## Evitar el modulo compartido gigante

`shared`, `common` o `utils` pueden convertirse en un cajon sin criterio.

Usalos para tipos realmente transversales, utilidades puras, errores base y primitivas comunes estables.

Evitalos para reglas de negocio, servicios ambiguos, DTOs de cualquier modulo o dependencias que solo usa una feature.

## Contratos entre modulos

Los modulos no deberian tocar tablas internas de otros modulos directamente. Es mejor comunicarse mediante:

- Casos de uso publicos.
- Eventos de dominio.
- APIs internas.
- Contratos de lectura.

## Dependencias permitidas

```txt
orders/application -> orders/domain
orders/infrastructure -> orders/application
billing/application -> billing/domain
```

Dependencias sospechosas:

```txt
orders/domain -> billing/infrastructure
catalog/application -> orders/database-model
```

## Checklist

- Cada modulo tiene una responsabilidad clara.
- Las dependencias cruzadas son visibles.
- No hay acceso directo a detalles internos de otros modulos.
- Las utilidades compartidas no contienen negocio oculto.
- Los nombres reflejan conceptos del dominio.

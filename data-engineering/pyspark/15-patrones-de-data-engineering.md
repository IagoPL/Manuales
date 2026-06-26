# Patrones de data engineering

PySpark suele formar parte de pipelines mayores. Los patrones correctos reducen duplicados, errores y costes.

## Incremental por fecha

Procesar solo particion:

```txt
date=2026-06-26
```

## Full refresh

Recalcula todo. Es simple, pero caro.

## Upsert

Con Delta:

```txt
MERGE source into target by id
```

## Validaciones

- Schema.
- Nulos.
- Duplicados.
- Rangos.
- Conteos.

## Quarantine

Datos invalidos van a una zona de cuarentena para investigacion.

## Buenas practicas

- Diseña pipelines idempotentes.
- Separa bronze/silver/gold.
- Valida antes y despues.
- Mantén contratos de datos.
- Documenta reprocesamientos.
- Evita mezclar transformacion y orquestacion.


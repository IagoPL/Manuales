# Patrones de pipelines de datos

Airflow brilla cuando modela pipelines batch claros, idempotentes y observables.

## ELT diario

```mermaid
flowchart LR
  A["Extract"] --> B["Load raw"]
  B --> C["Transform marts"]
  C --> D["Validate"]
```

## Bronze, silver, gold

```txt
bronze = datos crudos
silver = datos limpios
gold = datos de negocio
```

Airflow orquesta cada etapa, pero el procesamiento puede vivir en Spark, dbt o SQL.

## Validacion de datos

Incluye tareas para:

- Esquema.
- Nulos.
- Duplicados.
- Rangos.
- Conteos esperados.

## Idempotencia por particion

Procesa por fecha:

```txt
sales/date=2026-06-26
```

Reejecutar esa fecha debe reemplazar o reconciliar la particion, no duplicarla.

## Reprocesamiento

Documenta:

- Rango permitido.
- Coste estimado.
- Dependencias aguas abajo.
- Riesgos de duplicado.

## Anti-patrones

- DAG que hace todo en una sola task.
- Pasar datasets grandes por XCom.
- Reintentar calidad de datos mala.
- Usar Airflow como motor de streaming.
- Dependencias implicitas por nombres de archivo no documentados.

## Buenas practicas

- Pipelines particionados.
- Contratos de entrada.
- Validaciones despues de cargar.
- Alertas con contexto.
- Reprocesamiento probado.
- Logs con fecha, tabla y particion.


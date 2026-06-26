# Scheduling

El scheduling define cuando debe ejecutarse un DAG y que intervalo de datos representa cada ejecucion.

## Conceptos clave

- `schedule`: frecuencia.
- `start_date`: desde cuando puede planificarse.
- `catchup`: si se ejecutan periodos pasados.
- `logical_date`: fecha logica de la ejecucion.
- `data interval`: rango de datos que cubre la ejecucion.

## Ejemplo diario

```python
@dag(
    schedule="@daily",
    start_date=datetime(2026, 1, 1),
    catchup=False,
)
def daily_sales():
    ...
```

Un DAG diario ejecutado el 2 de enero suele procesar el intervalo del 1 de enero.

## Cron

```python
schedule="0 6 * * *"
```

Ejecuta a las 06:00.

## Catchup

```python
catchup=True
```

Airflow intentara ejecutar intervalos pasados desde `start_date`.

Usalo para backfills controlados. No lo actives sin calcular volumen.

## Backfill

Backfill es reprocesar periodos historicos.

Riesgos:

- Sobrecargar sistemas.
- Duplicar datos.
- Reprocesar con logica nueva resultados antiguos.

## Timezones

Define zona horaria conscientemente. En datos globales, UTC suele simplificar.

## Datasets

Airflow puede disparar DAGs cuando se actualizan datasets.

```python
Dataset("s3://bucket/sales/date={{ ds }}")
```

Util cuando la dependencia real es la llegada de datos, no solo el reloj.

## Buenas practicas

- Usa UTC salvo que haya razon fuerte.
- Entiende `logical_date`.
- Desactiva `catchup` en DAGs no preparados.
- Diseña tareas por intervalo.
- Documenta backfills.
- No uses scheduling para resolver dependencias de datos si necesitas sensors o datasets.

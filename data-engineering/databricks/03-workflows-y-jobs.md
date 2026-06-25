# Workflows y Jobs en Databricks

Databricks Workflows permite automatizar notebooks, scripts, pipelines y tareas de datos. Es una pieza clave para pasar de análisis interactivo a procesos productivos.

## Conceptos clave

- **Job:** definición de una ejecución automatizada.
- **Task:** unidad individual dentro de un job.
- **Workflow:** conjunto de tareas relacionadas.
- **Schedule:** programación temporal.
- **Cluster de job:** clúster creado para una ejecución concreta.
- **Parámetro:** valor configurable que se pasa a una tarea.

## Cuándo usar Workflows

Úsalo cuando necesites:

- Ejecutar notebooks de forma programada.
- Encadenar tareas dependientes.
- Automatizar cargas diarias.
- Ejecutar validaciones de calidad.
- Publicar tablas analíticas.

## Estructura de un workflow

```txt
ingesta -> validación -> transformación -> publicación -> notificación
```

Cada paso puede ser una task independiente.

## Parámetros en notebooks

Los widgets permiten parametrizar notebooks.

```python
dbutils.widgets.text("fecha", "2026-01-01")
fecha = dbutils.widgets.get("fecha")
```

Esto facilita reutilizar el mismo notebook en distintos días o entornos.

## Buenas prácticas

- Divide workflows en tareas pequeñas.
- Usa parámetros para fechas, rutas y entornos.
- Separa notebooks exploratorios de notebooks productivos.
- Configura alertas ante fallos.
- Registra métricas de filas procesadas.
- Usa clusters de job para procesos recurrentes.

## Errores comunes

- Ejecutar notebooks manuales como si fueran pipelines productivos.
- No parametrizar fechas o rutas.
- No definir notificaciones de fallo.
- Mezclar exploración, limpieza y publicación en una sola tarea enorme.
- No documentar dependencias entre tareas.

## Chuleta rápida

```txt
Job = ejecución automatizada
Task = paso del job
Schedule = programación
Parameter = valor configurable
Job cluster = cómputo por ejecución
```

## Recursos relacionados

- [Databricks: introducción](01-databricks.md)
- [Notebooks](02-notebooks.md)
- [Pipelines de datos](../pipelines/01-introduccion.md)

# Diseno y arquitectura de pipelines

El diseno de un pipeline empieza antes de elegir herramienta. La pregunta importante no es si usar Airflow, NiFi, Spark o dbt, sino que garantias necesita el flujo de datos.

## Contrato de datos

Un contrato de datos describe que puede esperar el consumidor del dataset.

Debe incluir:

- Nombre del dataset.
- Fuente original.
- Propietario funcional y tecnico.
- Frecuencia de actualizacion.
- Campos, tipos y significado.
- Claves primarias o claves naturales.
- Campos obligatorios.
- Reglas de calidad.
- Politica de cambios de esquema.
- Retencion y sensibilidad de los datos.

Ejemplo:

```txt
dataset: fact_ventas
fuente: api_ventas
frecuencia: cada hora
clave: id_venta
campos obligatorios: id_venta, fecha, cliente_id, importe, moneda
SLA: disponible antes del minuto 15 de cada hora
```

## Fuente

Analiza la fuente antes de programar:

- Si permite extraccion incremental.
- Si tiene paginacion, limites o ventanas temporales.
- Si expone fecha de modificacion.
- Si puede entregar duplicados.
- Si el esquema cambia sin aviso.
- Si hay campos sensibles.
- Si el orden de llegada importa.

Una fuente sin contrato claro obliga al pipeline a defenderse mejor.

## Destino

El destino condiciona el diseno:

- Un data lake prioriza trazabilidad, formato y particionado.
- Un data warehouse prioriza modelos consultables y coste de consulta.
- Una base operacional prioriza latencia y consistencia.
- Un indice de busqueda prioriza documentos y actualizaciones parciales.
- Un sistema de ML prioriza reproducibilidad de features.

No disenes igual una tabla historica para analisis que una API que necesita datos recientes.

## Separacion de responsabilidades

Un pipeline mantenible separa fases:

```txt
extract -> load raw -> validate -> transform -> publish -> monitor
```

Evita mezclar demasiadas responsabilidades en el mismo paso. Por ejemplo, un unico script que llama una API, corrige datos, aplica reglas de negocio, escribe una tabla final y manda alertas sera dificil de probar y reprocesar.

## Configuracion

La configuracion debe estar fuera de la logica principal:

- Rutas de entrada y salida.
- Credenciales.
- Ventanas de fechas.
- Nombres de tablas.
- Umbrales de calidad.
- Parametros por entorno.

Ejemplo:

```yaml
source: api_ventas
target_table: curated.fact_ventas
watermark_column: updated_at
quality:
  min_rows: 1
  required_columns:
    - id_venta
    - fecha
    - importe
```

## Versionado

Versiona todo lo que afecte al resultado:

- Codigo de transformacion.
- Esquemas.
- Consultas SQL.
- Configuracion.
- DAGs o flujos.
- Jobs de despliegue.
- Documentacion del contrato.

Si no puedes saber que version produjo un dataset, sera dificil explicar diferencias entre ejecuciones.

## Lineage

El lineage responde:

- De donde viene este dato.
- Que transformaciones se aplicaron.
- Que datasets dependen de el.
- Que se rompe si cambia una columna.

Aunque no tengas una herramienta avanzada al principio, puedes empezar documentando entradas, salidas y dependencias en cada capitulo del pipeline.

## Checklist de diseno

- La fuente esta identificada y documentada.
- El destino y el formato estan definidos.
- Existe una clave para idempotencia o deduplicacion.
- Los datos crudos se conservan.
- Hay estrategia de errores y cuarentena.
- El pipeline puede reprocesar una ventana concreta.
- Hay metricas minimas de filas, duracion y fallos.
- Hay propietario y runbook.

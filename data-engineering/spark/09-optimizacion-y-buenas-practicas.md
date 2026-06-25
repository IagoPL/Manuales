# Optimización y buenas prácticas en Spark

Optimizar Spark implica reducir shuffles, controlar particiones, usar formatos eficientes y escribir transformaciones que aprovechen el motor de ejecución.

## Conceptos clave

- **Shuffle:** redistribución de datos entre particiones.
- **Partition:** fragmento de datos procesado por una tarea.
- **Cache:** almacenamiento temporal para reutilizar datos.
- **Broadcast join:** join optimizado enviando una tabla pequeña a todos los executors.
- **Predicate pushdown:** filtrado que se delega al formato o fuente de datos.
- **Parquet:** formato columnar eficiente.

## Reducir shuffles

Operaciones como `groupBy`, `join`, `distinct` y `orderBy` pueden provocar shuffles.

Buenas prácticas:

- Filtra antes de agrupar.
- Selecciona solo columnas necesarias.
- Evita ordenar datasets completos si no es necesario.
- Revisa claves de join con alta cardinalidad.

## Particiones

```python
df = df.repartition(8, "pais")
df_pequeno = df.coalesce(1)
```

Usa `repartition` para aumentar o redistribuir particiones y `coalesce` para reducirlas sin shuffle completo cuando sea posible.

## Cache y persistencia

```python
df_limpio.cache()
df_limpio.count()
df_limpio.unpersist()
```

Cachea solo si el DataFrame se reutiliza varias veces.

## Formatos de datos

Parquet suele ser mejor que CSV para analítica:

- Es columnar.
- Conserva tipos.
- Comprime mejor.
- Permite leer solo columnas necesarias.

```python
df.write.mode("overwrite").parquet("/data/curated/ventas")
```

## Buenas prácticas

- Prefiere DataFrames sobre RDDs para procesamiento estructurado.
- Usa Parquet o Delta cuando sea posible.
- Evita `collect()` con grandes volúmenes.
- Filtra y selecciona columnas temprano.
- Revisa planes con `explain()`.
- Controla skew en claves muy desbalanceadas.
- Ajusta particiones según tamaño y cluster.

## Errores comunes

- Leer CSV repetidamente en procesos analíticos.
- Hacer joins sin revisar tamaño de tablas.
- Cachear todo sin liberar memoria.
- Usar `repartition(1)` para generar un único archivo grande.
- Ignorar datos desbalanceados.

## Chuleta rápida

```python
df.explain()
df.cache()
df.unpersist()
df.repartition(8)
df.coalesce(2)
df.write.parquet("/ruta")
```

## Recursos relacionados

- [Transformaciones y acciones](04-transformaciones-y-acciones.md)
- [Lectura y escritura](07-lectura-y-escritura.md)
- [Pipelines de datos](../pipelines/01-introduccion.md)

# Arquitectura de Spark y RDDs

Apache Spark se basa en un modelo distribuido donde el trabajo se divide entre varios procesos. Entender su arquitectura ayuda a escribir aplicaciones más eficientes y a diagnosticar problemas.

## Conceptos clave

- **Driver:** proceso principal que coordina la aplicación.
- **Executor:** proceso que ejecuta tareas en los nodos.
- **Cluster manager:** sistema que asigna recursos.
- **Job:** trabajo generado por una acción.
- **Stage:** conjunto de tareas que pueden ejecutarse sin shuffle.
- **Task:** unidad mínima de ejecución.
- **RDD:** colección distribuida e inmutable.

## Arquitectura básica

```txt
Driver -> Cluster Manager -> Executors -> Tasks
```

El driver crea el plan de ejecución, solicita recursos y coordina tareas. Los executors procesan particiones de datos y devuelven resultados.

## RDDs

Un RDD es una colección distribuida, tolerante a fallos e inmutable.

```python
datos = sc.parallelize([1, 2, 3, 4, 5])
resultado = datos.map(lambda x: x * 2).collect()
```

## Transformaciones y acciones

Las transformaciones son perezosas: no se ejecutan hasta que aparece una acción.

```python
rdd = sc.textFile("/data/logs.txt")
errores = rdd.filter(lambda linea: "ERROR" in linea)
total = errores.count()
```

## Particiones

Spark divide los datos en particiones. El número de particiones influye en paralelismo y rendimiento.

```python
rdd = sc.textFile("/data/logs.txt", minPartitions=8)
```

## Buenas prácticas

- Usa DataFrames cuando no necesites control de bajo nivel.
- Evita `collect()` sobre datasets grandes.
- Revisa particiones antes de operaciones pesadas.
- Cachea solo datos que se reutilizan.
- Minimiza shuffles innecesarios.

## Errores comunes

- Ejecutar `collect()` con demasiados datos.
- Confundir transformaciones con acciones.
- No entender cuándo se dispara un job.
- Usar RDDs para tareas que DataFrames resuelven mejor.

## Chuleta rápida

```txt
Driver = coordina
Executor = ejecuta
RDD = datos distribuidos
Transformation = lazy
Action = ejecuta job
Shuffle = redistribución costosa
```

## Recursos relacionados

- [Introducción a Apache Spark](01-introduccion-a-apache-spark.md)
- [Transformaciones y acciones](04-transformaciones-y-acciones.md)
- [Datos estructurados y SQL](05-datos-estructurados-y-sql.md)

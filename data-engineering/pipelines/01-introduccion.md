# Pipelines de datos

Un pipeline de datos es una cadena de pasos que mueve datos desde una o varias fuentes hasta uno o varios destinos, aplicando controles, transformaciones y reglas operativas por el camino.

No es solo "leer y escribir datos". Un buen pipeline define que se procesa, cuando, con que garantias, como se detectan errores, como se reprocesa y quien es responsable del resultado.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Diseno y arquitectura](02-diseno-y-arquitectura.md)
3. [Batch, incremental y streaming](03-batch-incremental-y-streaming.md)
4. [Calidad, idempotencia y reprocesos](04-calidad-idempotencia-y-reprocesos.md)
5. [Observabilidad y operacion](05-observabilidad-y-operacion.md)
6. [Patrones y antipatrones](06-patrones-y-antipatrones.md)

## Que problema resuelven

Los datos rara vez nacen en el sitio donde se consumen. Pueden venir de APIs, bases de datos, colas de eventos, ficheros, SaaS externos, logs o sensores. El pipeline conecta esos mundos y convierte entradas heterogeneas en datasets utiles, fiables y documentados.

Un pipeline suele resolver estas necesidades:

- Capturar datos desde una fuente.
- Validar estructura, tipos y reglas minimas.
- Enriquecer, limpiar o transformar informacion.
- Guardar datos crudos antes de modificar nada.
- Publicar datasets preparados para analisis, producto o ML.
- Registrar metricas, errores y lineage.
- Permitir reprocesos sin duplicar ni romper datos.

## Anatomia basica

```txt
fuente -> ingesta -> validacion -> transformacion -> almacenamiento -> consumo -> observabilidad
```

Cada fase tiene una responsabilidad distinta:

- **Fuente:** sistema origen, como PostgreSQL, una API REST, Kafka o ficheros SFTP.
- **Ingesta:** captura inicial y transporte hacia la plataforma de datos.
- **Validacion:** comprobacion de esquema, campos obligatorios, rangos y duplicados.
- **Transformacion:** limpieza, joins, agregaciones, reglas de negocio o normalizacion.
- **Almacenamiento:** data lake, data warehouse, base operacional o indice especializado.
- **Consumo:** BI, ciencia de datos, APIs, busquedas, aplicaciones o modelos de IA.
- **Observabilidad:** metricas, logs, alertas, lineage y runbooks.

## Capas habituales

Una arquitectura sencilla suele separar los datos por nivel de elaboracion:

```txt
raw -> staging -> curated -> serving
```

- **Raw:** copia fiel de lo recibido. Es la red de seguridad para auditoria y reprocesos.
- **Staging:** datos parseados, tipados y con validaciones tecnicas.
- **Curated:** datos limpios con reglas de negocio aplicadas.
- **Serving:** modelos optimizados para consumo: dashboards, APIs, features o reportes.

No todos los proyectos necesitan todas las capas desde el primer dia, pero separar datos crudos de datos transformados evita muchos problemas futuros.

## Decisiones iniciales

Antes de construir, conviene responder:

- Que fuente manda los datos y con que frecuencia.
- Si el pipeline sera batch, incremental, streaming o mixto.
- Que identificador permite detectar duplicados.
- Que contrato de esquema debe respetar la fuente.
- Donde se guardaran los datos rechazados.
- Que pasa si una ejecucion falla a medias.
- Como se reprocesa un dia, una particion o un rango completo.
- Que SLA tiene el dataset final.
- Quien recibe la alerta si algo se rompe.

## Herramientas relacionadas

Este manual habla del diseno transversal de pipelines. Otras herramientas cubren piezas concretas:

- [Apache NiFi](../nifi/01-introduccion.md): ingesta visual, routing y movimiento de datos.
- [Apache Airflow](../airflow/01-introduccion-y-arquitectura.md): orquestacion de tareas y dependencias.
- [Apache Spark](../spark/01-introduccion-a-apache-spark.md): procesamiento distribuido.
- [Kafka](../kafka/01-introduccion-y-arquitectura.md): transporte de eventos y streaming.
- [dbt](../dbt/01-introduccion-y-proyecto.md): modelado SQL, tests y documentacion en warehouses.
- [Snowflake](../../bases-de-datos/snowflake/01-introduccion-y-arquitectura.md): almacenamiento analitico.
- [Delta Lake](../delta-lake/01-introduccion-y-arquitectura.md): tablas ACID sobre data lakes.

## Ejemplo rapido

```txt
API de ventas
  -> ingesta incremental
  -> validacion de esquema
  -> raw/ventas
  -> staging/ventas_tipadas
  -> curated/fact_ventas
  -> dashboard comercial
```

Controles minimos:

- Guardar respuesta original o payload normalizado en raw.
- Registrar fecha de extraccion y ventana procesada.
- Validar campos obligatorios: id, fecha, importe y moneda.
- Escribir errores en una zona de cuarentena.
- Hacer la carga idempotente por `id_venta`.
- Alertar si el numero de filas cae por debajo de lo esperado.

## Idea clave

Un pipeline fiable no se mide solo porque "funciona hoy". Se mide porque se puede entender, observar, repetir y corregir cuando algo sale mal.

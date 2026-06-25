# Apache NiFi

Apache NiFi es una plataforma de flujo de datos orientada a ingesta, routing, transformaciones ligeras y movimiento fiable entre sistemas. Su punto fuerte es que permite disenar flujos de forma visual, observar que ocurre con cada FlowFile y cambiar rutas operativas sin convertir todo en codigo.

NiFi encaja muy bien cuando necesitas conectar sistemas, mover ficheros, enrutar eventos, enriquecer metadatos, llamar APIs, escribir en colas o bases de datos y dejar trazabilidad de lo que ha ocurrido.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Diseno y desarrollo de flujos](02-diseno-y-desarrollo-de-flujos.md)
3. [Optimizacion y administracion](03-optimizacion-y-administracion.md)
4. [Procesadores, controller services y parametros](04-procesadores-controller-services-y-parametros.md)
5. [Colas, back pressure y errores](05-colas-back-pressure-y-errores.md)
6. [Registry, despliegue y observabilidad](06-registry-despliegue-y-observabilidad.md)

## Cuando usar NiFi

NiFi es buena eleccion para:

- Ingesta desde ficheros, APIs, SFTP, HTTP, bases de datos o colas.
- Routing visual segun atributos o contenido.
- Flujos operativos donde importa ver colas, errores y trazabilidad.
- Integracion entre sistemas con protocolos distintos.
- Enriquecimiento ligero antes de enviar datos a Kafka, un lake o un warehouse.
- Procesos donde un equipo de datos necesita operar sin desplegar codigo para cada cambio menor.

## Cuando no usar NiFi

NiFi no deberia ser la herramienta principal para todo:

- Transformaciones analiticas pesadas: suele encajar mejor Spark, SQL, dbt o un motor distribuido.
- Streaming con estado complejo: Kafka Streams, Flink o Spark Structured Streaming suelen ser mejores.
- Logica de negocio grande y versionada como aplicacion: un servicio propio puede ser mas mantenible.
- Modelado de datos en warehouse: dbt o SQL gestionado suelen ser mas adecuados.

## Componentes principales

### FlowFile

Un FlowFile es la unidad que se mueve por NiFi. Tiene dos partes:

- **Contenido:** bytes reales del dato.
- **Atributos:** metadatos como nombre de fichero, ruta, MIME type, ids, timestamps o campos calculados.

NiFi intenta evitar copiar contenido innecesariamente. Muchas operaciones modifican atributos o referencias internas.

### Processor

Un processor ejecuta una accion concreta:

- Leer ficheros.
- Consumir mensajes.
- Invocar una API.
- Evaluar condiciones.
- Modificar atributos.
- Convertir formatos.
- Escribir en otro sistema.

Ejemplos:

- `GetFile`
- `PutFile`
- `InvokeHTTP`
- `RouteOnAttribute`
- `UpdateAttribute`
- `QueryDatabaseTableRecord`
- `PublishKafkaRecord_2_6`

### Connection

Una connection une dos componentes y funciona como cola. Permite configurar:

- Relaciones que acepta.
- Back pressure por cantidad de FlowFiles.
- Back pressure por tamano total.
- Priorizadores.
- Expiracion de datos.

### Process Group

Un process group agrupa una parte del flujo. Sirve para dividir responsabilidades:

- Ingesta.
- Validacion.
- Enrutado.
- Publicacion.
- Errores.

Un buen flujo de NiFi se entiende por grupos bien nombrados, no por cientos de procesadores en el mismo canvas.

### Controller Service

Un controller service define recursos compartidos:

- Conexiones a bases de datos.
- Lectores y escritores de registros.
- Clientes SSL.
- Servicios de cache.
- Esquemas.

Permite reutilizar configuracion y evitar duplicacion.

### Parameter Context

Un parameter context guarda valores configurables por entorno:

- Hosts.
- Rutas.
- Topics.
- Nombres de tablas.
- Umbrales.
- Credenciales sensibles.

Es la forma moderna de separar configuracion de diseno del flujo.

## Flujo minimo

```txt
GetFile -> UpdateAttribute -> LogAttribute -> PutFile
```

Este flujo:

1. Lee archivos de una carpeta.
2. Anade metadatos.
3. Registra atributos para depuracion.
4. Escribe el contenido en otra carpeta.

Aunque sea simple, ya aparecen conceptos clave: FlowFiles, processors, relationships, connections y colas.

## Buenas practicas iniciales

- Nombra los processors por intencion, no solo por tipo.
- Divide el flujo en process groups pequenos.
- Conecta o termina todas las relationships.
- Configura back pressure desde el principio.
- Separa rutas de exito, fallo y retry.
- Usa parameter contexts para valores por entorno.
- Versiona flujos con NiFi Registry.
- Documenta que entra, que sale y quien es propietario.

## Relacion con pipelines

NiFi suele ser una pieza dentro de un pipeline de datos. Puede encargarse de ingesta, routing y entrega, mientras que otras herramientas hacen orquestacion, transformacion pesada o modelado analitico.

Recursos relacionados:

- [Pipelines de datos](../pipelines/01-introduccion.md)
- [Apache Kafka](../kafka/01-introduccion-y-arquitectura.md)
- [Apache Spark](../spark/01-introduccion-a-apache-spark.md)
- [Apache Airflow](../airflow/01-introduccion-y-arquitectura.md)

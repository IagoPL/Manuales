# Diseno y desarrollo de flujos en NiFi

Disenar en NiFi no consiste en arrastrar procesadores hasta que algo funcione. Un flujo mantenible debe expresar responsabilidades, controlar errores y permitir operar sin miedo.

## Modelo mental

Piensa cada flujo como una serie de etapas:

```txt
entrada -> normalizacion -> validacion -> routing -> salida -> errores
```

Cada etapa deberia poder explicarse con una frase. Si un process group necesita una pagina entera para entenderse, probablemente esta mezclando demasiadas responsabilidades.

## Nombres y estructura

Usa nombres orientados a negocio:

```txt
Ingesta de pedidos desde SFTP
Validacion de esquema de pedidos
Publicacion en Kafka ventas.pedidos
Errores de pedidos invalidos
```

Evita nombres genericos:

```txt
GetFile 1
ProcessGroup final
Test nuevo
Processor copia
```

## Process groups recomendados

Una estructura habitual:

```txt
01 Entrada
02 Validacion
03 Enriquecimiento
04 Publicacion
90 Reintentos
99 Errores
```

No hace falta seguir exactamente esa numeracion, pero ayuda a que el canvas tenga lectura de izquierda a derecha.

## Relationships

Cada processor tiene salidas posibles llamadas relationships. Algunas comunes:

- `success`
- `failure`
- `retry`
- `original`
- `matched`
- `unmatched`

Una relationship sin conectar puede bloquear el processor, salvo que se marque como auto-terminated. Auto-terminar una relacion significa descartar esos FlowFiles, asi que debe ser una decision explicita.

## Routing por atributos

`RouteOnAttribute` permite enviar FlowFiles a rutas distintas segun sus atributos.

Ejemplo:

```txt
${mime.type:equals('application/json')}
${filename:endsWith('.csv')}
${source:equals('crm')}
```

Uso tipico:

```txt
entrada -> RouteOnAttribute
  -> json -> flujo JSON
  -> csv -> flujo CSV
  -> unmatched -> errores
```

## Routing por contenido

Cuando la decision depende del contenido, puedes usar processors como:

- `EvaluateJsonPath`
- `EvaluateXPath`
- `ExtractText`
- `QueryRecord`
- `ValidateRecord`

Patron comun:

```txt
EvaluateJsonPath -> RouteOnAttribute -> salida especifica
```

Extrae lo minimo necesario a atributos. No conviertas cada campo de negocio en atributo si el contenido es grande.

## Formato Record

La familia de processors `Record` permite trabajar con CSV, JSON, Avro, Parquet y otros formatos de manera mas estructurada.

Ejemplos:

- `ConvertRecord`
- `ValidateRecord`
- `QueryRecord`
- `PutDatabaseRecord`
- `PublishKafkaRecord_2_6`

Necesitan lectores y escritores configurados como controller services.

## Ejemplo: ingesta de CSV

```txt
GetFile
  -> UpdateAttribute
  -> ValidateRecord
      -> valid -> ConvertRecord -> PutDatabaseRecord
      -> invalid -> PutFile cuarentena
```

Controles recomendados:

- Guardar ruta y nombre original.
- Anadir identificador de ejecucion.
- Validar esquema.
- Separar registros invalidos.
- Publicar metricas de volumen.

## Ejemplo: API a Kafka

```txt
GenerateTableFetch
  -> ExecuteSQLRecord
  -> ConvertRecord
  -> PublishKafkaRecord_2_6
```

O para HTTP:

```txt
InvokeHTTP
  -> EvaluateJsonPath
  -> RouteOnAttribute
  -> PublishKafkaRecord_2_6
```

## Documentacion del flujo

Cada process group importante deberia documentar:

- Objetivo.
- Fuente.
- Destino.
- Frecuencia.
- Formato esperado.
- Relaciones de error.
- Parametros necesarios.
- Propietario.

NiFi permite anadir comentarios y labels en el canvas. Usalos para decisiones que no sean obvias.

## Checklist de desarrollo

- El flujo tiene grupos por responsabilidad.
- Los nombres explican intencion.
- Todas las relationships estan conectadas o terminadas de forma consciente.
- Hay rutas separadas para exito, retry y fallo definitivo.
- Las rutas, hosts y credenciales son parametros.
- Los controller services estan reutilizados.
- La salida final es idempotente o deduplicable.
- El flujo queda versionado en Registry.

## Recursos relacionados

- [Procesadores, controller services y parametros](04-procesadores-controller-services-y-parametros.md)
- [Colas, back pressure y errores](05-colas-back-pressure-y-errores.md)
- [Pipelines de datos](../pipelines/01-introduccion.md)

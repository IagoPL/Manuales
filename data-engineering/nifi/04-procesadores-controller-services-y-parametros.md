# Procesadores, controller services y parametros

Los procesadores hacen el trabajo visible, pero los controller services y los parametros hacen que el flujo sea mantenible.

## Ciclo de vida de un processor

Un processor puede estar:

- **Stopped:** configurado pero sin ejecutar.
- **Running:** ejecutando segun su planificacion.
- **Invalid:** falta configuracion o algun servicio requerido.
- **Disabled:** desactivado manualmente.

Antes de arrancar un flujo, revisa los processors invalidos. Un icono de advertencia suele indicar propiedades incompletas, relationships sin resolver o controller services no habilitados.

## Propiedades

Cada processor tiene propiedades configurables:

- Rutas.
- URLs.
- Topics.
- Consultas SQL.
- Timeouts.
- Estrategias de retry.
- Lectores y escritores.

Evita valores hardcodeados. Usa parametros siempre que el valor cambie por entorno.

## Expression Language

NiFi Expression Language permite calcular valores desde atributos.

Ejemplos:

```txt
${filename}
${filename:toLower()}
${now():format("yyyy-MM-dd")}
${source_system:equals("crm")}
${fileSize:gt(1048576)}
```

Uso tipico en `UpdateAttribute`:

```txt
landing_path = /raw/${source_system}/${now():format("yyyy/MM/dd")}
```

No abuses de expresiones complejas. Si la logica empieza a ser dificil de leer, separala en pasos o usa una herramienta mas adecuada.

## Controller services

Un controller service comparte configuracion entre processors.

Casos comunes:

- `DBCPConnectionPool` para conexiones JDBC.
- `JsonTreeReader` para leer JSON.
- `CSVReader` para leer CSV.
- `AvroRecordSetWriter` para escribir Avro.
- `StandardSSLContextService` para TLS.
- Schema Registry services.

Ventajas:

- Menos duplicacion.
- Cambios centralizados.
- Configuracion reutilizable.
- Flujos mas claros.

## Record readers y writers

Los processors `Record` necesitan servicios de lectura y escritura.

Ejemplo:

```txt
CSVReader -> ConvertRecord -> JsonRecordSetWriter
```

Esto permite convertir formato sin escribir codigo.

Buenas practicas:

- Definir esquemas claros.
- Controlar cabeceras y delimitadores.
- Validar tipos.
- Versionar cambios de esquema.

## Parameter contexts

Un parameter context contiene valores usados por el flujo.

Ejemplo:

```txt
#{sftp.host}
#{sftp.input.path}
#{kafka.topic}
#{db.url}
#{max.error.percent}
```

Beneficios:

- Separar configuracion de diseno.
- Promocionar el mismo flujo entre entornos.
- Marcar parametros sensibles.
- Reducir cambios manuales.

## Parametros sensibles

Usa parametros sensibles para:

- Passwords.
- Tokens.
- Secretos.
- Claves privadas.
- Credenciales de APIs.

No escribas secretos en labels, nombres de processors, logs ni atributos visibles.

## Patron recomendado

```txt
Process Group
  -> Parameter Context por entorno
  -> Controller Services compartidos
  -> Processors con referencias a parametros
```

## Checklist

- No hay rutas ni hosts hardcodeados.
- Los servicios compartidos estan centralizados.
- Los parametros sensibles estan marcados como sensibles.
- Los processors `Record` usan readers/writers consistentes.
- Las expresiones son legibles.
- El flujo puede moverse de dev a prod cambiando parametros.

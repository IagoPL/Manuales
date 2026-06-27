# Integracion entre contextos

Los bounded contexts no viven aislados. Necesitan intercambiar informacion sin perder autonomia.

## Formas de integracion

- Llamadas sincronas por API.
- Eventos asincronos.
- Lecturas replicadas.
- Ficheros o cargas batch.
- Bases compartidas solo en casos muy controlados.

## API sincronica

Util cuando necesitas respuesta inmediata.

```txt
Learning -> Catalog: GET /courses/{id}
```

Riesgo: acoplamiento temporal. Si Catalog cae, Learning puede fallar.

## Eventos

Utiles para comunicar hechos.

```txt
CoursePublished
StudentEnrolled
InvoicePaid
```

Riesgo: consistencia eventual y necesidad de idempotencia.

## Anti-corruption layer

Una capa anticorrupcion traduce modelos externos al lenguaje interno.

```txt
External CRM Customer
  -> CustomerTranslator
  -> SupportAccount
```

Evita que conceptos externos contaminen tu dominio.

## Shared kernel

Un shared kernel comparte una parte pequena del modelo entre contextos.

Debe ser pequeno, estable y gobernado con cuidado. Si crece demasiado, se convierte en acoplamiento peligroso.

## Published language

Cuando un contexto publica contratos estables:

- API REST.
- Eventos.
- Schemas.
- Documentacion.

Los consumidores dependen de ese lenguaje publicado, no del modelo interno.

## Checklist

- Cada integracion tiene owner y contrato.
- Los eventos son idempotentes.
- Los modelos externos se traducen.
- No se comparten tablas internas.
- La consistencia eventual se comunica al producto.

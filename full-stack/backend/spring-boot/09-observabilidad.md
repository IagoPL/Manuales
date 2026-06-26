# Observabilidad

Una API no esta lista para produccion si no se puede observar. Spring Boot Actuator, logs, metricas y tracing ayudan a entender salud y comportamiento.

## Actuator

Dependencia:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Config:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
```

## Health

```txt
/actuator/health
```

Puedes exponer detalles solo internamente:

```yaml
management:
  endpoint:
    health:
      show-details: when_authorized
```

## Metricas

Micrometer permite exportar a Prometheus, Datadog y otros sistemas.

Metricas utiles:

- Latencia HTTP.
- Errores 4xx/5xx.
- Uso de pool de conexiones.
- JVM memory.
- GC.
- Threads.
- Queries lentas.

## Logs estructurados

Incluye contexto:

```txt
timestamp level trace_id user_id request_id message
```

No loguees tokens, passwords ni datos sensibles.

## Tracing

El tracing permite seguir una peticion entre servicios.

Propaga:

- `trace_id`
- `span_id`
- `correlation_id`

## Alertas

Alertas tipicas:

- Tasa de 5xx alta.
- Latencia p95/p99 elevada.
- Health down.
- Pool de DB saturado.
- Errores de autenticacion anormales.
- Reinicios frecuentes.

## Buenas practicas

- Actuator no debe exponer todo publicamente.
- Define dashboards antes de incidentes.
- Usa logs estructurados.
- No registres secretos.
- Mide latencia por endpoint.
- Documenta runbooks basicos.

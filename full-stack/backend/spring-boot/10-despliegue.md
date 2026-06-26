# Despliegue

Desplegar Spring Boot implica empaquetar la aplicacion, configurar entorno, exponer health checks y operar logs, metricas y secretos.

## Build

Maven:

```bash
./mvnw clean package
```

Gradle:

```bash
./gradlew build
```

## Ejecutar JAR

```bash
java -jar target/shop-api.jar
```

Variables:

```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
```

## Dockerfile

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/shop-api.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Dockerfile por capas

Spring Boot puede generar layers para mejorar cache de imagenes.

```bash
java -Djarmode=layertools -jar app.jar extract
```

## Health checks

Kubernetes o Docker deben consultar:

```txt
/actuator/health/liveness
/actuator/health/readiness
```

Config:

```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
```

## Configuracion externa

No empaquetes secretos en el JAR.

Usa:

- Variables de entorno.
- Secret manager.
- Kubernetes Secrets.
- ConfigMaps para configuracion no sensible.

## Migraciones

Decide si Flyway corre al arrancar o en job separado.

En sistemas criticos, migraciones destructivas requieren plan de despliegue.

## Buenas practicas

- Build reproducible.
- Imagen pequeña y con JRE adecuado.
- Health checks reales.
- Logs a stdout.
- Configuracion externa.
- Rollback definido.
- Migraciones revisadas.

# Proyecto base y estructura

Un proyecto Spring Boot debe arrancar rapido, ser facil de entender y separar responsabilidades desde el primer dia. La estructura inicial condiciona mucho el crecimiento posterior.

## Crear proyecto

Con Spring Initializr selecciona:

- Java 21 o version LTS usada por tu equipo.
- Maven o Gradle.
- Spring Web.
- Validation.
- Spring Data JPA si usaras base de datos.
- Actuator para observabilidad.
- Driver de base de datos.

## Estructura recomendada

```txt
src/main/java/com/example/shop/
  ShopApplication.java
  products/
    ProductController.java
    ProductService.java
    ProductRepository.java
    Product.java
    ProductDto.java
  shared/
    error/
    config/
src/main/resources/
  application.yml
```

Agrupar por dominio evita carpetas enormes como `controllers`, `services` y `repositories` cuando la app crece.

## Clase principal

```java
@SpringBootApplication
public class ShopApplication {
  public static void main(String[] args) {
    SpringApplication.run(ShopApplication.class, args);
  }
}
```

`@SpringBootApplication` combina configuracion, auto-configuracion y component scanning.

## Configuracion

Usa `application.yml`:

```yaml
spring:
  application:
    name: shop-api
server:
  port: 8080
```

Perfiles:

```txt
application-dev.yml
application-test.yml
application-prod.yml
```

## Dependencias

Mantén dependencias con intencion clara. No anadas starters "por si acaso".

Ejemplo Maven:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## Buenas practicas

- Organiza por dominio cuando la aplicacion vaya a crecer.
- Mantén `ShopApplication` limpia.
- Usa perfiles para entorno, no condicionales manuales dispersos.
- No pongas secretos en `application.yml`.
- Define convenciones de paquetes desde el inicio.

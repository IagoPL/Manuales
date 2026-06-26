# Arquitectura interna de Spring Boot

Spring Boot reduce configuracion, pero entender que ocurre por dentro ayuda a depurar arranques, beans y dependencias.

## Arranque

```mermaid
flowchart LR
  A["main"] --> B["SpringApplication.run"]
  B --> C["ApplicationContext"]
  C --> D["Bean scanning"]
  D --> E["Auto-configuration"]
  E --> F["Embedded server"]
```

## ApplicationContext

El `ApplicationContext` contiene beans, configuracion y ciclo de vida.

Un bean es un objeto gestionado por Spring.

```java
@Service
class ProductService {}
```

## Component scanning

Spring busca componentes desde el paquete de la clase principal hacia abajo.

Anotaciones detectadas:

- `@Component`
- `@Service`
- `@Repository`
- `@Controller`
- `@RestController`
- `@Configuration`

## Auto-configuration

Spring Boot activa configuracion segun:

- Dependencias presentes.
- Properties.
- Beans existentes.
- Condiciones.

Ejemplo: si existe Spring Web, configura servidor embebido y MVC.

## Starters

Un starter agrupa dependencias.

```txt
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-security
```

No son magia; son paquetes de dependencias y auto-configuracion.

## Bean lifecycle

Fases simplificadas:

```txt
crear instancia -> inyectar dependencias -> post processors -> init -> ready
```

## Diagnosticar beans

Actuator:

```txt
/actuator/beans
/actuator/conditions
```

Logs de auto-configuracion:

```bash
java -jar app.jar --debug
```

## Errores comunes

- Bean duplicado.
- Dependencia circular.
- Componente fuera del package scan.
- Configuracion condicional no activada.
- Starter añadido sin entender efectos.

## Buenas practicas

- Mantén clase principal en paquete raiz.
- Prefiere constructor injection.
- Evita dependencias circulares.
- Usa `@ConfigurationProperties` para configuracion.
- Consulta conditions report ante problemas de auto-configuracion.


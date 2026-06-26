# Servicios y configuracion

Los servicios contienen casos de uso y reglas de negocio. La configuracion adapta la aplicacion al entorno sin tocar codigo.

## Servicio

```java
@Service
class ProductService {
  private final ProductRepository productRepository;

  ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  ProductResponse findById(Long id) {
    Product product = productRepository.findById(id)
      .orElseThrow(() -> new ProductNotFoundException(id));

    return ProductResponse.from(product);
  }
}
```

## Inyeccion por constructor

Preferible a `@Autowired` en campos:

```java
class OrderService {
  private final PaymentClient paymentClient;

  OrderService(PaymentClient paymentClient) {
    this.paymentClient = paymentClient;
  }
}
```

Ventajas:

- Dependencias explicitas.
- Facil de testear.
- Objetos inmutables.

## Configuration properties

```java
@ConfigurationProperties(prefix = "app.payment")
public record PaymentProperties(String baseUrl, Duration timeout) {}
```

Activar:

```java
@EnableConfigurationProperties(PaymentProperties.class)
@Configuration
class PaymentConfig {}
```

YAML:

```yaml
app:
  payment:
    base-url: https://payments.example.com
    timeout: 3s
```

## Perfiles

```bash
SPRING_PROFILES_ACTIVE=prod
```

No uses perfiles para esconder ramas de negocio. Usalos para infraestructura y configuracion de entorno.

## Beans explicitos

```java
@Bean
Clock clock() {
  return Clock.systemUTC();
}
```

Inyectar `Clock` facilita tests.

## Buenas practicas

- Mantén servicios orientados a casos de uso.
- Usa constructor injection.
- Usa `@ConfigurationProperties` para configuracion agrupada.
- Valida configuracion critica al arrancar.
- Evita leer variables de entorno directamente por toda la app.

# Testing

Spring Boot permite testear desde unidades pequenas hasta la aplicacion completa. La clave es elegir el nivel correcto para cada riesgo.

## Piramide

```txt
Unit tests -> servicios, mappers, reglas
Slice tests -> controller, repository
Integration tests -> app + base real/testcontainers
E2E -> flujo completo externo
```

## Test unitario de servicio

```java
@Test
void createsProduct() {
  ProductRepository repository = mock(ProductRepository.class);
  ProductService service = new ProductService(repository);

  service.create(new CreateProductRequest("Keyboard", BigDecimal.TEN));

  verify(repository).save(any(Product.class));
}
```

## WebMvcTest

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
  @Autowired MockMvc mockMvc;
  @MockBean ProductService productService;

  @Test
  void returnsProduct() throws Exception {
    mockMvc.perform(get("/api/products/1"))
      .andExpect(status().isOk());
  }
}
```

## DataJpaTest

```java
@DataJpaTest
class ProductRepositoryTest {
  @Autowired ProductRepository repository;

  @Test
  void findsByName() {
    repository.save(new Product("Keyboard", BigDecimal.TEN));
    assertThat(repository.findByNameContainingIgnoreCase("key")).hasSize(1);
  }
}
```

## Testcontainers

Para integracion real:

```java
@Testcontainers
@SpringBootTest
class ProductIntegrationTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
}
```

## Tests de seguridad

```java
mockMvc.perform(delete("/api/products/1"))
  .andExpect(status().isUnauthorized());
```

## Buenas practicas

- Testea reglas de negocio sin levantar Spring cuando puedas.
- Usa slice tests para capa web y persistencia.
- Usa Testcontainers para integracion con base real.
- Cubre errores y autorizacion.
- Evita depender de orden entre tests.
- Ejecuta tests en CI.

# Persistencia con Spring Data JPA

Spring Data JPA simplifica el acceso a bases relacionales, pero no elimina la necesidad de entender entidades, transacciones, consultas e indices.

## Entidad

```java
@Entity
@Table(name = "products")
class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private BigDecimal price;
}
```

## Repositorio

```java
interface ProductRepository extends JpaRepository<Product, Long> {
  boolean existsByName(String name);
  List<Product> findByNameContainingIgnoreCase(String name);
}
```

## Consultas JPQL

```java
@Query("""
  select p
  from Product p
  where p.price between :min and :max
""")
List<Product> findByPriceRange(BigDecimal min, BigDecimal max);
```

## Migraciones

Usa Flyway o Liquibase. No delegues el esquema de produccion a `ddl-auto=update`.

```yaml
spring:
  flyway:
    enabled: true
```

Migracion:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL
);
```

## N+1 queries

Problema comun:

```txt
1 query para pedidos
N queries para lineas
```

Soluciones:

- `fetch join`.
- EntityGraph.
- DTO projections.
- Consultas especificas para pantalla.

## Transacciones

```java
@Transactional
public OrderResponse createOrder(CreateOrderRequest request) {
  // cambios atomicos
}
```

Pon transacciones en servicios, no en controladores.

## Buenas practicas

- No expongas entidades como JSON.
- Usa migraciones versionadas.
- Diseña indices segun consultas.
- Revisa SQL generado en casos criticos.
- Evita relaciones bidireccionales innecesarias.
- Controla N+1 desde tests o logs.

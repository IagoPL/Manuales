# Transacciones, JPA y rendimiento

El rendimiento de una API Spring Boot depende mucho de transacciones, consultas SQL, pool de conexiones y uso correcto de JPA.

## Transacciones

```java
@Transactional
public OrderResponse createOrder(CreateOrderRequest request) {
  Order order = orderRepository.save(Order.create(request));
  return OrderResponse.from(order);
}
```

`@Transactional` define una unidad atomica de trabajo.

## Read only

```java
@Transactional(readOnly = true)
public ProductResponse findById(Long id) {}
```

Ayuda a comunicar intencion y puede optimizar ciertos comportamientos.

## Propagation

La propagacion define como se comporta una transaccion cuando ya existe otra.

La mas comun:

```txt
REQUIRED
```

Usa modos avanzados solo si entiendes bien el caso.

## Lazy loading

JPA carga relaciones lazy cuando se acceden.

Riesgo:

- N+1 queries.
- `LazyInitializationException`.
- Queries inesperadas en serializacion JSON.

## DTO projections

Para lecturas de API, a menudo conviene consultar directamente DTOs.

```java
@Query("""
  select new com.example.ProductSummary(p.id, p.name, p.price)
  from Product p
""")
List<ProductSummary> findSummaries();
```

## Pool de conexiones

HikariCP es el pool por defecto.

Config:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      connection-timeout: 3000
```

No pongas un pool enorme sin revisar limites de la base de datos.

## Paginacion

Evita devolver miles de filas:

```java
Page<Product> findByActiveTrue(Pageable pageable);
```

Para tablas grandes, considera keyset pagination.

## Cache

Cachea lecturas repetidas, pero define invalidacion.

```java
@Cacheable(cacheNames = "products", key = "#id")
public ProductResponse findById(Long id) {}
```

## Buenas practicas

- Transacciones en servicios.
- Consultas especificas para pantallas criticas.
- Revisa SQL generado.
- Mide antes de optimizar.
- Evita N+1 con tests o profiling.
- Dimensiona pool segun capacidad real de DB.


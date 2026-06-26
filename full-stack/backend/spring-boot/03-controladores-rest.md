# Controladores REST

Los controladores son la capa HTTP de la aplicacion. Deben traducir peticiones y respuestas, no contener reglas de negocio complejas.

## Controlador basico

```java
@RestController
@RequestMapping("/api/products")
class ProductController {
  private final ProductService productService;

  ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/{id}")
  ProductResponse findById(@PathVariable Long id) {
    return productService.findById(id);
  }
}
```

## Metodos HTTP

- `GET`: leer.
- `POST`: crear.
- `PUT`: reemplazar.
- `PATCH`: modificar parcialmente.
- `DELETE`: eliminar.

## DTOs

Evita exponer entidades JPA directamente.

```java
record CreateProductRequest(String name, BigDecimal price) {}
record ProductResponse(Long id, String name, BigDecimal price) {}
```

Los DTOs protegen la API de cambios internos del modelo.

## Codigos de estado

```java
@PostMapping
ResponseEntity<ProductResponse> create(@RequestBody CreateProductRequest request) {
  ProductResponse product = productService.create(request);
  return ResponseEntity.status(HttpStatus.CREATED).body(product);
}
```

Usa codigos coherentes:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `404 Not Found`
- `409 Conflict`

## Paginacion

```java
@GetMapping
Page<ProductResponse> search(Pageable pageable) {
  return productService.search(pageable);
}
```

Para APIs publicas, considera respuestas propias en vez de exponer directamente `Page`.

## Buenas practicas

- Controladores finos.
- DTOs para entrada y salida.
- Validacion en requests.
- Errores consistentes.
- No devolver stack traces al cliente.
- Versionar API cuando haya cambios incompatibles.

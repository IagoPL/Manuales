# Validacion y manejo de errores

Una API profesional valida entradas y devuelve errores consistentes. El usuario de la API no deberia depender de stack traces ni mensajes improvisados.

## Validacion

```java
record CreateProductRequest(
  @NotBlank String name,
  @NotNull @DecimalMin("0.0") BigDecimal price
) {}
```

Controlador:

```java
@PostMapping
ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
  return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
}
```

## Errores de dominio

```java
class ProductNotFoundException extends RuntimeException {
  ProductNotFoundException(Long id) {
    super("Product not found: " + id);
  }
}
```

## Controller advice

```java
@RestControllerAdvice
class ApiExceptionHandler {
  @ExceptionHandler(ProductNotFoundException.class)
  ResponseEntity<ApiError> handle(ProductNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
      .body(new ApiError("PRODUCT_NOT_FOUND", ex.getMessage()));
  }
}
```

## Formato de error

```java
record ApiError(
  String code,
  String message,
  Instant timestamp
) {}
```

Incluye un `code` estable para clientes.

## Validacion de negocio

No todo es Bean Validation.

```java
if (productRepository.existsByName(request.name())) {
  throw new ProductAlreadyExistsException(request.name());
}
```

## Problem Details

Spring moderno puede trabajar con `ProblemDetail` para errores HTTP estandarizados.

```java
ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.CONFLICT);
detail.setTitle("Product already exists");
detail.setProperty("code", "PRODUCT_ALREADY_EXISTS");
```

## Buenas practicas

- Valida DTOs de entrada.
- Usa codigos de error estables.
- No expongas detalles internos.
- Separa errores tecnicos de errores de dominio.
- Loguea con contexto suficiente.
- Cubre errores con tests de API.

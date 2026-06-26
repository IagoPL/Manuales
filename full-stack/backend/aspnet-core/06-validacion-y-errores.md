# Validación y errores

Una API profesional valida entradas y devuelve errores consistentes.

## Data annotations

```csharp
public record CreateProductRequest(
    [Required, StringLength(120)] string Name,
    [Range(0, double.MaxValue)] decimal Price
);
```

Con `[ApiController]`, ASP.NET Core devuelve `400 Bad Request` automáticamente si el modelo no es válido.

## FluentValidation

```csharp
public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
    }
}
```

## ProblemDetails

ASP.NET Core puede devolver errores con formato estándar.

```csharp
return Problem(
    title: "Product not found",
    statusCode: StatusCodes.Status404NotFound);
```

## Exception handler

Centraliza errores con middleware o filtros.

## Buenas practicas

- Valida DTOs de entrada.
- Usa códigos de error estables.
- No expongas stack traces.
- Registra errores con contexto.
- Cubre errores en tests.

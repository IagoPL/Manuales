# Controladores y Minimal APIs

ASP.NET Core permite definir endpoints con controladores o Minimal APIs. Ambas opciones son válidas; la elección depende del tamaño y estilo de la aplicación.

## Controlador

```csharp
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _service;

    public ProductsController(ProductService service)
    {
        _service = service;
    }

    [HttpGet("{id:int}")]
    public ActionResult<ProductResponse> Get(int id)
    {
        var product = _service.FindById(id);
        return product is null ? NotFound() : Ok(product);
    }
}
```

## Minimal API

```csharp
app.MapGet("/api/products/{id:int}", (int id, ProductService service) =>
{
    var product = service.FindById(id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});
```

## Cuándo usar cada una

Controladores:

- APIs medianas o grandes.
- Convenciones MVC.
- Filtros y atributos.

Minimal APIs:

- APIs pequeñas.
- Microservicios simples.
- Endpoints muy directos.

## DTOs

```csharp
public record CreateProductRequest(string Name, decimal Price);
public record ProductResponse(int Id, string Name, decimal Price);
```

## Buenas practicas

- Endpoints finos.
- DTOs para entrada y salida.
- Códigos HTTP coherentes.
- No exponer entidades EF directamente.
- Agrupar endpoints por dominio.

# Testing

ASP.NET Core se puede probar con tests unitarios, integración y WebApplicationFactory.

## Unit test

```csharp
[Fact]
public void CalculatesTotal()
{
    var total = OrderCalculator.Total(new[] { 10m, 20m });
    Assert.Equal(30m, total);
}
```

## Test de integración

```csharp
public class ProductsApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProductsApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/health");
        response.EnsureSuccessStatusCode();
    }
}
```

## Base de datos

Opciones:

- SQLite para tests simples.
- Testcontainers con SQL Server/PostgreSQL.
- Base efímera por suite.

## Buenas practicas

- Testea servicios sin levantar servidor.
- Usa integración para endpoints críticos.
- Mockea dependencias externas.
- Cubre seguridad y errores.
- Ejecuta tests en CI.

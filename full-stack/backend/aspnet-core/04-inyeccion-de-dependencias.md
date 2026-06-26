# Inyección de dependencias

ASP.NET Core incluye un contenedor de inyección de dependencias. Sirve para registrar servicios, repositorios, clientes HTTP y configuración.

## Registro

```csharp
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<ProductRepository>();
```

## Uso por constructor

```csharp
public class ProductService
{
    private readonly ProductRepository _repository;

    public ProductService(ProductRepository repository)
    {
        _repository = repository;
    }
}
```

## Lifetimes

- `Transient`: nueva instancia cada vez.
- `Scoped`: una instancia por request.
- `Singleton`: una instancia para toda la aplicación.

## Options pattern

```csharp
builder.Services.Configure<PaymentOptions>(
    builder.Configuration.GetSection("Payment"));
```

```csharp
public class PaymentOptions
{
    public string BaseUrl { get; set; } = "";
}
```

## HttpClientFactory

```csharp
builder.Services.AddHttpClient<PaymentClient>(client =>
{
    client.BaseAddress = new Uri("https://payments.example.com");
});
```

## Buenas practicas

- Usa constructor injection.
- Evita service locator.
- No inyectes servicios scoped en singletons.
- Usa `HttpClientFactory`.
- Centraliza configuración con Options.

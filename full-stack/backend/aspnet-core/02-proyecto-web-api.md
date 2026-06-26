# Proyecto Web API

ASP.NET Core permite construir APIs HTTP modernas, rápidas y mantenibles. Un proyecto Web API debe separar endpoints, servicios, persistencia, configuración y errores.

## Crear proyecto

```bash
dotnet new webapi -n Shop.Api
cd Shop.Api
dotnet run
```

## Estructura recomendada

```txt
Shop.Api/
  Program.cs
  Products/
    ProductsController.cs
    ProductService.cs
    ProductDto.cs
  Shared/
    Errors/
    Configuration/
```

## Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

app.Run();
```

## appsettings

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=Shop;Trusted_Connection=True;"
  }
}
```

## Buenas practicas

- Mantén `Program.cs` legible.
- Agrupa por dominio cuando la API crece.
- Usa configuración por entorno.
- No guardes secretos en `appsettings.json`.
- Activa Swagger en desarrollo o entornos internos.

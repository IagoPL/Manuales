# Configuración y despliegue

ASP.NET Core usa configuración por capas: appsettings, variables de entorno, secretos y argumentos.

## appsettings por entorno

```txt
appsettings.json
appsettings.Development.json
appsettings.Production.json
```

## Variables

```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__Default="..."
```

## Publicar

```bash
dotnet publish -c Release -o publish
```

## Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Shop.Api.dll"]
```

## Health checks

```csharp
builder.Services.AddHealthChecks();
app.MapHealthChecks("/health");
```

## Buenas practicas

- Configuración externa.
- Secretos fuera del repo.
- Imagenes pequeñas.
- Health checks.
- Logs a stdout.
- Migraciones controladas.

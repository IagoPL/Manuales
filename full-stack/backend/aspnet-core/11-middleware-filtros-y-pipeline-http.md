# Middleware, filtros y pipeline HTTP

ASP.NET Core procesa cada request mediante un pipeline de middleware.

## Pipeline

```csharp
app.UseExceptionHandler();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

El orden importa.

## Middleware personalizado

```csharp
public class RequestIdMiddleware
{
    private readonly RequestDelegate _next;

    public RequestIdMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext context)
    {
        context.Response.Headers["X-Request-Id"] = Guid.NewGuid().ToString();
        await _next(context);
    }
}
```

## Filtros

Los filtros actúan alrededor de acciones MVC.

- Authorization filters.
- Action filters.
- Exception filters.
- Result filters.

## Buenas practicas

- Ordenar middleware conscientemente.
- Centralizar errores.
- Usar filtros para cross-cutting MVC.
- No meter negocio en middleware.
- Medir latencia por request.

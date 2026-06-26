# Autenticación y autorización

ASP.NET Core integra autenticación, autorización por políticas y soporte JWT.

## JWT Bearer

```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://auth.example.com";
        options.Audience = "shop-api";
    });

builder.Services.AddAuthorization();
```

Pipeline:

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

## Proteger endpoint

```csharp
[Authorize]
[HttpGet("me")]
public IActionResult Me() => Ok();
```

## Políticas

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});
```

Uso:

```csharp
[Authorize(Policy = "AdminOnly")]
```

## Buenas practicas

- Valida issuer y audience.
- Usa HTTPS.
- Comprueba permisos en backend.
- No confíes en ocultar botones.
- Testea 401 y 403.

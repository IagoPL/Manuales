# Entity Framework Core

Entity Framework Core es el ORM principal del ecosistema .NET. Permite mapear entidades, consultar con LINQ y gestionar migraciones.

## DbContext

```csharp
public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) {}

    public DbSet<Product> Products => Set<Product>();
}
```

## Entidad

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}
```

## Registro

```csharp
builder.Services.AddDbContext<ShopDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
```

## Migraciones

```bash
dotnet ef migrations add CreateProducts
dotnet ef database update
```

## Consultas

```csharp
var products = await db.Products
    .Where(p => p.Price > 0)
    .OrderBy(p => p.Name)
    .ToListAsync();
```

## Buenas practicas

- Usa migraciones versionadas.
- Evita lazy loading por defecto en APIs.
- Proyecta a DTOs.
- Revisa consultas generadas.
- Controla transacciones en casos críticos.

# Rendimiento y buenas practicas

ASP.NET Core es rápido, pero el rendimiento real depende de I/O, base de datos, serialización, memoria y concurrencia.

## Async

Usa APIs async para I/O:

```csharp
var product = await db.Products.FindAsync(id);
```

No bloquees con `.Result` o `.Wait()`.

## Paginación

```csharp
var products = await db.Products
    .OrderBy(p => p.Id)
    .Skip(page * size)
    .Take(size)
    .ToListAsync();
```

## Response compression

```csharp
builder.Services.AddResponseCompression();
app.UseResponseCompression();
```

## Caching

Usa cache para lecturas repetidas, con invalidación clara.

## Buenas practicas

- Async end-to-end.
- Paginación en colecciones.
- Revisar consultas EF.
- Timeouts en clientes externos.
- Medir p95/p99.
- Evitar payloads enormes.

# Data fetching y cache

Next.js combina renderizado en servidor, cache de fetch, revalidacion y rutas dinamicas. Entender cache es esencial para evitar datos obsoletos o renders innecesarios.

## Fetch en servidor

```tsx
async function getProducts() {
  const res = await fetch("https://api.example.com/products")
  if (!res.ok) throw new Error("Error loading products")
  return res.json()
}
```

## Cache por defecto

En Server Components, `fetch` puede cachearse segun configuracion.

Forzar no cache:

```tsx
await fetch(url, { cache: "no-store" })
```

Revalidar cada minuto:

```tsx
await fetch(url, { next: { revalidate: 60 } })
```

## Static vs dynamic

Una pagina puede ser estatica si no depende de datos dinamicos por request.

Se vuelve dinamica si usa:

- `cookies()`
- `headers()`
- `cache: "no-store"`
- parametros dinamicos no precomputados.

## Revalidacion por tag

```tsx
await fetch(url, { next: { tags: ["products"] } })
```

Luego:

```tsx
revalidateTag("products")
```

## Buenas practicas

- Define estrategia de cache por dato.
- Usa `no-store` para datos privados o siempre frescos.
- Usa `revalidate` para contenido semiestatico.
- Usa tags para invalidar tras mutaciones.
- Documenta si una ruta es estatica o dinamica.

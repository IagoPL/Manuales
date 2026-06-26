# SEO, metadata e imagenes

Next.js ofrece APIs para metadata, Open Graph, sitemap, robots e imagenes optimizadas.

## Metadata estatica

```tsx
export const metadata = {
  title: "Productos",
  description: "Catalogo de productos"
}
```

## Metadata dinamica

```tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  return {
    title: product.name,
    description: product.summary
  }
}
```

## Open Graph

```tsx
export const metadata = {
  openGraph: {
    title: "Manuales",
    description: "Guias tecnicas",
    images: ["/og.png"]
  }
}
```

## next/image

```tsx
import Image from "next/image"

<Image
  src="/product.png"
  alt="Producto"
  width={800}
  height={600}
/>
```

Siempre usa `alt` significativo o vacio si es decorativa.

## sitemap y robots

Archivos especiales:

```txt
app/sitemap.ts
app/robots.ts
```

## Buenas practicas

- Titulo unico por pagina importante.
- Descripcion clara.
- Open Graph para compartir.
- Imagenes con dimensiones estables.
- `alt` correcto.
- Sitemap para contenido indexable.
- No indexar rutas privadas.

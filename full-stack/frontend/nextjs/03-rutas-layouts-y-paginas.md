# Rutas, layouts y paginas

Next.js crea rutas a partir del sistema de archivos. Esto hace que la estructura de carpetas sea parte de la arquitectura.

## Ruta simple

```txt
app/about/page.tsx -> /about
```

```tsx
export default function AboutPage() {
  return <h1>Sobre nosotros</h1>
}
```

## Ruta dinamica

```txt
app/products/[id]/page.tsx -> /products/123
```

```tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <h1>Producto {params.id}</h1>
}
```

## Layout anidado

```tsx
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <nav>Productos</nav>
      {children}
    </section>
  )
}
```

## Route groups

Los grupos no afectan a la URL:

```txt
app/
  (marketing)/
    page.tsx
  (dashboard)/
    dashboard/
      page.tsx
```

Sirven para separar layouts y zonas de la app.

## not-found

```tsx
import { notFound } from "next/navigation"

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  if (!product) notFound()
  return <ProductView product={product} />
}
```

## Buenas practicas

- Usa route groups para separar areas.
- Mantén layouts ligeros.
- Define 404 por secciones cuando aporte contexto.
- Modela rutas dinamicas con tipos claros.
- No dupliques fetches innecesarios entre layout y page.

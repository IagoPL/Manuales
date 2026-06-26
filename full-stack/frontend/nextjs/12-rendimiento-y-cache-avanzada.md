# Rendimiento y cache avanzada

El rendimiento en Next.js depende de renderizado, cache, tamaño de JavaScript, imagenes, fuentes y streaming.

## Reducir JavaScript cliente

Mantén componentes como Server Components salvo que necesiten interactividad.

## Streaming

`loading.tsx` permite mostrar UI mientras carga un segmento.

```txt
app/products/loading.tsx
```

## Suspense

```tsx
<Suspense fallback={<ProductsSkeleton />}>
  <Products />
</Suspense>
```

## Cache tags

```tsx
fetch(url, { next: { tags: ["products"] } })
```

Invalidar:

```tsx
revalidateTag("products")
```

## Imagenes y fuentes

- Usa `next/image`.
- Define width/height.
- Usa `next/font`.
- Evita fuentes externas bloqueantes si puedes servirlas optimizadas.

## Buenas practicas

- Mide con Lighthouse y Web Vitals.
- Reduce Client Components.
- Usa cache por tags.
- Evita bundles grandes en layouts globales.
- Analiza dependencias pesadas.


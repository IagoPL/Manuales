# App Router y estructura

El App Router organiza la aplicacion alrededor de la carpeta `app/`. Cada carpeta representa un segmento de ruta y puede contener paginas, layouts, loading states y errores.

## Estructura base

```txt
app/
  layout.tsx
  page.tsx
  products/
    page.tsx
    [id]/
      page.tsx
  api/
    health/
      route.ts
components/
lib/
```

## Archivos especiales

- `page.tsx`: UI de una ruta.
- `layout.tsx`: layout compartido.
- `loading.tsx`: estado de carga.
- `error.tsx`: error boundary de segmento.
- `not-found.tsx`: pantalla 404.
- `route.ts`: route handler para endpoints.

## Layout raiz

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

## Organización recomendada

```txt
app/              rutas
components/       componentes compartidos
features/         modulos por dominio
lib/              clientes, helpers, config
styles/           estilos globales
```

## Buenas practicas

- Mantén `app/` centrado en rutas.
- Extrae lógica de dominio a `features/` o `lib/`.
- Usa layouts para estructura compartida.
- Define `loading.tsx` y `error.tsx` en rutas importantes.
- No conviertas todo en Client Component por costumbre.

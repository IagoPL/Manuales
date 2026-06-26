# Observabilidad y errores

Una app Next.js debe exponer errores, logs y metricas utiles tanto del lado servidor como cliente.

## error.tsx

```tsx
"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Algo ha fallado</h2>
      <button onClick={reset}>Reintentar</button>
    </div>
  )
}
```

## not-found.tsx

```tsx
export default function NotFound() {
  return <h1>No encontrado</h1>
}
```

## Logs

Incluye:

- Request id.
- Usuario si aplica.
- Ruta.
- Error code.
- Latencia.

## Web Vitals

Monitoriza:

- LCP.
- CLS.
- INP.
- TTFB.

## Buenas practicas

- No mostrar stack traces al usuario.
- Registrar errores de Server Actions.
- Medir Web Vitals reales.
- Añadir health endpoint.
- Centralizar logs en produccion.


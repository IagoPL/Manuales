# Server Components y Client Components

En App Router, los componentes son Server Components por defecto. Solo necesitas Client Components cuando hay interactividad de navegador.

## Server Component

```tsx
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsList products={products} />
}
```

Puede:

- Leer datos en servidor.
- Acceder a base de datos o servicios internos.
- Reducir JavaScript enviado al cliente.

## Client Component

```tsx
"use client"

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

Necesario para:

- `useState`
- `useEffect`
- Eventos de navegador.
- APIs del navegador.
- Librerias que requieren DOM.

## Frontera servidor-cliente

Puedes pasar datos serializables de Server a Client Component.

```tsx
<ProductFilters initialSearch={search} />
```

No pases funciones, conexiones o clases no serializables.

## Patrón recomendado

```txt
page.server -> obtiene datos
client component -> interaccion local
```

## Buenas practicas

- Empieza con Server Components.
- Añade `"use client"` solo donde haga falta.
- Mantén Client Components pequeños.
- No expongas secretos al cliente.
- Evita proveedores globales client si solo una zona los necesita.

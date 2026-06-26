# Arquitectura de aplicaciones React

Una aplicacion React grande no se mantiene solo con componentes. Necesita estructura, limites claros, gestion de estado, rutas, datos remotos, testing y convenciones.

## Objetivo

El objetivo de la arquitectura es que el proyecto pueda crecer sin que cada cambio obligue a tocar media aplicacion.

Preguntas clave:

- Donde viven las paginas?
- Donde viven los componentes reutilizables?
- Donde se llama a la API?
- Donde se guarda estado local, global y remoto?
- Como se testea?
- Como se separa dominio de UI?

## Estructura por features

Una estructura habitual:

```txt
src/
  app/
    router.tsx
    providers.tsx
  features/
    auth/
      components/
      hooks/
      services/
      types.ts
    products/
      components/
      hooks/
      services/
      types.ts
  shared/
    components/
    hooks/
    lib/
    ui/
```

Ventaja: cada feature agrupa su UI, hooks, tipos y servicios.

## Estructura por capas

Otra opcion:

```txt
src/
  components/
  pages/
  hooks/
  services/
  stores/
  types/
```

Es simple para proyectos pequenos, pero puede degradarse cuando crece mucho.

## Regla practica

Para aplicaciones reales, prefiere estructura por dominio o feature. Para demos pequenas, una estructura por capas puede bastar.

## Separar UI y datos

Un componente de pagina puede coordinar datos:

```tsx
function ProductsPage() {
  const { data, isLoading } = useProducts()

  if (isLoading) return <Spinner />

  return <ProductsList products={data} />
}
```

El componente visual recibe props:

```tsx
function ProductsList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

Esto facilita pruebas y reutilizacion.

## Providers

Centraliza providers:

```tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

Evita esconder providers dispersos en muchas paginas.

## Rutas

Agrupa rutas por dominio:

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "products", element: <ProductsPage /> },
      { path: "orders", element: <OrdersPage /> }
    ]
  }
])
```

## Dependencias entre modulos

Regla saludable:

```txt
app -> features -> shared
features no deberian depender entre si sin motivo claro
shared no deberia depender de features
```

## Anti-patrones

- Componentes enormes que hacen fetch, validan, renderizan y transforman datos.
- Estado global para todo.
- Hooks que ocultan demasiados efectos secundarios.
- Carpeta `utils` convertida en cajon desastre.
- Imports circulares entre features.

## Checklist

- Cada feature tiene ownership claro.
- La UI reutilizable no conoce APIs concretas.
- Los servicios de API estan centralizados.
- Los providers estan declarados en un sitio.
- Los tests pueden montar componentes sin levantar toda la app.


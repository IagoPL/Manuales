# Proyecto final: dashboard React

El objetivo es construir un dashboard React completo para gestionar productos y pedidos. Debe aplicar arquitectura, rutas, server state, formularios, accesibilidad, testing y despliegue.

## Funcionalidades

- Login simulado.
- Listado de productos con busqueda y paginacion.
- Detalle de producto.
- Crear y editar producto.
- Listado de pedidos.
- Estado vacio, loading y error.
- Proteccion de rutas privadas.
- Tests de flujos principales.

## Arquitectura

```txt
src/
  app/
    router.tsx
    providers.tsx
  features/
    auth/
    products/
    orders/
  shared/
    ui/
    hooks/
    lib/
```

## Rutas

```txt
/login
/products
/products/:id
/products/new
/orders
```

## Providers

```tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
```

## Server state

Productos:

```tsx
function useProducts(params: ProductFilters) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params)
  })
}
```

Crear producto:

```tsx
function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}
```

## URL state

La busqueda debe vivir en URL:

```txt
/products?search=keyboard&page=2
```

Asi se puede compartir enlace y volver atras correctamente.

## Formulario

Campos:

- Nombre.
- SKU.
- Precio.
- Stock.
- Activo.

Validaciones:

- Nombre obligatorio.
- SKU obligatorio.
- Precio mayor o igual a 0.
- Stock entero mayor o igual a 0.

## Accesibilidad

Checklist:

- Inputs con label.
- Errores asociados con `aria-describedby`.
- Botones reales.
- Foco visible.
- Navegacion con teclado.
- Mensajes de guardado con `role="status"`.

## Testing

Tests minimos:

- Login permite entrar.
- Productos muestra loading y luego lista.
- Busqueda actualiza URL.
- Crear producto invalida cache.
- Error de API muestra mensaje.
- Formulario muestra errores accesibles.

## Despliegue

Build:

```bash
npm run build
```

Servidor SPA:

```txt
todas las rutas internas -> index.html
```

## Criterios de calidad

- Componentes de UI no llaman directamente a la API.
- Hooks encapsulan server state.
- Formularios tienen validacion clara.
- Estados loading/error/empty estan implementados.
- Tests cubren flujos criticos.
- No hay secretos en variables frontend.
- La app se puede desplegar como archivos estaticos.

